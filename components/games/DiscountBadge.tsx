import { getDictionary } from "@/lib/i18n/server";
import { gameOffers, maxDiscountPercent } from "@/lib/offers";
import { cn } from "@/lib/utils";
import type { GameCardData } from "@/types";

/**
 * Sale badge for the top-left corner of a cover (the top-right belongs to the favourite star): a solid
 * crimson block with the percentage in large, bold figures, so a sale reads before anything else on the
 * card without covering much of the art. A thin dark rim keeps its edge crisp on bright artwork.
 * Renders nothing when no version of the game is on sale right now.
 */
export async function DiscountBadge({ game, inline = false }: { game: GameCardData; /** Inside a positioned stack instead of the cover corner. */ inline?: boolean }) {
  const percent = maxDiscountPercent(gameOffers(game));
  if (percent <= 0) return null;
  const t = await getDictionary();
  return (
    <span
      className={cn(
        "inline-block border border-black/40 bg-crimson px-2 py-1.5 font-display text-lg leading-none font-bold tracking-[0.02em] text-parchment tabular-nums sm:px-2.5 sm:py-2 sm:text-2xl",
        !inline && "absolute top-3 left-3",
      )}
    >
      <span className="sr-only">{t.game.discountLabel} </span>−{percent}%
    </span>
  );
}
