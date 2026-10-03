import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { btn } from "@/components/admin/ui";
import { Corners, OrnateDivider } from "@/components/ui/Ornaments";
import { isAdmin } from "@/lib/admin/auth";
import { getSessionUser, loginUrl } from "@/lib/auth/user";
import { getAdminI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getAdminI18n()).t.meta.forbidden };
}

/** Signed in, but without admin rights (an ordinary account, or one blocked since signing in). */
export default async function ForbiddenPage() {
  const [user, { t }] = await Promise.all([getSessionUser(), getAdminI18n()]);
  if (!user) redirect(loginUrl("/admin"));
  if (isAdmin(user)) redirect("/admin");
  const T = t.forbidden;
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md border border-gold-dark bg-panel/95 px-7 py-9 text-center">
        <Corners />
        <span aria-hidden className="relative mx-auto flex size-16 items-center justify-center">
          <span className="absolute inset-2 rotate-45 border border-blood/70 bg-panel-deep" />
          <ShieldAlert className="relative size-6 text-blood-text" strokeWidth={1.5} />
        </span>
        <p className="mt-5 font-display-ui text-[0.65rem] tracking-[0.3em] text-parchment-muted">403</p>
        <h1 className="text-gold mt-1 font-display text-2xl font-semibold tracking-[0.12em] uppercase">{T.title}</h1>
        <OrnateDivider className="mx-auto mt-4 max-w-56" />
        <p className="mt-3 text-parchment-muted">{T.text(user.email, user.status === "blocked")}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <form action={logout}>
            <button type="submit" className={btn("secondary", "md", "w-full sm:w-auto")}>
              {T.otherAccount}
            </button>
          </form>
          <Link href="/account" className={btn("quiet", "md")}>
            {T.myAccount}
          </Link>
          <Link href="/" className={btn("quiet", "md")}>
            {T.backToShop}
          </Link>
        </div>
      </div>
    </div>
  );
}
