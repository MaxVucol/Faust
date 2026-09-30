import type { GameVariant } from "@prisma/client";
import { discountPercent, effectivePrice, isOnSale, type Priced } from "./format";

/** One purchasable version of a game, with the game's defaults filled in. */
export type Offer = Priced & {
  platform: string;
  edition: string | null;
  activation: string | null;
  region: string | null;
  stock: number;
};

type OfferSource = Priced & { platforms: string[]; variants: GameVariant[]; stock: number };

/**
 * The versions a customer can buy. Stored variants win; without them each listed platform is one
 * version at the game's price. Details that aren't in the data (edition, activation, region) stay null
 * so the UI can leave them out instead of guessing.
 *
 * A variant with its own price only uses its own sale fields; one without a price inherits the game's
 * price and sale.
 */
export function gameOffers(game: OfferSource): Offer[] {
  if (game.variants.length === 0) {
    return game.platforms.map((platform) => ({
      platform,
      edition: null,
      activation: null,
      region: null,
      price: game.price,
      discountPrice: game.discountPrice,
      discountStartsAt: game.discountStartsAt ?? null,
      discountEndsAt: game.discountEndsAt,
      stock: game.stock,
    }));
  }
  return game.variants.map((v) => {
    const own = v.price != null;
    return {
      platform: v.platform,
      edition: v.edition,
      activation: v.activation,
      region: v.region,
      price: v.price ?? game.price,
      discountPrice: v.discountPrice ?? (own ? null : game.discountPrice),
      discountStartsAt: v.discountStartsAt ?? (own ? null : (game.discountStartsAt ?? null)),
      discountEndsAt: v.discountEndsAt ?? (own ? null : game.discountEndsAt),
      stock: v.stock ?? game.stock,
    };
  });
}

/** The offer a card shows: the cheapest one right now (in stock first). */
export function bestOffer(offers: Offer[], now: Date = new Date()): Offer | undefined {
  return [...offers].sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0) || effectivePrice(a, now) - effectivePrice(b, now))[0];
}

/** Whether versions differ in price, so a card should say "from". */
export function hasPriceRange(offers: Offer[], now: Date = new Date()): boolean {
  return new Set(offers.map((o) => effectivePrice(o, now))).size > 1;
}

/** Largest active discount across the versions, in percent (0 when nothing is on sale). */
export function maxDiscountPercent(offers: Offer[], now: Date = new Date()): number {
  return Math.max(0, ...offers.filter((o) => isOnSale(o, now)).map(discountPercent));
}

/** Whether any version is on sale right now. */
export function anyOnSale(offers: Offer[], now: Date = new Date()): boolean {
  return offers.some((o) => isOnSale(o, now));
}

/** The running sale with the largest discount, if any (for "−40% · ends on …"). */
export function biggestSale(offers: Offer[], now: Date = new Date()): Offer | undefined {
  return offers.filter((o) => isOnSale(o, now)).sort((a, b) => discountPercent(b) - discountPercent(a))[0];
}
