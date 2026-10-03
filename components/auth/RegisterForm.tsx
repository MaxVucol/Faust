"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { registerAction, type AuthFormState } from "@/app/auth/actions";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { Honeypot } from "@/components/ui/Honeypot";
import { FieldError, Input, Label } from "@/components/ui/Input";

/** Registration: name, email, password twice. There is no role field; every account is an ordinary user. */
export function RegisterForm({ next, configured }: { next: string; configured: boolean }) {
  const { t } = useI18n();
  const a = t.auth;
  const [state, action, pending] = useActionState<AuthFormState, FormData>(registerAction, {});
  // Controlled, so name and email survive a rejected submission (passwords are cleared on purpose).
  const [values, setValues] = useState({ name: "", email: "" });
  const errors = state.fieldErrors ?? {};
  const aria = (name: string) => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `register-${name}-error` : name === "password" ? "register-password-hint" : undefined,
  });
  return (
    <form action={action} noValidate className="space-y-5">
      <Honeypot />
      {!configured && !state.error && (
        <p role="alert" className="border-l-2 border-blood-text pl-3 text-blood-text">
          {a.errors.unavailable}
        </p>
      )}
      <input type="hidden" name="next" value={next} />
      <div>
        <Label htmlFor="register-name">{a.name}</Label>
        <Input id="register-name" name="name" autoComplete="name" required value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} {...aria("name")} />
        <FieldError id="register-name-error" errors={errors.name} />
      </div>
      <div>
        <Label htmlFor="register-email">{a.email}</Label>
        <Input id="register-email" name="email" type="email" autoComplete="email" required value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} {...aria("email")} />
        <FieldError id="register-email-error" errors={errors.email} />
      </div>
      <div>
        <Label htmlFor="register-password">{a.password}</Label>
        <Input id="register-password" name="password" type="password" autoComplete="new-password" required {...aria("password")} />
        {errors.password ? (
          <FieldError id="register-password-error" errors={errors.password} />
        ) : (
          <p id="register-password-hint" className="mt-2 text-sm text-parchment-muted">
            {a.passwordHint}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="register-confirm">{a.confirm}</Label>
        <Input id="register-confirm" name="confirm" type="password" autoComplete="new-password" required {...aria("confirm")} />
        <FieldError id="register-confirm-error" errors={errors.confirm} />
      </div>
      {state.error && (
        <p role="alert" className="border-l-2 border-blood-text pl-3 text-base text-blood-text">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="gold" disabled={pending || !configured} className="min-h-12 w-full">
        {pending ? a.submittingRegister : a.submitRegister}
      </Button>
      <p className="text-center text-parchment-muted">
        {a.haveAccount}{" "}
        <Link href={next && next !== "/account" ? `/login?next=${encodeURIComponent(next)}` : "/login"} className="text-gold-light underline-offset-4 hover:underline">
          {a.toLogin}
        </Link>
      </p>
    </form>
  );
}
