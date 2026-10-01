import Link from "next/link";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { Card } from "@/components/ui/Card";
import { DiscountBadge } from "@/components/games/DiscountBadge";
import { GameImage } from "@/components/games/GameImage";
import { GamePrice } from "@/components/games/Price";
import { genreLabel } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n/server";
import type { GameCardData } from "@/types";
import { CardArrow, MetaList } from "./CardParts";

export async function FeaturedCard({ game }: { game: GameCardData }) {
  const t = await getDictionary();
  return (
    <Card interactive className="h-full">
      {/* No prefetch, as on the other home cards: a tap still navigates. */}
      <Link prefetch={false} href={`/produse/${game.slug}`} className="block h-full">
        <div className="relative aspect-video overflow-hidden border-b border-bronze">
          {/* One card per row below 768px (88–93vw), three per row from 768px (28–31vw). */}
          <GameImage src={game.cardImage ?? game.screenshots[0] ?? game.coverImage} alt="" sizes="(min-width: 768px) 32vw, 90vw" />
          <DiscountBadge game={game} />
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg tracking-[0.12em] uppercase transition-colors duration-300 group-hover:text-gold-light">
            {game.title}
          </h3>
          <MetaList items={game.genres.map((g) => genreLabel(t.genres, g))} />
          <div className="mt-3 flex items-center justify-between gap-4">
            <GamePrice game={game} className="text-lg" />
            <CardArrow />
          </div>
        </div>
      </Link>
      {/* Outside the link: toggling the star never opens the game. */}
      <FavoriteButton slug={game.slug} title={game.title} />
    </Card>
  );
}
