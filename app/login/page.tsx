import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFrame } from "@/components/auth/AuthFrame";
import { LoginForm } from "@/components/auth/LoginForm";
import { isAdmin, isFresh } from "@/lib/admin/auth";
import { safeNext } from "@/lib/auth/redirect";
import { sessionsConfigured } from "@/lib/auth/session";
import { getSessionUser } from "@/lib/auth/user";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.auth.loginMeta, robots: { index: false } };
}

/**
 * The site's single sign-in. Afterwards the visitor goes to `next` when it is a local path (default
 * /account). Someone already signed in goes straight there, except an admin whose sign-in is too old for
 * the admin panel: they confirm the password here first.
 */
export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const [user, sp, t] = await Promise.all([getSessionUser(), searchParams, getDictionary()]);
  const next = safeNext(sp.next);
  const reauth = user !== null && next.startsWith("/admin") && isAdmin(user) && !isFresh(user);
  if (user && user.status === "active" && !reauth) redirect(next);
  return (
    <AuthFrame title={reauth ? t.auth.reauthTitle : t.auth.loginTitle} subtitle={reauth ? undefined : t.auth.loginSubtitle}>
      <div className="border-t border-iron/80 px-5 py-8 sm:px-10">
        <LoginForm next={next} configured={sessionsConfigured()} reauthEmail={reauth ? user.email : null} />
      </div>
    </AuthFrame>
  );
}
