import Link from "next/link";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { Card } from "@/components/ui/Card";
import { DiscountBadge } from "@/components/games/DiscountBadge";
import { GameImage } from "@/components/games/GameImage";
import { GamePrice } from "@/components/games/Price";
import { genreLabel } from "@/lib/catalog";
import { getI18n } from "@/lib/i18n/server";
import { formatDate } from "@/lib/format";
import { biggestSale, gameOffers } from "@/lib/offers";
import { QuickAdd } from "@/components/games/QuickAdd";
import { purchaseOptions } from "@/lib/purchase";
import type { GameCardData } from "@/types";
import { CAROUSEL_CARD_SIZES, CardArrow, MetaList } from "./CardParts";

export async function OfferCard({ game }: { game: GameCardData }) {
  const { locale, t } = await getI18n();
  const sale = biggestSale(gameOffers(game));
  return (
    <Card interactive className="flex h-full flex-col">
      {/* No prefetch: a carousel brings a new card into view on every swipe, and prefetching each
          game page then costs a request and main-thread parsing mid-swipe. A tap still navigates. */}
      <Link prefetch={false} href={`/produse/${game.slug}`} className="block flex-1">
        <div className="relative aspect-[16/7] overflow-hidden border-b border-bronze">
          <GameImage src={game.cardImage ?? game.screenshots[0] ?? game.coverImage} alt="" sizes={CAROUSEL_CARD_SIZES} />
          <DiscountBadge game={game} />
        </div>
        <div className="p-4">
          <h3 className="font-display text-sm tracking-[0.12em] uppercase transition-colors duration-300 group-hover:text-gold-light">
            {game.title}
          </h3>
          <MetaList items={game.genres.map((g) => genreLabel(t.genres, g))} />
          <div className="mt-2 flex items-center justify-between gap-4">
            <GamePrice game={game} className="text-lg" />
            <CardArrow />
          </div>
          {sale?.discountEndsAt && <p className="mt-1 text-sm text-parchment-muted">{t.game.expires(formatDate(sale.discountEndsAt, locale))}</p>}
        </div>
      </Link>
      {/* Outside the link: adding to the cart never opens the game page. */}
      <div className="px-4 pb-4">
        <QuickAdd game={{ slug: game.slug, title: game.title, coverImage: game.coverImage }} offers={purchaseOptions(game)} />
      </div>
      <FavoriteButton slug={game.slug} title={game.title} />
    </Card>
  );
}
