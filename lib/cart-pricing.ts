import "server-only";
import { effectivePrice, isOnSale } from "./format";
import { bestOffer, gameOffers } from "./offers";
import { prisma } from "./prisma";

/** A cart line as the browser names it: the game and, for lines saved with one, its version. */
export type CartLineRef = { slug: string; platform?: string; edition?: string | null };

/** A line priced from the catalogue right now (MDL). */
export type PricedLine = {
  title: string;
  coverImage: string;
  platform: string;
  edition: string | null;
  price: number;
  /** Set only while a sale runs, as on the product page. */
  oldPrice: number | null;
};

/** A priced line plus how many copies of that version are in stock (server only: never sent to the browser). */
export type StockedLine = PricedLine & { stock: number };

/**
 * Prices cart lines from the database, the one place a price comes from: the cart page shows these and
 * the order is charged these. A line is null when it can't be bought any more (the game or version is
 * gone, or out of stock). A line without a platform (saved before platforms existed) takes the cheapest
 * version, as its card showed.
 */
export async function priceLines(lines: CartLineRef[], now: Date = new Date()): Promise<(PricedLine | null)[]> {
  return (await priceLinesWithStock(lines, now)).map((l) => (l ? { title: l.title, coverImage: l.coverImage, platform: l.platform, edition: l.edition, price: l.price, oldPrice: l.oldPrice } : null));
}

/** The same pricing with each version's stock, for checking an order's quantities (lib/orders.ts). */
export async function priceLinesWithStock(lines: CartLineRef[], now: Date = new Date()): Promise<(StockedLine | null)[]> {
  const games = await prisma.game.findMany({
    where: { slug: { in: [...new Set(lines.map((l) => l.slug))] } },
    select: { slug: true, title: true, coverImage: true, price: true, discountPrice: true, discountStartsAt: true, discountEndsAt: true, platforms: true, variants: true, stock: true },
  });
  return lines.map((line) => {
    const game = games.find((g) => g.slug === line.slug);
    const offers = game ? gameOffers(game) : [];
    const offer = line.platform
      ? offers.find((o) => o.platform === line.platform && (o.edition ?? null) === (line.edition ?? null))
      : bestOffer(offers, now);
    if (!game || !offer || offer.stock <= 0) return null;
    return {
      title: game.title,
      coverImage: game.coverImage,
      platform: offer.platform,
      edition: offer.edition,
      price: effectivePrice(offer, now),
      oldPrice: isOnSale(offer, now) ? offer.price : null,
      stock: offer.stock,
    };
  });
}
