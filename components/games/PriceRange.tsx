"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

type Thumb = "lo" | "hi";

type PriceRangeProps = {
  /** Ends of the scale (the catalogue's cheapest and dearest price, in the shown currency). */
  min: number;
  max: number;
  /** Current range; always min <= lo <= hi <= max. */
  lo: number;
  hi: number;
  /** Live updates while dragging or pressing keys (no navigation). */
  onInput: (lo: number, hi: number) => void;
  /** The range to apply: `delay` 0 on release, a short delay after keys so repeats collapse into one. */
  onCommit: (lo: number, hi: number, delay: number) => void;
  labels: { lo: string; hi: string };
  /** Spoken value, e.g. "€20.00". */
  valueText: (v: number) => string;
};

const KEY_DELAY = 500;

/**
 * Two-handle price slider. A plain dark track with a solid antique-gold bar between the handles (no
 * gradient; the bar is its own element positioned from both values). The handles are small rings with
 * a 44px-tall invisible grip for touch; they never cross. Each is an ARIA slider: arrows move one
 * unit, Page Up/Down a tenth of the scale, Home/End to the end of its free range.
 */
export function PriceRange({ min, max, lo, hi, onInput, onCommit, labels, valueText }: PriceRangeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const loRef = useRef<HTMLDivElement>(null);
  const hiRef = useRef<HTMLDivElement>(null);
  // `undecided`: the press began with both handles on the same spot; the first movement picks the side.
  const drag = useRef<{ thumb: Thumb; lo: number; hi: number; undecided: boolean } | null>(null);
  // The handle moved last stays on top, so two handles at the same spot can always be separated.
  const [top, setTop] = useState<Thumb>("hi");
  const span = max - min;
  const pct = (v: number) => (span > 0 ? ((v - min) / span) * 100 : 0);
  const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
  const big = Math.max(1, Math.round(span / 10));

  const valueAt = (clientX: number) => {
    const r = trackRef.current!.getBoundingClientRect();
    return Math.round(min + clamp((clientX - r.left) / r.width, 0, 1) * span);
  };

  /** Moves one handle to `v`, keeping it on its side of the other one. */
  const move = (thumb: Thumb, v: number, from = { lo, hi }) =>
    thumb === "lo" ? { lo: clamp(v, min, from.hi), hi: from.hi } : { lo: from.lo, hi: clamp(v, from.lo, max) };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (span <= 0 || (e.pointerType === "mouse" && e.button !== 0)) return;
    const v = valueAt(e.clientX);
    // The nearer handle; when both sit together, the side the pointer is on.
    const thumb: Thumb = v < lo ? "lo" : v > hi ? "hi" : v - lo < hi - v ? "lo" : v - lo > hi - v ? "hi" : top;
    e.currentTarget.setPointerCapture(e.pointerId);
    const next = move(thumb, v);
    drag.current = { thumb, ...next, undecided: lo === hi && v === lo };
    setTop(thumb);
    (thumb === "lo" ? loRef : hiRef).current?.focus({ preventScroll: true });
    onInput(next.lo, next.hi);
    e.preventDefault();
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const v = valueAt(e.clientX);
    // Pressed where both handles sit: the first move decides which one comes along (right: the
    // maximum, left: the minimum), so they can always be pulled apart. Otherwise a handle simply stops
    // at the other one; dragging the minimum never moves the maximum.
    let thumb = d.thumb;
    let undecided = d.undecided;
    if (undecided && v !== d.lo) {
      thumb = v > d.lo ? "hi" : "lo";
      undecided = false;
    }
    const next = move(thumb, v, d);
    if (next.lo === d.lo && next.hi === d.hi && thumb === d.thumb) return;
    drag.current = { thumb, ...next, undecided };
    if (thumb !== d.thumb) setTop(thumb);
    onInput(next.lo, next.hi);
  };

  const onPointerEnd = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    onCommit(d.lo, d.hi, 0);
  };

  const onKeyDown = (thumb: Thumb) => (e: KeyboardEvent<HTMLDivElement>) => {
    const v = thumb === "lo" ? lo : hi;
    const target: Record<string, number> = {
      ArrowLeft: v - 1,
      ArrowDown: v - 1,
      ArrowRight: v + 1,
      ArrowUp: v + 1,
      PageDown: v - big,
      PageUp: v + big,
      Home: thumb === "lo" ? min : lo,
      End: thumb === "lo" ? hi : max,
    };
    if (!(e.key in target)) return;
    e.preventDefault();
    const next = move(thumb, target[e.key]);
    setTop(thumb);
    if (next.lo === lo && next.hi === hi) return;
    onInput(next.lo, next.hi);
    onCommit(next.lo, next.hi, KEY_DELAY);
  };

  const handle = (thumb: Thumb) => {
    const v = thumb === "lo" ? lo : hi;
    return (
      <div
        ref={thumb === "lo" ? loRef : hiRef}
        role="slider"
        tabIndex={span > 0 ? 0 : -1}
        aria-label={labels[thumb]}
        aria-orientation="horizontal"
        aria-valuemin={thumb === "lo" ? min : lo}
        aria-valuemax={thumb === "lo" ? hi : max}
        aria-valuenow={v}
        aria-valuetext={valueText(v)}
        aria-disabled={span <= 0 || undefined}
        onKeyDown={onKeyDown(thumb)}
        style={{ left: `${pct(v)}%` }}
        className={cn(
          // The grip: 36×44px around a 14px ring, centred on the value.
          "group absolute top-1/2 flex h-11 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center outline-none",
          top === thumb ? "z-20" : "z-10",
        )}
      >
        <span
          aria-hidden
          className="size-3.5 rounded-full border-2 border-gold-light bg-base transition-colors duration-200 group-hover:border-[#e0c487] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-aged-gold group-focus-visible:outline-solid"
        />
      </div>
    );
  };

  return (
    // The whole strip takes the pointer (a press on the track moves the nearer handle); touch-none keeps
    // a horizontal drag on the slider from scrolling the page.
    <div
      className="relative mx-2 h-11 cursor-pointer touch-none select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
    >
      <div ref={trackRef} className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 border border-iron bg-[#0b0907]" />
      <div aria-hidden className="absolute top-1/2 h-1.5 -translate-y-1/2 bg-aged-gold" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
      {handle("lo")}
      {handle("hi")}
    </div>
  );
}
