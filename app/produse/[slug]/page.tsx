import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache, type ReactNode } from "react";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { Gallery } from "@/components/games/Gallery";
import { Carousel } from "@/components/games/Carousel";
import { GameCard } from "@/components/games/GameCard";
import { PurchasePanel, type PanelOffer } from "@/components/games/PurchasePanel";
import { SystemRequirements } from "@/components/games/SystemRequirements";
import { Tabs } from "@/components/games/Tabs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { genreLabel, SITE_NAME } from "@/lib/catalog";
import { discountPercent, effectivePrice, formatDate, formatRating, isOnSale } from "@/lib/format";
import { getGameBySlug, getSimilarGames } from "@/lib/games";
import { galleryImages } from "@/lib/gallery";
import { gameOffers } from "@/lib/offers";
import { LOCALE_NAMES } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/localized-text";

const loadGame = cache(getGameBySlug);
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: PageProps<"/produse/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const game = await loadGame(slug);
  const { locale, t } = await getI18n();
  if (!game) return { title: t.meta.gameNotFound };
  const description = pickLocalized(game.description, locale)?.text.split("\n")[0].slice(0, 160);
  return {
    title: game.title,
    description,
    alternates: { canonical: `/produse/${game.slug}` },
    openGraph: {
      title: game.title,
      description,
      url: `/produse/${game.slug}`,
      images: [{ url: game.screenshots[0] ?? game.coverImage, width: 1280, height: 720, alt: game.title }],
    },
  };
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[150px_1fr] items-baseline gap-4 border-b border-iron py-4 text-[1.2rem] sm:grid-cols-[240px_1fr] sm:text-[1.3rem]">
      <dt className="font-display-ui text-[0.8rem] text-parchment-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default async function GamePage({ params }: PageProps<"/produse/[slug]">) {
  const { slug } = await params;
  const game = await loadGame(slug);
  if (!game) notFound();
  const { locale, t } = await getI18n();
  const g = t.game;
  const description = pickLocalized(game.description, locale);
  const [similar, gallery] = await Promise.all([getSimilarGames(game.slug, game.genres, 12), galleryImages(game.slug, game.screenshots)]);
  const now = new Date();
  const offers = gameOffers(game);
  const inStock = offers.some((o) => o.stock > 0);
  const panelOffers: PanelOffer[] = offers.map((o) => {
    const sale = isOnSale(o, now);
    return {
      platform: o.platform,
      edition: o.edition,
      activation: o.activation,
      region: o.region,
      inStock: o.stock > 0,
      price: effectivePrice(o, now),
      oldPrice: sale ? o.price : null,
      percent: sale ? discountPercent(o) : 0,
      saleEnds: sale && o.discountEndsAt ? formatDate(o.discountEndsAt, locale) : null,
    };
  });
  const prices = panelOffers.map((o) => o.price);

  // Product structured data. Prices are listed in MDL, the store's base currency. No aggregateRating:
  // the rating is the store's own score, not an average of customer reviews.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: game.title,
    image: [game.coverImage, ...game.screenshots.slice(0, 3)].map((src) => new URL(src, SITE_URL).href),
    description: description?.text.split("\n")[0],
    category: game.genres.join(", "),
    brand: { "@type": "Brand", name: game.publisher },
    offers: {
      "@type": "AggregateOffer",
      url: new URL(`/produse/${game.slug}`, SITE_URL).href,
      priceCurrency: "MDL",
      lowPrice: Math.min(...prices).toFixed(2),
      highPrice: Math.max(...prices).toFixed(2),
      offerCount: panelOffers.length,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // Escape "<" so a title can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="relative isolate border-b border-iron">
        <Image src={game.screenshots[0] ?? game.coverImage} alt="" fill priority sizes="100vw" className="-z-10 object-cover saturate-[0.85]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/70" />
        {/* Phones: title and rating, then the cover, then the purchase card. From md: cover on the left. */}
        <div className="mx-auto grid max-w-page gap-8 px-4 py-10 sm:px-6 md:grid-cols-[260px_1fr] md:gap-x-10 lg:px-8 lg:py-14">
          <header className="md:col-start-2">
            <Breadcrumbs
              label={t.common.breadcrumbs}
              className="mb-5"
              items={[{ label: t.nav.home, href: "/" }, { label: t.nav.products, href: "/produse" }, { label: game.title }]}
            />
            <p className="font-display-ui text-xs text-aged-gold">{game.genres.map((x) => genreLabel(t.genres, x)).join(" / ")}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-[0.12em] uppercase sm:text-5xl">{game.title}</h1>
            <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-3">
              {game.rating !== null && (
                <div>
                  <dt className="font-display-ui text-[0.65rem] text-parchment-muted">{g.ratingSource}</dt>
                  <dd className="text-xl">{formatRating(game.rating)}</dd>
                </div>
              )}
              <div>
                <dt className="font-display-ui text-[0.65rem] text-parchment-muted">{g.availability}</dt>
                <dd className={inStock ? "text-xl text-stock-in" : "text-xl text-stock-out"}>{inStock ? g.inStock : g.outOfStock}</dd>
              </div>
            </dl>
          </header>
          <div className="relative mx-auto aspect-[3/4] w-48 border border-iron shadow-lg shadow-black/50 md:col-start-1 md:row-span-2 md:row-start-1 md:w-full md:self-start">
            <Image src={game.pageCoverImage ?? game.coverImage} alt={g.coverAlt(game.title)} fill sizes="(min-width: 768px) 260px, 192px" className="object-cover saturate-[0.85]" />
            <FavoriteButton slug={game.slug} title={game.title} />
          </div>
          <div className="md:col-start-2 md:max-w-xl">
            <PurchasePanel game={{ slug: game.slug, title: game.title, coverImage: game.coverImage }} offers={panelOffers} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-page space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        {gallery.length > 0 && (
          <section aria-labelledby="galerie">
            <SectionHeading id="galerie" title={g.gallery} />
            <Gallery images={gallery} title={game.title} />
          </section>
        )}

        <section aria-label={g.infoAria} className="max-w-4xl">
          <Tabs
            label={g.tabsAria}
            tabs={[
              {
                label: g.description,
                content: (
                  <div className="space-y-6 text-[1.25rem] leading-[1.75] text-parchment sm:text-[1.35rem]">
                    {description && description.locale !== locale && (
                      <p className="text-sm text-parchment-muted italic">{g.descriptionFallback(LOCALE_NAMES[description.locale])}</p>
                    )}
                    {description ? (
                      description.text
                        .split("\n")
                        .filter(Boolean)
                        .map((p) => <p key={p.slice(0, 24)}>{p}</p>)
                    ) : (
                      <p className="text-parchment-muted">{g.descriptionEmpty}</p>
                    )}
                  </div>
                ),
              },
              {
                label: g.requirements,
                content: <SystemRequirements requirements={game.systemRequirements} onPc={offers.some((o) => o.platform === "PC")} t={g} />,
              },
              {
                label: g.details,
                content: (
                  <dl className="border-t border-iron">
                    <Detail label={g.developer}>{game.developer}</Detail>
                    <Detail label={g.publisher}>{game.publisher}</Detail>
                    <Detail label={g.releaseDate}>{formatDate(game.releaseDate, locale)}</Detail>
                    <Detail label={g.genres}>{game.genres.map((x) => genreLabel(t.genres, x)).join(", ")}</Detail>
                    <Detail label={g.platforms}>{offers.map((o) => o.platform).join(", ")}</Detail>
                  </dl>
                ),
              },
            ]}
          />
        </section>

        {similar.length > 0 && (
          <section aria-labelledby="asemanatoare">
            <SectionHeading id="asemanatoare" title={g.similar} linkLabel={t.common.seeAll} href={`/produse?genre=${encodeURIComponent(game.genres[0])}`} />
            {/* Slightly narrower than the page; side arrows move through the list. */}
            <Carousel mobileArrows className="max-w-[calc(100%-5rem)] sm:max-w-[88%]">
              {similar.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </Carousel>
          </section>
        )}
      </div>
    </article>
  );
}
