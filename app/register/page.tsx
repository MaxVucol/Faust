import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFrame } from "@/components/auth/AuthFrame";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { safeNext } from "@/lib/auth/redirect";
import { sessionsConfigured } from "@/lib/auth/session";
import { getSessionUser } from "@/lib/auth/user";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.auth.registerMeta, robots: { index: false } };
}

/** Public registration of an ordinary account (no email confirmation yet). Signed in already → the account. */
export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const [user, sp, t] = await Promise.all([getSessionUser(), searchParams, getDictionary()]);
  const next = safeNext(sp.next);
  if (user && user.status === "active") redirect(next);
  return (
    <AuthFrame title={t.auth.registerTitle} subtitle={t.auth.registerSubtitle}>
      <div className="border-t border-iron/80 px-5 py-8 sm:px-10">
        <RegisterForm next={next} configured={sessionsConfigured()} />
      </div>
    </AuthFrame>
  );
}
