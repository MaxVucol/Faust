import Link from "next/link";
import { Star } from "lucide-react";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { platformShort } from "@/lib/catalog";
import { formatRating, isNewRelease } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/server";
import { gameOffers } from "@/lib/offers";
import { purchaseOptions } from "@/lib/purchase";
import type { GameCardData } from "@/types";
import { DiscountBadge } from "./DiscountBadge";
import { GameImage } from "./GameImage";
import { GamePrice } from "./Price";
import { QuickAdd } from "./QuickAdd";
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
 * Catalogue card: cover (rank and discount top-left, wishlist heart top-right), title, developer, rating
 * and stock, platforms, price, then "Add to cart" (QuickAdd): a game sold on one platform goes straight to
 * the cart; with several, the purchase dialog asks which one, so nothing ambiguous is bought. `rank`: its
 * place in a ranked list ("Trending now"). The cover eases in by 2% on hover (not with reduced motion).
 *
 * `compact`: below the sm breakpoint (two cards per row) the card keeps only the cover, favourite,
 * discount, title and price (plus "out of stock" when it applies); the whole card leads to the game.
 */
export async function GameCard({
  game,
  priority,
  compact = false,
  sizes = DEFAULT_CARD_SIZES,
  rank,
}: {
  game: GameCardData;
  priority?: boolean;
  compact?: boolean;
  sizes?: string;
  rank?: number;
}) {
  const t = await getDictionary();
  const offers = gameOffers(game);
  const inStock = offers.some((o) => o.stock > 0);
  const href = `/produse/${game.slug}`;
  // Details hidden on phones in the compact grid; unchanged from sm up.
  const wide = compact ? { block: "hidden sm:block", flex: "hidden sm:flex" } : { block: "block", flex: "flex" };
  return (
    <Card interactive className="flex h-full flex-col">
      <div className="relative border-b border-iron">
        {/* No prefetch: cards come into view by the dozen while scrolling the catalogue or swiping the
            similar games, and prefetching each game page costs a request mid-scroll. A tap still navigates. */}
        <Link prefetch={false} href={href} className="relative block aspect-[3/4] overflow-hidden">
          <GameImage
            src={game.coverImage}
            alt={t.game.coverAlt(game.title)}
            sizes={sizes}
            priority={priority}
            className="transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </Link>
        {/* Below md the cover is 170-350px wide and official covers put the title at the top, so the star
            shrinks (28px disc, 18px star) into the very corner, 2px in. Unlike on the game page the 44px hit
            area stays inside the cover (the similar-games carousel would clip anything past its edge): the
            button sits in the corner and pins its disc and star to its top-right. Unchanged from md up. */}
        <FavoriteButton
          slug={game.slug}
          title={game.title}
          className="max-md:top-0 max-md:right-0 max-md:items-start max-md:justify-end max-md:p-0.5 max-md:before:size-7 max-md:[&>svg]:mt-[5px] max-md:[&>svg]:mr-[5px] max-md:[&>svg]:size-[18px]"
        />
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {rank !== undefined && (
            <span className="border border-gold-light bg-[#0a0907]/90 px-2 py-0.5 font-display text-base leading-6 font-semibold text-gold-light tabular-nums">
              <span className="sr-only">{t.home.rank(rank)}</span>
              <span aria-hidden>#{rank}</span>
            </span>
          )}
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
        <p className={cn("mt-1 truncate text-sm text-parchment-muted", wide.block)}>{t.game.by(game.developer)}</p>
        {compact && !inStock && <p className="mt-1 text-sm text-blood-text sm:hidden">{t.game.outOfStock}</p>}
        <div className={cn("mt-3 items-center justify-between gap-3 text-sm", wide.flex)}>
          {game.rating !== null && (
            <span className="flex items-center gap-1.5 text-parchment">
              <Star aria-hidden className="size-3.5 fill-gold-light text-gold-light" />
              <span className="sr-only">{t.game.ratingPrefix}</span>
              {formatRating(game.rating)}
            </span>
          )}
          {/* Beside a rating the stock sits at the far end; without one it starts the row, so nothing floats alone on the right. */}
          <span className={cn(game.rating !== null && "ml-auto", inStock ? "text-stock-in" : "text-blood-text")}>{inStock ? t.game.inStock : t.game.outOfStock}</span>
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
            {/* The same "Add to cart" as on the home cards: one version goes straight in, several open the purchase dialog. */}
            <QuickAdd game={{ slug: game.slug, title: game.title, coverImage: game.coverImage }} offers={purchaseOptions(game)} />
          </div>
        </div>
      </div>
    </Card>
  );
}
