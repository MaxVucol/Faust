"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { favoritesStore } from "@/lib/favorites-store";

// The server's reading of the cookie, used while hydrating so stars render the same on both sides.
const InitialFavorites = createContext<string[]>([]);

export function FavoritesProvider({ initial, children }: { initial: string[]; children: ReactNode }) {
  return <InitialFavorites.Provider value={initial}>{children}</InitialFavorites.Provider>;
}

export function useFavorites() {
  const initial = useContext(InitialFavorites);
  const slugs = useSyncExternalStore(favoritesStore.subscribe, favoritesStore.getSnapshot, () => initial);
  return { slugs, count: slugs.length, has: (slug: string) => slugs.includes(slug), toggle: favoritesStore.toggle };
}
