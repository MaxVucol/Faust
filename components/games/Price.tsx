import { discountPercent, isOnSale, type Priced } from "@/lib/format";
import { getCurrency, getDictionary } from "@/lib/i18n/server";
import { bestOffer, gameOffers, hasPriceRange } from "@/lib/offers";
import type { GameCardData } from "@/types";
import { PriceBlock } from "./PriceBlock";

type PriceProps = {
  game: Priced;
  /** Prefix "from": versions of the game differ in price. */
  from?: boolean;
  className?: string;
  /** Show the percentage badge in the price (off on cards: the cover badge shows it). */
  showPercent?: boolean;
};

/**
 * Price with a clear hierarchy (see PriceBlock): on sale the old price, the amount saved and the
 * percentage sit in a small row above the price to pay, which is the largest and brightest element.
 * `className` sets the scale.
 */
export async function Price({ game, from = false, className, showPercent = true }: PriceProps) {
  const [t, currency] = await Promise.all([getDictionary(), getCurrency()]);
  const onSale = isOnSale(game);
  return (
    <PriceBlock
      price={onSale ? (game.discountPrice as number) : game.price}
      oldPrice={onSale ? game.price : null}
      percent={onSale ? discountPercent(game) : 0}
      currency={currency}
      labels={t.game}
      from={from}
      className={className}
      showPercent={showPercent}
    />
  );
}

/** Card price: the cheapest version right now, with "from" when versions differ. The percentage is on the cover badge. */
export function GamePrice({ game, className }: { game: GameCardData; className?: string }) {
  const offers = gameOffers(game);
  return <Price game={bestOffer(offers) ?? game} from={hasPriceRange(offers)} className={className} showPercent={false} />;
}
