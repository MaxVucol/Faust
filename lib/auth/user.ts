import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "./password";
import { consume, RateLimitUnavailable, signInRules } from "./rate-limit";
import { createSessionToken, LEGACY_SESSION_COOKIE, readSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "./session";

/**
 * Accounts and sessions for the whole site. The session cookie names the user (lib/auth/session.ts);
 * everything that decides access (role, status, session version) is read from the database here, once
 * per request.
 */

/** Where signing in happens until the public /login page exists (a later migration stage). */
export const LOGIN_PATH = "/admin/login";

/** What pages may know about the signed-in account (never the password hash). */
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  /** When this session was signed in (seconds); the admin panel requires it to be recent. */
  signedInAt: number;
};

/** The signed-in account, or null (no cookie, a bad or expired token, a deleted account, or a revoked session). */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const claims = readSessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!claims) return null;
  const user = await prisma.user.findUnique({ where: { id: claims.uid }, select: { id: true, name: true, email: true, role: true, status: true, sessionVersion: true } });
  // A missing sessionVersion (accounts from before it existed) counts as 0.
  if (!user || (user.sessionVersion ?? 0) !== claims.ver) return null;
  return { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, signedInAt: claims.iat };
});

/** For pages that need any active account: not signed in (or blocked) → the sign-in page. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || user.status !== "active") redirect(LOGIN_PATH);
  return user;
}

// Compared against when the email is unknown, so a wrong email takes as long as a wrong password.
const DUMMY_HASH = "scrypt$32768$AAAAAAAAAAAAAAAAAAAAAA$" + "A".repeat(86);

export type SignInResult = { ok: true; user: { id: string; role: string } } | { ok: false; reason: "invalid" | "blocked" | "rate-limited" | "unavailable" };

/**
 * Checks an email and password and, when they match an active account, starts a session. Attempts are
 * counted (lib/auth/rate-limit.ts) before the password is checked; if the limit can't be checked the
 * attempt is refused. A blocked account gets no session.
 */
export async function signIn(email: string, password: string, ip: string): Promise<SignInResult> {
  try {
    if (!(await consume(signInRules(ip, email)))) return { ok: false, reason: "rate-limited" };
  } catch (error) {
    if (error instanceof RateLimitUnavailable) {
      console.error("sign-in refused: rate limit unavailable", error.message);
      return { ok: false, reason: "unavailable" };
    }
    throw error;
  }
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true, status: true, passwordHash: true, sessionVersion: true } });
  const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) return { ok: false, reason: "invalid" };
  if (user.status !== "active") return { ok: false, reason: "blocked" };
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await startSession(user.id, user.sessionVersion ?? 0);
  return { ok: true, user: { id: user.id, role: user.role } };
}

/** Issues a fresh session cookie (a new token every time, so a session is never carried over). */
export async function startSession(userId: string, version: number): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSessionToken(userId, version), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  jar.delete(LEGACY_SESSION_COOKIE);
}

/** Signs out this browser. */
export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(LEGACY_SESSION_COOKIE);
}

/**
 * Ends every session of an account (password change, blocking, losing the admin role, "sign out
 * everywhere") by moving its session version on. Returns the new version.
 */
export async function revokeSessions(userId: string): Promise<number> {
  if (!/^[a-f0-9]{24}$/.test(userId)) throw new Error("invalid user id");
  // One atomic update. Prisma's `increment` leaves a missing (null) field null on MongoDB, which would
  // revoke nothing, so the missing value is counted as 0 explicitly.
  const result = await prisma.$runCommandRaw({
    findAndModify: "User",
    query: { _id: { $oid: userId } },
    update: [{ $set: { sessionVersion: { $add: [{ $ifNull: ["$sessionVersion", 0] }, 1] } } }],
    new: true,
  });
  const version = Number((result as { value?: { sessionVersion?: unknown } | null }).value?.sessionVersion);
  if (!Number.isInteger(version) || version < 1) throw new Error("session version was not updated");
  return version;
}
