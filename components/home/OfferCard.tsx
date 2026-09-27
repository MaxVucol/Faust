import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GameImage } from "@/components/games/GameImage";
import { Price } from "@/components/games/Price";
import { genreLabel } from "@/lib/catalog";
import { getI18n } from "@/lib/i18n/server";
import { discountPercent, formatDate } from "@/lib/format";
import type { GameCardData } from "@/types";
import { CardArrow, MetaList } from "./CardParts";

export async function OfferCard({ game }: { game: GameCardData }) {
  const { locale, t } = await getI18n();
  return (
    <Card interactive className="h-full">
      <Link href={`/produse/${game.slug}`} className="block h-full">
        <div className="relative aspect-[16/7] overflow-hidden border-b border-bronze">
          <GameImage src={game.cardImage ?? game.screenshots[0] ?? game.coverImage} alt="" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          <Badge variant="blood" className="absolute top-3 left-3 text-xs">
            -{discountPercent(game)}%
          </Badge>
        </div>
        <div className="p-4">
          <h3 className="font-display text-sm tracking-[0.12em] uppercase transition-colors duration-300 group-hover:text-gold-light">
            {game.title}
          </h3>
          <MetaList items={game.genres.map((g) => genreLabel(t.genres, g))} />
          <div className="mt-2 flex items-center justify-between gap-4">
            <Price game={game} className="text-base" />
            <CardArrow />
          </div>
          {game.discountEndsAt && (
            <p className="mt-1 text-sm text-parchment-muted">{t.game.expires(formatDate(game.discountEndsAt, locale))}</p>
          )}
        </div>
      </Link>
    </Card>
  );
}
