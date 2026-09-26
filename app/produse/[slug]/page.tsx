import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cache, type ReactNode } from "react";
import { AddToCartButton } from "@/components/games/AddToCartButton";
import { Gallery } from "@/components/games/Gallery";
import { GameCard } from "@/components/games/GameCard";
import { Price } from "@/components/games/Price";
import { Tabs } from "@/components/games/Tabs";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { genreLabel } from "@/lib/catalog";
import { discountPercent, effectivePrice, formatDate, formatRating, isOnSale } from "@/lib/format";
import { getGameBySlug, getSimilarGames } from "@/lib/games";

const loadGame = cache(getGameBySlug);

export async function generateMetadata({ params }: PageProps<"/produse/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const game = await loadGame(slug);
  if (!game) return { title: "Joc negăsit" };
  const description = game.description.split("\n")[0].slice(0, 160);
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

const REQUIREMENTS = [
  ["Sistem de operare", "Windows 10 / 11, 64-bit", "Windows 11, 64-bit"],
  ["Procesor", "Intel Core i5-8400 / AMD Ryzen 5 2600", "Intel Core i7-10700 / AMD Ryzen 7 3700X"],
  ["Memorie", "12 GB RAM", "16 GB RAM"],
  ["Placă video", "GTX 1060 6 GB / RX 580 8 GB", "RTX 3060 / RX 6700 XT"],
  ["Spațiu", "60 GB SSD", "60 GB SSD"],
] as const;

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4 border-b border-iron py-3 sm:grid-cols-[200px_1fr]">
      <dt className="font-display-ui text-[0.7rem] text-parchment-muted">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default async function GamePage({ params }: PageProps<"/produse/[slug]">) {
  const { slug } = await params;
  const game = await loadGame(slug);
  if (!game) notFound();
  const similar = await getSimilarGames(game.slug, game.genres);
  const onSale = isOnSale(game);
  const inStock = game.stock > 0;

  return (
    <article>
      <section className="relative isolate border-b border-iron">
        <Image src={game.screenshots[0] ?? game.coverImage} alt="" fill priority sizes="100vw" className="-z-10 object-cover saturate-[0.85]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-black/70" />
        <div className="mx-auto grid max-w-page gap-8 px-4 py-12 sm:px-6 md:grid-cols-[260px_1fr] md:items-end lg:px-8 lg:py-16">
          <div className="relative mx-auto aspect-[3/4] w-48 border border-iron shadow-lg shadow-black/50 md:w-full">
            <Image src={game.coverImage} alt={`Coperta jocului ${game.title}`} fill sizes="260px" className="object-cover saturate-[0.85]" />
          </div>
          <div>
            <p className="font-display-ui text-xs text-aged-gold">{game.genres.map(genreLabel).join(" / ")}</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-[0.12em] uppercase sm:text-5xl">{game.title}</h1>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Platforme">
              {game.platforms.map((p) => (
                <li key={p}>
                  <Badge className="text-parchment">{p}</Badge>
                </li>
              ))}
            </ul>
            <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
              <div>
                <dt className="font-display-ui text-[0.65rem] text-parchment-muted">Rating</dt>
                <dd className="text-xl">{formatRating(game.rating)}</dd>
              </div>
              <div>
                <dt className="font-display-ui text-[0.65rem] text-parchment-muted">Disponibilitate</dt>
                <dd className={inStock ? "text-xl" : "text-xl text-blood-text"}>{inStock ? "În stoc" : "Stoc epuizat"}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div>
                {onSale && (
                  <p className="mb-1 flex items-center gap-3 text-sm text-parchment-muted">
                    <Badge variant="blood">-{discountPercent(game)}%</Badge>
                    {game.discountEndsAt && <>Expiră la {formatDate(game.discountEndsAt)}</>}
                  </p>
                )}
                <Price game={game} className="text-2xl" />
              </div>
              <AddToCartButton
                size="md"
                label="Cumpără"
                inStock={inStock}
                item={{ slug: game.slug, title: game.title, price: effectivePrice(game), coverImage: game.coverImage }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-page space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        <section aria-labelledby="galerie">
          <SectionHeading id="galerie" title="Galerie" />
          <Gallery images={game.screenshots} title={game.title} />
        </section>

        <section aria-label="Informații" className="max-w-4xl">
          <Tabs
            tabs={[
              {
                label: "Descriere",
                content: (
                  <div className="space-y-5 text-lg">
                    {game.description.split("\n").filter(Boolean).map((p) => (
                      <p key={p.slice(0, 24)}>{p}</p>
                    ))}
                  </div>
                ),
              },
              {
                label: "Cerințe sistem",
                content: game.platforms.includes("PC") ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left text-base">
                      <thead>
                        <tr className="border-b border-iron font-display-ui text-[0.7rem] text-parchment-muted">
                          <th scope="col" className="py-3 pr-4 font-normal">Componentă</th>
                          <th scope="col" className="py-3 pr-4 font-normal">Minim</th>
                          <th scope="col" className="py-3 font-normal">Recomandat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {REQUIREMENTS.map(([name, min, rec]) => (
                          <tr key={name} className="border-b border-iron">
                            <th scope="row" className="py-3 pr-4 font-normal text-parchment-muted">{name}</th>
                            <td className="py-3 pr-4">{min}</td>
                            <td className="py-3">{rec}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-parchment-muted">Jocul este disponibil doar pe console. Nu are cerințe de sistem pentru PC.</p>
                ),
              },
              {
                label: "Detalii",
                content: (
                  <dl className="border-t border-iron">
                    <Detail label="Dezvoltator">{game.developer}</Detail>
                    <Detail label="Editor">{game.publisher}</Detail>
                    <Detail label="Data lansării">{formatDate(game.releaseDate)}</Detail>
                    <Detail label="Genuri">{game.genres.map(genreLabel).join(", ")}</Detail>
                    <Detail label="Platforme">{game.platforms.join(", ")}</Detail>
                  </dl>
                ),
              },
            ]}
          />
        </section>

        {similar.length > 0 && (
          <section aria-labelledby="asemanatoare">
            <SectionHeading id="asemanatoare" title="Jocuri asemănătoare" href={`/produse?genre=${encodeURIComponent(game.genres[0])}`} />
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similar.map((g) => (
                <li key={g.id}>
                  <GameCard game={g} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
