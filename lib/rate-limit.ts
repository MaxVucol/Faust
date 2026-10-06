import "server-only";
import { headers } from "next/headers";
import { HONEYPOT_FIELD } from "./schemas";

/**
 * A small in-memory rate limiter for the public forms. Each server instance keeps its own counts, so
 * it slows down scripted spam rather than guaranteeing an exact global limit, which is enough for
 * this demo without an external store.
 */
const hits = new Map<string, number[]>();
const MAX_KEYS = 10_000;

/** Records one attempt for `key`; false when `limit` attempts already happened within `windowMs`. */
export function allowAttempt(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > MAX_KEYS) {
    // Forget the oldest keys (Map keeps insertion order) so memory stays bounded.
    for (const k of [...hits.keys()].slice(0, hits.size - MAX_KEYS)) hits.delete(k);
  }
  return true;
}

/**
 * The visitor's IP, for rate limits. On Vercel (VERCEL is set) the platform's own headers, which it
 * writes itself and doesn't take from the visitor: x-real-ip (what @vercel/functions ipAddress() reads),
 * then x-vercel-forwarded-for. Elsewhere (local development, another proxy) the first x-forwarded-for
 * entry, which is only trustworthy behind a proxy that sets it.
 */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (process.env.VERCEL) return h.get("x-real-ip")?.trim() || h.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || forwarded || "unknown";
  return forwarded || h.get("x-real-ip")?.trim() || "unknown";
}

/** Honeypot check (see HONEYPOT_FIELD): anything in the hidden field means an automated submission. */
export function isBot(formData: FormData): boolean {
  const value = formData.get(HONEYPOT_FIELD);
  return typeof value === "string" && value.trim() !== "";
}
