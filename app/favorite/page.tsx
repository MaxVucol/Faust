import type { Metadata } from "next";
import { FavoritesGrid } from "@/components/favorites/FavoritesGrid";
import { GameCard } from "@/components/games/GameCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { getFavorites } from "@/lib/favorites-server";
import { cardSelect } from "@/lib/games";
import { getDictionary } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  // Personal list: nothing for search engines here.
  return { title: t.favorites.title, robots: { index: false } };
}

export default async function FavoritesPage() {
  const [t, slugs] = await Promise.all([getDictionary(), getFavorites()]);
  const f = t.favorites;
  const found = slugs.length ? await prisma.game.findMany({ where: { slug: { in: slugs } }, select: cardSelect }) : [];
  // Most recently starred first (the cookie keeps that order).
  const games = slugs.flatMap((slug) => found.filter((g) => g.slug === slug));

  return (
    <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumbs label={t.common.breadcrumbs} className="mb-6" items={[{ label: t.nav.home, href: "/" }, { label: f.title }]} />
      <h1 className="font-display text-3xl font-semibold tracking-[0.15em] uppercase sm:text-4xl">{f.title}</h1>
      <p className="mt-2 text-parchment-muted">{f.intro}</p>
      <Divider double className="my-10" />
      <FavoritesGrid
        items={games.map((game, i) => ({ slug: game.slug, card: <GameCard game={game} priority={i < 3} /> }))}
        empty={
          <div className="border border-iron bg-surface px-6 py-16 text-center">
            <p className="font-display text-xl text-parchment">{f.emptyTitle}</p>
            <p className="mt-2 text-parchment-muted">{f.emptyText}</p>
            <ButtonLink href="/produse" className="mt-6">
              {f.browse}
            </ButtonLink>
          </div>
        }
      />
    </div>
  );
}
