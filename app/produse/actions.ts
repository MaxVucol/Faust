"use server";

import type { ReactNode } from "react";
import { gameGridItems } from "@/components/games/GameGridItems";
import { parseFilters, searchCatalog, type SearchParams } from "@/lib/games";
import { getCurrency } from "@/lib/i18n/server";

/**
 * "Load more" on the catalogue: the next batch of cards for the same filters, sort and search, from
 * the same query as the page itself. `query` comes from the page (catalogQuery) and is parsed and
 * validated again here like any URL.
 */
export async function loadMoreGames(query: string, page: number): Promise<{ items: ReactNode; pages: number }> {
  const sp: SearchParams = {};
  for (const [key, value] of new URLSearchParams(query.slice(0, 2000))) {
    const prev = sp[key];
    sp[key] = prev === undefined ? value : [...(Array.isArray(prev) ? prev : [prev]), value];
  }
  const safePage = Number.isInteger(page) ? Math.min(Math.max(page, 2), 500) : 2;
  const { games, pages } = await searchCatalog({ ...parseFilters(sp), page: safePage }, await getCurrency());
  return { items: gameGridItems(games, false), pages };
}
