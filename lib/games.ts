import type { Prisma } from "@prisma/client";
import { cache } from "react";
import { GENRES, PAGE_SIZE, PLATFORMS, RELEASED_OPTIONS, SORT_OPTIONS, type SortValue } from "./catalog";
import { toMdl, type Currency } from "./currency";
import { effectivePrice } from "./format";
import { anyOnSale, bestOffer, gameOffers, maxDiscountPercent } from "./offers";
import { dictionaries } from "./i18n/dictionaries";
import { prisma } from "./prisma";
import { searchKey } from "./utils";
import type { GameCardData } from "@/types";

export const cardSelect = {
  id: true,
  title: true,
  slug: true,
  price: true,
  discountPrice: true,
  discountStartsAt: true,
  discountEndsAt: true,
  variants: true,
  coverImage: true,
  cardImage: true,
  screenshots: true,
  genres: true,
  platforms: true,
  rating: true,
  releaseDate: true,
  stock: true,
  developer: true,
} satisfies Prisma.GameSelect;

export type SearchParams = Record<string, string | string[] | undefined>;

export type GameFilters = {
  q: string;
  genres: string[];
  platforms: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  /** Released within the last N years (1 or 3). */
  releasedYears?: number;
  sale: boolean;
  sort: SortValue;
  page: number;
};

