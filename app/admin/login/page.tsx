import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { isAdmin, isFresh } from "@/lib/admin/auth";
import { sessionsConfigured } from "@/lib/auth/session";
import { getSessionUser } from "@/lib/auth/user";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const [user, sp] = await Promise.all([getSessionUser(), searchParams]);
  // An admin whose sign-in is too old for the panel stays here to confirm the password.
  const reauth = user !== null && isAdmin(user) && !isFresh(user);
  if (user && !reauth) redirect(isAdmin(user) ? "/admin" : "/admin/forbidden");
  const next = typeof sp.next === "string" ? sp.next : "";
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-gold-dark bg-[#100d0a]/95 glow-gold">
        <div className="border-b border-iron px-7 py-6 text-center">
          <p className="font-brand text-lg tracking-[0.16em] text-gold-light uppercase">The Iron Vault</p>
          <h1 className="mt-2 font-display-ui text-[0.75rem] text-parchment-muted">{reauth ? "Confirm your password" : "Admin sign-in"}</h1>
        </div>
        <div className="px-7 py-7">
          <LoginForm next={next} configured={sessionsConfigured()} reauthEmail={reauth ? user.email : null} />
        </div>
      </div>
    </div>
  );
}
