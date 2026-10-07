import { SHOP_TIME_ZONE } from "./admin/time";
import { DEFAULT_LOCALE, INTL_LOCALES, type Locale } from "./i18n/config";

/** Anything with a price and an optional time-limited sale: a game or one of its variants (offers). */
export type Priced = {
  price: number;
  discountPrice: number | null;
  /** The sale starts immediately when unset. */
  discountStartsAt?: Date | null;
  discountEndsAt: Date | null;
};

export function formatDate(date: Date, locale: Locale = DEFAULT_LOCALE): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

/**
 * A sale's end date as formatDate writes it, but as the day in the shop's time zone (the one the admin
 * typed it in, lib/admin/time.ts), not the server's: a sale ending at 01:00 in Chisinau is still that day
 * on a UTC server.
 */
export function formatSaleEnd(date: Date, locale: Locale = DEFAULT_LOCALE): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], { day: "2-digit", month: "2-digit", year: "numeric", timeZone: SHOP_TIME_ZONE }).format(date);
}

/**
 * A sale is shown only while it runs (start ≤ now < end) and only if the sale price is really lower.
 * Expired or future sales simply don't count, so badges, old prices and deal lists update on their own.
 */
export function isOnSale(game: Priced, now: Date = new Date()): boolean {
  if (game.discountPrice == null || game.discountEndsAt == null) return false;
  if (!(game.discountPrice < game.price)) return false;
  if (game.discountStartsAt && game.discountStartsAt > now) return false;
  return game.discountEndsAt > now;
}

/** Released within the last 90 days (and not a future release). */
export function isNewRelease(game: { releaseDate: Date }, now: Date = new Date()): boolean {
  const age = now.getTime() - game.releaseDate.getTime();
  return age >= 0 && age <= 90 * 24 * 60 * 60 * 1000;
}

export function effectivePrice(game: Priced, now: Date = new Date()): number {
  return isOnSale(game, now) ? (game.discountPrice as number) : game.price;
}

/** Always derived from the two prices (never stored), rounded to the nearest whole percent. */
export function discountPercent(game: Priced): number {
  if (game.discountPrice == null || game.price <= 0 || game.discountPrice >= game.price) return 0;
  return Math.round(((game.price - game.discountPrice) / game.price) * 100);
}

export function formatRating(rating: number): string {
  return `${rating.toFixed(1)} / 10`;
}
