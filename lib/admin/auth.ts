import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { readSessionToken, SESSION_COOKIE } from "./session";

/** What the admin UI may know about the signed-in account (never the password hash). */
export type AdminUser = { id: string; name: string; email: string; role: string };

export const ROLES = ["admin", "user"] as const;
export const USER_STATUSES = ["active", "blocked"] as const;

/** The signed-in account from the session cookie, read from the database once per request. */
export const getSessionUser = cache(async (): Promise<(AdminUser & { status: string }) | null> => {
  const id = readSessionToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!id) return null;
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true, status: true } });
  return user;
});

const isAdmin = (u: { role: string; status: string } | null) => u !== null && u.role === "admin" && u.status === "active";

/**
 * Gate for every admin page and every admin data read: not signed in → the login page; signed in
 * without admin rights (another role, or a blocked account) → the access-denied page.
 */
export async function requireAdmin(): Promise<AdminUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (!isAdmin(user)) redirect("/admin/forbidden");
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export class AdminAccessError extends Error {}

/** Gate for every admin Server Action: throws instead of redirecting, so the action stops right here. */
export async function assertAdmin(): Promise<AdminUser> {
  const user = await getSessionUser();
  if (!user) throw new AdminAccessError("Unauthorized");
  if (!isAdmin(user)) throw new AdminAccessError("Forbidden");
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
