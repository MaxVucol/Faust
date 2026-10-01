"use client";

import { Star } from "lucide-react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { useFavorites } from "./FavoritesProvider";

/**
 * Wishlist star for the top-right corner of a game cover. Place it as a sibling of the card's link
 * (never inside it), in a `relative` box, so a tap only toggles the star.
 *
 * Off: near-white outline; a solid, half-transparent dark disc behind it (no gradient, no glow) and a
 * faint drop shadow keep it readable on light and dark covers alike. On: filled in the site's light
 * gold. The hit area is 44px; the star itself is 26px on a 38px disc.
 */
export function FavoriteButton({ slug, title, className }: { slug: string; title: string; className?: string }) {
  const { t } = useI18n();
  const { has, toggle } = useFavorites();
  const active = has(slug);
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? t.favorites.remove(title) : t.favorites.add(title)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={cn(
        "group/fav absolute top-1 right-1 z-10 flex size-11 items-center justify-center outline-none",
        // A plain dark disc under the star: contrast on bright art, barely visible on dark art.
        "before:pointer-events-none before:absolute before:size-[38px] before:rounded-full before:bg-black/45 before:transition-colors before:duration-200 group-hover/fav:before:bg-black/60",
        // Focus ring drawn as an outline square, so it doesn't rely on colour alone.
        "focus-visible:after:absolute focus-visible:after:inset-1.5 focus-visible:after:border focus-visible:after:border-parchment",
        className,
      )}
    >
      <Star
        aria-hidden
        strokeWidth={1.9}
        className={cn(
          "relative size-[26px] drop-shadow-[0_1px_2px_rgb(0_0_0/0.9)] transition-[color,fill,opacity,scale] duration-200 ease-out group-hover/fav:scale-[1.07] group-active/fav:scale-95 motion-reduce:transition-none",
          active ? "fill-gold-light text-gold-light opacity-100" : "fill-transparent text-[#f6f0e3] opacity-95 group-hover/fav:opacity-100",
        )}
      />
    </button>
  );
}
