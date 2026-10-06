import type { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { exchangeCode, findOrCreateGoogleUser, linkGoogle, sameState, takeTransaction } from "@/lib/auth/google";
import { consume, googleRules, RateLimitUnavailable } from "@/lib/auth/rate-limit";
import { getSessionUser, loginUrl, startSession } from "@/lib/auth/user";
import { clientIp } from "@/lib/rate-limit";

/** What the sign-in page (?error=google_…) and the account page (?google=…) know how to explain. */
type Outcome = "expired" | "cancelled" | "failed" | "unverified" | "link" | "blocked" | "not_allowed" | "linked_elsewhere" | "rate_limited" | "unavailable";

/**
 * Google sends the visitor back here (lib/auth/google.ts). The transaction cookie is taken first (and
 * deleted, so it works once); the state must match it. Then the attempt is counted (fail-closed), the
 * code exchanged and the ID token checked on the server, and the account found, created or connected.
 * A successful sign-in starts the site's ordinary session (iv_session); nothing else is ever trusted from
 * the request: not a user, not an account, not a destination.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const tx = await takeTransaction();
  // Declared with its type so TypeScript knows every call ends the request (redirect throws).
  const back: (outcome: Outcome) => never = (outcome) => {
    if (tx?.intent === "link") redirect(`/account?google=${outcome}`);
    redirect(`${tx && tx.next !== "/account" ? loginUrl(tx.next) + "&" : "/login?"}error=google_${outcome}`);
  };

  if (!tx || !sameState(params.get("state"), tx.state)) back("expired");
  const error = params.get("error");
  if (error) back(error === "access_denied" ? "cancelled" : "failed");
  const code = params.get("code");
  if (!code || code.length > 2048) back("failed");

  let allowed: boolean;
  try {
    allowed = await consume(googleRules(await clientIp()));
  } catch (e) {
    if (!(e instanceof RateLimitUnavailable)) throw e;
    console.error("Google sign-in refused: rate limit unavailable", e.message);
    return back("unavailable");
  }
  if (!allowed) back("rate_limited");

  const exchanged = await exchangeCode(code, tx);
  if (!exchanged.ok) back(exchanged.reason);
  const { identity } = exchanged;

  if (tx.intent === "link") {
    // Only the account that started it, still signed in on this browser.
    const user = await getSessionUser();
    if (!user || user.id !== tx.uid || user.status !== "active") redirect(loginUrl("/account"));
    const linked = await linkGoogle(user.id, identity);
    redirect(`/account?google=${linked === "linkedElsewhere" ? "linked_elsewhere" : linked === "notAllowed" ? "not_allowed" : linked}`);
  }

  const result = await findOrCreateGoogleUser(identity);
  if (!result.ok) back(result.reason === "notAllowed" ? "not_allowed" : result.reason);
  await startSession(result.userId, result.version);
  redirect(tx.next);
}
