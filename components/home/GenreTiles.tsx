import Image from "next/image";
import Link from "next/link";
import { GENRES, genreLabel } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

/** Real artwork per genre; genres not listed keep the generated placeholder. */
const GENRE_ART: Partial<Record<string, string>> = {
  action: "/images/genres/action-v2.jpg",
  rpg: "/images/genres/rpg-v2.jpg",
  strategy: "/images/genres/strategy-v2.jpg",
  horror: "/images/genres/horror-v2.jpg",
  "souls-like": "/images/genres/souls-like-v2.jpg",
};

export async function GenreTiles() {
  const t = await getDictionary();
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {GENRES.map((genre) => {
        const art = GENRE_ART[genre.slug];
        return (
          <li key={genre.slug}>
            <Link
              href={`/produse?genre=${encodeURIComponent(genre.name)}`}
              className="group relative block aspect-[3/2] border border-gold-dark glow-gold transition-colors duration-300 hover:border-gold-light"
            >
              <span className="absolute inset-0 overflow-hidden">
                {/* Real art keeps its colour and only a light shade for the label; placeholders stay muted. */}
                <Image
                  src={art ?? `/images/genres/${genre.slug}.jpg`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                  className={cn(
                    "object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100",
                    !art && "saturate-50",
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-0",
                    art ? "bg-black/25" : "bg-black/45",
                  )}
                />
              </span>
              <span className="absolute inset-x-0 bottom-0 pb-4 text-center font-display text-sm font-semibold tracking-[0.15em] text-parchment uppercase transition-colors duration-300 group-hover:text-aged-gold">
                {genreLabel(t.genres, genre.name)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
