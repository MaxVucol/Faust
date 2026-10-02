/**
 * Password hashing for every account (shop users and admins). Server only (node:crypto); also used by
 * scripts/create-admin.ts, which runs outside Next, so there is no "server-only" import. The stored
 * format ("scrypt$N$salt$hash") and parameters are unchanged since the admin panel introduced them,
 * so every existing hash keeps working.
 */
import { randomBytes, scrypt as scryptCallback, timingSafeEqual, type ScryptOptions } from "node:crypto";

const scrypt = (password: string, salt: Buffer, keylen: number, options: ScryptOptions) =>
  new Promise<Buffer>((resolve, reject) => scryptCallback(password, salt, keylen, options, (err, key) => (err ? reject(err) : resolve(key))));

// scrypt with Node's built-in implementation: N=2^15, r=8, p=1, 64-byte key (~32 MB, well inside Node's limit).
const N = 32768;
const KEYLEN = 64;
const OPTIONS: ScryptOptions = { N, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

/** "scrypt$N$salt$hash" (salt and hash in base64url). */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEYLEN, OPTIONS);
  return `scrypt$${N}$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

/** Constant-time check of a password against a stored hash; false for any malformed hash. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, n, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || Number(n) !== N || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  if (expected.length !== KEYLEN) return false;
  const key = await scrypt(password, Buffer.from(salt, "base64url"), KEYLEN, OPTIONS);
  return timingSafeEqual(key, expected);
}
