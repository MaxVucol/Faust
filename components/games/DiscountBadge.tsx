import { getDictionary } from "@/lib/i18n/server";
import { gameOffers, maxDiscountPercent } from "@/lib/offers";
import { cn } from "@/lib/utils";
import type { GameCardData } from "@/types";

/**
 * Sale pennant for the top-left corner of a cover (the top-right belongs to the favourite star):
 * flat crimson with the store's swallow-tail notch, the percentage large and bold so it reads before
 * the card's text. Renders nothing when no version of the game is on sale right now.
 */
export async function DiscountBadge({ game, inline = false }: { game: GameCardData; /** Inside a positioned stack instead of the cover corner. */ inline?: boolean }) {
  const percent = maxDiscountPercent(gameOffers(game));
  if (percent <= 0) return null;
  const t = await getDictionary();
  return (
    <span
      className={cn(
        "inline-block bg-crimson py-1.5 pr-4 pl-2.5 font-display text-[0.95rem] leading-none font-semibold tracking-[0.04em] text-parchment tabular-nums [clip-path:polygon(0_0,100%_0,calc(100%-7px)_50%,100%_100%,0_100%)]",
        !inline && "absolute top-3 left-3",
      )}
    >
      <span className="sr-only">{t.game.discountLabel} </span>−{percent}%
    </span>
  );
}
