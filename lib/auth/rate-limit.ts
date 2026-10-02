import "server-only";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

/**
 * A rate limit shared by every server instance, kept in MongoDB (collection AuthRateLimit), for
 * sign-in and, later, registration. Fixed windows: each window of each key is one document whose _id
 * is the key plus the window start, counted with one atomic findAndModify (upsert + $inc); _id is
 * always unique and indexed, so no Prisma model, index or schema push is needed. Emails are stored
 * only as SHA-256 hashes.
 *
 * Old windows carry `expiresAt` and are removed by an occasional cleanup here (there is no TTL index).
 * Fail-closed: if the database can't be reached, `consume` throws RateLimitUnavailable and the caller
 * refuses the attempt; the limit is never skipped.
 */
const COLLECTION = "AuthRateLimit";
const CLEANUP_CHANCE = 0.02;

export class RateLimitUnavailable extends Error {}

export type LimitRule = { key: string; limit: number; windowMs: number };

/** A key part for an email: its SHA-256 (of the trimmed, lower-cased address), never the address. */
export function emailKey(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

function countOf(result: unknown): number {
  const value = (result as { value?: { count?: unknown } } | null)?.value;
  const raw = value?.count;
  const n = typeof raw === "number" ? raw : Number((raw as { $numberInt?: string; $numberLong?: string } | undefined)?.$numberInt ?? (raw as { $numberLong?: string } | undefined)?.$numberLong);
  if (!Number.isFinite(n)) throw new RateLimitUnavailable("unexpected rate-limit response");
  return n;
}

/**
 * Counts one attempt against every rule; true when all of them are still within their limit. Every
 * rule is counted even after one is exceeded, so the counts stay a true record of attempts.
 */
export async function consume(rules: LimitRule[], now = Date.now()): Promise<boolean> {
  let allowed = true;
  try {
    for (const rule of rules) {
      const start = Math.floor(now / rule.windowMs) * rule.windowMs;
      const result = await prisma.$runCommandRaw({
        findAndModify: COLLECTION,
        query: { _id: `${rule.key}:${start}` },
        update: { $inc: { count: 1 }, $setOnInsert: { expiresAt: { $date: new Date(start + rule.windowMs).toISOString() } } },
        upsert: true,
        new: true,
      });
      if (countOf(result) > rule.limit) allowed = false;
    }
  } catch (error) {
    if (error instanceof RateLimitUnavailable) throw error;
    throw new RateLimitUnavailable(error instanceof Error ? error.message : "rate limit unavailable");
  }
  if (Math.random() < CLEANUP_CHANCE) {
    // Housekeeping only; a failure here doesn't affect the attempt.
    prisma
      .$runCommandRaw({ delete: COLLECTION, deletes: [{ q: { expiresAt: { $lt: { $date: new Date(now).toISOString() } } }, limit: 0 }] })
      .catch(() => {});
  }
  return allowed;
}

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const ONE_HOUR = 60 * 60 * 1000;

/** Registration: 5 accounts per IP and 3 attempts per email per hour, counted before anything is created. */
export function registerRules(ip: string, email: string): LimitRule[] {
  return [
    { key: `register:ip:${ip}`, limit: 5, windowMs: ONE_HOUR },
    { key: `register:email:${emailKey(email)}`, limit: 3, windowMs: ONE_HOUR },
  ];
}

/** Sign-in: 10 attempts per IP and 5 per email per 15 minutes, counted before the password is checked. */
export function signInRules(ip: string, email: string): LimitRule[] {
  return [
    { key: `login:ip:${ip}`, limit: 10, windowMs: FIFTEEN_MINUTES },
    { key: `login:email:${emailKey(email)}`, limit: 5, windowMs: FIFTEEN_MINUTES },
  ];
}
