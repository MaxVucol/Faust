import { cn } from "@/lib/utils";
import type { GameCardData } from "@/types";
import { CATALOG_CARD_SIZES, GameCard } from "./GameCard";

/**
 * Grid cells for a batch of catalogue cards, shared by the page (first batch) and "Load more" (later
 * batches), so both render exactly the same cards. The first batch gives its first row priority
 * loading; later batches fade in, opacity only.
 */
export function gameGridItems(games: GameCardData[], firstBatch: boolean) {
  return games.map((game, i) => (
    <li key={game.id} className={cn(!firstBatch && "transition-opacity duration-300 starting:opacity-0")}>
      <GameCard game={game} priority={firstBatch && i < 4} compact sizes={CATALOG_CARD_SIZES} />
    </li>
  ));
}
