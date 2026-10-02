"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { safeNext } from "@/lib/auth/redirect";
import { registerSchema, signInSchema } from "@/lib/auth/schemas";
import { sessionsConfigured } from "@/lib/auth/session";
import { endSession, getSessionUser, registerUser, revokeSessions, signIn } from "@/lib/auth/user";
import { getDictionary } from "@/lib/i18n/server";
import { clientIp, isBot } from "@/lib/rate-limit";

/**
 * The site's sign-in, registration and sign-out, on the single session of lib/auth (cookie iv_session).
 * Registration never takes a role: every account created here is an ordinary user. After signing in,
 * the visitor goes to `next` only when it is a local path (lib/auth/redirect.ts).
 */

export type AuthFormState = { error?: string; fieldErrors?: Record<string, string[] | undefined>; values?: { name?: string; email?: string } };

export async function signInAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const t = await getDictionary();
  const e = t.auth.errors;
  const email = String(formData.get("email") ?? "").slice(0, 200);
  if (!sessionsConfigured()) return { error: e.notConfigured, values: { email } };
  const parsed = signInSchema(t).safeParse({ email, password: String(formData.get("password") ?? "") });
  if (!parsed.success) return { error: e.checkFields, fieldErrors: z.flattenError(parsed.error).fieldErrors, values: { email } };
  const result = await signIn(parsed.data.email, parsed.data.password, await clientIp());
  if (!result.ok) {
    const messages = { invalid: e.invalid, blocked: e.blocked, "rate-limited": e.rateLimited, unavailable: e.unavailable } as const;
    return { error: messages[result.reason], values: { email } };
  }
  redirect(safeNext(formData.get("next")));
}

export async function registerAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const t = await getDictionary();
  const e = t.auth.errors;
  const values = { name: String(formData.get("name") ?? "").slice(0, 100), email: String(formData.get("email") ?? "").slice(0, 200) };
  // A filled honeypot is a bot: nothing is created.
  if (isBot(formData)) redirect("/");
  if (!sessionsConfigured()) return { error: e.notConfigured, values };
  const parsed = registerSchema(t).safeParse({ ...values, password: String(formData.get("password") ?? ""), confirm: String(formData.get("confirm") ?? "") });
  if (!parsed.success) return { error: e.checkFields, fieldErrors: z.flattenError(parsed.error).fieldErrors, values };
  const { name, email, password } = parsed.data;
  const result = await registerUser({ name, email, password }, await clientIp());
  if (!result.ok) {
    if (result.reason === "taken") return { error: e.checkFields, fieldErrors: { email: [e.taken] }, values };
    return { error: result.reason === "rate-limited" ? e.rateLimited : e.unavailable, values };
  }
  redirect(safeNext(formData.get("next")));
}

/** Signs out this browser (other devices stay signed in). */
export async function signOutAction(): Promise<void> {
  await endSession();
  redirect("/");
}

/** Ends every session of the signed-in account, this browser included. */
export async function signOutEverywhereAction(): Promise<void> {
  const user = await getSessionUser();
  if (user) await revokeSessions(user.id);
  await endSession();
  redirect("/login");
}