const list = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
const first = (v: string | string[] | undefined) => list(v)[0];
const num = (v: string | string[] | undefined) => {
  const raw = first(v);
  if (raw === undefined || raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export function parseFilters(sp: SearchParams): GameFilters {
  const genreNames: string[] = GENRES.map((g) => g.name);
  const platformNames: string[] = PLATFORMS.map((p) => p.name);
  const sort = first(sp.sort);
  return {
    q: (first(sp.q) ?? "").trim().slice(0, 80),
    genres: list(sp.genre).filter((g) => genreNames.includes(g)),
    platforms: list(sp.platform).filter((p) => platformNames.includes(p)),
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    minRating: num(sp.minRating),
    releasedYears: RELEASED_OPTIONS.find((n) => n === num(sp.released)),
    sale: first(sp.sale) === "1",
    sort: SORT_OPTIONS.includes(sort as SortValue) ? (sort as SortValue) : "popular",
    page: Math.max(1, Math.floor(num(sp.page) ?? 1)),
  };
}

/**
 * Free-text match used by the catalogue and the header suggestions: the title, developer or publisher, plus any genre whose
 * key or localized name contains the query (so "strategie" or "хоррор" work), plus any platform
 * whose name or short code contains it ("ps5", "switch"). Diacritics are ignored on both sides
 * (searchKey), so "yotei" finds "Ghost of Yōtei" and "actiune" finds the "Acțiune" genre. The
 * database can't compare that way, so titles are matched here: one light query of slugs and titles.
 */
async function textSearchWhere(q: string): Promise<Prisma.GameWhereInput> {
  const needle = searchKey(q.trim());
  const genres = GENRES.filter((g) => {
    const names = [g.name, ...Object.values(dictionaries).map((d) => d.genres[g.name] ?? "")];
    return names.some((n) => searchKey(n).includes(needle));
  }).map((g) => g.name);
  const platforms = PLATFORMS.filter((p) => searchKey(p.name).includes(needle) || searchKey(p.short).includes(needle)).map((p) => p.name);
  const titles = await prisma.game.findMany({ select: { slug: true, title: true, developer: true, publisher: true } });
  const slugs = titles.filter((g) => [g.title, g.developer, g.publisher].some((s) => searchKey(s).includes(needle))).map((g) => g.slug);
  const or: Prisma.GameWhereInput[] = [{ slug: { in: slugs } }];
  if (genres.length) or.push({ genres: { hasSome: genres } });
  if (platforms.length) or.push({ platforms: { hasSome: platforms } });
  return { OR: or };
}

/** Up to `take` games for the search box: exact and prefix title matches first, then by rating. */
export async function suggestGames(q: string, take = 6): Promise<GameCardData[]> {
  const needle = searchKey(q.trim());
  if (needle.length < 2) return [];
  const found = await prisma.game.findMany({ where: await textSearchWhere(q), select: cardSelect, orderBy: { rating: "desc" }, take: 30 });
  const rank = (title: string) => {
    const t = searchKey(title);
    if (t === needle) return 0;
    if (t.startsWith(needle)) return 1;
    if (t.split(/[\s:]+/).some((w) => w.startsWith(needle))) return 2;
    if (t.includes(needle)) return 3;
    return 4; // matched by developer, publisher, genre or platform
  };
  return found.sort((a, b) => rank(a.title) - rank(b.title) || score(b.rating) - score(a.rating)).slice(0, take);
}

/** Sort key for the optional store rating: unrated games go after rated ones. */
const score = (rating: number | null) => rating ?? -1;

/** The price a game's card shows right now (its cheapest offer, in stock first), in MDL: what the price filter compares. */
function cardPriceNow(game: Parameters<typeof gameOffers>[0], offers: ReturnType<typeof gameOffers>, now: Date): number {
  const best = bestOffer(offers, now);
  return best ? effectivePrice(best, now) : game.price;
}

/**
 * The cheapest and the dearest card price in the whole catalogue right now (MDL), by the same rule as
 * the price filter: the ends of the catalogue's price slider. Null when the catalogue is empty.
 */
export const getPriceBounds = cache(async (): Promise<{ min: number; max: number } | null> => {
  const now = new Date();
  const games = await prisma.game.findMany({
    select: { price: true, discountPrice: true, discountStartsAt: true, discountEndsAt: true, platforms: true, variants: true, stock: true },
  });
  if (games.length === 0) return null;
  const prices = games.map((g) => cardPriceNow(g, gameOffers(g), now));
  return { min: Math.min(...prices), max: Math.max(...prices) };
});

/** Filters that the database can apply directly (everything except price and sale). */
async function buildWhere(f: GameFilters, now: Date): Promise<Prisma.GameWhereInput> {
  const and: Prisma.GameWhereInput[] = [];
  if (f.q) and.push(await textSearchWhere(f.q));
  if (f.genres.length) and.push({ genres: { hasSome: f.genres } });
  if (f.platforms.length) and.push({ platforms: { hasSome: f.platforms } });
  if (f.minRating !== undefined) and.push({ rating: { gte: f.minRating } });
  if (f.releasedYears !== undefined) {
    const since = new Date(now);
    since.setFullYear(since.getFullYear() - f.releasedYears);
    and.push({ releaseDate: { gte: since, lte: now } });
  }
  return and.length ? { AND: and } : {};
}

/**
 * Catalogue search. Price, sale and discount depend on the current date and on each game's versions
 * (see lib/offers.ts), so those filters and sorts run here on the matching set rather than in the
 * query. That keeps the catalogue, cards and product page in agreement; for a catalogue of a few
 * thousand titles it is still cheap.
 */
export async function searchGames(f: GameFilters): Promise<{ games: GameCardData[]; total: number; pages: number }> {
  const now = new Date();
  const [found, featured] = await Promise.all([
    prisma.game.findMany({ where: await buildWhere(f, now), select: cardSelect }),
    prisma.game.findMany({ where: { featured: true }, select: { slug: true } }),
  ]);
  const featuredSlugs = new Set(featured.map((g) => g.slug));

  const rows = found.map((game) => {
    const offers = gameOffers(game);
    return { game, offers, price: cardPriceNow(game, offers, now) };
  });
  const filtered = rows.filter(
    (r) =>
      (!f.sale || anyOnSale(r.offers, now)) &&
      (f.minPrice === undefined || r.price >= f.minPrice) &&
      (f.maxPrice === undefined || r.price <= f.maxPrice),
  );

  const byTitle = (a: (typeof rows)[number], b: (typeof rows)[number]) => a.game.title.localeCompare(b.game.title);
  const sorters: Record<SortValue, (a: (typeof rows)[number], b: (typeof rows)[number]) => number> = {
    // The store's featured picks first, then by rating.
    popular: (a, b) => Number(featuredSlugs.has(b.game.slug)) - Number(featuredSlugs.has(a.game.slug)) || score(b.game.rating) - score(a.game.rating) || byTitle(a, b),
    rating: (a, b) => score(b.game.rating) - score(a.game.rating) || byTitle(a, b),
    newest: (a, b) => b.game.releaseDate.getTime() - a.game.releaseDate.getTime() || byTitle(a, b),
    "price-asc": (a, b) => a.price - b.price || byTitle(a, b),
    "price-desc": (a, b) => b.price - a.price || byTitle(a, b),
    discount: (a, b) => maxDiscountPercent(b.offers, now) - maxDiscountPercent(a.offers, now) || score(b.game.rating) - score(a.game.rating) || byTitle(a, b),
    name: byTitle,
  };
  filtered.sort(sorters[f.sort]);

  const skip = (f.page - 1) * PAGE_SIZE;
  return {
    games: filtered.slice(skip, skip + PAGE_SIZE).map((r) => r.game),
    total: filtered.length,
    pages: Math.ceil(filtered.length / PAGE_SIZE),
  };
}

/**
 * The catalogue page's search (the page and its "Load more" batches): price filters are typed in the
 * visitor's currency, prices are stored in MDL.
 */
export function searchCatalog(f: GameFilters, currency: Currency) {
  const inMdl = (v: number | undefined) => (v === undefined ? undefined : toMdl(v, currency));
  return searchGames({ ...f, minPrice: inMdl(f.minPrice), maxPrice: inMdl(f.maxPrice) });
}

/** The catalogue's filters, sort and search as a query string (no page: batches are loaded in place). */
export function catalogQuery(sp: SearchParams): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (key === "page" || value === undefined) continue;
    for (const v of Array.isArray(value) ? value : [value]) params.append(key, v);
  }
  return params.toString();
}

