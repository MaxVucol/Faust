import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { isAdmin } from "@/lib/admin/auth";
import { getSessionUser } from "@/lib/auth/user";

export const metadata: Metadata = { title: "Access denied" };

/** Signed in, but without admin rights (another role or a blocked account). */
export default async function ForbiddenPage() {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  if (isAdmin(user)) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-gold-dark bg-[#100d0a]/95 px-7 py-8 text-center">
        <span aria-hidden className="mx-auto flex size-14 items-center justify-center border border-blood/70">
          <ShieldAlert className="size-6 text-blood-text" strokeWidth={1.5} />
        </span>
        <p className="mt-5 font-display-ui text-[0.7rem] text-parchment-muted">403</p>
        <h1 className="mt-1 font-display text-2xl tracking-[0.1em] text-parchment uppercase">Access denied</h1>
        <p className="mt-3 text-parchment-muted">
          You are signed in as <span className="text-parchment">{user.email}</span>, but this account {user.status === "blocked" ? "is blocked" : "has no admin rights"}.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <form action={logout}>
            <button type="submit" className="min-h-11 w-full border border-gold-dark/80 px-5 font-display-ui text-[0.68rem] text-gold-light hover:border-gold-light sm:w-auto">
              Sign in with another account
            </button>
          </form>
          <Link href="/" className="flex min-h-11 items-center justify-center px-5 font-display-ui text-[0.68rem] text-parchment-muted hover:text-parchment">
            Back to the shop
          </Link>
        </div>
      </div>
    </div>
  );
}
