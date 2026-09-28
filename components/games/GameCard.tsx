import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { genreLabel, platformShort } from "@/lib/catalog";
import { discountPercent, effectivePrice, formatRating, isOnSale } from "@/lib/format";
import { getDictionary } from "@/lib/i18n/server";
import type { GameCardData } from "@/types";
import { AddToCartButton } from "./AddToCartButton";
import { GameImage } from "./GameImage";
import { Price } from "./Price";

/** Catalogue card: 3:4 cover, details and an add-to-cart action. */
export async function GameCard({ game, priority }: { game: GameCardData; priority?: boolean }) {
  const t = await getDictionary();
  const onSale = isOnSale(game);
  return (
    <Card interactive className="flex h-full flex-col">
      <Link prefetch href={`/produse/${game.slug}`} className="relative block aspect-[3/4] overflow-hidden border-b border-iron">
        <GameImage
          src={game.coverImage}
          alt={t.game.coverAlt(game.title)}
          sizes="(min-width: 1536px) 340px, (min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
          priority={priority}
        />
        {onSale && (
          <Badge variant="blood" className="absolute top-3 left-3">
            -{discountPercent(game)}%
          </Badge>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-semibold tracking-[0.1em] uppercase">
          <Link prefetch href={`/produse/${game.slug}`} className="transition-colors duration-300 hover:text-aged-gold">
            {game.title}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-parchment-muted">{game.genres.map((g) => genreLabel(t.genres, g)).join(" / ")}</p>
        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span className="text-parchment-muted">
            <span className="sr-only">{t.game.ratingPrefix}</span>
            {formatRating(game.rating)}
          </span>
          {game.stock > 0 ? (
            <span className="text-parchment-muted">{t.game.inStock}</span>
          ) : (
            <span className="text-blood-text">{t.game.outOfStock}</span>
          )}
        </div>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t.game.platforms}>
          {game.platforms.map((p) => (
            <li key={p}>
              <Badge>{platformShort(p)}</Badge>
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-5">
          <Price game={game} className="mb-4 text-lg" />
          <AddToCartButton
            className="w-full"
            inStock={game.stock > 0}
            item={{ slug: game.slug, title: game.title, price: effectivePrice(game), coverImage: game.coverImage }}
          />
        </div>
      </div>
    </Card>
  );
}
