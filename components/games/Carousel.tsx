"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

/**
 * Horizontal list of cards (1 / 2 / 4 visible by breakpoint) moved by translucent side arrows.
 * Scrolls natively (swipe on touch, snaps to whole cards); the arrows fade out at either end.
 */
export function Carousel({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  };

  const arrow = (dir: 1 | -1, enabled: boolean) => (
    <button
      type="button"
      onClick={() => step(dir)}
      disabled={!enabled}
      aria-label={dir === -1 ? t.game.similarPrev : t.game.similarNext}
      className={cn(
        "absolute top-1/2 z-10 hidden -translate-y-1/2 p-2 text-white/45 transition-[color,opacity,filter] duration-300 hover:text-gold-light hover:drop-shadow-[0_0_8px_rgb(192_154_85/0.6)] focus-visible:text-gold-light disabled:pointer-events-none disabled:opacity-0 sm:block",
        // Sit in the side margin (the list is 88% wide), clear of the cards.
        dir === -1 ? "right-full mr-1 lg:mr-4" : "left-full ml-1 lg:ml-4",
      )}
    >
      {dir === -1 ? <ChevronLeft className="size-14 stroke-[1.25]" /> : <ChevronRight className="size-14 stroke-[1.25]" />}
    </button>
  );

  return (
    <div className="relative mx-auto max-w-[88%]">
      {arrow(-1, canPrev)}
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, (child) => (
          <li className="w-full shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]">{child}</li>
        ))}
      </ul>
      {arrow(1, canNext)}
    </div>
  );
}
