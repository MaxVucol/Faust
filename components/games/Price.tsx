import { formatMoney } from "@/lib/currency";
import { isOnSale } from "@/lib/format";
import { getCurrency, getDictionary } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

type PriceProps = {
  game: { price: number; discountPrice: number | null; discountEndsAt: Date | null };
  className?: string;
};

export async function Price({ game, className }: PriceProps) {
  const [t, currency] = await Promise.all([getDictionary(), getCurrency()]);
  const money = (v: number) => formatMoney(v, currency);
  if (isOnSale(game)) {
    return (
      <p className={cn("flex flex-wrap items-baseline gap-x-3", className)}>
        <span className="sr-only">{t.game.oldPrice}</span>
        <s className="text-sm text-parchment-muted">{money(game.price)}</s>
        <span className="sr-only">{t.game.newPrice}</span>
        <span className="text-aged-gold">{money(game.discountPrice as number)}</span>
      </p>
    );
  }
  return <p className={cn("text-aged-gold", className)}>{money(game.price)}</p>;
}
