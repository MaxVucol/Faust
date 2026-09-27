import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache, type ReactNode } from "react";
import { AddToCartButton } from "@/components/games/AddToCartButton";
import { Gallery } from "@/components/games/Gallery";
import { Carousel } from "@/components/games/Carousel";
import { GameCard } from "@/components/games/GameCard";
import { Price } from "@/components/games/Price";
import { Tabs } from "@/components/games/Tabs";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { genreLabel } from "@/lib/catalog";
import { discountPercent, effectivePrice, formatDate, formatRating, isOnSale } from "@/lib/format";
import { getGameBySlug, getSimilarGames } from "@/lib/games";
import { LOCALE_NAMES } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { pickLocalized } from "@/lib/localized-text";

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

/** Minimum / recommended values; row names come from t.game.requirementRows in the same order. */
const REQUIREMENTS = [
  ["Windows 10 / 11, 64-bit", "Windows 11, 64-bit"],
  ["Intel Core i5-8400 / AMD Ryzen 5 2600", "Intel Core i7-10700 / AMD Ryzen 7 3700X"],
  ["12 GB RAM", "16 GB RAM"],
  ["GTX 1060 6 GB / RX 580 8 GB", "RTX 3060 / RX 6700 XT"],
  ["60 GB SSD", "60 GB SSD"],
] as const;

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
  const similar = await getSimilarGames(game.slug, game.genres, 12);
  const onSale = isOnSale(game);
  const inStock = game.stock > 0;

  return (
    <article>
      <section className="relative isolate border-b border-iron">
        <Image src={game.screenshots[0] ?? game.coverImage} alt="" fill priority sizes="100vw" className="-z-10 object-cover saturate-[0.85]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/70" />
        <div className="mx-auto grid max-w-page gap-8 px-4 py-12 sm:px-6 md:grid-cols-[260px_1fr] md:items-end lg:px-8 lg:py-16">
          <div className="relative mx-auto aspect-[3/4] w-48 border border-iron shadow-lg shadow-black/50 md:w-full">
            <Image src={game.pageCoverImage ?? game.coverImage} alt={g.coverAlt(game.title)} fill sizes="260px" className="object-cover saturate-[0.85]" />
          </div>
          <div>
            <p className="font-display-ui text-xs text-aged-gold">{game.genres.map((x) => genreLabel(t.genres, x)).join(" / ")}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-[0.12em] uppercase sm:text-5xl">{game.title}</h1>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={g.platforms}>
              {game.platforms.map((p) => (
                <li key={p}>
                  {/* ! overrides the outline variant's muted colours (cn does not merge conflicting classes). */}
                  <Badge className="border-[#f2ead8]! bg-black/30 text-[#f7f1e4]!">{p}</Badge>
                </li>
              ))}
            </ul>
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
              <div>
                <dt className="font-display-ui text-[0.65rem] text-parchment-muted">{g.rating}</dt>
                <dd className="text-xl">{formatRating(game.rating)}</dd>
              </div>
              <div>
                <dt className="font-display-ui text-[0.65rem] text-parchment-muted">{g.availability}</dt>
                <dd className={inStock ? "text-xl text-stock-in" : "text-xl text-stock-out"}>{inStock ? g.inStock : g.outOfStock}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div>
                {onSale && (
                  <p className="mb-1 flex items-center gap-3 text-sm text-parchment-muted">
                    <Badge variant="blood">-{discountPercent(game)}%</Badge>
                    {game.discountEndsAt && g.expires(formatDate(game.discountEndsAt, locale))}
                  </p>
                )}
                <Price game={game} className="text-2xl" />
              </div>
              <AddToCartButton
                size="md"
                label={g.buy}
                inStock={inStock}
                item={{ slug: game.slug, title: game.title, price: effectivePrice(game), coverImage: game.coverImage }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-page space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        <section aria-labelledby="galerie">
          <SectionHeading id="galerie" title={g.gallery} />
          <Gallery images={game.screenshots} title={game.title} />
        </section>

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
                content: game.platforms.includes("PC") ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-[1.15rem] sm:text-[1.25rem]">
                      <thead>
                        <tr className="border-b border-iron font-display-ui text-[0.8rem] text-parchment-muted">
                          <th scope="col" className="py-4 pr-5 font-normal">{g.component}</th>
                          <th scope="col" className="py-4 pr-5 font-normal">{g.minimum}</th>
                          <th scope="col" className="py-4 font-normal">{g.recommended}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {REQUIREMENTS.map(([min, rec], i) => (
                          <tr key={g.requirementRows[i]} className="border-b border-iron">
                            <th scope="row" className="py-4 pr-5 font-normal text-parchment-muted">{g.requirementRows[i]}</th>
                            <td className="py-4 pr-5">{min}</td>
                            <td className="py-4">{rec}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-parchment-muted">{g.consoleOnly}</p>
                ),
              },
              {
                label: g.details,
                content: (
                  <dl className="border-t border-iron">
                    <Detail label={g.developer}>{game.developer}</Detail>
                    <Detail label={g.publisher}>{game.publisher}</Detail>
                    <Detail label={g.releaseDate}>{formatDate(game.releaseDate, locale)}</Detail>
                    <Detail label={g.genres}>{game.genres.map((x) => genreLabel(t.genres, x)).join(", ")}</Detail>
                    <Detail label={g.platforms}>{game.platforms.join(", ")}</Detail>
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
            <Carousel>
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
