import { convert, formatAmount, type Currency } from "@/lib/currency";
import { cn } from "@/lib/utils";

type PriceLabels = { oldPrice: string; newPrice: string; discountLabel: string; savingLabel: string; fromPrice: string };

type PriceBlockProps = {
  /** Price to pay now, in MDL. */
  price: number;
  /** Price before the sale, in MDL; null when nothing is on sale. */
  oldPrice: number | null;
  /** Sale percentage from discountPercent() (lib/format), so it rounds like everywhere else. */
  percent: number;
  currency: Currency;
  labels: PriceLabels;
  /** Prefix "from": versions of the game differ in price. */
  from?: boolean;
  /** Font size of the block; the price to pay uses it, the sale row is relative to it. */
  className?: string;
  /** Overrides the sale row's size (e.g. a fixed size next to a very large price). */
  saleRowClassName?: string;
  /** The percentage badge; cards leave it out because the large badge on the cover already shows it. */
  showPercent?: boolean;
};

/**
 * Shared price presentation for cards and the product page (server or client, no hooks).
 *
 * On sale:   [old price, struck]  [−amount]  [−percent]
 *            [price to pay, largest]
 *
 * The amount saved is the difference of the two prices after conversion to the display currency
 * (the same rule as the cart summary), so the three figures always add up in every currency.
 * Not on sale: only the price. The sale is spelled out for screen readers, never shown by colour alone.
 */
export function PriceBlock({ price, oldPrice, percent, currency, labels, from = false, className, saleRowClassName, showPercent = true }: PriceBlockProps) {
  const onSale = oldPrice !== null && oldPrice > price;
  const shownPrice = convert(price, currency);
  const shownOld = onSale ? convert(oldPrice, currency) : 0;
  const saving = Math.round((shownOld - shownPrice) * 100) / 100;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {onSale && (
        // On a narrow card the two badges move to a second line together, never one by one.
        <p className={cn("flex flex-wrap items-center gap-x-1 gap-y-1 text-[0.7em] leading-none tabular-nums", saleRowClassName)}>
          <span className="sr-only">{labels.oldPrice}</span>
          <s className="text-parchment-muted decoration-parchment-muted/70">{formatAmount(shownOld, currency)}</s>
          <span className="inline-flex items-center gap-x-1 whitespace-nowrap">
            {saving > 0 && (
              <span className="bg-crimson px-1 py-1 text-parchment">
                <span className="sr-only">{labels.savingLabel} </span>−{formatAmount(saving, currency)}
              </span>
            )}
            {showPercent && percent > 0 && (
              <span className="border border-crimson px-1 py-[calc(0.25rem-1px)] text-blood-text">
                <span className="sr-only">{labels.discountLabel} </span>−{percent}%
              </span>
            )}
          </span>
        </p>
      )}
      <p className="leading-tight font-semibold text-gold-light">
        {onSale && <span className="sr-only">{labels.newPrice} </span>}
        {from && <span className="mr-1 text-[0.72em] font-normal text-parchment-muted">{labels.fromPrice}</span>}
        {formatAmount(shownPrice, currency)}
      </p>
    </div>
  );
}
