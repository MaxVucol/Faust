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
import { cn } from "@/lib/utils";

/**
 * `sizes` for the cover in each place the card is shown, matched to the measured card width.
 * Catalogue grid: two columns on phones (42–45vw), two on tablets (43–46vw), two then three beside the
 * filters (31–35vw, 23–24vw) and four from 1400px (17–19.4vw). Similar games carousel: one card plus
 * the arrows on phones (65–80vw), two from 640px (38–40vw), four from 1024px (19–20.2vw).
 * The default fits the favourites grid.
 */
export const CATALOG_CARD_SIZES = "(min-width: 1400px) 20vw, (min-width: 1280px) 24vw, (min-width: 1024px) 35vw, (min-width: 640px) 46vw, 50vw";
export const SIMILAR_CARD_SIZES = "(min-width: 1024px) 20vw, (min-width: 640px) 41vw, 80vw";
const DEFAULT_CARD_SIZES = "(min-width: 1536px) 340px, (min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw";

/**
 * Catalogue card: cover (discount top-left, favourite star top-right), title, genres, rating and
 * stock, platforms, price, then the action. A game sold on one platform goes straight to the cart;
 * with several, the button leads to the product page to pick one, so nothing ambiguous is bought.
 *
 * `compact`: below the sm breakpoint (two cards per row) the card keeps only the cover, favourite,
 * discount, title and price (plus "out of stock" when it applies); the whole card leads to the game.
 */
export async function GameCard({
  game,
  priority,
  compact = false,
  sizes = DEFAULT_CARD_SIZES,
}: {
  game: GameCardData;
  priority?: boolean;
  compact?: boolean;
  sizes?: string;
}) {
  const t = await getDictionary();
  const offers = gameOffers(game);
  const inStock = offers.some((o) => o.stock > 0);
  // Straight to the cart only when there is exactly one version (or nothing to buy at all).
  const direct = offers.length === 1 || !inStock ? offers[0] : undefined;
  const href = `/produse/${game.slug}`;
  // Details hidden on phones in the compact grid; unchanged from sm up.
  const wide = compact ? { block: "hidden sm:block", flex: "hidden sm:flex" } : { block: "block", flex: "flex" };
  return (
    <Card interactive className="flex h-full flex-col">
      <div className="relative border-b border-iron">
        {/* No prefetch: cards come into view by the dozen while scrolling the catalogue or swiping the
            similar games, and prefetching each game page costs a request mid-scroll. A tap still navigates. */}
        <Link prefetch={false} href={href} className="relative block aspect-[3/4] overflow-hidden">
          <GameImage src={game.coverImage} alt={t.game.coverAlt(game.title)} sizes={sizes} priority={priority} />
        </Link>
        <FavoriteButton slug={game.slug} title={game.title} />
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          <DiscountBadge game={game} inline />
          {isNewRelease(game) && <Badge variant="gold">{t.game.newBadge}</Badge>}
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col", compact ? "p-3 sm:p-5" : "p-5")}>
        <h3 className={cn("font-display font-semibold uppercase", compact ? "text-sm tracking-[0.06em] sm:text-base sm:tracking-[0.1em]" : "text-base tracking-[0.1em]")}>
          <Link prefetch={false} href={href} className="transition-colors duration-300 hover:text-aged-gold">
            {game.title}
          </Link>
        </h3>
        <p className={cn("mt-1 text-sm text-parchment-muted", wide.block)}>{game.genres.map((g) => genreLabel(t.genres, g)).join(" / ")}</p>
        {compact && !inStock && <p className="mt-1 text-sm text-blood-text sm:hidden">{t.game.outOfStock}</p>}
        <div className={cn("mt-3 items-center justify-between gap-3 text-sm", wide.flex)}>
          {game.rating !== null && (
            <span className="text-parchment-muted">
              <span className="sr-only">{t.game.ratingPrefix}</span>
              {formatRating(game.rating)}
            </span>
          )}
          {inStock ? <span className="ml-auto text-stock-in">{t.game.inStock}</span> : <span className="ml-auto text-blood-text">{t.game.outOfStock}</span>}
        </div>
        <ul className={cn("mt-3 flex-wrap gap-1.5", wide.flex)} aria-label={t.game.platforms}>
          {offers.map((o) => (
            <li key={o.platform + (o.edition ?? "")}>
              <Badge>{platformShort(o.platform)}</Badge>
            </li>
          ))}
        </ul>
        <div className={cn("mt-auto", compact ? "pt-3 sm:pt-5" : "pt-5")}>
          <GamePrice game={game} className={compact ? "text-base sm:mb-4 sm:text-xl" : "mb-4 text-xl"} />
          <div className={wide.block}>
            {direct ? (
              <AddToCartButton
                variant="outline"
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
              <Link prefetch={false} href={`${href}#cumpara`} className={buttonClasses("outline", "sm", "w-full")}>
                {t.game.choosePlatform}
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
