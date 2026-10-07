import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache, type ReactNode } from "react";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { Gallery } from "@/components/games/Gallery";
import { Carousel } from "@/components/games/Carousel";
import { GameCard, SIMILAR_CARD_SIZES } from "@/components/games/GameCard";
import { PurchasePanel } from "@/components/games/PurchasePanel";
import { StickyPurchaseBar } from "@/components/games/StickyPurchaseBar";
import { SystemRequirements } from "@/components/games/SystemRequirements";
import { Tabs } from "@/components/games/Tabs";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { genreLabel, SITE_NAME } from "@/lib/catalog";
import { formatDate, formatRating } from "@/lib/format";
import { getGameBySlug, getSimilarGames } from "@/lib/games";
import { galleryImages } from "@/lib/gallery";
import { gameOffers } from "@/lib/offers";
import { purchaseOptions, type PanelOffer } from "@/lib/purchase";
import { LOCALE_NAMES } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/localized-text";
import { absoluteUrl } from "@/lib/site";

const loadGame = cache(getGameBySlug);

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
  // The gallery is worth showing only with real screenshots: the key art alone is already the
  // page background (and the cover is beside it).
  const keyArt = game.screenshots[0] ?? game.coverImage;
  const hasScreenshots = gallery.some((src) => src !== keyArt && src !== game.coverImage && src !== game.pageCoverImage);
  const now = new Date();
  const offers = gameOffers(game);
  const inStock = offers.some((o) => o.stock > 0);
  // Same versions and prices as the home cards' "Add to cart" (lib/purchase.ts).
  const panelOffers: PanelOffer[] = purchaseOptions(game, locale, now);
  const prices = panelOffers.map((o) => o.price);

  // Product structured data. Prices are listed in MDL, the store's base currency. No aggregateRating:
  // the rating is the store's own score, not an average of customer reviews.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: game.title,
    image: [game.coverImage, ...game.screenshots.slice(0, 3)].map(absoluteUrl),
    description: description?.text.split("\n")[0],
    category: game.genres.join(", "),
    brand: { "@type": "Brand", name: game.publisher },
    offers: {
      "@type": "AggregateOffer",
      url: absoluteUrl(`/produse/${game.slug}`),
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
      <section className="relative isolate overflow-hidden border-b border-iron">
        {/* The key art sets the mood without competing with the text: softened (its logo becomes a
            shape, not letters) and darkened by a flat layer. */}
        <Image
          src={game.screenshots[0] ?? game.coverImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 scale-110 object-cover blur-[8px] saturate-[0.85]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/75" />
        {/* Phones: title, then the cover beside rating and availability, then the purchase card, so the
            price and button sit near the top. From md: cover on the left, everything else beside it. From
            lg: three columns, the purchase card on the right the full height of the cover (the page's main
            object), the game's identity and its facts between them. */}
        <div className="mx-auto grid max-w-page grid-cols-[8rem_1fr] items-start gap-x-5 gap-y-6 px-4 py-8 sm:grid-cols-[10rem_1fr] sm:px-6 sm:py-10 md:grid-cols-[260px_1fr] md:gap-x-10 lg:grid-cols-[260px_minmax(0,1fr)_minmax(22rem,26rem)] lg:grid-rows-[auto_auto_1fr] lg:px-8 lg:py-14">
          <header className="col-span-2 md:col-span-1 md:col-start-2 md:row-start-1">
            <Breadcrumbs
              label={t.common.breadcrumbs}
              className="mb-5"
              items={[{ label: t.nav.home, href: "/" }, { label: t.nav.products, href: "/produse" }, { label: game.title }]}
            />
            <p className="font-display-ui text-xs text-aged-gold">{game.genres.map((x) => genreLabel(t.genres, x)).join(" / ")}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-[0.12em] uppercase sm:text-5xl">{game.title}</h1>
          </header>
          <div className="relative col-start-1 row-start-2 aspect-[3/4] w-full border border-iron shadow-lg shadow-black/50 md:row-span-3 md:row-start-1">
            <Image src={game.pageCoverImage ?? game.coverImage} alt={g.coverAlt(game.title)} fill sizes="(min-width: 768px) 260px, (min-width: 640px) 160px, 128px" className="object-cover saturate-[0.85]" />
            {/* Below md the cover is only 128-160px wide and official covers put the title at the top, so the
                star shrinks (26px disc, 18px star) into the very corner; the 44px hit area stays and reaches
                6px past the corner into the gap around the cover. Unchanged from md up. */}
            <FavoriteButton
              slug={game.slug}
              title={game.title}
              className="max-md:-top-1.5 max-md:-right-1.5 max-md:before:size-[26px] max-md:[&>svg]:size-[18px]"
            />
          </div>
          <dl className="col-start-2 row-start-2 flex flex-col gap-4 self-center md:row-start-2 md:-mt-2 md:flex-row md:flex-wrap md:gap-x-10 md:gap-y-3 md:self-start">
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
          {/* From lg, under the rating: who made it, when, and for what (the same facts as the Details tab). */}
          <dl className="hidden self-start border-t border-iron/70 pt-5 text-sm lg:col-start-2 lg:row-start-3 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-4">
            {[
              [g.developer, game.developer],
              [g.publisher, game.publisher],
              [g.releaseDate, formatDate(game.releaseDate, locale)],
              [g.platforms, [...new Set(offers.map((o) => o.platform))].join(", ")],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-display-ui text-[0.65rem] text-parchment-muted">{label}</dt>
                <dd className="mt-1 text-base text-parchment">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="col-span-2 md:col-span-1 md:col-start-2 md:row-start-3 md:max-w-xl lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:max-w-none">
            <PurchasePanel game={{ slug: game.slug, title: game.title, coverImage: game.coverImage }} offers={panelOffers} />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-page space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        {hasScreenshots && (
          <section aria-labelledby="galerie">
            <SectionHeading id="galerie" title={g.gallery} />
            <Gallery images={gallery} title={game.title} />
          </section>
        )}

        {/* A solid surface keeps the long text legible over the lit edges of the background art. */}
        <section aria-label={g.infoAria} className="max-w-4xl border border-iron bg-surface/90 px-5 py-2 sm:px-8 sm:py-4">
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
                <GameCard key={g.id} game={g} sizes={SIMILAR_CARD_SIZES} />
              ))}
            </Carousel>
          </section>
        )}
      </div>
      <StickyPurchaseBar game={{ slug: game.slug, title: game.title, coverImage: game.coverImage }} offers={panelOffers} />
    </article>
  );
}
