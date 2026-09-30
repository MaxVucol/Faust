import type { GameCardData } from "@/types";
import { GameCard } from "./GameCard";

/**
 * Catalogue grid. Phones get two compact cards per row (cover, title, price); from 1400px the desktop
 * shows four per row next to the filters (written as 87.5rem so it sorts after the rem-based xl).
 */
export function GameGrid({ games }: { games: GameCardData[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3 min-[87.5rem]:grid-cols-4 3xl:grid-cols-5">
      {games.map((game, i) => (
        <li key={game.id}>
          <GameCard game={game} priority={i < 4} compact />
        </li>
      ))}
    </ul>
  );
}
