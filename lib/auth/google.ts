import "server-only";
import { createHash, createPublicKey, randomBytes, timingSafeEqual, verify, type JsonWebKey, type KeyObject } from "node:crypto";
import { cookies } from "next/headers";
import { z } from "zod";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site";
import { safeNext } from "./redirect";
import { readSignedValue, sessionsConfigured, signValue } from "./session";

/**
 * Sign-in with Google, on top of the site's own accounts and session (lib/auth/user.ts): OAuth 2.0
 * authorization code flow with PKCE and OpenID Connect (scope "openid email profile"). Google only proves
 * who the visitor is; the session is the same iv_session cookie a password sign-in gets.
 *
 *  /auth/google           starts: a fresh state, nonce and PKCE verifier go into a short-lived signed
 *                         cookie (iv_oauth), then the visitor is sent to Google.
 *  /auth/google/callback  Google sends the visitor back: the cookie is taken (and deleted), the state must
 *                         match, the code is exchanged here on the server with the client secret and the
 *                         verifier, and the ID token is checked (signature by Google's published keys,
 *                         issuer, audience, expiry, nonce, a verified email).
 *
 * Accounts: a Google account (its permanent `sub`) belongs to at most one user (User.googleId).
 *  - Signing in finds the user by googleId. An email that already has an account is never linked
 *    automatically (registration here doesn't confirm emails, so that would hand an account to whoever
 *    registered the address first, or the other way round): the visitor signs in with the password and
 *    connects Google from the account page. Otherwise a new ordinary customer is created, without a password.
 *  - Administrators don't sign in with Google: their sign-in stays email and password (and the admin
 *    panel's freshness rule, lib/admin/auth.ts).
 * Without GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET (or on a Vercel preview, whose address Google doesn't
 * know) none of this is offered and nothing else changes.
 */

const AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const KEYS_URL = "https://www.googleapis.com/oauth2/v3/certs";
const ISSUERS = ["https://accounts.google.com", "accounts.google.com"];

export const GOOGLE_CALLBACK_PATH = "/auth/google/callback";
const TX_COOKIE = "iv_oauth";
const TX_PURPOSE = "oauth";
const TX_MAX_AGE = 10 * 60; // seconds
/** Clock difference tolerated when checking the ID token's times (seconds). */
const SKEW = 60;

function credentials(): { id: string; secret: string } | null {
  const id = process.env.GOOGLE_CLIENT_ID?.trim();
  const secret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  if (!id || !secret || process.env.VERCEL_ENV === "preview") return null;
  return { id, secret };
}

/** Whether Google sign-in is offered here: both Google variables are set and sessions can be signed. */
export function googleConfigured(): boolean {
  return credentials() !== null && sessionsConfigured();
}

/** The callback address registered in Google Cloud Console (from NEXT_PUBLIC_SITE_URL, lib/site.ts). */
export function googleRedirectUri(): string {
  return new URL(GOOGLE_CALLBACK_PATH, SITE_URL).href;
}

// ---------- The transaction (cookie iv_oauth) ----------

export type GoogleIntent = "login" | "link";

type Transaction = {
  state: string;
  nonce: string;
  verifier: string;
  intent: GoogleIntent;
  /** For "link": the signed-in user who started it (from their session, never from the request). */
  uid: string | null;
  /** For "login": where to go afterwards, already checked by safeNext. */
  next: string;
  /** Expires at (seconds). */
  exp: number;
};

const random = () => randomBytes(32).toString("base64url");

/**
 * Starts a Google sign-in (or, for a signed-in user, connecting Google): stores a new transaction in the
 * signed cookie and returns Google's authorization URL. Null when Google sign-in isn't configured.
 */
export async function beginGoogle(intent: GoogleIntent, next: string, uid: string | null): Promise<string | null> {
  const c = credentials();
  if (!c) return null;
  const tx: Transaction = { state: random(), nonce: random(), verifier: random(), intent, uid, next: safeNext(next), exp: Math.floor(Date.now() / 1000) + TX_MAX_AGE };
  const value = signValue(TX_PURPOSE, tx);
  if (!value) return null;
  (await cookies()).set(TX_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Lax: Google sends the visitor back with a top-level GET, which carries it.
    sameSite: "lax",
    path: "/auth/google",
    maxAge: TX_MAX_AGE,
  });
  const url = new URL(AUTHORIZE_URL);
  url.search = new URLSearchParams({
    client_id: c.id,
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state: tx.state,
    nonce: tx.nonce,
    code_challenge: createHash("sha256").update(tx.verifier).digest("base64url"),
    code_challenge_method: "S256",
    prompt: "select_account",
  }).toString();
  return url.href;
}

