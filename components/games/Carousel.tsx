"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

type CarouselProps = {
  children: ReactNode;
  /** Sets the track width; arrows sit just outside it, in the side margin. */
  className?: string;
  /** Endless list: after the last card the first one comes round again, in both directions. */
  loop?: boolean;
};

/**
 * Horizontal list of cards (1 / 2 / 4 visible by breakpoint) moved by translucent side arrows.
 * Scrolls natively (swipe on touch, snaps to whole cards).
 *
 * Without `loop` the arrows fade out at either end. With `loop` the cards are rendered three times
 * and the view is kept in the middle copy: whenever scrolling settles in an outer copy it jumps by
 * one copy width, which lands on identical cards, so the list appears to repeat forever.
 */
export function Carousel({ children, className = "max-w-[88%]", loop = false }: CarouselProps) {
  const { t } = useI18n();
  const trackRef = useRef<HTMLUListElement>(null);
  // Arrow animation state: the scroll position being animated towards, and the running frame.
  const animRef = useRef<{ frame: number; target: number } | null>(null);
  const items = Children.toArray(children);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  // Looping only makes sense when one copy of the list is wider than the track.
  const [looping, setLooping] = useState(loop && items.length > 1);
  const copies = looping ? 3 : 1;

  /** Width of one full copy of the list (cards plus gaps). */
  const copyWidth = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 0;
    return el.scrollWidth / copies;
  }, [copies]);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    if (looping) {
      setCanPrev(true);
      setCanNext(true);
      return;
    }
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, [looping]);

  // Decide whether the list is long enough to loop, and start in the middle copy.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !loop) return;
    const oneCopy = el.scrollWidth / copies;
    if (looping && oneCopy <= el.clientWidth + 4) {
      setLooping(false);
      return;
    }
    if (looping) el.scrollTo({ left: oneCopy, behavior: "instant" });
  }, [loop, looping, copies]);

  // After each scroll settles, move back into the middle copy without any visible change.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !looping) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const recentre = () => {
      if (animRef.current) return; // never shift the list mid-animation
      const w = copyWidth();
      if (el.scrollLeft < w * 0.5) el.scrollTo({ left: el.scrollLeft + w, behavior: "instant" });
      else if (el.scrollLeft >= w * 1.5) el.scrollTo({ left: el.scrollLeft - w, behavior: "instant" });
    };
    // `scrollend` where supported, with a debounce fallback.
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(recentre, 150);
    };
    el.addEventListener("scrollend", recentre);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scrollend", recentre);
      el.removeEventListener("scroll", onScroll);
    };
  }, [looping, copyWidth]);

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

  /**
   * Glides one card per click with an ease-in-out curve. Snapping is paused while the list moves
   * (it would fight the animation) and restored on the last frame. Repeated clicks extend the same
   * glide towards a further card instead of restarting it.
   */
  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const stride = card.getBoundingClientRect().width + gap;

    const running = animRef.current;
    if (running) cancelAnimationFrame(running.frame);
    let target = (running ? running.target : el.scrollLeft) + dir * stride;
    if (!looping) target = Math.max(0, Math.min(target, el.scrollWidth - el.clientWidth));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      animRef.current = null;
      el.scrollTo({ left: target, behavior: "instant" });
      return;
    }

    const start = el.scrollLeft;
    const distance = target - start;
    const duration = Math.min(900, 520 + Math.abs(distance) * 0.25);
    let t0 = -1; // taken from the first frame's timestamp
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    el.style.scrollSnapType = "none";

    const tick = (now: number) => {
      if (t0 < 0) t0 = now;
      const p = Math.min(1, (now - t0) / duration);
      el.scrollLeft = start + distance * ease(p);
      if (p < 1) {
        animRef.current = { frame: requestAnimationFrame(tick), target };
        return;
      }
      animRef.current = null;
      el.style.scrollSnapType = "";
      if (looping) {
        const w = copyWidth();
        if (el.scrollLeft < w * 0.5) el.scrollLeft += w;
        else if (el.scrollLeft >= w * 1.5) el.scrollLeft -= w;
      }
    };
    animRef.current = { frame: requestAnimationFrame(tick), target };
  };

  useEffect(
    () => () => {
      if (animRef.current) cancelAnimationFrame(animRef.current.frame);
    },
    [],
  );

  const arrow = (dir: 1 | -1, enabled: boolean) => (
    <button
      type="button"
      onClick={() => step(dir)}
      disabled={!enabled}
      aria-label={dir === -1 ? t.game.similarPrev : t.game.similarNext}
      className={cn(
        "absolute top-1/2 z-10 hidden -translate-y-1/2 p-2 text-white/45 transition-[color,opacity,filter] duration-300 hover:text-gold-light hover:drop-shadow-[0_0_8px_rgb(192_154_85/0.6)] focus-visible:text-gold-light disabled:pointer-events-none disabled:opacity-0 sm:block",
        // Sit in the side margin next to the track, clear of the cards.
        dir === -1 ? "right-full mr-1 lg:mr-4" : "left-full ml-1 lg:ml-4",
      )}
    >
      {dir === -1 ? <ChevronLeft className="size-14 stroke-[1.25]" /> : <ChevronRight className="size-14 stroke-[1.25]" />}
    </button>
  );

  return (
    <div className={cn("relative mx-auto", className)}>
      {arrow(-1, canPrev)}
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: copies }, (_, copy) =>
          items.map((child, i) => (
            <li
              key={`${copy}-${i}`}
              // Only the middle copy is announced; the others are visual repeats.
              aria-hidden={copies > 1 && copy !== 1 ? true : undefined}
              className="w-full shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
            >
              {child}
            </li>
          )),
        )}
      </ul>
      {arrow(1, canNext)}
    </div>
  );
}
