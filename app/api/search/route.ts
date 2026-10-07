import type { NextRequest } from "next/server";
import { effectivePrice, isOnSale } from "@/lib/format";
import { suggestGames } from "@/lib/games";
import { bestOffer, gameOffers } from "@/lib/offers";

export type SearchSuggestion = {
  slug: string;
  title: string;
  /** Shown under the title: the search also matches developers, so a result says whose game it is. */
  developer: string;
  coverImage: string;
  platforms: string[];
  /** Prices in MDL; the client formats them in the visitor's currency. */
  price: number;
  oldPrice: number | null;
};

/** Suggestions for the header search box. Read-only; returns at most six games. */
export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").slice(0, 80);
  const now = new Date();
  const games = await suggestGames(q);
  const results: SearchSuggestion[] = games.map((g) => {
    // The same version a card shows (its cheapest right now), so the price matches the catalogue's.
    const best = bestOffer(gameOffers(g), now) ?? g;
    return {
      slug: g.slug,
      title: g.title,
      developer: g.developer,
      coverImage: g.coverImage,
      platforms: g.platforms,
      price: effectivePrice(best, now),
      oldPrice: isOnSale(best, now) ? best.price : null,
    };
  });
  return Response.json({ results }, { headers: { "Cache-Control": "public, max-age=60" } });
}
