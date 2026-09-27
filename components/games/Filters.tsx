"use client";

import Form from "next/form";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { GENRES, PLATFORMS, genreLabel } from "@/lib/catalog";
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
  const { t } = useI18n();
  const c = t.catalog;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setOpen(true)} aria-controls="filtre" aria-expanded={open}>
        <SlidersHorizontal aria-hidden className="size-4" />
        {c.filters}
      </Button>

      <aside
        id="filtre"
        aria-label={c.filters}
        className={cn(
          open ? "fixed inset-0 z-50 block overflow-y-auto bg-base px-6 py-6" : "hidden",
          "lg:static lg:z-auto lg:block lg:overflow-visible lg:bg-transparent lg:p-0",
        )}
      >
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <p className="font-display text-xl tracking-[0.15em] uppercase">{c.filters}</p>
          <button type="button" aria-label={c.closeFilters} onClick={() => setOpen(false)} className="text-parchment-muted">
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

          <Group title={c.price}>
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
              {c.reset}
            </Link>
          </div>
        </Form>
      </aside>
    </>
  );
}
