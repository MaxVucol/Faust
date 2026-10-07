import { saveWishlistAction } from "@/app/favorite/actions";
import { FAVORITES_COOKIE, parseFavorites, serializeFavorites } from "./favorites";

const ONE_YEAR = 60 * 60 * 24 * 365;
const listeners = new Set<() => void>();
let cache: { raw: string | null; slugs: string[] } = { raw: null, slugs: [] };
// Signed in: changes are also saved to the account, a moment after the last one. While a change is
// waiting or being saved, the page's (older) copy of the account list never overwrites it.
let signedIn = false;
let saveTimer: ReturnType<typeof setTimeout> | undefined;
let unsaved = false;
// The latest change's number: only its save (or retry) may clear `unsaved`.
let generation = 0;

function writeCookie(slugs: string[]) {
  document.cookie = `${FAVORITES_COOKIE}=${encodeURIComponent(serializeFavorites(slugs))}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

function saveToAccount(slugs: string[], delay = 300, retry = true) {
  if (!signedIn) return;
  unsaved = true;
  const mine = ++generation;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveWishlistAction(slugs)
      .catch(() => false)
      .then((saved) => {
        if (mine !== generation) return; // a newer change is on its way
        // Not saved (too many saves in a minute, a lost connection): one more try once that minute has
        // passed, and until then the account's older copy doesn't replace the list here.
        if (!saved && retry) saveToAccount(slugs, 61_000, false);
        else unsaved = false;
      });
  }, delay);
}

function readCookie(): string {
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${FAVORITES_COOKIE}=`));
  return match ? match.slice(FAVORITES_COOKIE.length + 1) : "";
}

/** Client side of the wishlist cookie (and, signed in, the account's copy); every heart on the page subscribes to the same store. */
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
    writeCookie(next);
    listeners.forEach((l) => l());
    saveToAccount(next);
  },
  /**
   * After the page loads. Signed in (`account` is the account's list): the cookie mirrors the account,
   * unless a change made here is still being saved. A guest (`account` null): the cookie is the list.
   */
  connect(account: string[] | null) {
    signedIn = account !== null;
    if (account === null || unsaved) return;
    if (serializeFavorites(account) !== serializeFavorites(favoritesStore.getSnapshot())) {
      writeCookie(account);
      listeners.forEach((l) => l());
    }
  },
};
