import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Admin sessions are stateless: an httpOnly cookie holding the user id and an expiry, signed with
 * HMAC-SHA256 under ADMIN_SESSION_SECRET. Who the user is and whether they may still use the panel is
 * read from the database on every request (lib/admin/auth.ts), so blocking an account or changing its
 * role takes effect at once. Without the secret (at least 32 characters) no session can be created or
 * read, so the admin panel stays closed.
 */
export const SESSION_COOKIE = "iv_admin";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function secret(): string | null {
  const value = process.env.ADMIN_SESSION_SECRET?.trim();
  return value && value.length >= 32 ? value : null;
}

export function sessionsConfigured(): boolean {
  return secret() !== null;
}

const sign = (payload: string, key: string) => createHmac("sha256", key).update(payload).digest("base64url");

export function createSessionToken(userId: string, now = Date.now()): string {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET is not set (at least 32 characters)");
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp: Math.floor(now / 1000) + SESSION_MAX_AGE })).toString("base64url");
  return `${payload}.${sign(payload, key)}`;
}

/** The user id of a valid, unexpired token; null for anything else. */
export function readSessionToken(token: string | undefined): string | null {
  const key = secret();
  if (!key || !token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload, key));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data !== "object" || data === null) return null;
    const { uid, exp } = data as { uid?: unknown; exp?: unknown };
    if (typeof uid !== "string" || !/^[a-f0-9]{24}$/.test(uid) || typeof exp !== "number") return null;
    return exp > Date.now() / 1000 ? uid : null;
  } catch {
    return null;
  }
}
