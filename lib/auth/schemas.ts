import { z } from "zod";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** Account rules shared by sign-in, registration, the admin panel's user forms and scripts/create-admin.ts. */
export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 200;

export const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email"));
export const passwordSchema = z.string().min(PASSWORD_MIN, `At least ${PASSWORD_MIN} characters`).max(PASSWORD_MAX, `At most ${PASSWORD_MAX} characters`);

export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, "Required").max(PASSWORD_MAX) });

/** The public sign-in form, with messages in the visitor's language. */
export function signInSchema(t: Dictionary) {
  const e = t.auth.errors;
  return z.object({
    email: z.string().trim().toLowerCase().pipe(z.email(e.email)),
    password: z.string().min(1, e.passwordRequired).max(PASSWORD_MAX, e.passwordMax),
  });
}

/**
 * Public registration. Only these four fields are read: there is no role or status here, every
 * account created from it is an ordinary active user (lib/auth/user.ts registerUser).
 */
export function registerSchema(t: Dictionary) {
  const e = t.auth.errors;
  return z
    .object({
      name: z.string().trim().min(2, t.contact.errors.nameMin).max(80, t.contact.errors.nameMax),
      email: z.string().trim().toLowerCase().max(200, e.email).pipe(z.email(e.email)),
      password: z.string().min(PASSWORD_MIN, e.passwordMin).max(PASSWORD_MAX, e.passwordMax),
      confirm: z.string().max(PASSWORD_MAX, e.passwordMax),
    })
    .refine((v) => v.password === v.confirm, { path: ["confirm"], message: e.passwordMismatch });
}
