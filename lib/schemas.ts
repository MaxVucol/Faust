import { z } from "zod";
import type { Dictionary } from "./i18n/dictionaries";

/** Stable keys stored with each message; labels live in the dictionaries (t.contact.subjects). */
export const CONTACT_SUBJECTS = ["order", "key", "refund", "collab", "other"] as const;

/**
 * Name of the hidden anti-spam field on the public forms. People never see or fill it; bots that fill
 * every input do, and their submission is dropped (lib/rate-limit.ts).
 */
export const HONEYPOT_FIELD = "website";

/** Schemas are built per request so validation messages come out in the visitor's language. */
export function contactSchema(t: Dictionary) {
  const e = t.contact.errors;
  return z.object({
    name: z.string().trim().min(2, e.nameMin).max(80, e.nameMax),
    email: z.string().trim().pipe(z.email(e.email)),
    subject: z.enum(CONTACT_SUBJECTS, e.subject),
    message: z.string().trim().min(10, e.messageMin).max(2000, e.messageMax),
  });
}

export function newsletterSchema(t: Dictionary) {
  return z.object({
    email: z.string().trim().toLowerCase().pipe(z.email(t.contact.errors.email)),
  });
}
