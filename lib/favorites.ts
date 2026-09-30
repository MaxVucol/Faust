/** Favourites are a cookie of game slugs, so the server can render stars and the favourites page. */
export const FAVORITES_COOKIE = "favorites";
export const MAX_FAVORITES = 60;
const SEPARATOR = ".";
const SLUG = /^[a-z0-9-]{1,80}$/;

export function parseFavorites(raw: string | undefined | null): string[] {
  if (!raw) return [];
  const slugs = decodeURIComponent(raw).split(SEPARATOR).filter((s) => SLUG.test(s));
  return [...new Set(slugs)].slice(0, MAX_FAVORITES);
}

export function serializeFavorites(slugs: string[]): string {
  return slugs.filter((s) => SLUG.test(s)).slice(0, MAX_FAVORITES).join(SEPARATOR);
}
