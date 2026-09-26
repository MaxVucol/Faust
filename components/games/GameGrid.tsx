import type { GameCardData } from "@/types";
import { GameCard } from "./GameCard";

export function GameGrid({ games }: { games: GameCardData[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
      {games.map((game, i) => (
        <li key={game.id}>
          <GameCard game={game} priority={i < 3} />
        </li>
      ))}
    </ul>
  );
}
