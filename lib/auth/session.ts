import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * One session for every account. Stateless: an httpOnly cookie holding the user id, the account's
 * session version, when the session was issued and when it expires, signed with HMAC-SHA256. It never
 * holds the role: who the user is, their role, status and current session version are read from the
 * database on every request (lib/auth/user.ts), so blocking, a role change, a password change or
 * "sign out everywhere" (a new sessionVersion) end existing sessions at once.
 *
 * The key is AUTH_SECRET (at least 32 characters). Transitional: without it, ADMIN_SESSION_SECRET (the
 * admin panel's former key) is used, until the next migration stage removes that fallback. Without
 * either, no session can be created or read, so signing in is closed.
 */
export const SESSION_COOKIE = "iv_session";
/** The admin panel's former cookie (commit 578df20); never read, removed on sign-in and sign-out. */
export const LEGACY_SESSION_COOKIE = "iv_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
/** The admin panel also requires the sign-in itself to be this recent. */
export const ADMIN_FRESHNESS = 60 * 60 * 8; // 8 hours

export type SecretSource = "AUTH_SECRET" | "ADMIN_SESSION_SECRET";

let reported = false;

function secret(): { key: string; source: SecretSource } | null {
  for (const source of ["AUTH_SECRET", "ADMIN_SESSION_SECRET"] as const) {
    const key = process.env[source]?.trim();
    if (key && key.length >= 32) return { key, source };
  }
  // A deployment problem, not the visitor's: they see a generic "unavailable"; the server log says what to fix
  // (the variable's name only, never a value). Once per process.
  if (!reported) {
    reported = true;
    console.error("[auth] Sign-in is closed: AUTH_SECRET is missing or shorter than 32 characters. Set it in this environment's variables (.env.local for local development, the hosting's settings in production) and restart.");
  }
  return null;
}

/** Which variable signs sessions now (never its value), or null when signing in is closed. */
export function sessionSecretSource(): SecretSource | null {
  return secret()?.source ?? null;
}

export function sessionsConfigured(): boolean {
  return secret() !== null;
}

export type SessionClaims = {
  /** User id. */
  uid: string;
  /** The account's sessionVersion when the session was issued. */
  ver: number;
  /** Issued at (seconds). */
  iat: number;
  /** Expires at (seconds). */
  exp: number;
};

const sign = (payload: string, key: string) => createHmac("sha256", key).update(`iv-session.${payload}`).digest("base64url");

export function createSessionToken(userId: string, version: number, now = Date.now()): string {
  const s = secret();
  if (!s) throw new Error("AUTH_SECRET is not set (at least 32 characters)");
  const iat = Math.floor(now / 1000);
  const claims: SessionClaims = { uid: userId, ver: version, iat, exp: iat + SESSION_MAX_AGE };
  const payload = Buffer.from(JSON.stringify(claims)).toString("base64url");
  return `${payload}.${sign(payload, s.key)}`;
}

/**
 * Other short-lived data the server hands to the browser and must get back unchanged (the Google sign-in
 * transaction, lib/auth/google.ts): JSON signed with the same key under its own label ("iv-<purpose>."),
 * so it can never pass for a session token or the other way round. Null when signing in is closed.
 */
export function signValue(purpose: string, data: object): string | null {
  if (purpose === "session") throw new Error("the session label is reserved");
  const s = secret();
  if (!s) return null;
  const payload = Buffer.from(JSON.stringify(data)).toString("base64url");
  return `${payload}.${createHmac("sha256", s.key).update(`iv-${purpose}.${payload}`).digest("base64url")}`;
}

/** The data of a value signed by signValue for this purpose; null for anything else. */
export function readSignedValue(purpose: string, token: string | undefined): unknown {
  if (purpose === "session") throw new Error("the session label is reserved");
  const s = secret();
  if (!s || !token || token.length > 2048) return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra !== undefined) return null;
  const expected = Buffer.from(createHmac("sha256", s.key).update(`iv-${purpose}.${payload}`).digest("base64url"));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

/** The claims of a validly signed, unexpired token; null for anything else (including a token from the future). */
export function readSessionToken(token: string | undefined, now = Date.now()): SessionClaims | null {
  const s = secret();
  if (!s || !token || token.length > 1024) return null;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra !== undefined) return null;
  const expected = Buffer.from(sign(payload, s.key));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data !== "object" || data === null) return null;
    const { uid, ver, iat, exp } = data as Record<string, unknown>;
    if (typeof uid !== "string" || !/^[a-f0-9]{24}$/.test(uid)) return null;
    if (typeof ver !== "number" || !Number.isInteger(ver) || ver < 0) return null;
    if (typeof iat !== "number" || typeof exp !== "number" || !Number.isInteger(iat) || !Number.isInteger(exp)) return null;
    const nowS = now / 1000;
    if (iat > nowS + 60 || exp <= nowS || exp - iat > SESSION_MAX_AGE) return null;
    return { uid, ver, iat, exp };
  } catch {
    return null;
  }
}
