import type { Metadata } from "next";
import { ActiveFilters, clearFiltersHref } from "@/components/games/ActiveFilters";
import { Filters } from "@/components/games/Filters";
import { GameGrid } from "@/components/games/GameGrid";
import { SortSelect } from "@/components/games/SortSelect";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { SITE_NAME } from "@/lib/catalog";
import { catalogQuery, getPriceBounds, hasActiveOffers, parseFilters, searchCatalog } from "@/lib/games";
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
  // Always the first batch: further games are appended by "Load more" without page URLs
  // (an old ?page=N link simply opens the catalogue from the start; canonical stays /produse).
  const [{ games, total, pages }, t, offers, priceBounds] = await Promise.all([
    searchCatalog({ ...filters, page: 1 }, currency),
    getDictionary(),
    hasActiveOffers(),
    getPriceBounds(),
  ]);
  const c = t.catalog;
  // "Only discounted" with nothing on sale anywhere: say so, rather than blame the filters.
  const noOffers = filters.sale && !offers;

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
          <Filters filters={filters} priceBounds={priceBounds} total={total} />
        </div>
        <section aria-label={c.resultsAria}>
          <div className="mb-6 flex justify-end">
            <SortSelect value={filters.sort} />
          </div>
          <ActiveFilters filters={filters} sp={sp} t={t} currency={currency} />
          {games.length > 0 ? (
            <GameGrid games={games} pages={pages} query={catalogQuery(sp)} />
          ) : (
            <div className="border border-iron bg-surface px-6 py-16 text-center">
              <p className="font-display text-xl text-parchment">{noOffers ? c.noOffersTitle : c.emptyTitle}</p>
              <p className="mt-2 text-parchment-muted">{noOffers ? c.noOffersText : c.emptyText}</p>
              <ButtonLink href={clearFiltersHref(sp)} variant="ghost" className="mt-6">
                {c.clearFilters}
              </ButtonLink>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
