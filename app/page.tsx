import type { Metadata } from "next";
import { connection } from "next/server";
import { GameCard } from "@/components/games/GameCard";
import { CuratedPicks } from "@/components/home/CuratedPicks";
import { GenreTiles } from "@/components/home/GenreTiles";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { NewsCard } from "@/components/home/NewsCard";
import { NewsletterPanel } from "@/components/home/NewsletterPanel";
import { OfferCard } from "@/components/home/OfferCard";
import { WhyVault } from "@/components/home/WhyVault";
import { Carousel } from "@/components/games/Carousel";
import { FadeIn } from "@/components/ui/FadeIn";
import { OrnateDivider } from "@/components/ui/Ornaments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCollections, getHeroGames, getRecentReleases, getTrendingGames, getWeeklyOffers } from "@/lib/games";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: { absolute: t.meta.homeTitle }, alternates: { canonical: "/" } };
}

export default async function HomePage() {
  await connection();
  const t = await getDictionary();
  const h = t.home;
  // Each list has its own purpose, and a game appears in only one of them: the hero's featured games,
  // then the first row (sales-ranked "Trending now" once paid orders can rank it, the store's own picks
  // until then), then running sales, then games released in the last twelve months. The collections'
  // shelves never repeat a game and prefer games not shown above.
  const hero = await getHeroGames();
  const shown = hero.map((g) => g.slug);
  const first = await getTrendingGames(4, shown);
  const offers = await getWeeklyOffers(12, [...shown, ...first.games.map((g) => g.slug)]);
  const newest = await getRecentReleases(12, 12, [...shown, ...[...first.games, ...offers].map((g) => g.slug)]);
  const collections = await getCollections(4, [...shown, ...[...first.games, ...offers, ...newest].map((g) => g.slug)]);
  const FirstList = first.ranked ? "ol" : "ul";

  // The rhythm: a row of games, an editorial pause (the manifesto), the sales, the collections' ledgers
  // (a different shape), the new releases, then the genres to browse on.
  return (
    <>
      <div className="mx-auto max-w-page space-y-12 px-4 pt-8 sm:px-6 lg:px-8">
        <Hero />
        <WhyVault />

        {first.games.length > 0 && (
          <FadeIn>
            <section aria-labelledby={first.ranked ? "tendinte" : "alegerea-noastra"}>
              {first.ranked ? (
                <SectionHeading id="tendinte" eyebrow={h.trendingEyebrow} title={h.trending} subtitle={h.trendingSubtitle} href="/produse" linkLabel={t.common.seeAll} />
              ) : (
                <SectionHeading id="alegerea-noastra" eyebrow={h.picksEyebrow} title={h.picks} subtitle={h.picksSubtitle} href="/produse?sort=rating" linkLabel={t.common.seeAll} />
              )}
              <FirstList className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                {first.games.map((game, i) => (
                  <li key={game.id}>
                    <GameCard game={game} rank={first.ranked ? i + 1 : undefined} compact sizes="(min-width: 1024px) 24vw, 50vw" />
                  </li>
                ))}
              </FirstList>
            </section>
          </FadeIn>
        )}

        <FadeIn>
          <Manifesto />
        </FadeIn>

        {offers.length > 0 && (
          <FadeIn>
            <section aria-labelledby="oferte">
              <SectionHeading id="oferte" eyebrow={h.forgeEyebrow} title={h.offers} subtitle={h.offersSubtitle} href="/produse?sale=1" linkLabel={h.allOffers} />
              <Carousel className="max-w-[92%] sm:max-w-[calc(100%-6rem)] lg:max-w-[92%]" loop peek preloadNext>
                {offers.map((game) => (
                  <OfferCard key={game.id} game={game} />
                ))}
              </Carousel>
            </section>
          </FadeIn>
        )}

        {collections.length > 0 && (
          <FadeIn>
            <section aria-labelledby="colectii">
              <SectionHeading id="colectii" eyebrow={h.curatedEyebrow} title={h.curated} />
              <CuratedPicks collections={collections} />
            </section>
          </FadeIn>
        )}

        <OrnateDivider />

        {newest.length > 0 && (
          <FadeIn>
            <section aria-labelledby="noutati">
              <SectionHeading id="noutati" eyebrow={h.newsEyebrow} title={h.news} subtitle={h.newsSubtitle} href="/produse?released=1&sort=newest" linkLabel={t.common.seeAll} />
              <Carousel className="max-w-[92%] sm:max-w-[calc(100%-6rem)] lg:max-w-[92%]" loop peek preloadNext>
                {newest.map((game) => (
                  <NewsCard key={game.id} game={game} />
                ))}
              </Carousel>
            </section>
          </FadeIn>
        )}

        <FadeIn>
          <section aria-labelledby="genuri">
            <SectionHeading id="genuri" title={h.genres} />
            <GenreTiles />
          </section>
        </FadeIn>

        <FadeIn>
          <NewsletterPanel />
        </FadeIn>
      </div>
    </>
  );
}
