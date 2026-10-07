"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

export type HeroSlide = { key: string; art: ReactNode; content: ReactNode };

const INTERVAL = 8000;

// prefers-reduced-motion, kept current; treated as reduced on the server and while hydrating (no autoplay yet).
const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (change: () => void) => {
  const media = window.matchMedia(REDUCED);
  media.addEventListener("change", change);
  return () => media.removeEventListener("change", change);
};
const reducedNow = () => window.matchMedia(REDUCED).matches;
const reducedOnServer = () => true;

/**
 * The hero's featured games, one at a time. Everything is rendered on the server (components/home/Hero.tsx);
 * this only chooses which slide shows. A slide's artwork is mounted once it is current or next, so the
 * first paint loads one image. Arrows, the numbered markers, the keyboard (← → inside the hero) and a
 * horizontal swipe move between games. It turns on its own every 8 s, but never while the pointer or the
 * focus is inside it, while it is scrolled out of view or the tab is hidden, when the visitor paused it,
 * or with reduced motion. Back on screen, it carries on unless the visitor paused it.
 * Hidden slides are `inert`, so neither the keyboard nor screen readers reach them.
 */
export function HeroCarousel({ slides, children }: { slides: HeroSlide[]; children?: ReactNode }) {
  const { t } = useI18n();
  const h = t.hero;
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState<number[]>([0, 1 % count]);
  const [paused, setPaused] = useState(false);
  const [hold, setHold] = useState(false);
  const reduced = useSyncExternalStore(subscribeMotion, reducedNow, reducedOnServer);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  // Whether any of the hero is on screen: scrolled away, it stops turning (and so loads no further artwork).
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = root.current;
    if (!el || count < 2) return;
    const watch = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    watch.observe(el);
    return () => watch.disconnect();
  }, [count]);

  const go = useCallback(
    (to: number) => {
      const next = (to + count) % count;
      setIndex(next);
      setSeen((s) => [...new Set([...s, next, (next + 1) % count])]);
    },
    [count],
  );

  useEffect(() => {
    if (count < 2 || paused || hold || reduced || !onScreen) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") go(index + 1);
    }, INTERVAL);
    return () => window.clearInterval(timer);
  }, [count, paused, hold, reduced, onScreen, index, go]);

  if (count === 0) return null;
  const control =
    "flex size-11 items-center justify-center border border-gold-dark/70 bg-black/40 text-gold-light transition-colors duration-200 hover:border-gold-light hover:bg-black/60 focus-visible:border-gold-light";

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={h.carouselAria}
      className="relative h-full"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setHold(false)}
      onKeyDown={(e) => {
        if (count < 2 || (e.target as HTMLElement).closest("input, textarea, select, dialog")) return;
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start || count < 2) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      {slides.map((slide, i) => {
        const current = i === index;
        return (
          <div
            key={slide.key}
            role="group"
            aria-roledescription="slide"
            aria-label={h.slide(i + 1, count)}
            aria-hidden={!current}
            inert={!current}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none",
              current ? "z-[1] opacity-100" : "z-0 opacity-0",
            )}
          >
            {seen.includes(i) && slide.art}
            {slide.content}
          </div>
        );
      })}

      {children}

      {count > 1 && (
        <div className="absolute right-4 bottom-6 z-[2] flex items-center gap-2 sm:right-8 lg:right-12 lg:bottom-10">
          <ol className="mr-1 flex items-center gap-1" aria-label={h.carouselAria}>
            {slides.map((slide, i) => (
              <li key={slide.key}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={h.slide(i + 1, count)}
                  aria-current={i === index ? "true" : undefined}
                  className="group/dot flex size-8 items-center justify-center"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block size-2 rotate-45 border transition-colors duration-200",
                      i === index ? "border-gold-light bg-gold-light" : "border-gold-light/70 bg-transparent group-hover/dot:bg-gold-light/40",
                    )}
                  />
                </button>
              </li>
            ))}
          </ol>
          {!reduced && (
            <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? h.play : h.pause} className={control}>
              {paused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
            </button>
          )}
          <button type="button" onClick={() => go(index - 1)} aria-label={h.prev} className={control}>
            <ChevronLeft aria-hidden className="size-5" />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label={h.next} className={control}>
            <ChevronRight aria-hidden className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
}
