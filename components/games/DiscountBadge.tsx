import { getDictionary } from "@/lib/i18n/server";
import { gameOffers, maxDiscountPercent } from "@/lib/offers";
import { cn } from "@/lib/utils";
import type { GameCardData } from "@/types";
import { untilSalesEnd } from "./UntilSalesEnd";

/**
 * Sale pennant for the top-left corner of a cover (the top-right belongs to the favourite star): a plain
 * crimson rectangle holding the percentage in large, bold figures, with a swallow-tail drawn by an
 * ::after on its right edge (only the tail is cut, so the text keeps a normal rectangular ground).
 * Sizes are in em, so the tail follows the badge from phone to desktop. A soft dark drop shadow, which
 * follows the tail too, keeps the edge crisp on bright artwork.
 *
 * The size follows the viewport (18px figures on phones, 24px from sm) and is then capped by the width of
 * the card it sits on (Card is a size container): below 320px the badge keeps the phone size, below 240px
 * it steps down to 16px with tighter padding. Narrow home cards (197-306px wide at 1024-1440) would
 * otherwise carry a desktop-size badge over a third of their artwork. Outside a card nothing changes.
 * Renders nothing when no version of the game is on sale right now, and leaves by itself when the sale
 * ends while the page is open (untilSalesEnd).
 */
export function DiscountBadge({ game, inline = false }: { game: GameCardData; /** Inside a positioned stack instead of the cover corner. */ inline?: boolean }) {
  const offers = gameOffers(game);
  return untilSalesEnd(offers, new Date(), (now) => <Pennant percent={maxDiscountPercent(offers, now)} inline={inline} />);
}

async function Pennant({ percent, inline }: { percent: number; inline: boolean }) {
  if (percent <= 0) return null;
  const t = await getDictionary();
  return (
    <span
      className={cn(
        "inline-block bg-crimson py-1.5 pr-1.5 pl-2 font-display text-lg leading-none font-bold tracking-[0.02em] text-parchment tabular-nums drop-shadow-[0_1px_1.5px_rgb(0_0_0/0.6)] sm:py-2 sm:pr-2 sm:pl-2.5 sm:text-2xl",
        // Capped by the card's width (container queries on Card); the narrower rule comes last and wins.
        "@max-[20rem]:py-1.5 @max-[20rem]:pr-1.5 @max-[20rem]:pl-2 @max-[20rem]:text-lg",
        "@max-[15rem]:py-1 @max-[15rem]:pr-1 @max-[15rem]:pl-1.5 @max-[15rem]:text-base",
        // The tail: overlaps the body by 1px so no seam shows between them; the notch is 45% of its width.
        "after:absolute after:top-0 after:left-[calc(100%-1px)] after:h-full after:w-[0.6em] after:bg-crimson after:[clip-path:polygon(0_0,100%_0,45%_50%,100%_100%,0_100%)]",
        // Either way the badge positions its tail; on the cover it also sits in the corner.
        inline ? "relative" : "absolute top-3 left-3",
      )}
    >
      <span className="sr-only">{t.game.discountLabel} </span>−{percent}%
    </span>
  );
}
