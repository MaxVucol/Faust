import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GameImage } from "@/components/games/GameImage";
import { platformShort } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import type { GameCardData } from "@/types";

export function NewsCard({ game }: { game: GameCardData }) {
  return (
    <Card interactive className="h-full">
      <Link href={`/produse/${game.slug}`} className="block h-full">
        <div className="relative aspect-[3/1] overflow-hidden border-b border-iron">
          <GameImage src={game.screenshots[0] ?? game.coverImage} alt="" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        </div>
        <div className="p-4">
          <h3 className="text-lg text-parchment transition-colors duration-300 group-hover:text-aged-gold">{game.title}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 font-display text-[0.65rem] tracking-[0.1em] text-parchment-muted uppercase">
            {game.platforms.map((p, i) => (
              <span key={p} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden className="h-3 w-px bg-iron" />}
                {platformShort(p)}
              </span>
            ))}
          </p>
          <p className="mt-3 text-sm text-parchment-muted">
            <span className="sr-only">Lansat pe </span>
            {formatDate(game.releaseDate)}
          </p>
        </div>
      </Link>
    </Card>
  );
}