const txSchema = z.object({
  state: z.string().min(32).max(64),
  nonce: z.string().min(32).max(64),
  verifier: z.string().min(43).max(128),
  intent: z.enum(["login", "link"]),
  uid: z.string().regex(/^[a-f0-9]{24}$/).nullable(),
  next: z.string().max(300),
  exp: z.number().int(),
});

/** The pending transaction, removed from the browser in the same step (it can be used once); null if missing, altered or expired. */
export async function takeTransaction(): Promise<Transaction | null> {
  const jar = await cookies();
  const raw = jar.get(TX_COOKIE)?.value;
  jar.delete({ name: TX_COOKIE, path: "/auth/google" });
  const parsed = txSchema.safeParse(readSignedValue(TX_PURPOSE, raw));
  if (!parsed.success || parsed.data.exp <= Date.now() / 1000) return null;
  if (parsed.data.intent === "link" && !parsed.data.uid) return null;
  return { ...parsed.data, next: safeNext(parsed.data.next) };
}

/** Constant-time comparison of the state Google returned with the one stored. */
export function sameState(given: string | null, expected: string): boolean {
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// ---------- The code exchange and the ID token ----------

export type GoogleIdentity = { sub: string; email: string; name: string | null };

let keyCache: { keys: Map<string, KeyObject>; until: number } | null = null;

/** Google's current signing keys (cached for as long as Google's Cache-Control allows, at most a day). */
async function googleKey(kid: string): Promise<KeyObject | null> {
  if (keyCache && keyCache.until > Date.now() && keyCache.keys.has(kid)) return keyCache.keys.get(kid)!;
  const res = await fetch(KEYS_URL, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`Google keys: HTTP ${res.status}`);
  const body = (await res.json()) as { keys?: (JsonWebKey & { kid?: string })[] };
  const keys = new Map<string, KeyObject>();
  for (const jwk of body.keys ?? []) {
    if (jwk.kid && jwk.kty === "RSA") keys.set(jwk.kid, createPublicKey({ key: jwk, format: "jwk" }));
  }
  const maxAge = Number(/max-age=(\d+)/.exec(res.headers.get("cache-control") ?? "")?.[1] ?? 3600);
  keyCache = { keys, until: Date.now() + Math.min(maxAge, 86_400) * 1000 };
  return keys.get(kid) ?? null;
}

const claimsSchema = z.object({
  iss: z.string(),
  aud: z.union([z.string(), z.array(z.string())]),
  azp: z.string().optional(),
  sub: z.string().regex(/^[A-Za-z0-9_-]{1,255}$/),
  exp: z.number(),
  iat: z.number(),
  nonce: z.string(),
  email: z.string().max(200).optional(),
  email_verified: z.unknown().optional(),
  name: z.string().max(500).optional(),
});

type ExchangeResult = { ok: true; identity: GoogleIdentity } | { ok: false; reason: "failed" | "unverified" };

/**
 * Exchanges the authorization code (with the client secret and the PKCE verifier) and checks the ID
 * token. Errors are logged without tokens, codes or secrets; the visitor only learns that it failed.
 */
export async function exchangeCode(code: string, tx: Transaction): Promise<ExchangeResult> {
  const c = credentials();
  if (!c) return { ok: false, reason: "failed" };
  try {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "authorization_code", code, client_id: c.id, client_secret: c.secret, redirect_uri: googleRedirectUri(), code_verifier: tx.verifier }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const body = (await res.json().catch(() => ({}))) as { id_token?: unknown; error?: unknown };
    if (!res.ok || typeof body.id_token !== "string") {
      console.error(`[auth] Google code exchange refused: HTTP ${res.status}${typeof body.error === "string" ? ` (${body.error.slice(0, 40)})` : ""}`);
      return { ok: false, reason: "failed" };
    }
    return await checkIdToken(body.id_token, c.id, tx.nonce);
  } catch (error) {
    console.error("[auth] Google code exchange failed:", error instanceof Error ? error.message : "unknown error");
    return { ok: false, reason: "failed" };
  }
}

