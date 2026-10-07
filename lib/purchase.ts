import { discountPercent, effectivePrice, formatSaleEnd, isOnSale } from "./format";
import type { Locale } from "./i18n/config";
import { gameOffers, type Offer } from "./offers";
import type { GameVariant } from "@prisma/client";
import type { CartItem } from "@/types";

/** One buyable version as the purchase UI shows it; prices are MDL and resolved for "now". */
export type PanelOffer = {
  platform: string;
  edition: string | null;
  activation: string | null;
  region: string | null;
  inStock: boolean;
  price: number;
  /** Set only while a sale runs. */
  oldPrice: number | null;
  percent: number;
  /** Pre-formatted end date of the running sale (only when a locale is given). */
  saleEnds: string | null;
  /** When the running sale ends (ISO), so the page can drop it at that moment (useLiveOffers). */
  saleEndsAt: string | null;
};

type Purchasable = Parameters<typeof gameOffers>[0] & { variants: GameVariant[] };

/**
 * The versions of a game as the product page and the home cards' "Add to cart" offer them, built
 * from gameOffers() and the existing price helpers, so a cart line is the same wherever it is added.
 */
export function purchaseOptions(game: Purchasable, locale?: Locale, now: Date = new Date()): PanelOffer[] {
  return gameOffers(game).map((o: Offer) => {
    const sale = isOnSale(o, now);
    return {
      platform: o.platform,
      edition: o.edition,
      activation: o.activation,
      region: o.region,
      inStock: o.stock > 0,
      price: effectivePrice(o, now),
      oldPrice: sale ? o.price : null,
      percent: sale ? discountPercent(o) : 0,
      saleEnds: sale && o.discountEndsAt && locale ? formatSaleEnd(o.discountEndsAt, locale) : null,
      saleEndsAt: sale && o.discountEndsAt ? o.discountEndsAt.toISOString() : null,
    };
  });
}

/** The cart line for one version: the same shape whether added on the product page or from a home card. */
export function cartItemFor(game: { slug: string; title: string; coverImage: string }, offer: PanelOffer): Omit<CartItem, "quantity"> {
  return {
    slug: game.slug,
    title: game.title,
    platform: offer.platform,
    edition: offer.edition,
    price: offer.price,
    oldPrice: offer.oldPrice,
    coverImage: game.coverImage,
  };
}
