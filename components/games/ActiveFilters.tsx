import Link from "next/link";
import { X } from "lucide-react";
import { genreLabel } from "@/lib/catalog";
import { formatMoney, toMdl, type Currency } from "@/lib/currency";
import type { GameFilters } from "@/lib/games";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type SearchParams = Record<string, string | string[] | undefined>;

/** Query-string keys that are filters (sorting is kept when filters are removed). */
const FILTER_KEYS = ["q", "genre", "platform", "minPrice", "maxPrice", "minRating", "sale"] as const;

/** Catalogue URL for the current search params with one value of `key` (or all of them) removed. */
function hrefWithout(sp: SearchParams, key: string, value?: string) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (k === "page" || v === undefined) continue;
    for (const item of Array.isArray(v) ? v : [v]) {
      if (k === key && (value === undefined || item === value)) continue;
      params.append(k, item);
    }
  }
  const qs = params.toString();
  return qs ? `/produse?${qs}` : "/produse";
}

/** Catalogue URL with every filter removed; sorting stays. */
export function clearFiltersHref(sp: SearchParams) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (k === "page" || v === undefined || (FILTER_KEYS as readonly string[]).includes(k)) continue;
    for (const item of Array.isArray(v) ? v : [v]) params.append(k, item);
  }
  const qs = params.toString();
  return qs ? `/produse?${qs}` : "/produse";
}

/** One removable chip per active filter, plus "Clear all" when there are several. */
export function ActiveFilters({ filters, sp, t, currency }: { filters: GameFilters; sp: SearchParams; t: Dictionary; currency: Currency }) {
  const c = t.catalog;
  const money = (v: number) => formatMoney(toMdl(v, currency), currency);
  const chips: { label: string; href: string }[] = [
    ...(filters.q ? [{ label: c.searchChip(filters.q), href: hrefWithout(sp, "q") }] : []),
    ...filters.genres.map((g) => ({ label: genreLabel(t.genres, g), href: hrefWithout(sp, "genre", g) })),
    ...filters.platforms.map((p) => ({ label: p, href: hrefWithout(sp, "platform", p) })),
    ...(filters.minPrice !== undefined ? [{ label: c.priceFromChip(money(filters.minPrice)), href: hrefWithout(sp, "minPrice") }] : []),
    ...(filters.maxPrice !== undefined ? [{ label: c.priceToChip(money(filters.maxPrice)), href: hrefWithout(sp, "maxPrice") }] : []),
    ...(filters.minRating !== undefined ? [{ label: c.ratingChip(filters.minRating), href: hrefWithout(sp, "minRating") }] : []),
    ...(filters.sale ? [{ label: c.offers, href: hrefWithout(sp, "sale") }] : []),
  ];
  if (chips.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <h2 className="sr-only">{c.activeFilters}</h2>
      <ul className="contents">
        {chips.map((chip) => (
          <li key={chip.href + chip.label}>
            <Link
              href={chip.href}
              scroll={false}
              aria-label={c.removeFilter(chip.label)}
              className="flex min-h-9 items-center gap-2 border border-iron bg-surface px-3 text-sm text-parchment transition-colors duration-200 hover:border-aged-gold hover:text-gold-light"
            >
              {chip.label}
              <X aria-hidden className="size-3.5 text-parchment-muted" />
            </Link>
          </li>
        ))}
      </ul>
      {chips.length > 1 && (
        <Link
          href={clearFiltersHref(sp)}
          scroll={false}
          className="min-h-9 px-2 py-2 font-display-ui text-[0.7rem] tracking-[0.16em] text-aged-gold underline-offset-4 hover:text-gold-light hover:underline"
        >
          {c.clearAll}
        </Link>
      )}
    </div>
  );
}
