"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signInAction, type AuthFormState } from "@/app/auth/actions";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label } from "@/components/ui/Input";

/**
 * Sign-in: email and password, returning to `next` (checked on the server). `reauthEmail`: an admin
 * whose sign-in is too old for the admin panel, asked for the password again.
 */
export function LoginForm({ next, configured, reauthEmail }: { next: string; configured: boolean; reauthEmail: string | null }) {
  const { t } = useI18n();
  const a = t.auth;
  const [state, action, pending] = useActionState<AuthFormState, FormData>(signInAction, {});
  // Controlled, so the email survives a failed attempt (the password is cleared on purpose).
  const [email, setEmail] = useState(reauthEmail ?? "");
  const errors = state.fieldErrors ?? {};
  return (
    <form action={action} noValidate className="space-y-5">
      {!configured && (
        <p role="alert" className="border-l-2 border-blood-text pl-3 text-blood-text">
          {a.errors.notConfigured}
        </p>
      )}
      {reauthEmail && !state.error && <p className="border-l-2 border-aged-gold pl-3 text-parchment">{a.reauthText}</p>}
      <input type="hidden" name="next" value={next} />
      <div>
        <Label htmlFor="login-email">{a.email}</Label>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "login-email-error" : undefined}
        />
        <FieldError id="login-email-error" errors={errors.email} />
      </div>
      <div>
        <Label htmlFor="login-password">{a.password}</Label>
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "login-password-error" : undefined}
        />
        <FieldError id="login-password-error" errors={errors.password} />
      </div>
      {state.error && (
        <p role="alert" className="border-l-2 border-blood-text pl-3 text-base text-blood-text">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="gold" disabled={pending || !configured} className="min-h-12 w-full">
        {pending ? a.submittingLogin : a.submitLogin}
      </Button>
      {!reauthEmail && (
        <p className="text-center text-parchment-muted">
          {a.noAccount}{" "}
          <Link href={next && next !== "/account" ? `/register?next=${encodeURIComponent(next)}` : "/register"} className="text-gold-light underline-offset-4 hover:underline">
            {a.toRegister}
          </Link>
        </p>
      )}
    </form>
  );
}
