import type { Metadata } from "next";
import { connection } from "next/server";
import { FeaturedCard } from "@/components/home/FeaturedCard";
import { GenreTiles } from "@/components/home/GenreTiles";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { NewsCard } from "@/components/home/NewsCard";
import { NewsletterPanel } from "@/components/home/NewsletterPanel";
import { OfferCard } from "@/components/home/OfferCard";
import { Carousel } from "@/components/games/Carousel";
import { FadeIn } from "@/components/ui/FadeIn";
import { OrnateDivider } from "@/components/ui/Ornaments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedGames, getNewestGames, getWeeklyOffers } from "@/lib/games";
import { getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: { absolute: t.meta.homeTitle }, alternates: { canonical: "/" } };
}

export default async function HomePage() {
  await connection();
  const t = await getDictionary();
  const [featured, offers, newest] = await Promise.all([getFeaturedGames(), getWeeklyOffers(12), getNewestGames(12)]);

  return (
    <>
      <div className="mx-auto max-w-page space-y-12 px-4 pt-8 sm:px-6 lg:px-8">
        <Hero />
        <FadeIn>
          <section aria-labelledby="recomandate">
            <SectionHeading id="recomandate" title={t.home.featured} href="/produse" linkLabel={t.common.seeAll} />
            <ul className="grid gap-6 md:grid-cols-3">
              {featured.map((game) => (
                <li key={game.id}>
                  <FeaturedCard game={game} />
                </li>
              ))}
            </ul>
          </section>
        </FadeIn>

        <OrnateDivider />

        {offers.length > 0 && (
          <FadeIn>
            <section aria-labelledby="oferte">
              <SectionHeading id="oferte" title={t.home.offers} href="/produse?sale=1" linkLabel={t.home.allOffers} />
              <Carousel className="max-w-[92%]" loop>
                {offers.map((game) => (
                  <OfferCard key={game.id} game={game} />
                ))}
              </Carousel>
            </section>
          </FadeIn>
        )}

        <FadeIn>
          <section aria-labelledby="genuri">
            <SectionHeading id="genuri" title={t.home.genres} />
            <GenreTiles />
          </section>
        </FadeIn>

        <FadeIn>
          <section aria-labelledby="noutati">
            <SectionHeading id="noutati" title={t.home.news} href="/produse?sort=newest" linkLabel={t.common.seeAll} />
            <Carousel className="max-w-[92%]" loop>
              {newest.map((game) => (
                <NewsCard key={game.id} game={game} />
              ))}
            </Carousel>
          </section>
        </FadeIn>

        <FadeIn>
          <Manifesto />
        </FadeIn>

        <FadeIn>
          <NewsletterPanel />
        </FadeIn>
      </div>
    </>
  );
}
