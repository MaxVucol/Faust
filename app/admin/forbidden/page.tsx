import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { btn } from "@/components/admin/ui";
import { Corners, OrnateDivider } from "@/components/ui/Ornaments";
import { isAdmin } from "@/lib/admin/auth";
import { getSessionUser, loginUrl } from "@/lib/auth/user";

export const metadata: Metadata = { title: "Access denied" };

/** Signed in, but without admin rights (an ordinary account, or one blocked since signing in). */
export default async function ForbiddenPage() {
  const user = await getSessionUser();
  if (!user) redirect(loginUrl("/admin"));
  if (isAdmin(user)) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md border border-gold-dark bg-panel/95 px-7 py-9 text-center">
        <Corners />
        <span aria-hidden className="relative mx-auto flex size-16 items-center justify-center">
          <span className="absolute inset-2 rotate-45 border border-blood/70 bg-panel-deep" />
          <ShieldAlert className="relative size-6 text-blood-text" strokeWidth={1.5} />
        </span>
        <p className="mt-5 font-display-ui text-[0.65rem] tracking-[0.3em] text-parchment-muted">403</p>
        <h1 className="text-gold mt-1 font-display text-2xl font-semibold tracking-[0.12em] uppercase">Access denied</h1>
        <OrnateDivider className="mx-auto mt-4 max-w-56" />
        <p className="mt-3 text-parchment-muted">
          You are signed in as <span className="text-parchment">{user.email}</span>, but this account {user.status === "blocked" ? "is blocked" : "has no admin rights"}.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <form action={logout}>
            <button type="submit" className={btn("secondary", "md", "w-full sm:w-auto")}>
              Sign in with another account
            </button>
          </form>
          <Link href="/account" className={btn("quiet", "md")}>
            My account
          </Link>
          <Link href="/" className={btn("quiet", "md")}>
            Back to the shop
          </Link>
        </div>
      </div>
    </div>
  );
}
