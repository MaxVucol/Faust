"use server";

import { z } from "zod";
import { platformShort } from "@/lib/catalog";
import { effectivePrice, isOnSale } from "@/lib/format";
import { bestOffer, gameOffers } from "@/lib/offers";
import { prisma } from "@/lib/prisma";

export type Suggestion = { slug: string; title: string; coverImage: string; platforms: string[]; price: number; oldPrice: number | null };

const slugsSchema = z.array(z.string().regex(/^[a-z0-9-]{1,120}$/)).min(1).max(100);

/**
 * "You may also like" under the cart: up to four games in stock that share a genre with what is in the
 * cart (best rated first), never one already in it. Read-only; prices in MDL from the catalogue, as shown
 * on the cards (the cart and the order price everything again themselves).
 */
export async function getSuggestions(slugs: unknown): Promise<Suggestion[]> {
  const parsed = slugsSchema.safeParse(slugs);
  if (!parsed.success) return [];
  const inCart = [...new Set(parsed.data)];
  const cart = await prisma.game.findMany({ where: { slug: { in: inCart } }, select: { genres: true } });
  const genres = [...new Set(cart.flatMap((g) => g.genres))];
  if (genres.length === 0) return [];
  const now = new Date();
  const games = await prisma.game.findMany({
    where: { slug: { notIn: inCart }, genres: { hasSome: genres } },
    select: { slug: true, title: true, coverImage: true, price: true, discountPrice: true, discountStartsAt: true, discountEndsAt: true, variants: true, platforms: true, stock: true, rating: true },
  });
  return games
    .map((g) => ({ g, offers: gameOffers(g) }))
    .filter(({ offers }) => offers.some((o) => o.stock > 0))
    .sort((a, b) => (b.g.rating ?? -1) - (a.g.rating ?? -1))
    .slice(0, 4)
    .map(({ g, offers }) => {
      const best = bestOffer(offers, now) ?? g;
      return {
        slug: g.slug,
        title: g.title,
        coverImage: g.coverImage,
        platforms: [...new Set(offers.map((o) => platformShort(o.platform)))],
        price: effectivePrice(best, now),
        oldPrice: isOnSale(best, now) ? best.price : null,
      };
    });
}
