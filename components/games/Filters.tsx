"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { GENRES, PLATFORMS, RELEASED_OPTIONS, genreLabel } from "@/lib/catalog";
import { formatAmount, fromMdl } from "@/lib/currency";
import type { GameFilters } from "@/lib/games";
import { cn } from "@/lib/utils";
import { PriceRange } from "./PriceRange";

/** The query-string keys this panel owns; everything else in the URL (search, sort) is left alone. */
const PANEL_KEYS = ["genre", "platform", "minPrice", "maxPrice", "minRating", "released", "sale"];

/** Checkboxes and selects apply after this pause, so a few quick clicks make one request. */
const CLICK_DELAY = 150;
/** Typed prices apply after this pause (or at once on Enter or when the field is left). */
const TYPE_DELAY = 800;

/** The panel's controls as the URL describes them (prices in the shown currency, as in the URL). */
type Draft = { genres: string[]; platforms: string[]; minPrice?: number; maxPrice?: number; minRating: string; released: string; sale: boolean };

const draftOf = (f: GameFilters): Draft => ({
  genres: f.genres,
  platforms: f.platforms,
  minPrice: f.minPrice,
  maxPrice: f.maxPrice,
  minRating: f.minRating?.toString() ?? "",
  released: f.releasedYears?.toString() ?? "",
  sale: f.sale,
});
const keyOf = (d: Draft) => JSON.stringify(d);

/** A typed price: undefined for an empty field (no limit), NaN when it isn't a number. */
const parsePrice = (text: string): number | undefined => (text.trim() === "" ? undefined : Number(text.replace(",", ".")));
const showPrice = (v: number) => String(Math.round(v * 100) / 100);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-iron py-6 first:pt-0">
      <legend className="float-left mb-3 w-full font-display-ui text-[0.7rem] text-aged-gold">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

type FiltersProps = {
  filters: GameFilters;
  /** Cheapest and dearest card price in the catalogue (MDL): the ends of the price slider. */
  priceBounds: { min: number; max: number } | null;
  /** Games matching the current filters (shown in the phone sheet as the results update). */
  total: number;
};

/**
 * Catalogue filters. Every control applies itself: the URL is updated with the existing query
 * parameters (the page reads them as before) and the results and "Load more" start again from the
 * first batch. Search and sorting in the URL are kept. Price is a two-handle slider with editable
 * fields, in the shown currency like the URL; the slider spans the catalogue's real prices.
 */
