import Link from "next/link";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { Card } from "@/components/ui/Card";
import { DiscountBadge } from "@/components/games/DiscountBadge";
import { GamePrice } from "@/components/games/Price";
import { GameImage } from "@/components/games/GameImage";
import { platformShort } from "@/lib/catalog";
import { formatDate, isNewRelease } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { getI18n } from "@/lib/i18n/server";
import type { GameCardData } from "@/types";
import { CardArrow, MetaList } from "./CardParts";

export async function NewsCard({ game }: { game: GameCardData }) {
  const { locale, t } = await getI18n();
  return (
    <Card interactive className="h-full">
      <Link prefetch href={`/produse/${game.slug}`} className="block h-full">
        <div className="relative aspect-[3/1] overflow-hidden border-b border-bronze">
          <GameImage src={game.cardImage ?? game.screenshots[0] ?? game.coverImage} alt="" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
            <DiscountBadge game={game} className="static" />
            {isNewRelease(game) && <Badge variant="gold">{t.game.newBadge}</Badge>}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg text-parchment transition-colors duration-300 group-hover:text-gold-light">{game.title}</h3>
          <MetaList items={game.platforms.map(platformShort)} />
          <p className="mt-1 text-sm text-parchment-muted">
            <span className="sr-only">{t.game.releasedOn}</span>
            {formatDate(game.releaseDate, locale)}
          </p>
          <div className="mt-2 flex items-center justify-between gap-4">
            <GamePrice game={game} className="text-lg" />
            <CardArrow />
          </div>
        </div>
      </Link>
      <FavoriteButton slug={game.slug} title={game.title} />
    </Card>
  );
}
