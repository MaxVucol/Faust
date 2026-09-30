import { Badge } from "@/components/ui/Badge";
import { getDictionary } from "@/lib/i18n/server";
import { gameOffers, maxDiscountPercent } from "@/lib/offers";
import { cn } from "@/lib/utils";
import type { GameCardData } from "@/types";

/**
 * "−40%" pennant for the top-right corner of a cover (the top-left belongs to the favourite star).
 * Renders nothing when no version of the game is on sale right now.
 */
export async function DiscountBadge({ game, className }: { game: GameCardData; className?: string }) {
  const percent = maxDiscountPercent(gameOffers(game));
  if (percent <= 0) return null;
  const t = await getDictionary();
  return (
    <Badge variant="blood" className={cn("absolute top-3 right-3 text-xs", className)}>
      <span className="sr-only">{t.game.discountLabel} </span>−{percent}%
    </Badge>
  );
}
