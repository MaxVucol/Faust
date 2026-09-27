import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { GameImage } from "@/components/games/GameImage";
import { platformShort } from "@/lib/catalog";
import { formatDate } from "@/lib/format";
import { getI18n } from "@/lib/i18n/server";
import type { GameCardData } from "@/types";
import { CardArrow, MetaList } from "./CardParts";

export async function NewsCard({ game }: { game: GameCardData }) {
  const { locale, t } = await getI18n();
  return (
    <Card interactive className="h-full">
      <Link href={`/produse/${game.slug}`} className="block h-full">
        <div className="relative aspect-[3/1] overflow-hidden border-b border-bronze">
          <GameImage src={game.cardImage ?? game.screenshots[0] ?? game.coverImage} alt="" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
        </div>
        <div className="p-4">
          <h3 className="text-lg text-parchment transition-colors duration-300 group-hover:text-gold-light">{game.title}</h3>
          <MetaList items={game.platforms.map(platformShort)} />
          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-sm text-parchment-muted">
              <span className="sr-only">{t.game.releasedOn}</span>
              {formatDate(game.releaseDate, locale)}
            </p>
            <CardArrow />
          </div>
        </div>
      </Link>
    </Card>
  );
}
