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

/** Which version of a game a cart line is; prices are never taken from the browser. */
export const cartLineSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  platform: z.string().trim().max(60).optional(),
  edition: z.string().trim().max(80).nullish(),
});

/** One cart line as the checkout form sends it. */
const orderLineSchema = cartLineSchema.extend({
  quantity: z.number().int().min(1).max(99),
});

export function orderSchema(t: Dictionary) {
  const e = t.contact.errors;
  const o = t.cart.order.errors;
  return z.object({
    name: z.string().trim().min(2, e.nameMin).max(80, e.nameMax),
    phone: z.string().trim().regex(/^\+?[0-9][0-9\s().-]{5,19}$/, o.phone),
    email: z.string().trim().pipe(z.email(e.email)),
    comment: z.string().trim().max(500, o.commentMax),
    items: z.array(orderLineSchema, o.cart).min(1, o.cart).max(30, o.cart),
    /** The checkout attempt's random key (lib/orders.ts); a form from before keys existed sends none. */
    idempotencyKey: z.string().regex(/^[A-Za-z0-9-]{16,64}$/, o.cart).optional(),
  });
}

export function newsletterSchema(t: Dictionary) {
  return z.object({
    email: z.string().trim().toLowerCase().pipe(z.email(t.contact.errors.email)),
  });
}