const json = (part: string): unknown => JSON.parse(Buffer.from(part, "base64url").toString("utf8"));

async function checkIdToken(token: string, clientId: string, nonce: string): Promise<ExchangeResult> {
  const fail = (why: string): ExchangeResult => {
    console.error(`[auth] Google ID token rejected: ${why}`);
    return { ok: false, reason: "failed" };
  };
  const parts = token.split(".");
  if (parts.length !== 3 || token.length > 8192) return fail("malformed");
  const header = json(parts[0]) as { alg?: unknown; kid?: unknown };
  if (header.alg !== "RS256" || typeof header.kid !== "string") return fail("unexpected algorithm");
  const key = await googleKey(header.kid);
  if (!key) return fail("unknown signing key");
  if (!verify("RSA-SHA256", Buffer.from(`${parts[0]}.${parts[1]}`), key, Buffer.from(parts[2], "base64url"))) return fail("bad signature");
  const parsed = claimsSchema.safeParse(json(parts[1]));
  if (!parsed.success) return fail("missing claims");
  const t = parsed.data;
  const now = Date.now() / 1000;
  if (!ISSUERS.includes(t.iss)) return fail("issuer");
  const audiences = Array.isArray(t.aud) ? t.aud : [t.aud];
  if (!audiences.includes(clientId) || (audiences.length > 1 && t.azp !== clientId)) return fail("audience");
  if (t.exp + SKEW <= now) return fail("expired");
  if (t.iat - SKEW > now) return fail("issued in the future");
  if (!sameState(t.nonce, nonce)) return fail("nonce");
  const email = z.email().safeParse(t.email?.trim().toLowerCase());
  if (!email.success) return fail("no email");
  if (t.email_verified !== true) return { ok: false, reason: "unverified" };
  return { ok: true, identity: { sub: t.sub, email: email.data, name: t.name ?? null } };
}

// ---------- Accounts ----------

/**
 * A display name from Google's profile, within the account rules (2–80 characters, as lib/auth/schemas.ts
 * profileSchema): control characters and angle brackets removed, spaces collapsed; when nothing usable is
 * left, the email's local part.
 */
function displayName(name: string | null, email: string): string {
  const clean = (s: string) =>
    [...s.replace(/[\p{Cc}\p{Cf}<>]/gu, "").replace(/\s+/g, " ").trim()].slice(0, 80).join("").trim();
  const fromName = clean(name ?? "");
  if (fromName.length >= 2) return fromName;
  const local = clean(email.split("@")[0] ?? "");
  return local.length >= 2 ? local : clean(email);
}

const oldestFirst = [{ createdAt: "asc" as const }, { id: "asc" as const }];
const notLinked = { OR: [{ googleId: null }, { googleId: { isSet: false } }] };

export type GoogleSignIn = { ok: true; userId: string; version: number } | { ok: false; reason: "link" | "blocked" | "notAllowed" | "failed" };

/**
 * The account for a verified Google identity: (A) the user linked to this Google account; else (B) if
 * the email already has an account, nothing is created or changed ("link": sign in with the password and
 * connect Google there); else (C) a new ordinary customer without a password. Emails and googleId have no
 * unique index in the database, so after creating, the newest of any duplicates (same Google account or
 * same email, from simultaneous attempts) is removed again, as registration does (lib/auth/user.ts).
 */
