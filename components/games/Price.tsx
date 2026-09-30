import { formatMoney } from "@/lib/currency";
import { discountPercent, isOnSale, type Priced } from "@/lib/format";
import { getCurrency, getDictionary } from "@/lib/i18n/server";
import { bestOffer, gameOffers, hasPriceRange } from "@/lib/offers";
import { cn } from "@/lib/utils";
import type { GameCardData } from "@/types";

type PriceProps = {
  game: Priced;
  /** Prefix "from": versions of the game differ in price. */
  from?: boolean;
  /** Also spell out the discount ("−40%") next to the prices. */
  showPercent?: boolean;
  className?: string;
};

/**
 * Price with a clear hierarchy: the price to pay is the largest and brightest element; on sale the
 * old price sits before it, smaller, muted and struck through. Sizes are relative (em), so
 * `className` sets the scale for both.
 */
export async function Price({ game, from = false, showPercent = false, className }: PriceProps) {
  const [t, currency] = await Promise.all([getDictionary(), getCurrency()]);
  const money = (v: number) => formatMoney(v, currency);
  const onSale = isOnSale(game);
  const current = onSale ? (game.discountPrice as number) : game.price;
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2.5 gap-y-1", className)}>
      {onSale && (
        <>
          <span className="sr-only">{t.game.oldPrice}</span>
          <s className="text-[0.72em] text-parchment-muted decoration-parchment-muted/70">{money(game.price)}</s>
          <span className="sr-only">{t.game.newPrice}</span>
        </>
      )}
      <span className="font-semibold text-gold-light">
        {from && <span className="mr-1 text-[0.72em] font-normal text-parchment-muted">{t.game.fromPrice}</span>}
        {money(current)}
      </span>
      {onSale && showPercent && (
        <span className="text-[0.72em] text-blood-text">
          <span className="sr-only">{t.game.discountLabel} </span>−{discountPercent(game)}%
        </span>
      )}
    </p>
  );
}

/** Card price: the cheapest version right now, with "from" when versions differ. */
export function GamePrice({ game, className }: { game: GameCardData; className?: string }) {
  const offers = gameOffers(game);
  return <Price game={bestOffer(offers) ?? game} from={hasPriceRange(offers)} className={className} />;
}
