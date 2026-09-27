import Link from "next/link";
import type { SearchParams } from "@/lib/games";
import { getDictionary } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

function hrefFor(sp: SearchParams, page: number): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (key === "page" || value === undefined) continue;
    for (const v of Array.isArray(value) ? value : [value]) params.append(key, v);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/produse?${qs}` : "/produse";
}

export async function Pagination({ page, pages, searchParams }: { page: number; pages: number; searchParams: SearchParams }) {
  if (pages <= 1) return null;
  const t = await getDictionary();
  const cell = "flex size-10 items-center justify-center border font-display text-sm transition-colors duration-300";
  return (
    <nav aria-label={t.catalog.pagination} className="mt-12">
      <ul className="flex flex-wrap justify-center gap-2">
        {page > 1 && (
          <li>
            <Link href={hrefFor(searchParams, page - 1)} className={cn(cell, "w-auto px-4 border-iron hover:border-aged-gold")}>
              {t.catalog.prev}
            </Link>
          </li>
        )}
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            <Link
              href={hrefFor(searchParams, n)}
              aria-current={n === page ? "page" : undefined}
              aria-label={t.catalog.page(n)}
              className={cn(cell, n === page ? "border-aged-gold text-aged-gold" : "border-iron text-parchment-muted hover:text-parchment")}
            >
              {n}
            </Link>
          </li>
        ))}
        {page < pages && (
          <li>
            <Link href={hrefFor(searchParams, page + 1)} className={cn(cell, "w-auto px-4 border-iron hover:border-aged-gold")}>
              {t.catalog.next}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
