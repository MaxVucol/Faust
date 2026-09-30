import Link from "next/link";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { genreLabel, platformShort } from "@/lib/catalog";
import { effectivePrice, formatRating, isNewRelease, isOnSale } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/server";
import { gameOffers } from "@/lib/offers";
import type { GameCardData } from "@/types";
import { AddToCartButton } from "./AddToCartButton";
import { DiscountBadge } from "./DiscountBadge";
import { GameImage } from "./GameImage";
import { GamePrice } from "./Price";

/**
 * Catalogue card: cover (discount top-left, favourite star top-right), title, genres, rating and
 * stock, platforms, price, then the action. A game sold on one platform goes straight to the cart;
 * with several, the button leads to the product page to pick one, so nothing ambiguous is bought.
 */
export async function GameCard({ game, priority }: { game: GameCardData; priority?: boolean }) {
  const t = await getDictionary();
  const offers = gameOffers(game);
  const inStock = offers.some((o) => o.stock > 0);
  // Straight to the cart only when there is exactly one version (or nothing to buy at all).
  const direct = offers.length === 1 || !inStock ? offers[0] : undefined;
  const href = `/produse/${game.slug}`;
  return (
    <Card interactive className="flex h-full flex-col">
      <div className="relative border-b border-iron">
        <Link prefetch href={href} className="relative block aspect-[3/4] overflow-hidden">
          <GameImage
            src={game.coverImage}
            alt={t.game.coverAlt(game.title)}
            sizes="(min-width: 1536px) 340px, (min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
            priority={priority}
          />
        </Link>
        <FavoriteButton slug={game.slug} title={game.title} />
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          <DiscountBadge game={game} inline />
          {isNewRelease(game) && <Badge variant="gold">{t.game.newBadge}</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-semibold tracking-[0.1em] uppercase">
          <Link prefetch href={href} className="transition-colors duration-300 hover:text-aged-gold">
            {game.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-parchment-muted">{game.genres.map((g) => genreLabel(t.genres, g)).join(" / ")}</p>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          {game.rating !== null && (
            <span className="text-parchment-muted">
              <span className="sr-only">{t.game.ratingPrefix}</span>
              {formatRating(game.rating)}
            </span>
          )}
          {inStock ? <span className="ml-auto text-stock-in">{t.game.inStock}</span> : <span className="ml-auto text-blood-text">{t.game.outOfStock}</span>}
        </div>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t.game.platforms}>
          {offers.map((o) => (
            <li key={o.platform + (o.edition ?? "")}>
              <Badge>{platformShort(o.platform)}</Badge>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-5">
          <GamePrice game={game} className="mb-4 text-xl" />
          {direct ? (
            <AddToCartButton
              className="w-full"
              inStock={direct.stock > 0}
              item={{
                slug: game.slug,
                title: game.title,
                platform: direct.platform,
                edition: direct.edition,
                price: effectivePrice(direct),
                oldPrice: isOnSale(direct) ? direct.price : null,
                coverImage: game.coverImage,
              }}
            />
          ) : (
            <Link href={`${href}#cumpara`} className={buttonClasses("primary", "sm", "w-full")}>
              {t.game.choosePlatform}
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
