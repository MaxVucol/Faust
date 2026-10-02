import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getSessionUser } from "@/lib/admin/auth";
import { sessionsConfigured } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Sign in" };

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const user = await getSessionUser();
  if (user) redirect(user.role === "admin" && user.status === "active" ? "/admin" : "/admin/forbidden");
  const next = (await searchParams).next;
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-gold-dark bg-[#100d0a]/95 glow-gold">
        <div className="border-b border-iron px-7 py-6 text-center">
          <p className="font-brand text-lg tracking-[0.16em] text-gold-light uppercase">The Iron Vault</p>
          <h1 className="mt-2 font-display-ui text-[0.75rem] text-parchment-muted">Admin sign-in</h1>
        </div>
        <div className="px-7 py-7">
          <LoginForm next={typeof next === "string" ? next : ""} configured={sessionsConfigured()} />
        </div>
      </div>
    </div>
  );
}
