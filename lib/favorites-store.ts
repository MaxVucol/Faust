import { FAVORITES_COOKIE, parseFavorites, serializeFavorites } from "./favorites";

const ONE_YEAR = 60 * 60 * 24 * 365;
const listeners = new Set<() => void>();
let cache: { raw: string | null; slugs: string[] } = { raw: null, slugs: [] };

function readCookie(): string {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${FAVORITES_COOKIE}=`));
  return match ? match.slice(FAVORITES_COOKIE.length + 1) : "";
}

/** Client side of the favourites cookie; every star on the page subscribes to the same store. */
export const favoritesStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot(): string[] {
    const raw = readCookie();
    if (raw !== cache.raw) cache = { raw, slugs: parseFavorites(raw) };
    return cache.slugs;
  },
  toggle(slug: string) {
    const current = favoritesStore.getSnapshot();
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [slug, ...current];
    document.cookie = `${FAVORITES_COOKIE}=${encodeURIComponent(serializeFavorites(next))}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
    listeners.forEach((l) => l());
  },
};
