"use client";

import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Children, useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

type CarouselProps = {
  children: ReactNode;
  /** Sets the track width; arrows sit just outside it, in the side margin. */
  className?: string;
  /** Endless list: after the last card the first one comes round again, in both directions. */
  loop?: boolean;
  /**
   * On phones (where the large side arrows are hidden) show small arrows either side of the card
   * cover. Give the carousel side margins of about 2.5rem on phones so they have room.
   */
  mobileArrows?: boolean;
  /** On phones make each card a little narrower than the track, so the next one shows at the edge. */
  peek?: boolean;
};

/**
 * Horizontal list of cards (1 / 2 / 4 visible by breakpoint) moved by translucent side arrows.
 * Scrolls natively (swipe on touch, snaps to whole cards).
 *
 * Without `loop` the arrows fade out at either end. With `loop` the list has no ends, yet every
 * card is rendered exactly once: when the view gets within one card of an edge, the card at the far
 * end is moved over to that edge (a keyed reorder, so React moves the existing DOM node) and the
 * scroll position shifts by one card width in the same frame, so nothing visibly jumps.
 */
export function Carousel({ children, className = "max-w-[88%]", loop = false, mobileArrows = false, peek = false }: CarouselProps) {
  const { t } = useI18n();
  const trackRef = useRef<HTMLUListElement>(null);
  // Arrow animation state: the scroll position being animated towards, and the running frame.
  const animRef = useRef<{ frame: number; target: number } | null>(null);
  const items = Children.toArray(children);
  const count = items.length;
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  // Looping only makes sense when the list is wider than the track (decided after measuring).
  const [looping, setLooping] = useState(false);
  // Display order as indices into `items`; rotated to keep a spare card beyond each edge.
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i));
  // Scroll correction to apply once a rotation has reached the DOM.
  const pendingShift = useRef(0);

  const stride = useCallback(() => {
    const el = trackRef.current;
    const card = el?.querySelector("li");
    if (!el || !card) return 0;
    return card.getBoundingClientRect().width + (parseFloat(getComputedStyle(el).columnGap) || 0);
  }, []);

  /** Move one card from one end to the other: 1 = first card to the back, -1 = last card to the front. */
  const rotate = useCallback(
    (dir: 1 | -1) => {
      // Snapping would re-align the view to the same card after the reorder, on top of the shift
      // applied below, so it is paused until the shift is done.
      if (trackRef.current) trackRef.current.style.scrollSnapType = "none";
      pendingShift.current += -dir * stride();
      setOrder((o) => (dir === 1 ? [...o.slice(1), o[0]] : [o[o.length - 1], ...o.slice(0, -1)]));
    },
    [stride],
  );

  // Keep the order valid if the number of cards changes.
  if (order.length !== count) setOrder(items.map((_, i) => i));

  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el || pendingShift.current === 0) return;
    el.scrollLeft += pendingShift.current;
    pendingShift.current = 0;
    // Resume snapping (unless an arrow glide is running; it restores snapping when it ends).
    if (!animRef.current) el.style.scrollSnapType = "";
  }, [order]);

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

  // Decide whether to loop; if so, put the last card in front so "previous" works from the start
  // (the view stays on the first card).
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el || !loop || count < 2 || looping) return;
    if (el.scrollWidth <= el.clientWidth + 4) return;
    setLooping(true);
    rotate(-1);
  }, [loop, count, looping, rotate]);

  // After a swipe settles near an edge, bring a card round from the other end.
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !looping) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const rebalance = () => {
      if (animRef.current) return; // never reorder mid-animation
      const w = stride();
      const max = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft < w * 0.5) flushSync(() => rotate(-1));
      else if (el.scrollLeft > max - w * 0.5) flushSync(() => rotate(1));
    };
    // `scrollend` where supported, with a debounce fallback.
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(rebalance, 150);
    };
    el.addEventListener("scrollend", rebalance);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scrollend", rebalance);
      el.removeEventListener("scroll", onScroll);
    };
  }, [looping, rotate, stride]);

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
    if (!el) return;
    const w = stride();
    if (!w) return;

    const running = animRef.current;
    if (running) cancelAnimationFrame(running.frame);
    animRef.current = null;
    el.style.scrollSnapType = "none";
    let target = (running ? running.target : el.scrollLeft) + dir * w;
    const max = el.scrollWidth - el.clientWidth;
    if (looping) {
      // Past an edge: bring a card round first; the rotation shifts the view by one card, so does the target.
      if (target > max + 1) {
        flushSync(() => rotate(1));
        target -= w;
      } else if (target < -1) {
        flushSync(() => rotate(-1));
        target += w;
      }
    } else {
      target = Math.max(0, Math.min(target, max));
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.scrollTo({ left: target, behavior: "instant" });
      el.style.scrollSnapType = "";
      return;
    }

    const start = el.scrollLeft;
    const distance = target - start;
    const duration = Math.min(900, 520 + Math.abs(distance) * 0.25);
    let t0 = -1; // taken from the first frame's timestamp
    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

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
        "absolute top-1/2 z-10 hidden -translate-y-1/2 p-1 text-white/45 xl:p-2 transition-[color,opacity,filter] duration-300 hover:text-gold-light hover:drop-shadow-[0_0_8px_rgb(192_154_85/0.6)] focus-visible:text-gold-light disabled:pointer-events-none disabled:opacity-0 sm:block",
        // Sit in the side margin next to the track, clear of the cards.
        dir === -1 ? "right-full mr-1 lg:mr-2 xl:mr-4" : "left-full ml-1 lg:ml-2 xl:ml-4",
      )}
    >
      {dir === -1 ? <ChevronLeft className="size-10 stroke-[1.25] xl:size-14" /> : <ChevronRight className="size-10 stroke-[1.25] xl:size-14" />}
    </button>
  );

  return (
    <div className={cn("relative mx-auto", className)}>
      {arrow(-1, canPrev)}
      <ul
        ref={trackRef}
        // No browser scroll anchoring: when a card is moved to the other end, the carousel shifts the
        // view itself; anchoring would shift it a second time and start the list one card too far.
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain [overflow-anchor:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {(order.length === count ? order : items.map((_, i) => i)).map((i) => (
          <li
            key={i}
            className={cn("shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]", peek ? "w-[84%]" : "w-full")}
          >
            {items[i]}
          </li>
        ))}
      </ul>
      {arrow(1, canNext)}
      {mobileArrows && (
        // Phones: one card fills the track, so this box has the size of its 3:4 cover and the arrows
        // sit either side of it, centred on the cover, in the margin left free for them.
        <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[3/4] sm:hidden">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => step(dir)}
              disabled={dir === -1 ? !canPrev : !canNext}
              aria-label={dir === -1 ? t.game.similarPrev : t.game.similarNext}
              className={cn(
                "pointer-events-auto absolute top-1/2 flex h-11 w-9 -translate-y-1/2 items-center justify-center text-parchment-muted transition-[color,opacity] duration-300 hover:text-gold-light focus-visible:text-gold-light disabled:pointer-events-none disabled:opacity-30",
                dir === -1 ? "right-full mr-1" : "left-full ml-1",
              )}
            >
              {dir === -1 ? <ArrowLeft className="size-5" /> : <ArrowRight className="size-5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
