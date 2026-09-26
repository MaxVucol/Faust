import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GameImage } from "@/components/games/GameImage";
import { Price } from "@/components/games/Price";
import { genreLabel } from "@/lib/catalog";
import type { GameCardData } from "@/types";

export function FeaturedCard({ game }: { game: GameCardData }) {
  return (
    <Card interactive className="h-full shadow-lg shadow-black/50">
      <Link href={`/produse/${game.slug}`} className="block h-full">
        <div className="relative aspect-video overflow-hidden border-b border-iron">
          <GameImage src={game.screenshots[0] ?? game.coverImage} alt="" sizes="(min-width: 1024px) 33vw, 100vw" />
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-semibold tracking-[0.1em] uppercase transition-colors duration-300 group-hover:text-aged-gold">
            {game.title}
          </h3>
          <p className="mt-1 text-sm text-parchment-muted">{game.genres.map(genreLabel).join("  /  ")}</p>
          <Price game={game} className="mt-3" />
        </div>
      </Link>
    </Card>
  );
}
