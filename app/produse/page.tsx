import type { Metadata } from "next";
import { Filters } from "@/components/games/Filters";
import { GameGrid } from "@/components/games/GameGrid";
import { Pagination } from "@/components/games/Pagination";
import { SortSelect } from "@/components/games/SortSelect";
import { Divider } from "@/components/ui/Divider";
import { SITE_NAME } from "@/lib/catalog";
import { parseFilters, searchGames } from "@/lib/games";
import { toMdl } from "@/lib/currency";
import { getCurrency, getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return {
    title: t.catalog.title,
    description: t.meta.productsDescription,
    alternates: { canonical: "/produse" },
    openGraph: { title: `${t.catalog.title} — ${SITE_NAME}`, url: "/produse" },
  };
}

export default async function ProductsPage({ searchParams }: PageProps<"/produse">) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const currency = await getCurrency();
  // Filter inputs are shown in the selected currency; prices are stored in MDL.
  const inMdl = (v: number | undefined) => (v === undefined ? undefined : toMdl(v, currency));
  const [{ games, total, pages }, t] = await Promise.all([
    searchGames({ ...filters, minPrice: inMdl(filters.minPrice), maxPrice: inMdl(filters.maxPrice) }),
    getDictionary(),
  ]);
  const c = t.catalog;

  return (
    <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-[0.15em] uppercase sm:text-4xl">{c.title}</h1>
        <p className="mt-2 text-parchment-muted">
          {filters.q ? c.resultsFor(c.results(total), filters.q) : c.results(total)}
        </p>
      </header>
      <Divider double className="mb-10" />

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <div>
          <Filters filters={filters} />
        </div>
        <section aria-label={c.resultsAria}>
          <div className="mb-6 flex justify-end">
            <SortSelect value={filters.sort} />
          </div>
          {games.length > 0 ? (
            <GameGrid games={games} />
          ) : (
            <p className="border border-iron bg-surface px-6 py-16 text-center text-parchment-muted">
              {c.empty}
            </p>
          )}
          <Pagination page={filters.page} pages={pages} searchParams={sp} />
        </section>
      </div>
    </div>
  );
}
