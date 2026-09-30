/** Genre names are stable keys stored in the database; labels live in the dictionaries (t.genres). */
export const GENRES = [
  { name: "Action", slug: "action" },
  { name: "RPG", slug: "rpg" },
  { name: "Strategy", slug: "strategy" },
  { name: "Horror", slug: "horror" },
  { name: "Souls-like", slug: "souls-like" },
  { name: "Adventure", slug: "adventure" },
] as const;

export type GenreName = (typeof GENRES)[number]["name"];

export const PLATFORMS = [
  { name: "PC", short: "PC" },
  { name: "PlayStation 5", short: "PS5" },
  { name: "Xbox Series X|S", short: "XBOX" },
  { name: "Nintendo Switch", short: "SWITCH" },
] as const;

export function platformShort(name: string): string {
  return PLATFORMS.find((p) => p.name === name)?.short ?? name;
}

/** Sort keys used in the URL; labels live in the dictionaries (t.sort). */
export const SORT_OPTIONS = ["popular", "rating", "newest", "price-asc", "price-desc", "discount"] as const;

export type SortValue = (typeof SORT_OPTIONS)[number];

export const PAGE_SIZE = 12;

export const SITE_NAME = "The Iron Vault";

/** Localised genre name, falling back to the stored key. Pass t.genres. */
export function genreLabel(labels: Record<string, string>, name: string): string {
  return labels[name] ?? name;
}
