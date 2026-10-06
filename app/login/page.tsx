import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFrame } from "@/components/auth/AuthFrame";
import { LoginForm } from "@/components/auth/LoginForm";
import { isAdmin, isFresh } from "@/lib/admin/auth";
import { googleConfigured, googleMessage } from "@/lib/auth/google";
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
 * the admin panel: they confirm the password here first. Google is offered to customers only: not on the
 * way to the admin panel and not for the password confirmation. ?error=google_… explains a Google
 * sign-in that came back (only known codes are shown).
 */
export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const [user, sp, t] = await Promise.all([getSessionUser(), searchParams, getDictionary()]);
  const next = safeNext(sp.next);
  const reauth = user !== null && next.startsWith("/admin") && isAdmin(user) && !isFresh(user);
  if (user && user.status === "active" && !reauth) redirect(next);
  const error = typeof sp.error === "string" && sp.error.startsWith("google_") ? googleMessage(t, sp.error.slice(7)) : null;
  return (
    <AuthFrame title={reauth ? t.auth.reauthTitle : t.auth.loginTitle} subtitle={reauth ? undefined : t.auth.loginSubtitle}>
      <div className="border-t border-iron/80 px-5 py-8 sm:px-10">
        <LoginForm
          next={next}
          configured={sessionsConfigured()}
          reauthEmail={reauth ? user.email : null}
          google={!reauth && !next.startsWith("/admin") && googleConfigured()}
          notice={error?.tone === "error" ? error.text : null}
        />
      </div>
    </AuthFrame>
  );
}
