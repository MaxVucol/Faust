import { redirect } from "next/navigation";
import { safeNext } from "@/lib/auth/redirect";
import { loginUrl } from "@/lib/auth/user";

/**
 * Transitional: the admin panel no longer has its own sign-in. Old links and bookmarks go to the site's
 * /login, back to the panel afterwards (a local `next` is kept; "reauth" too).
 */
export default async function AdminLoginRedirect({ searchParams }: PageProps<"/admin/login">) {
  const sp = await searchParams;
  const next = safeNext(sp.next, "/admin");
  redirect(`${loginUrl(next.startsWith("/admin") ? next : "/admin")}${sp.reauth === "1" ? "&reauth=1" : ""}`);
}
