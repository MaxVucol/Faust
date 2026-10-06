import "server-only";
import { createHash } from "node:crypto";
import { Prisma } from "@prisma/client";
import { consume, orderRules, orderShopRule, RateLimitUnavailable } from "./auth/rate-limit";
import { priceLinesWithStock } from "./cart-pricing";
import { convert, formatAmount, isCurrency } from "./currency";
import { prisma } from "./prisma";
import { escapeTelegramHtml, sendTelegramMessage } from "./telegram";

/**
 * Placing an order (app/actions.ts placeOrder is the form's entry point). The database is the record of
 * an order: it is priced and checked here, saved, and only then announced in the shop's Telegram chat
 * (notifyOrder). A failed notification never undoes or refuses an order; it stays pending and can be
 * sent again (scripts/notify-orders.ts).
 *
 * Repeats: every checkout attempt carries a random key from the browser (CheckoutForm). The order's
 * database id is derived from that key and the account placing it (orderIdFor), and MongoDB's _id is
 * always unique, so however often an attempt arrives (a double click, a retry after a lost response,
 * parallel requests) it creates at most one order; a repeat gets the same order number back. The key is
 * known only to the browser that made it, and a repeat must come from the same account (or guest) with
 * the same email, so it can't be used to look up anyone else's order.
 *
 * Prices, discounts, stock and the total always come from the catalogue (lib/cart-pricing.ts); the
 * browser only names games, versions and quantities. Its total is compared, never used.
 */

export type OrderLine = { slug: string; platform?: string; edition?: string | null; quantity: number };

export type OrderRequest = {
  name: string;
  phone: string;
  email: string;
  comment: string;
  items: OrderLine[];
  /** The total the visitor saw (MDL), only compared with the server's. */
  shownTotal: number;
  /** The checkout attempt's key (16–64 letters, digits or dashes). */
  key: string;
};

export type OrderContext = {
  ip: string;
  /** The signed-in, active account placing the order (from the session), or null for a guest. */
  userId: string | null;
  locale: string;
  currency: string;
  now?: Date;
  /** Separates the security tests' rate-limit counters from the shop's; never set by the site. */
  limitScope?: string;
};

export type OrderResult =
  | { ok: true; id: string; number: string; created: boolean }
  | { ok: false; reason: "unavailable" | "stock" | "pricesChanged" | "tooMany" | "failed" };

/** The order's database id for one checkout attempt of one account (or of a guest): 24 hex digits, a valid ObjectId. */
export function orderIdFor(key: string, userId: string | null): string {
  return createHash("sha256").update(`iv-order.${userId ?? "guest"}.${key}`).digest("hex").slice(0, 24);
}

const sameOwner = (order: { email: string; userId: string | null }, req: OrderRequest, ctx: OrderContext) =>
  order.email.trim().toLowerCase() === req.email.trim().toLowerCase() && (order.userId ?? null) === ctx.userId;

/** An attempt that was already placed: its number again (nothing new is created or counted). */
async function existing(id: string, req: OrderRequest, ctx: OrderContext): Promise<OrderResult | null> {
  const order = await prisma.order.findUnique({ where: { id }, select: { number: true, email: true, userId: true } });
  if (!order) return null;
  // The same key from another email can only be a mistake or a guess: say nothing about that order.
  if (!sameOwner(order, req, ctx)) return { ok: false, reason: "failed" };
  return { ok: true, id, number: order.number, created: false };
}

/** Counts the order against the limits (lib/auth/rate-limit.ts); fail-closed like sign-in. */
async function withinLimits(req: OrderRequest, ctx: OrderContext): Promise<"ok" | "tooMany" | "failed"> {
  try {
    if (!(await consume(orderRules({ ip: ctx.ip, email: req.email, phone: req.phone, userId: ctx.userId }, ctx.limitScope)))) return "tooMany";
    return (await consume(orderShopRule(ctx.limitScope))) ? "ok" : "tooMany";
  } catch (error) {
    if (!(error instanceof RateLimitUnavailable)) throw error;
    console.error("[orders] refused: rate limit unavailable", error.message);
    return "failed";
  }
}

/**
 * Checks, prices and saves one order. Validation of the fields themselves (lengths, formats, 1–99 per
 * line, at most 30 lines) is the caller's (lib/schemas.ts orderSchema).
 */
