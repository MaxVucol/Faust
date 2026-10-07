"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { favoritesStore } from "@/lib/favorites-store";

// The server's reading of the cookie, used while hydrating so stars render the same on both sides.
const InitialFavorites = createContext<string[]>([]);

/** `initial`: the list the server rendered; `account`: the signed-in user's list (the same), or null for a guest. */
export function FavoritesProvider({ initial, account, children }: { initial: string[]; account: string[] | null; children: ReactNode }) {
  const accountKey = account === null ? null : account.join(".");
  useEffect(() => {
    favoritesStore.connect(accountKey === null ? null : accountKey ? accountKey.split(".") : []);
  }, [accountKey]);
  return <InitialFavorites.Provider value={initial}>{children}</InitialFavorites.Provider>;
}

export function useFavorites() {
  const initial = useContext(InitialFavorites);
  const slugs = useSyncExternalStore(favoritesStore.subscribe, favoritesStore.getSnapshot, () => initial);
  return { slugs, count: slugs.length, has: (slug: string) => slugs.includes(slug), toggle: favoritesStore.toggle };
}
