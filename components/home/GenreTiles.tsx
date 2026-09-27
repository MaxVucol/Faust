import Image from "next/image";
import Link from "next/link";
import { GENRES, genreLabel } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n/server";

export async function GenreTiles() {
  const t = await getDictionary();
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {GENRES.map((genre) => (
        <li key={genre.slug}>
          <Link
            href={`/produse?genre=${encodeURIComponent(genre.name)}`}
            className="group relative block aspect-[3/2] border border-gold-dark glow-gold transition-colors duration-300 hover:border-gold-light"
          >
            <span className="absolute inset-0 overflow-hidden">
              <Image src={`/images/genres/${genre.slug}.jpg`} alt="" fill sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw" className="object-cover saturate-50" />
              <span aria-hidden className="absolute inset-0 bg-black/45" />
            </span>
            <span className="absolute inset-x-0 bottom-0 pb-4 text-center font-display text-sm font-semibold tracking-[0.15em] text-parchment uppercase transition-colors duration-300 group-hover:text-aged-gold">
              {genreLabel(t.genres, genre.name)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
