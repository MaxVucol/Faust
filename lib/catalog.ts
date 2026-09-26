export const GENRES = [
  { name: "Action", slug: "action", label: "Acțiune" },
  { name: "RPG", slug: "rpg", label: "RPG" },
  { name: "Strategy", slug: "strategy", label: "Strategie" },
  { name: "Horror", slug: "horror", label: "Horror" },
  { name: "Souls-like", slug: "souls-like", label: "Souls-like" },
  { name: "Adventure", slug: "adventure", label: "Aventură" },
] as const;

export type GenreName = (typeof GENRES)[number]["name"];

export const PLATFORMS = [
  { name: "PC", short: "PC" },
  { name: "PlayStation 5", short: "PS5" },
  { name: "Xbox Series X|S", short: "XBOX" },
  { name: "Nintendo Switch", short: "SWITCH" },
] as const;

export function genreLabel(name: string): string {
  return GENRES.find((g) => g.name === name)?.label ?? name;
}

export function platformShort(name: string): string {
  return PLATFORMS.find((p) => p.name === name)?.short ?? name;
}

export const SORT_OPTIONS = [
  { value: "popular", label: "Popularitate" },
  { value: "price-asc", label: "Preț crescător" },
  { value: "price-desc", label: "Preț descrescător" },
  { value: "newest", label: "Cele mai noi" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const PAGE_SIZE = 12;

export const SITE_NAME = "The Iron Vault";
