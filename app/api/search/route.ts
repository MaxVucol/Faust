import type { NextRequest } from "next/server";
import { effectivePrice, isOnSale } from "@/lib/format";
import { suggestGames } from "@/lib/games";

export type SearchSuggestion = {
  slug: string;
  title: string;
  coverImage: string;
  genres: string[];
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
  const results: SearchSuggestion[] = games.map((g) => ({
    slug: g.slug,
    title: g.title,
    coverImage: g.coverImage,
    genres: g.genres,
    platforms: g.platforms,
    price: effectivePrice(g, now),
    oldPrice: isOnSale(g, now) ? g.price : null,
  }));
  return Response.json({ results }, { headers: { "Cache-Control": "public, max-age=60" } });
}
