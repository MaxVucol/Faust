"use client";

import { useActionState, useState } from "react";
import { login, type LoginState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label } from "@/components/ui/Input";
import { Notice } from "./ui";

/** `reauthEmail`: an admin whose sign-in is too old for the panel, asked for the password again. */
export function LoginForm({ next, configured, reauthEmail }: { next: string; configured: boolean; reauthEmail: string | null }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  // Controlled, so the email survives a failed attempt (the password is cleared on purpose).
  const [email, setEmail] = useState(reauthEmail ?? "");
  const errors = state.fieldErrors ?? {};
  return (
    <form action={action} noValidate className="space-y-5">
      {!configured && <Notice tone="error">Signing in is not configured on this server (AUTH_SECRET).</Notice>}
      {reauthEmail && !state.error && <Notice tone="info">For security, the admin panel asks for your password again after 8 hours.</Notice>}
      {state.error && <Notice tone="error">{state.error}</Notice>}
      <input type="hidden" name="next" value={next} />
      <div>
        <Label htmlFor="admin-email">Email</Label>
        <Input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "admin-email-error" : undefined}
        />
        <FieldError id="admin-email-error" errors={errors.email ? [errors.email] : undefined} />
      </div>
      <div>
        <Label htmlFor="admin-password">Password</Label>
        <Input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "admin-password-error" : undefined}
        />
        <FieldError id="admin-password-error" errors={errors.password ? [errors.password] : undefined} />
      </div>
      <Button type="submit" variant="gold" disabled={pending || !configured} className="min-h-12 w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
