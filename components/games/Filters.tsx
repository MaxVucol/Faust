"use client";

import Form from "next/form";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { GENRES, PLATFORMS, RELEASED_OPTIONS, genreLabel } from "@/lib/catalog";
import type { GameFilters } from "@/lib/games";
import { cn } from "@/lib/utils";

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-iron py-6 first:pt-0">
      <legend className="float-left mb-3 w-full font-display-ui text-[0.7rem] text-aged-gold">{title}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

export function Filters({ filters }: { filters: GameFilters }) {
  const { t, currency } = useI18n();
  const c = t.catalog;
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        openerRef.current?.focus();
      } else if (e.key === "Tab" && panelRef.current) {
        const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea")].filter((el) => !el.hasAttribute("disabled"));
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
        <p className="font-display text-xl tracking-[0.15em] uppercase">{active > 0 ? c.filtersCount(active) : c.filters}</p>
        <button ref={closeRef} type="button" aria-label={c.closeFilters} onClick={close} className="flex size-11 items-center justify-center text-parchment-muted hover:text-parchment">
          <X className="size-6" />
        </button>
      </div>

      {/* Keyed by the active filters so the form resets when the URL changes. */}
      <Form key={JSON.stringify(filters)} action="/produse" onSubmit={() => setOpen(false)}>
        {filters.q && <input type="hidden" name="q" value={filters.q} />}
        {filters.sort !== "popular" && <input type="hidden" name="sort" value={filters.sort} />}

        <Group title={c.genre}>
          {GENRES.map((g) => (
            <Checkbox
              key={g.name}
              id={`genre-${g.slug}`}
              name="genre"
              value={g.name}
              defaultChecked={filters.genres.includes(g.name)}
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
              defaultChecked={filters.platforms.includes(p.name)}
              label={p.name}
            />
          ))}
        </Group>

        <Group title={c.price(currency)}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="minPrice">{c.from}</Label>
              <Input id="minPrice" name="minPrice" type="number" min={0} step={10} inputMode="numeric" defaultValue={filters.minPrice} />
            </div>
            <div>
              <Label htmlFor="maxPrice">{c.to}</Label>
              <Input id="maxPrice" name="maxPrice" type="number" min={0} step={10} inputMode="numeric" defaultValue={filters.maxPrice} />
            </div>
          </div>
        </Group>

        <Group title={c.minRating}>
          <Label htmlFor="minRating" className="sr-only">
            {c.minRating}
          </Label>
          <Select id="minRating" name="minRating" defaultValue={filters.minRating?.toString() ?? ""}>
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
          <Select id="released" name="released" defaultValue={filters.releasedYears?.toString() ?? ""}>
            <option value="">{c.anyTime}</option>
            {RELEASED_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {c.releasedWithin(n)}
              </option>
            ))}
          </Select>
        </Group>

        <Group title={c.offers}>
          <Checkbox id="sale" name="sale" value="1" defaultChecked={filters.sale} label={c.onlyDiscounted} />
        </Group>

        <div className="flex flex-col gap-3 pt-6">
          <Button type="submit">{c.apply}</Button>
          <Link
            href="/produse"
            onClick={() => setOpen(false)}
            className="py-2 text-center font-display-ui text-[0.7rem] text-parchment-muted hover:text-parchment"
          >
            {c.clearAll}
          </Link>
        </div>
      </Form>
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
