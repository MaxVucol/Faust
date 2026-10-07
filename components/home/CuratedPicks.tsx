import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { GameImage } from "@/components/games/GameImage";
import { untilSalesEnd } from "@/components/games/UntilSalesEnd";
import { Diamond } from "@/components/ui/Ornaments";
import { convert, formatAmount } from "@/lib/currency";
import { discountPercent, effectivePrice, isOnSale } from "@/lib/format";
import { getCurrency, getDictionary } from "@/lib/i18n/server";
import { bestOffer, gameOffers, hasPriceRange } from "@/lib/offers";
import type { getCollections } from "@/lib/games";
import type { GameCardData } from "@/types";

type Collections = Awaited<ReturnType<typeof getCollections>>;

/**
 * A shelf row's price, in its own right-hand column so the row is as tall as its cover whatever the
 * price: the price to pay on top (gold, the one figure that stands out), and on sale a small line under it
 * with the percentage and the old price, struck and muted. Back to the regular price by itself when the
 * sale ends while the page is open.
 */
async function ShelfPrice({ game }: { game: GameCardData }) {
  const [t, currency] = await Promise.all([getDictionary(), getCurrency()]);
  const offers = gameOffers(game);
  const money = (mdl: number) => formatAmount(convert(mdl, currency), currency);
  return untilSalesEnd(offers, new Date(), (now) => {
    const best = bestOffer(offers, now) ?? game;
    const sale = isOnSale(best, now);
    return (
      <span className="flex shrink-0 flex-col items-end text-right tabular-nums">
        <span className="font-display text-base leading-tight font-semibold whitespace-nowrap text-gold-light">
          {sale && <span className="sr-only">{t.game.newPrice} </span>}
          {hasPriceRange(offers, now) && <span className="mr-1 text-xs font-normal text-parchment-muted">{t.game.fromPrice}</span>}
          {money(effectivePrice(best, now))}
        </span>
        {sale && (
          <span className="mt-1 flex items-center gap-1.5 text-xs leading-none whitespace-nowrap">
            <span className="text-blood-text">
              <span className="sr-only">{t.game.discountLabel} </span>−{discountPercent(best)}%
            </span>
            <s className="text-parchment-muted decoration-parchment-muted/70">
              <span className="sr-only">{t.game.oldPrice} </span>
              {money(best.price)}
            </s>
          </span>
        )}
      </span>
    );
  });
}

/**
 * Curated picks: a few collections drawn from the catalogue's genres (lib/games.ts COLLECTIONS), each a
 * short ledger of its best-rated games with cover, title, rating, developer and price, and a link to the
 * whole genre in the catalogue. Only real games, each on one shelf (getCollections); an empty collection
 * isn't shown.
 */
export async function CuratedPicks({ collections }: { collections: Collections }) {
  const t = await getDictionary();
  const h = t.home;
  return (
    // Phones: a sideways row (each collection 85% wide, the next one peeking), so four lists don't make a
    // long column; from md a grid. `contain: paint` keeps the row's scrolled-away width from counting
    // towards the page's (the animated page wrapper above it would otherwise report it).
    <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto max-md:[contain:paint] overscroll-x-contain px-4 pb-2 [scrollbar-width:thin] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4">
      {collections.map((c) => (
        <li key={c.key} className="flex w-[85%] shrink-0 snap-start flex-col border border-iron bg-[#0d0b09] md:w-auto">
          <h3 className="flex items-center gap-2.5 border-b border-gold-dark/50 px-5 py-4 font-display text-lg tracking-[0.1em] text-gold-light uppercase">
            <Diamond className="size-1.5 bg-gold-dark" />
            {h.collections[c.key] ?? c.key}
          </h3>
          <ol className="flex-1">
            {c.games.map((game) => (
              <li key={game.slug} className="border-b border-iron/60 last:border-b-0">
                <Link prefetch={false} href={`/produse/${game.slug}`} className="group flex items-center gap-4 px-5 py-3 transition-colors duration-200 hover:bg-gold-light/[0.04]">
                  <span className="relative aspect-[3/4] w-11 shrink-0 overflow-hidden border border-iron">
                    <GameImage src={game.coverImage} alt="" sizes="44px" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[0.95rem] tracking-[0.06em] uppercase transition-colors duration-200 group-hover:text-gold-light">{game.title}</span>
                    <span className="mt-0.5 flex min-w-0 items-center gap-2 text-sm text-parchment-muted">
                      {game.rating !== null && (
                        <span className="flex shrink-0 items-center gap-1">
                          <Star aria-hidden className="size-3 fill-current text-gold-dark" />
                          <span className="sr-only">{t.game.ratingPrefix}</span>
                          {game.rating.toFixed(1)}
                        </span>
                      )}
                      <span className="truncate">{game.developer}</span>
                    </span>
                  </span>
                  <ShelfPrice game={game} />
                </Link>
              </li>
            ))}
          </ol>
          <Link
            href={`/produse?genre=${encodeURIComponent(c.genre)}`}
            className="flex items-center justify-between gap-2 border-t border-iron px-5 py-3.5 font-display-ui text-[0.62rem] text-parchment-muted transition-colors duration-200 hover:text-gold-light"
          >
            {h.collectionLink}
            <ArrowRight aria-hidden className="size-3.5" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