export function getFeaturedGames(take = 3) {
  return prisma.game.findMany({ where: { featured: true }, select: cardSelect, orderBy: { rating: "desc" }, take });
}

/**
 * The home hero's games: the ones the store marked as featured (admin, "Featured"), best rated first.
 * With fewer than `min`, the store's best-rated games fill the rest, so the hero always has something to
 * show and is never empty. Each comes with its description for the hero's short text.
 */
export async function getHeroGames(take = 5, min = 3) {
  const select = { ...cardSelect, description: true, publisher: true } satisfies Prisma.GameSelect;
  const featured = await prisma.game.findMany({ where: { featured: true }, select, orderBy: { rating: "desc" }, take });
  if (featured.length >= min) return featured;
  const more = await prisma.game.findMany({
    where: { slug: { notIn: featured.map((g) => g.slug) }, rating: { not: null } },
    select,
    orderBy: { rating: "desc" },
    take: min - featured.length,
  });
  return [...featured, ...more];
}

/**
 * Copies a game must have sold in the window (paid orders, see getTrendingGames) to hold a numbered
 * "Trending now" place. Sales rank the list only when every place can be held that way; with fewer, a
 * numbered list would be the store's opinion dressed up as statistics.
 */
export const TRENDING_MIN_COPIES = 3;

/**
 * The home page's first row of games. Ranked by sales (`ranked`: "Trending now", #1–#4) only when, in
 * the last `days` days, at least `take` games in stock each sold TRENDING_MIN_COPIES copies in paid,
 * not cancelled orders (unpaid or spam orders never move it). Otherwise the store's selection: its
 * best-rated games in stock, unnumbered ("The Iron Vault's picks"). `exclude`: games already shown (the hero).
 */
export async function getTrendingGames(take = 4, exclude: string[] = [], days = 60): Promise<{ ranked: boolean; games: GameCardData[] }> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: since }, paymentStatus: "paid", status: { not: "cancelled" } },
    select: { items: true },
  });
  const demand = new Map<string, number>();
  for (const o of orders) for (const i of o.items) demand.set(i.slug, (demand.get(i.slug) ?? 0) + i.quantity);
  const games = (await prisma.game.findMany({ where: { slug: { notIn: exclude } }, select: cardSelect })).filter((g) => gameOffers(g).some((o) => o.stock > 0));
  const byQuality = (a: GameCardData, b: GameCardData) => score(b.rating) - score(a.rating) || b.releaseDate.getTime() - a.releaseDate.getTime();
  const sold = (g: GameCardData) => demand.get(g.slug) ?? 0;
  const selling = games.filter((g) => sold(g) >= TRENDING_MIN_COPIES);
  if (selling.length >= take) {
    return { ranked: true, games: selling.sort((a, b) => sold(b) - sold(a) || byQuality(a, b)).slice(0, take) };
  }
  return { ranked: false, games: games.sort(byQuality).slice(0, take) };
}