export async function findOrCreateGoogleUser(identity: GoogleIdentity, mayCreate = true): Promise<GoogleSignIn> {
  const [linked] = await prisma.user.findMany({ where: { googleId: identity.sub }, orderBy: oldestFirst, take: 1, select: { id: true, role: true, status: true, sessionVersion: true } });
  if (linked) {
    if (linked.role === "admin") return { ok: false, reason: "notAllowed" };
    if (linked.status !== "active") return { ok: false, reason: "blocked" };
    await prisma.user.update({ where: { id: linked.id }, data: { lastLoginAt: new Date() } });
    return { ok: true, userId: linked.id, version: linked.sessionVersion ?? 0 };
  }
  if (!mayCreate) return { ok: false, reason: "failed" };
  if (await prisma.user.findFirst({ where: { email: identity.email }, select: { id: true } })) return { ok: false, reason: "link" };

  const created = await prisma.user.create({
    data: { name: displayName(identity.name, identity.email), email: identity.email, passwordHash: null, googleId: identity.sub, role: "user", status: "active", sessionVersion: 0, lastLoginAt: new Date() },
    select: { id: true },
  });
  const [sameGoogle, sameEmail] = await Promise.all([
    prisma.user.findMany({ where: { googleId: identity.sub }, orderBy: oldestFirst, select: { id: true } }),
    prisma.user.findMany({ where: { email: identity.email }, orderBy: oldestFirst, select: { id: true } }),
  ]);
  if (sameGoogle[0]?.id !== created.id || sameEmail[0]?.id !== created.id) {
    // Another account came first (it has no orders or picture yet: it was created a moment ago).
    await prisma.user.delete({ where: { id: created.id } });
    if (sameEmail[0]?.id !== created.id && sameEmail[0]?.id !== sameGoogle[0]?.id) return { ok: false, reason: "link" };
    return findOrCreateGoogleUser(identity, false);
  }
  return { ok: true, userId: created.id, version: 0 };
}

export type GoogleLink = "linked" | "linkedElsewhere" | "notAllowed" | "failed";

/**
 * Connects a verified Google account to the signed-in user `userId` (taken from their session by the
 * caller). Refused for administrators, for a Google account already connected to someone else, and for an
 * account already connected to a different Google account. Set only while the account has no googleId;
 * if a simultaneous attempt connected the same Google account elsewhere, this one is undone.
 */
export async function linkGoogle(userId: string, identity: GoogleIdentity): Promise<GoogleLink> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true, status: true, googleId: true } });
  if (!user || user.status !== "active") return "failed";
  if (user.role === "admin") return "notAllowed";
  if (user.googleId === identity.sub) return "linked";
  if (user.googleId) return "failed";
  if (await prisma.user.findFirst({ where: { googleId: identity.sub, id: { not: userId } }, select: { id: true } })) return "linkedElsewhere";
  const updated = await prisma.user.updateMany({ where: { id: userId, ...notLinked }, data: { googleId: identity.sub } });
  if (updated.count !== 1) return "failed";
  const holders = await prisma.user.findMany({ where: { googleId: identity.sub }, select: { id: true }, take: 2 });
  if (holders.some((h) => h.id !== userId)) {
    await prisma.user.updateMany({ where: { id: userId, googleId: identity.sub }, data: { googleId: null } });
    return "linkedElsewhere";
  }
  return "linked";
}

/** Disconnects Google from `userId` (from their session), only when the account can still sign in with a password. */
export async function unlinkGoogle(userId: string): Promise<"unlinked" | "onlyMethod" | "failed"> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { passwordHash: true, googleId: true } });
  if (!user) return "failed";
  if (!user.googleId) return "unlinked";
  if (!user.passwordHash) return "onlyMethod";
  await prisma.user.updateMany({ where: { id: userId, googleId: user.googleId }, data: { googleId: null } });
  return "unlinked";
}

// ---------- What the pages say ----------

/** Codes the routes put in the URL (?error=google_… on the sign-in page, ?google=… on the account page). */
const GOOGLE_CODES = ["expired", "cancelled", "failed", "unverified", "link", "blocked", "not_allowed", "linked_elsewhere", "rate_limited", "unavailable", "linked", "unlinked"] as const;
export type GoogleCode = (typeof GOOGLE_CODES)[number];

/**
 * The visitor's message for a code from the URL, in their language; null for anything else (unknown
 * values are ignored, never echoed).
 */
export function googleMessage(t: Dictionary, code: unknown): { tone: "ok" | "error"; text: string } | null {
  if (typeof code !== "string" || !(GOOGLE_CODES as readonly string[]).includes(code)) return null;
  const g = t.auth.google;
  const e = t.auth.errors;
  const p = t.account.profile.google;
  const texts: Record<GoogleCode, string> = {
    expired: g.expired,
    cancelled: g.cancelled,
    failed: g.failed,
    unverified: g.unverified,
    link: g.link,
    blocked: e.blocked,
    not_allowed: g.notAllowed,
    linked_elsewhere: g.linkedElsewhere,
    rate_limited: e.rateLimited,
    unavailable: e.unavailable,
    linked: p.linked,
    unlinked: p.unlinked,
  };
  return { tone: code === "linked" || code === "unlinked" ? "ok" : "error", text: texts[code as GoogleCode] };
}
