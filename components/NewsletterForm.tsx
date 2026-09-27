"use client";

import { useActionState } from "react";
import { subscribeToNewsletter } from "@/app/actions";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { FieldError } from "@/components/ui/Input";
import type { FormState } from "@/types";

const initial: FormState = { status: "idle" };

export function NewsletterForm() {
  const { t } = useI18n();
  const [state, action, pending] = useActionState(subscribeToNewsletter, initial);

  if (state.status === "success") {
    return (
      <p role="status" className="border border-moss px-5 py-3 text-base text-parchment">
        {state.message}
      </p>
    );
  }

  const emailErrors = state.fieldErrors?.email;
  return (
    <form action={action} noValidate className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
        <label htmlFor="newsletter-email" className="sr-only">
          {t.newsletter.emailLabel}
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={t.newsletter.placeholder}
          aria-invalid={emailErrors ? true : undefined}
          aria-describedby={emailErrors ? "newsletter-error" : undefined}
          className="min-w-0 flex-1 border border-iron bg-base px-4 py-3 text-base text-parchment placeholder:text-parchment-muted/70 transition-colors duration-300 focus:border-aged-gold aria-invalid:border-blood"
        />
        <Button type="submit" disabled={pending} className="sm:border-l-0">
          {pending ? t.newsletter.sending : t.newsletter.submit}
        </Button>
      </div>
      <FieldError id="newsletter-error" errors={emailErrors} />
      {state.status === "error" && state.message && <p className="mt-2 text-sm text-blood-text">{state.message}</p>}
    </form>
  );
}
