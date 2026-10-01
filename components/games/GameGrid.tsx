import { getCurrency, getLocale } from "@/lib/i18n/server";
import type { GameCardData } from "@/types";
import { CatalogGrid } from "./CatalogGrid";
import { gameGridItems } from "./GameGridItems";

/**
 * Catalogue grid. Phones get two compact cards per row (cover, title, price); from 1400px the desktop
 * shows four per row next to the filters (written as 87.5rem so it sorts after the rem-based xl).
 * Further batches are appended in place by "Load more" (CatalogGrid).
 */
export async function GameGrid({ games, pages, query }: { games: GameCardData[]; pages: number; query: string }) {
  const [currency, locale] = await Promise.all([getCurrency(), getLocale()]);
  return (
    // Keyed by everything the cards depend on: new filters, currency or language start again from the first batch.
    <CatalogGrid key={`${query}|${currency}|${locale}`} query={query} pages={pages}>
      {gameGridItems(games, true)}
    </CatalogGrid>
  );
}