export function Filters({ filters, priceBounds, total }: FiltersProps) {
  const { t, currency } = useI18n();
  const c = t.catalog;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // The controls are controlled, not re-mounted from the URL, so focus and the open sheet survive
  // every update. They follow the URL whenever it changes for another reason (a removed chip, "Clear
  // all", Back), but not when it only catches up with what was chosen here.
  const urlKey = keyOf(draftOf(filters));
  const [draft, setDraft] = useState(() => draftOf(filters));
  const [seenKey, setSeenKey] = useState(urlKey);
  const [requested, setRequested] = useState(urlKey);
  // Price being edited: the field texts while typing, the handles while dragging.
  const [typed, setTyped] = useState<{ min: string | null; max: string | null }>({ min: null, max: null });
  const [live, setLive] = useState<{ lo: number; hi: number } | null>(null);
  if (urlKey !== seenKey) {
    setSeenKey(urlKey);
    if (urlKey !== requested) {
      setDraft(draftOf(filters));
      setRequested(urlKey);
      setTyped({ min: null, max: null });
      setLive(null);
    }
  }

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  /** The catalogue URL for `d`, keeping search, sort and anything else this panel doesn't own. */
  const hrefFor = (d: Draft) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of [...PANEL_KEYS, "page"]) params.delete(key);
    for (const g of d.genres) params.append("genre", g);
    for (const p of d.platforms) params.append("platform", p);
    if (d.minPrice !== undefined) params.set("minPrice", showPrice(d.minPrice));
    if (d.maxPrice !== undefined) params.set("maxPrice", showPrice(d.maxPrice));
    if (d.minRating) params.set("minRating", d.minRating);
    if (d.released) params.set("released", d.released);
    if (d.sale) params.set("sale", "1");
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  /** Shows a change at once and applies it after `delay` (a newer change replaces a waiting one). */
  const update = (patch: Partial<Draft>, delay: number) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    if (timer.current) clearTimeout(timer.current);
    const href = hrefFor(next);
    const key = keyOf(next);
    timer.current = setTimeout(() => {
      timer.current = null;
      setRequested(key);
      if (href === window.location.pathname + window.location.search) return;
      startTransition(() => router.push(href, { scroll: false }));
    }, delay);
  };

  const toggle = (list: "genres" | "platforms", value: string) => (e: { target: { checked: boolean } }) =>
    update({ [list]: e.target.checked ? [...draft[list], value] : draft[list].filter((v) => v !== value) }, CLICK_DELAY);

  // ---- price, in the shown currency
  const bounds = priceBounds && { lo: Math.floor(fromMdl(priceBounds.min, currency)), hi: Math.ceil(fromMdl(priceBounds.max, currency)) };
  const committed = bounds && {
    lo: clamp(draft.minPrice ?? bounds.lo, bounds.lo, bounds.hi),
    hi: clamp(draft.maxPrice ?? bounds.hi, bounds.lo, bounds.hi),
  };
  // What the handles show: a drag in progress, else the typed values (when valid), else the filter.
  let shown = committed;
  if (bounds && committed) {
    if (live) shown = live;
    else {
      const tMin = typed.min === null ? committed.lo : parsePrice(typed.min);
      const tMax = typed.max === null ? committed.hi : parsePrice(typed.max);
      const lo = Number.isNaN(tMin) ? committed.lo : clamp(tMin ?? bounds.lo, bounds.lo, bounds.hi);
      const hi = Number.isNaN(tMax) ? committed.hi : clamp(tMax ?? bounds.hi, bounds.lo, bounds.hi);
      shown = { lo: Math.min(lo, hi), hi: Math.max(lo, hi) };
    }
  }

  /** Applies a price range; the ends of the scale mean "no limit" and leave the URL without it. */
  const commitPrice = (lo: number, hi: number, delay: number) => {
    if (!bounds) return;
    setLive(null);
    update({ minPrice: lo <= bounds.lo ? undefined : lo, maxPrice: hi >= bounds.hi ? undefined : hi }, delay);
  };

  /**
   * Applies the typed prices. `final` (Enter, leaving the field) clamps them into the scale and puts
   * the clean values back in the fields; while typing, only a valid range is applied, so a half-typed
   * number never triggers a jump.
   */
  const commitTyped = (texts: { min: string | null; max: string | null }, edited: "min" | "max", final: boolean) => {
    if (!bounds || !committed) return;
    const a = texts.min === null ? committed.lo : parsePrice(texts.min);
    const b = texts.max === null ? committed.hi : parsePrice(texts.max);
    if (final) setTyped({ min: null, max: null });
    // Not a number: leave the filter as it is (the field shows it again once left).
    if (Number.isNaN(a) || Number.isNaN(b)) return;
    let lo = clamp(a ?? bounds.lo, bounds.lo, bounds.hi);
    let hi = clamp(b ?? bounds.hi, bounds.lo, bounds.hi);
    if (!final && (lo !== (a ?? bounds.lo) || hi !== (b ?? bounds.hi) || lo > hi)) return;
    if (lo > hi) {
      if (edited === "min") lo = hi;
      else hi = lo;
    }
    commitPrice(lo, hi, final ? 0 : TYPE_DELAY);
  };

  const priceField = (edge: "min" | "max") => {
    const id = edge === "min" ? "minPrice" : "maxPrice";
    // The fields show exactly what the handles show (a URL value beyond the catalogue's prices is
    // shown at the end of the scale; the URL itself is only rewritten once the price is changed).
    const value = typed[edge] ?? (shown ? showPrice(edge === "min" ? shown.lo : shown.hi) : "");
    return (
      <div>
        <Label htmlFor={id}>{edge === "min" ? c.from : c.to}</Label>
        <Input
          id={id}
          name={id}
          type="number"
          inputMode="decimal"
          min={bounds?.lo ?? 0}
          max={bounds?.hi}
          step={1}
          value={value}
          onChange={(e) => {
            const texts = { ...typed, [edge]: e.target.value };
            setTyped(texts);
            commitTyped(texts, edge, false);
          }}
          onBlur={() => typed[edge] !== null && commitTyped(typed, edge, true)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            commitTyped(typed, edge, true);
          }}
          className="px-3 tabular-nums"
        />
      </div>
    );
  };

  // "Clear all": every filter of this panel goes; search and sorting stay.
  const resetHref = (() => {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of [...PANEL_KEYS, "page"]) params.delete(key);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  })();

  const active =
    filters.genres.length +
    filters.platforms.length +
    Number(filters.minPrice !== undefined) +
    Number(filters.maxPrice !== undefined) +
    Number(filters.minRating !== undefined) +
    Number(filters.releasedYears !== undefined) +
    Number(filters.sale);

  const close = () => {
    setOpen(false);
    openerRef.current?.focus();
  };

  // Phones and tablets: the panel is a full-screen dialog. Focus moves into it and stays there (Tab
  // wraps), the page behind doesn't scroll, Escape closes it and focus returns to the "Filters" button.
  // Widening the window to the desktop layout closes it, since the sidebar then shows the same panel.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        openerRef.current?.focus();
      } else if (e.key === "Tab" && panelRef.current) {
        const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, [role=slider][tabindex='0']")].filter(
          (el) => !el.hasAttribute("disabled"),
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onWide = () => desktop.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onWide);
    // Lock the root scroller as well as the body: on most browsers the page scrolls on <html>.
    const root = document.documentElement;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onWide);
      root.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [open]);

  const panel = (
    <aside
      ref={panelRef}
      id="filtre"
      aria-label={c.filters}
      role={open ? "dialog" : undefined}
      aria-modal={open ? true : undefined}
      className={cn(
        // Open (phones/tablets): a viewport-sized sheet above the header, scrolling on its own.
        open
          ? "fixed inset-0 z-50 block overflow-y-auto overscroll-contain bg-base px-6 py-6"
          : // Desktop sidebar: a solid surface so the labels stay legible over the background art.
            "hidden lg:block lg:border lg:border-iron lg:bg-surface/90 lg:p-6",
      )}
    >
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <div>
          <p className="font-display text-xl tracking-[0.15em] uppercase">{active > 0 ? c.filtersCount(active) : c.filters}</p>
          {/* The results update behind the sheet as the filters change: their count, announced politely. */}
          <p aria-live="polite" className="mt-1 text-sm text-parchment-muted">
            {c.results(total)}
          </p>
        </div>
        <button ref={closeRef} type="button" aria-label={c.closeFilters} onClick={close} className="flex size-11 items-center justify-center text-parchment-muted hover:text-parchment">
          <X className="size-6" />
        </button>
      </div>

      <form action={pathname} onSubmit={(e) => e.preventDefault()} noValidate>
        <Group title={c.genre}>
          {GENRES.map((g) => (
            <Checkbox
              key={g.name}
              id={`genre-${g.slug}`}
              name="genre"
              value={g.name}
              checked={draft.genres.includes(g.name)}
              onChange={toggle("genres", g.name)}
              label={genreLabel(t.genres, g.name)}
            />
          ))}
        </Group>

        <Group title={c.platform}>
          {PLATFORMS.map((p) => (
            <Checkbox
              key={p.name}
              id={`platform-${p.short}`}
              name="platform"
              value={p.name}
              checked={draft.platforms.includes(p.name)}
              onChange={toggle("platforms", p.name)}
              label={p.name}
            />
          ))}
        </Group>

        <Group title={c.price(currency)}>
          <div className="grid grid-cols-2 gap-3">
            {priceField("min")}
            {priceField("max")}
          </div>
          {bounds && shown && (
            <div className="mt-4">
              <PriceRange
                min={bounds.lo}
                max={bounds.hi}
                lo={shown.lo}
                hi={shown.hi}
                onInput={(lo, hi) => {
                  setTyped({ min: null, max: null });
                  setLive({ lo, hi });
                }}
                onCommit={commitPrice}
                labels={{ lo: c.priceMin, hi: c.priceMax }}
                valueText={(v) => formatAmount(v, currency)}
              />
            </div>
          )}
        </Group>

        <Group title={c.minRating}>
          <Label htmlFor="minRating" className="sr-only">
            {c.minRating}
          </Label>
          <Select id="minRating" name="minRating" value={draft.minRating} onChange={(e) => update({ minRating: e.target.value }, CLICK_DELAY)}>
            <option value="">{c.anyRating}</option>
            {[7, 8, 9].map((n) => (
              <option key={n} value={n}>
                {c.ratingAtLeast(n)}
              </option>
            ))}
          </Select>
        </Group>

        <Group title={c.released}>
          <Label htmlFor="released" className="sr-only">
            {c.released}
          </Label>
          <Select id="released" name="released" value={draft.released} onChange={(e) => update({ released: e.target.value }, CLICK_DELAY)}>
            <option value="">{c.anyTime}</option>
            {RELEASED_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {c.releasedWithin(n)}
              </option>
            ))}
          </Select>
        </Group>

        <Group title={c.offers}>
          <Checkbox id="sale" name="sale" value="1" checked={draft.sale} onChange={(e) => update({ sale: e.target.checked }, CLICK_DELAY)} label={c.onlyDiscounted} />
        </Group>

        {/* Filters apply as they change, so there is no "Apply" button; resetting is a quiet text action. */}
        <div className="pt-5 text-center">
          <Link
            href={resetHref}
            scroll={false}
            onClick={() => {
              if (timer.current) clearTimeout(timer.current);
              timer.current = null;
              setOpen(false);
            }}
            className="inline-flex min-h-11 items-center px-2 font-display-ui text-[0.7rem] text-parchment-muted underline-offset-4 transition-colors duration-200 hover:text-gold-light hover:underline"
          >
            {c.clearAll}
          </Link>
        </div>
      </form>
    </aside>
  );

  return (
    <>
      <Button ref={openerRef} variant="ghost" size="sm" className="lg:hidden" onClick={() => setOpen(true)} aria-controls="filtre" aria-expanded={open}>
        <SlidersHorizontal aria-hidden className="size-4" />
        {active > 0 ? c.filtersCount(active) : c.filters}
      </Button>
      {/* While open, the dialog is rendered straight into <body>: page wrappers with an entrance
          animation (app/template.tsx) keep a transform, which would otherwise pin a fixed element
          to the page instead of the viewport. It exists only after a click, so only in the browser. */}
      {open ? createPortal(panel, document.body) : panel}
    </>
  );
}
