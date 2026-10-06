"use server";

import { randomUUID } from "node:crypto";
import { after } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { priceLines, type PricedLine } from "@/lib/cart-pricing";
import { getSessionUser } from "@/lib/auth/user";
import { getCurrency, getDictionary, getLocale } from "@/lib/i18n/server";
import { allowAttempt, clientIp, isBot } from "@/lib/rate-limit";
import { cartLineSchema, contactSchema, newsletterSchema, orderSchema } from "@/lib/schemas";
import { notifyOrder, submitOrder } from "@/lib/orders";
import type { FormState } from "@/types";

const TEN_MINUTES = 10 * 60 * 1000;

/**
 * The cart page's prices: each line priced from the catalogue now, by the same rule the order uses
 * (null for a line that can't be bought any more). Read-only. Null when the list itself is invalid.
 */
export async function getCartPrices(lines: unknown): Promise<(PricedLine | null)[] | null> {
  const parsed = z.array(cartLineSchema).max(100).safeParse(lines);
  if (!parsed.success) return null;
  return priceLines(parsed.data);
}

/**
 * Checkout: validates the customer's details and the cart, then lib/orders.ts prices it again from the
 * database (the browser's prices are ignored), saves it, and returns its number. The shop's Telegram
 * message is sent after the response (after()); if Telegram fails the order still stands.
 */
export async function placeOrder(_prev: FormState, formData: FormData): Promise<FormState> {
  const t = await getDictionary();
  const o = t.cart.order;
  if (isBot(formData)) return { status: "success", message: o.success("—") };

  let items: unknown = [];
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { status: "error", message: o.errors.cart };
  }
  const parsed = orderSchema(t).safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    comment: formData.get("comment") ?? "",
    items,
    idempotencyKey: formData.get("idempotencyKey") || undefined,
  });
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    return { status: "error", message: fieldErrors.items || fieldErrors.idempotencyKey ? o.errors.cart : t.contact.errors.checkFields, fieldErrors };
  }
  const { idempotencyKey, ...order } = parsed.data;

  // The account comes from the session only; an inactive one orders as a guest.
  const [user, ip, locale, currency] = await Promise.all([getSessionUser(), clientIp(), getLocale(), getCurrency()]);
  const result = await submitOrder(
    // A form loaded before attempt keys existed: a fresh key (that attempt just isn't protected against repeats).
    { ...order, shownTotal: Number(formData.get("total")), key: idempotencyKey ?? randomUUID() },
    { ip, userId: user && user.status === "active" ? user.id : null, locale, currency },
  );
  if (!result.ok) {
    const messages = { unavailable: o.errors.unavailable, stock: o.errors.stock, pricesChanged: o.errors.pricesChanged, tooMany: o.errors.tooMany, failed: o.errors.failed } as const;
    const cartChanged = result.reason === "unavailable" || result.reason === "pricesChanged";
    return { status: "error", message: messages[result.reason], ...(cartChanged ? { code: "cart-changed" as const } : {}) };
  }
  // Only a newly saved order is announced (a repeat of it was announced already, or is pending).
  if (result.created) {
    const id = result.id;
    after(() => notifyOrder(id));
  }
  return { status: "success", message: o.success(result.number) };
}

export async function sendContactMessage(_prev: FormState, formData: FormData): Promise<FormState> {
  const t = await getDictionary();
  // A filled honeypot is a bot: answer as if it worked, store nothing.
  if (isBot(formData)) return { status: "success", message: t.contact.success };
  const parsed = contactSchema(t).safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: t.contact.errors.checkFields,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  // Only valid messages count, so someone correcting a typo is never locked out.
  if (!allowAttempt(`contact:${await clientIp()}`, 3, TEN_MINUTES)) {
    return { status: "error", message: t.contact.errors.tooMany };
  }
  try {
    await prisma.contactMessage.create({ data: parsed.data });
  } catch (error) {
    console.error("contact message failed", error);
    return { status: "error", message: t.contact.errors.sendFailed };
  }
  return { status: "success", message: t.contact.success };
}

export async function subscribeToNewsletter(_prev: FormState, formData: FormData): Promise<FormState> {
  const t = await getDictionary();
  if (isBot(formData)) return { status: "success", message: t.newsletter.success };
  const parsed = newsletterSchema(t).safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  if (!allowAttempt(`newsletter:${await clientIp()}`, 5, TEN_MINUTES)) {
    return { status: "error", message: t.newsletter.tooMany };
  }
  try {
    await prisma.newsletterSubscriber.create({ data: parsed.data });
  } catch (error) {
    // Already subscribed: treat as success so we don't reveal who is on the list.
    if (!(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")) {
      console.error("newsletter subscribe failed", error);
      return { status: "error", message: t.newsletter.failed };
    }
  }
  return { status: "success", message: t.newsletter.success };
}
