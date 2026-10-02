import "server-only";
import { redirect } from "next/navigation";
import { ADMIN_FRESHNESS } from "@/lib/auth/session";
import { getSessionUser, loginUrl, type SessionUser } from "@/lib/auth/user";

/**
 * The admin panel's gates, on top of the site's single session (lib/auth). Admin rights are an active
 * account with role "admin", read from the database on every request (never from the cookie), and the
 * sign-in itself must be recent (ADMIN_FRESHNESS): an older session still works for the rest of the
 * site but must sign in again before using the panel.
 */

/** What the admin UI may know about the signed-in account (never the password hash). */
export type AdminUser = { id: string; name: string; email: string; role: string };

export const ROLES = ["admin", "user"] as const;
export const USER_STATUSES = ["active", "blocked"] as const;

export const isAdmin = (u: { role: string; status: string } | null) => u !== null && u.role === "admin" && u.status === "active";

/** Whether the session was signed in recently enough for the admin panel. */
export const isFresh = (u: Pick<SessionUser, "signedInAt">, now = Date.now()) => now / 1000 - u.signedInAt <= ADMIN_FRESHNESS;

const toAdmin = (u: SessionUser): AdminUser => ({ id: u.id, name: u.name, email: u.email, role: u.role });

/**
 * Gate for every admin page and every admin data read: not signed in → the site's sign-in page (back to
 * /admin afterwards); signed in without admin rights → the access-denied page; an admin whose sign-in is
 * older than ADMIN_FRESHNESS → the sign-in page to confirm the password.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getSessionUser();
  if (!user) redirect(loginUrl("/admin"));
  if (!isAdmin(user)) redirect("/admin/forbidden");
  if (!isFresh(user)) redirect(`${loginUrl("/admin")}&reauth=1`);
  return toAdmin(user);
}

export class AdminAccessError extends Error {}

/** Gate for every admin Server Action: throws instead of redirecting, so the action stops right here. */
export async function assertAdmin(): Promise<AdminUser> {
  const user = await getSessionUser();
  if (!user) throw new AdminAccessError("Unauthorized");
  if (!isAdmin(user)) throw new AdminAccessError("Forbidden");
  if (!isFresh(user)) throw new AdminAccessError("Stale");
  return toAdmin(user);
}
