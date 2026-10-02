"use server";

import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { priceLines, type PricedLine } from "@/lib/cart-pricing";
import { convert, formatAmount } from "@/lib/currency";
import { getSessionUser } from "@/lib/auth/user";
import { getCurrency, getDictionary, getLocale } from "@/lib/i18n/server";
import { allowAttempt, clientIp, isBot } from "@/lib/rate-limit";
import { cartLineSchema, contactSchema, newsletterSchema, orderSchema } from "@/lib/schemas";
import { escapeTelegramHtml, sendTelegramMessage } from "@/lib/telegram";
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
 * Checkout: validates the customer's details and the cart, prices every line again from the database
 * (the browser's prices are ignored), and sends the order to the shop's Telegram chat.
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
  });
  if (!parsed.success) {
    const fieldErrors = z.flattenError(parsed.error).fieldErrors;
    return { status: "error", message: fieldErrors.items ? o.errors.cart : t.contact.errors.checkFields, fieldErrors };
  }
  const order = parsed.data;

  // Current prices and stock, straight from the catalogue (the same pricing the cart page shows).
  const now = new Date();
  const priced = await priceLines(order.items, now);
  const lines = [];
  for (const [i, item] of order.items.entries()) {
    const line = priced[i];
    if (!line) return { status: "error", message: o.errors.unavailable, code: "cart-changed" };
    lines.push({ slug: item.slug, title: line.title, platform: line.platform, edition: line.edition, quantity: item.quantity, unitPrice: line.price, sum: line.price * item.quantity });
  }
  const totalMdl = Math.round(lines.reduce((s, l) => s + l.sum, 0) * 100) / 100;
  // The total the visitor saw (MDL). It never sets the price; a different one means prices changed
  // since the cart was shown, so the order waits until the visitor has seen the new total.
  if (!(Math.abs(Number(formData.get("total")) - totalMdl) < 0.005)) {
    return { status: "error", message: o.errors.pricesChanged, code: "cart-changed" };
  }

  // Counted only once everything checks out, so fixing a typo never locks anyone out.
  if (!allowAttempt(`order:${await clientIp()}`, 3, TEN_MINUTES)) {
    return { status: "error", message: o.errors.tooMany };
  }

  const [locale, currency] = await Promise.all([getLocale(), getCurrency()]);
  const number = `IV-${now.getTime().toString(36).toUpperCase()}`;
  const mdl = (v: number) => formatAmount(Math.round(v * 100) / 100, "MDL");
  const e = escapeTelegramHtml;
  const text = [
    `🛒 <b>Comandă nouă ${number}</b>`,
    "",
    ...lines.map((l) => `• ${e(l.title)} — ${e([l.platform, l.edition].filter(Boolean).join(" · "))} × ${l.quantity} = ${mdl(l.sum)}`),
    "",
    `<b>Total: ${mdl(totalMdl)}</b>${currency !== "MDL" ? ` (≈ ${formatAmount(convert(totalMdl, currency), currency)})` : ""}`,
    "",
    `👤 ${e(order.name)}`,
    `📞 ${e(order.phone)}`,
    `✉️ ${e(order.email)}`,
    ...(order.comment ? [`💬 ${e(order.comment)}`] : []),
    "",
    `Limba: ${locale.toUpperCase()} · Valuta: ${currency}`,
    new Intl.DateTimeFormat("ro-RO", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Chisinau" }).format(now),
  ].join("\n");

  try {
    await sendTelegramMessage(text);
  } catch (error) {
    console.error("order notification failed", error instanceof Error ? error.message : error);
    return { status: "error", message: o.errors.failed };
  }
  // Kept for the admin panel once the shop has it. The customer's order is already placed at this
  // point, so a failed save is only logged. Signed in: the order belongs to the account (its id, from the
  // session, never from the form); a guest order has no account.
  try {
    const user = await getSessionUser();
    await prisma.order.create({
      data: {
        number,
        userId: user && user.status === "active" ? user.id : null,
        name: order.name,
        email: order.email,
        phone: order.phone,
        comment: order.comment || null,
        items: lines.map((l) => ({ ...l, unitPrice: Math.round(l.unitPrice * 100) / 100, sum: Math.round(l.sum * 100) / 100 })),
        totalMdl,
        currency,
        locale,
      },
    });
  } catch (error) {
    console.error("order save failed", number, error instanceof Error ? error.message : error);
  }
  return { status: "success", message: o.success(number) };
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
