import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GameImage } from "@/components/games/GameImage";
import { Price } from "@/components/games/Price";
import { genreLabel } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n/server";
import { discountPercent, isOnSale } from "@/lib/format";
import type { GameCardData } from "@/types";
import { CardArrow, MetaList } from "./CardParts";

export async function FeaturedCard({ game }: { game: GameCardData }) {
  const t = await getDictionary();
  return (
    <Card interactive className="h-full">
      <Link prefetch href={`/produse/${game.slug}`} className="block h-full">
        <div className="relative aspect-video overflow-hidden border-b border-bronze">
          <GameImage src={game.cardImage ?? game.screenshots[0] ?? game.coverImage} alt="" sizes="(min-width: 1024px) 33vw, 100vw" />
          {isOnSale(game) && (
            <Badge variant="blood" className="absolute top-3 left-3 text-xs">
              -{discountPercent(game)}%
            </Badge>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg tracking-[0.12em] uppercase transition-colors duration-300 group-hover:text-gold-light">
            {game.title}
          </h3>
          <MetaList items={game.genres.map((g) => genreLabel(t.genres, g))} />
          <div className="mt-3 flex items-center justify-between gap-4">
            <Price game={game} />
            <CardArrow />
          </div>
        </div>
      </Link>
    </Card>
  );
}
