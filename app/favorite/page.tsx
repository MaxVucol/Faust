import type { Metadata } from "next";
import { FavoritesGrid } from "@/components/favorites/FavoritesGrid";
import { GameCard } from "@/components/games/GameCard";
import { Heart } from "lucide-react";
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
          <div className="flex flex-col items-center border border-iron bg-[#0d0b09] px-6 py-16 text-center">
            <span aria-hidden className="flex size-16 items-center justify-center border border-gold-dark/70 bg-[#100d0a]">
              <Heart className="size-7 text-gold-light" strokeWidth={1.5} />
            </span>
            <p className="mt-6 font-display text-xl tracking-[0.12em] text-parchment uppercase">{f.emptyTitle}</p>
            <p className="mt-2 text-parchment-muted">{f.emptyText}</p>
            <ButtonLink href="/produse" variant="gold" className="mt-8">
              {f.browse}
            </ButtonLink>
          </div>
        }
      />
    </div>
  );
}