export async function submitOrder(req: OrderRequest, ctx: OrderContext): Promise<OrderResult> {
  const now = ctx.now ?? new Date();
  const id = orderIdFor(req.key, ctx.userId);
  const again = await existing(id, req, ctx);
  if (again) return again;

  // Current prices, discounts and stock, straight from the catalogue.
  const priced = await priceLinesWithStock(req.items, now);
  const lines = [];
  const wanted = new Map<string, { quantity: number; stock: number }>();
  for (const [i, item] of req.items.entries()) {
    const line = priced[i];
    if (!line) return { ok: false, reason: "unavailable" };
    // The same version may be in the cart twice (once without a platform, once with): counted together.
    const version = `${item.slug}\u0000${line.platform}\u0000${line.edition ?? ""}`;
    const w = wanted.get(version) ?? { quantity: 0, stock: line.stock };
    w.quantity += item.quantity;
    wanted.set(version, w);
    lines.push({ slug: item.slug, title: line.title, platform: line.platform, edition: line.edition, quantity: item.quantity, unitPrice: line.price, sum: line.price * item.quantity });
  }
  if ([...wanted.values()].some((w) => w.quantity > w.stock)) return { ok: false, reason: "stock" };
  const totalMdl = Math.round(lines.reduce((s, l) => s + l.sum, 0) * 100) / 100;
  // A different total means prices changed since the cart was shown: the visitor sees the new one first.
  if (!(Math.abs(req.shownTotal - totalMdl) < 0.005)) return { ok: false, reason: "pricesChanged" };

  const allowed = await withinLimits(req, ctx);
  if (allowed !== "ok") {
    // Copies of one attempt sent at once all reach the limits; the one that got through may be saving
    // it right now. Then this copy is a repeat, not a new order: answer with that order.
    for (let i = 0; i < 2; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const saved = await existing(id, req, ctx);
      if (saved) return saved;
    }
    return { ok: false, reason: allowed };
  }

  const number = `IV-${now.getTime().toString(36).toUpperCase()}`;
  try {
    await prisma.order.create({
      data: {
        id,
        number,
        userId: ctx.userId,
        name: req.name,
        email: req.email,
        phone: req.phone,
        comment: req.comment || null,
        items: lines.map((l) => ({ ...l, unitPrice: Math.round(l.unitPrice * 100) / 100, sum: Math.round(l.sum * 100) / 100 })),
        totalMdl,
        currency: ctx.currency,
        locale: ctx.locale,
        notifiedAt: null,
        notifyAttempts: 0,
      },
    });
  } catch (error) {
    // The same attempt arriving twice at once: the other request saved it first.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const saved = await existing(id, req, ctx);
      if (saved) return saved;
    }
    console.error("[orders] save failed", error instanceof Error ? error.message : "unknown error");
    return { ok: false, reason: "failed" };
  }
  return { ok: true, id, number, created: true };
}

// ---------- The shop's notification ----------

type NotifiedOrder = Prisma.OrderGetPayload<{ select: { number: true; items: true; totalMdl: true; currency: true; name: true; phone: true; email: true; comment: true; locale: true; createdAt: true } }>;

/** The Telegram message for an order (HTML parse mode; everything the customer typed is escaped). */
export function orderMessage(order: NotifiedOrder): string {
  const mdl = (v: number) => formatAmount(Math.round(v * 100) / 100, "MDL");
  const e = escapeTelegramHtml;
  const currency = isCurrency(order.currency) ? order.currency : "MDL";
  return [
    `🛒 <b>Comandă nouă ${e(order.number)}</b>`,
    "",
    ...order.items.map((l) => `• ${e(l.title)} — ${e([l.platform, l.edition].filter(Boolean).join(" · "))} × ${l.quantity} = ${mdl(l.sum)}`),
    "",
    `<b>Total: ${mdl(order.totalMdl)}</b>${currency !== "MDL" ? ` (≈ ${formatAmount(convert(order.totalMdl, currency), currency)})` : ""}`,
    "",
    `👤 ${e(order.name)}`,
    `📞 ${e(order.phone)}`,
    `✉️ ${e(order.email)}`,
    ...(order.comment ? [`💬 ${e(order.comment)}`] : []),
    "",
    `Limba: ${e(order.locale.toUpperCase())} · Valuta: ${e(order.currency)}`,
    new Intl.DateTimeFormat("ro-RO", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Chisinau" }).format(order.createdAt),
  ].join("\n");
}

/**
 * Sends one order's notification, once: "sent" (now marked notifiedAt), "failed" (logged; the order stays
 * pending), or "skipped" (already sent, an order from before notifications were tracked, or another
 * attempt for it is running: each attempt first claims the next attempt number, so two never send at once).
 */
export async function notifyOrder(id: string, send: (html: string) => Promise<void> = sendTelegramMessage): Promise<"sent" | "failed" | "skipped"> {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      select: { number: true, items: true, totalMdl: true, currency: true, name: true, phone: true, email: true, comment: true, locale: true, createdAt: true, notifiedAt: true, notifyAttempts: true },
    });
    if (!order || order.notifiedAt || order.notifyAttempts == null) return "skipped";
    const claimed = await prisma.order.updateMany({ where: { id, notifiedAt: null, notifyAttempts: order.notifyAttempts }, data: { notifyAttempts: order.notifyAttempts + 1 } });
    if (claimed.count !== 1) return "skipped";
    try {
      await send(orderMessage(order));
    } catch (error) {
      console.error(`[orders] Telegram notification failed for ${order.number} (attempt ${order.notifyAttempts + 1}):`, error instanceof Error ? error.message : "unknown error");
      return "failed";
    }
    await prisma.order.update({ where: { id }, data: { notifiedAt: new Date() } });
    return "sent";
  } catch (error) {
    console.error("[orders] notification bookkeeping failed", error instanceof Error ? error.message : "unknown error");
    return "failed";
  }
}

/** Orders whose notification hasn't been delivered yet (only orders saved with tracking), oldest first. */
export function pendingNotifications(take = 50) {
  return prisma.order.findMany({ where: { notifiedAt: null, notifyAttempts: { gte: 0 } }, orderBy: { createdAt: "asc" }, take, select: { id: true, number: true, createdAt: true, notifyAttempts: true } });
}
