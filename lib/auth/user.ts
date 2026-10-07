import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "./password";
import { consume, RateLimitUnavailable, registerRules, signInRules, type LimitRule } from "./rate-limit";
import { FAVORITES_COOKIE, MAX_FAVORITES, parseFavorites } from "../favorites";
import { createSessionToken, LEGACY_SESSION_COOKIE, readSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "./session";

/**
 * Accounts and sessions for the whole site. The session cookie names the user (lib/auth/session.ts);
 * everything that decides access (role, status, session version) is read from the database here, once
 * per request.
 */

/** The site's sign-in page (it takes a local ?next= path; see lib/auth/redirect.ts). */
export const LOGIN_PATH = "/login";

/** The sign-in page, returning to `next` (a local path) afterwards. */
export const loginUrl = (next: string) => `${LOGIN_PATH}?next=${encodeURIComponent(next)}`;

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

/** For pages that need any active account: not signed in (or blocked) → the sign-in page, back to `next` afterwards. */
export async function requireUser(next: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || user.status !== "active") redirect(loginUrl(next));
  return user;
}

/** Counts an attempt; "rate-limited" over the limit, "unavailable" when the limit can't be checked (fail-closed). */
async function limit(rules: LimitRule[], what: string): Promise<"ok" | "rate-limited" | "unavailable"> {
  try {
    return (await consume(rules)) ? "ok" : "rate-limited";
  } catch (error) {
    if (error instanceof RateLimitUnavailable) {
      console.error(`${what} refused: rate limit unavailable`, error.message);
      return "unavailable";
    }
    throw error;
  }
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
  const allowed = await limit(signInRules(ip, email), "sign-in");
  if (allowed !== "ok") return { ok: false, reason: allowed };
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true, status: true, passwordHash: true, sessionVersion: true } });
  // An account without a password (created with Google) never signs in here; the comparison still runs.
  const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !user.passwordHash || !valid) return { ok: false, reason: "invalid" };
  if (user.status !== "active") return { ok: false, reason: "blocked" };
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await startSession(user.id, user.sessionVersion ?? 0);
  return { ok: true, user: { id: user.id, role: user.role } };
}

export type RegisterResult = { ok: true } | { ok: false; reason: "taken" | "rate-limited" | "unavailable" };

/**
 * Public registration: always an ordinary, active account (role "user", status "active", session
 * version 0); nothing from the visitor decides the role. Attempts are counted first. On success the
 * new account is signed in. Emails have no unique index in the database, so a second account created
 * for the same email at the same moment is removed again and reported as taken.
 */
export async function registerUser(input: { name: string; email: string; password: string }, ip: string): Promise<RegisterResult> {
  const allowed = await limit(registerRules(ip, input.email), "registration");
  if (allowed !== "ok") return { ok: false, reason: allowed };
  if (await prisma.user.findUnique({ where: { email: input.email }, select: { id: true } })) return { ok: false, reason: "taken" };
  const created = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash: await hashPassword(input.password), role: "user", status: "active", sessionVersion: 0, lastLoginAt: new Date() },
    select: { id: true },
  });
  const same = await prisma.user.findMany({ where: { email: input.email }, select: { id: true }, orderBy: { createdAt: "asc" } });
  if (same.length > 1 && same[0].id !== created.id) {
    await prisma.user.delete({ where: { id: created.id } });
    return { ok: false, reason: "taken" };
  }
  await startSession(created.id, 0);
  return { ok: true };
}

/**
 * A guest's wishlist (the cookie) joins the account's on signing in: newest first, only games in the
 * catalogue, at most MAX_FAVORITES. A failure only leaves the lists as they were; signing in goes on.
 */
async function mergeWishlist(userId: string, cookieValue: string | undefined): Promise<void> {
  const local = parseFavorites(cookieValue);
  if (local.length === 0) return;
  try {
    const saved = await prisma.wishlist.findUnique({ where: { id: userId }, select: { slugs: true } });
    const wanted = [...new Set([...local, ...(saved?.slugs ?? [])])];
    const known = new Set((await prisma.game.findMany({ where: { slug: { in: wanted } }, select: { slug: true } })).map((g) => g.slug));
    const slugs = wanted.filter((s) => known.has(s)).slice(0, MAX_FAVORITES);
    await prisma.wishlist.upsert({ where: { id: userId }, create: { id: userId, slugs }, update: { slugs } });
  } catch (error) {
    console.error("[wishlist] merge on sign-in failed", error instanceof Error ? error.message : "unknown error");
  }
}

/** Issues a fresh session cookie (a new token every time, so a session is never carried over). */
export async function startSession(userId: string, version: number): Promise<void> {
  const jar = await cookies();
  await mergeWishlist(userId, jar.get(FAVORITES_COOKIE)?.value);
  jar.set(SESSION_COOKIE, createSessionToken(userId, version), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  jar.delete(LEGACY_SESSION_COOKIE);
}

/** Signs out this browser. The wishlist stays in the account and leaves this browser with the session. */
export async function endSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete(LEGACY_SESSION_COOKIE);
  jar.delete(FAVORITES_COOKIE);
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
