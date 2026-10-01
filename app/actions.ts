"use server";

import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { convert, formatAmount } from "@/lib/currency";
import { effectivePrice } from "@/lib/format";
import { getCurrency, getDictionary, getLocale } from "@/lib/i18n/server";
import { bestOffer, gameOffers } from "@/lib/offers";
import { allowAttempt, clientIp, isBot } from "@/lib/rate-limit";
import { contactSchema, newsletterSchema, orderSchema } from "@/lib/schemas";
import { escapeTelegramHtml, sendTelegramMessage } from "@/lib/telegram";
import type { FormState } from "@/types";

const TEN_MINUTES = 10 * 60 * 1000;

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

  // Current prices and stock, straight from the catalogue.
  const now = new Date();
  const games = await prisma.game.findMany({
    where: { slug: { in: [...new Set(order.items.map((i) => i.slug))] } },
    select: { slug: true, title: true, price: true, discountPrice: true, discountStartsAt: true, discountEndsAt: true, platforms: true, variants: true, stock: true },
  });
  const lines = [];
  for (const item of order.items) {
    const game = games.find((g) => g.slug === item.slug);
    const offers = game ? gameOffers(game) : [];
    const offer = item.platform
      ? offers.find((of) => of.platform === item.platform && (of.edition ?? null) === (item.edition ?? null))
      : bestOffer(offers, now);
    if (!game || !offer || offer.stock <= 0) return { status: "error", message: o.errors.unavailable };
    const unit = effectivePrice(offer, now);
    lines.push({ title: game.title, platform: offer.platform, edition: offer.edition, quantity: item.quantity, unit, sum: unit * item.quantity });
  }

  // Counted only once everything checks out, so fixing a typo never locks anyone out.
  if (!allowAttempt(`order:${await clientIp()}`, 3, TEN_MINUTES)) {
    return { status: "error", message: o.errors.tooMany };
  }

  const [locale, currency] = await Promise.all([getLocale(), getCurrency()]);
  const totalMdl = Math.round(lines.reduce((s, l) => s + l.sum, 0) * 100) / 100;
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
