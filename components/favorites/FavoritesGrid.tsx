"use client";

import type { ReactNode } from "react";
import { useFavorites } from "./FavoritesProvider";

/**
 * The favourites page grid. Cards are rendered on the server; this keeps only the ones still starred,
 * so un-starring a game removes its card at once, and shows `empty` when none are left.
 */
export function FavoritesGrid({ items, empty }: { items: { slug: string; card: ReactNode }[]; empty: ReactNode }) {
  const { has } = useFavorites();
  const visible = items.filter((item) => has(item.slug));
  if (visible.length === 0) return <>{empty}</>;
  return (
    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {visible.map((item) => (
        <li key={item.slug}>{item.card}</li>
      ))}
    </ul>
  );
}