/** The home page's curated collections: a stable key (labels in t.home.collections) and the genre it gathers. */
export const COLLECTIONS = [
  { key: "soulslike", genre: "Souls-like" },
  { key: "rpg", genre: "RPG" },
  { key: "horror", genre: "Horror" },
  { key: "strategy", genre: "Strategy" },
] as const;

/**
 * The collections' games, each game on one shelf only. A shelf takes only games of its genre; among those
 * it prefers games not shown elsewhere on the page (`elsewhere`, a soft preference), then the best rated
 * (newest first among unrated ones). Shelves choose in turns, one game per round, and the shelf with the
 * fewest unused candidates chooses first, so a broad genre can't empty a narrow one. A shelf without
 * enough distinct games stays shorter rather than repeating one; an empty shelf is left out.
 */
export async function getCollections(perCollection = 4, elsewhere: string[] = []) {
  const games = await prisma.game.findMany({ where: { genres: { hasSome: COLLECTIONS.map((c) => c.genre) } }, select: cardSelect });
  const seen = new Set(elsewhere);
  const byQuality = (a: GameCardData, b: GameCardData) => score(b.rating) - score(a.rating) || b.releaseDate.getTime() - a.releaseDate.getTime();
  const shelves = COLLECTIONS.map((c) => ({
    ...c,
    candidates: games.filter((g) => g.genres.includes(c.genre)).sort((a, b) => Number(seen.has(a.slug)) - Number(seen.has(b.slug)) || byQuality(a, b)),
    games: [] as GameCardData[],
  }));
  const used = new Set<string>();
  const left = (s: (typeof shelves)[number]) => s.candidates.filter((g) => !used.has(g.slug)).length;
  for (let round = 0; round < perCollection; round++) {
    for (const shelf of [...shelves].sort((a, b) => left(a) - left(b))) {
      const next = shelf.candidates.find((g) => !used.has(g.slug));
      if (!next) continue;
      shelf.games.push(next);
      used.add(next.slug);
    }
  }
  return shelves.filter((s) => s.games.length > 0).map((s) => ({ key: s.key, genre: s.genre, games: s.games.sort(byQuality) }));
}

/** Games with a sale running right now, soonest-ending first. `exclude`: slugs already shown elsewhere. */
export async function getWeeklyOffers(take = 12, exclude: string[] = []) {
  const now = new Date();
  const games = await prisma.game.findMany({ where: { slug: { notIn: exclude } }, select: cardSelect });
  const endsAt = (g: GameCardData) =>
    Math.min(...gameOffers(g).filter((o) => anyOnSale([o], now)).map((o) => o.discountEndsAt?.getTime() ?? Infinity));
  return games
    .filter((g) => anyOnSale(gameOffers(g), now))
    .sort((a, b) => endsAt(a) - endsAt(b))
    .slice(0, take);
}

/**
 * Whether any game or version is on sale right now (the same test as the catalogue's "sale" filter).
 * Links to /produse?sale=1 are shown only when it is true, so they never lead to an empty list.
 * Cached per request: the hero and the footer both ask. The footer is on every page, so a database
 * error only hides the links instead of failing the page.
 */
export const hasActiveOffers = cache(async (): Promise<boolean> => {
  const now = new Date();
  try {
    const games = await prisma.game.findMany({
      select: { price: true, discountPrice: true, discountStartsAt: true, discountEndsAt: true, variants: true, platforms: true, stock: true },
    });
    return games.some((g) => anyOnSale(gameOffers(g), now));
  } catch (error) {
    console.error("active offers check failed", error);
    return false;
  }
});

/** Games released in the last `months` months (never future dates), newest first. */
export function getRecentReleases(months = 12, take = 12, exclude: string[] = []) {
  const now = new Date();
  const since = new Date(now);
  since.setMonth(since.getMonth() - months);
  return prisma.game.findMany({
    where: { releaseDate: { gte: since, lte: now }, slug: { notIn: exclude } },
    select: cardSelect,
    orderBy: { releaseDate: "desc" },
    take,
  });
}

export function getGameBySlug(slug: string) {
  return prisma.game.findUnique({ where: { slug } });
}

export function getSimilarGames(slug: string, genres: string[], take = 4) {
  return prisma.game.findMany({
    where: { slug: { not: slug }, genres: { hasSome: genres } },
    select: cardSelect,
    orderBy: { rating: "desc" },
    take,
  });
}
