import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GameImage } from "@/components/games/GameImage";
import { Price } from "@/components/games/Price";
import { discountPercent, formatDate } from "@/lib/format";
import type { GameCardData } from "@/types";

export function OfferCard({ game }: { game: GameCardData }) {
  return (
    <Card interactive className="h-full">
      <Link href={`/produse/${game.slug}`} className="block h-full">
        <div className="relative aspect-[16/7] overflow-hidden border-b border-iron">
          <GameImage src={game.screenshots[1] ?? game.coverImage} alt="" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          <Badge variant="blood" className="absolute top-3 left-3 text-xs">
            -{discountPercent(game)}%
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-display text-sm font-semibold tracking-[0.1em] uppercase transition-colors duration-300 group-hover:text-aged-gold">
            {game.title}
          </h3>
          <Price game={game} className="mt-2 text-base" />
          {game.discountEndsAt && (
            <p className="mt-1 text-sm text-parchment-muted">Expiră la {formatDate(game.discountEndsAt)}</p>
          )}
        </div>
      </Link>
    </Card>
  );
}
