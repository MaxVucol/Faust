import { DEFAULT_LOCALE, INTL_LOCALES, type Locale } from "./i18n/config";

type Priced = { price: number; discountPrice: number | null; discountEndsAt: Date | null };

export function formatDate(date: Date, locale: Locale = DEFAULT_LOCALE): string {
  return new Intl.DateTimeFormat(INTL_LOCALES[locale], { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export function isOnSale(game: Priced, now: Date = new Date()): boolean {
  return game.discountPrice != null && game.discountEndsAt != null && game.discountEndsAt > now;
}

/** Released within the last 90 days (and not a future release). */
export function isNewRelease(game: { releaseDate: Date }, now: Date = new Date()): boolean {
  const age = now.getTime() - game.releaseDate.getTime();
  return age >= 0 && age <= 90 * 24 * 60 * 60 * 1000;
}

export function effectivePrice(game: Priced, now: Date = new Date()): number {
  return isOnSale(game, now) ? (game.discountPrice as number) : game.price;
}

export function discountPercent(game: Priced): number {
  if (game.discountPrice == null) return 0;
  return Math.round((1 - game.discountPrice / game.price) * 100);
}

export function formatRating(rating: number): string {
  return `${rating.toFixed(1)} / 10`;
}
