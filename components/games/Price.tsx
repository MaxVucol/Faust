import { formatPrice, isOnSale } from "@/lib/format";
import { cn } from "@/lib/utils";

type PriceProps = {
  game: { price: number; discountPrice: number | null; discountEndsAt: Date | null };
  className?: string;
};

export function Price({ game, className }: PriceProps) {
  if (isOnSale(game)) {
    return (
      <p className={cn("flex flex-wrap items-baseline gap-x-3", className)}>
        <span className="sr-only">Preț vechi:</span>
        <s className="text-sm text-parchment-muted">{formatPrice(game.price)}</s>
        <span className="sr-only">Preț redus:</span>
        <span className="text-aged-gold">{formatPrice(game.discountPrice as number)}</span>
      </p>
    );
  }
  return <p className={cn("text-aged-gold", className)}>{formatPrice(game.price)}</p>;
}
