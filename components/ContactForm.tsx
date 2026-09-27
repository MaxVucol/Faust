"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { sendContactMessage } from "@/app/actions";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CONTACT_SUBJECTS } from "@/lib/schemas";
import type { FormState } from "@/types";

const initial: FormState = { status: "idle" };

function SubmitButton() {
  const { t } = useI18n();
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? t.contact.sending : t.contact.send}
    </Button>
  );
}

export function ContactForm() {
  const { t } = useI18n();
  const c = t.contact;
  const [state, action] = useActionState(sendContactMessage, initial);
  const errors = state.fieldErrors ?? {};
  const field = (name: string) => ({
    id: name,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  if (state.status === "success") {
    return (
      <div role="status" className="border border-moss bg-surface p-8">
        <h2 className="font-display text-lg font-semibold tracking-[0.12em] uppercase">{c.sentTitle}</h2>
        <p className="mt-3 text-parchment">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">{c.name}</Label>
          <Input {...field("name")} autoComplete="name" required />
          <FieldError id="name-error" errors={errors.name} />
        </div>
        <div>
          <Label htmlFor="email">{c.email}</Label>
          <Input {...field("email")} type="email" autoComplete="email" required />
          <FieldError id="email-error" errors={errors.email} />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">{c.subject}</Label>
        <Select {...field("subject")} defaultValue="" required>
          <option value="" disabled>
            {c.chooseSubject}
          </option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {c.subjects[s]}
            </option>
          ))}
        </Select>
        <FieldError id="subject-error" errors={errors.subject} />
      </div>
      <div>
        <Label htmlFor="message">{c.message}</Label>
        <Textarea {...field("message")} required />
        <FieldError id="message-error" errors={errors.message} />
      </div>
      {state.status === "error" && state.message && (
        <p role="alert" className="text-base text-blood-text">
          {state.message}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}
