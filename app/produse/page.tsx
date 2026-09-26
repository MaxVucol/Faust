import type { Metadata } from "next";
import { Filters } from "@/components/games/Filters";
import { GameGrid } from "@/components/games/GameGrid";
import { Pagination } from "@/components/games/Pagination";
import { SortSelect } from "@/components/games/SortSelect";
import { Divider } from "@/components/ui/Divider";
import { parseFilters, searchGames } from "@/lib/games";

export const metadata: Metadata = {
  title: "Produse",
  description: "Catalogul complet: jocuri de acțiune, RPG, strategie, horror, souls-like și aventură pentru PC și console.",
  alternates: { canonical: "/produse" },
  openGraph: { title: "Produse — The Iron Vault", url: "/produse" },
};

function resultsLabel(n: number) {
  if (n === 1) return "1 joc";
  return n % 100 >= 1 && n % 100 <= 19 ? `${n} jocuri` : `${n} de jocuri`;
}

export default async function ProductsPage({ searchParams }: PageProps<"/produse">) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const { games, total, pages } = await searchGames(filters);

  return (
    <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-[0.15em] uppercase sm:text-4xl">Produse</h1>
        <p className="mt-2 text-parchment-muted">
          {filters.q ? (
            <>
              {resultsLabel(total)} pentru „{filters.q}”
            </>
          ) : (
            resultsLabel(total)
          )}
        </p>
      </header>
      <Divider double className="mb-10" />

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <div>
          <Filters filters={filters} />
        </div>
        <section aria-label="Rezultate">
          <div className="mb-6 flex justify-end">
            <SortSelect value={filters.sort} />
          </div>
          {games.length > 0 ? (
            <GameGrid games={games} />
          ) : (
            <p className="border border-iron bg-surface px-6 py-16 text-center text-parchment-muted">
              Niciun joc nu corespunde căutării.
            </p>
          )}
          <Pagination page={filters.page} pages={pages} searchParams={sp} />
        </section>
      </div>
    </div>
  );
}
