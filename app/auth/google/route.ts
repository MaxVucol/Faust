import type { NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { beginGoogle } from "@/lib/auth/google";
import { safeNext } from "@/lib/auth/redirect";
import { getSessionUser, loginUrl } from "@/lib/auth/user";

/**
 * Starts signing in with Google (lib/auth/google.ts), or with ?intent=link connecting Google to the
 * signed-in account. Nothing here decides whose account: a link is for the user of the current session,
 * and `next` is only ever a local path (safeNext). Administrators sign in with their password, so the
 * admin panel's way back never goes through Google.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const user = await getSessionUser();

  if (params.get("intent") === "link") {
    if (!user || user.status !== "active") redirect(loginUrl("/account"));
    if (user.role === "admin") redirect("/account?google=not_allowed");
    const to = await beginGoogle("link", "/account", user.id);
    redirect(to ?? "/account?google=failed");
  }

  const next = safeNext(params.get("next"));
  if (user && user.status === "active") redirect(next);
  if (next.startsWith("/admin")) redirect(loginUrl(next));
  const to = await beginGoogle("login", next, null);
  redirect(to ?? "/login?error=google_failed");
}
