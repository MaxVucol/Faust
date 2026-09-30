import type { Prisma } from "@prisma/client";
import { GENRES, PAGE_SIZE, PLATFORMS, SORT_OPTIONS, type SortValue } from "./catalog";
import { discountPercent, effectivePrice, isOnSale } from "./format";
import { dictionaries } from "./i18n/dictionaries";
import { prisma } from "./prisma";
import type { GameCardData } from "@/types";

export const cardSelect = {
  id: true,
  title: true,
  slug: true,
  price: true,
  discountPrice: true,
  discountEndsAt: true,
  coverImage: true,
  cardImage: true,
  screenshots: true,
  genres: true,
  platforms: true,
  rating: true,
  releaseDate: true,
  stock: true,
} satisfies Prisma.GameSelect;

export type SearchParams = Record<string, string | string[] | undefined>;

export type GameFilters = {
  q: string;
  genres: string[];
  platforms: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
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
    sale: first(sp.sale) === "1",
    sort: SORT_OPTIONS.includes(sort as SortValue) ? (sort as SortValue) : "popular",
    page: Math.max(1, Math.floor(num(sp.page) ?? 1)),
  };
}

/**
 * Free-text match used by the catalogue and the header suggestions: the title, plus any genre whose
 * key or localized name contains the query (so "strategie" or "хоррор" work), plus any platform
 * whose name or short code contains it ("ps5", "switch").
 */
export function textSearchWhere(q: string): Prisma.GameWhereInput {
  const needle = q.trim().toLowerCase();
  const genres = GENRES.filter((g) => {
    const names = [g.name, ...Object.values(dictionaries).map((d) => d.genres[g.name] ?? "")];
    return names.some((n) => n.toLowerCase().includes(needle));
  }).map((g) => g.name);
  const platforms = PLATFORMS.filter((p) => p.name.toLowerCase().includes(needle) || p.short.toLowerCase().includes(needle)).map((p) => p.name);
  const or: Prisma.GameWhereInput[] = [{ title: { contains: q.trim(), mode: "insensitive" } }];
  if (genres.length) or.push({ genres: { hasSome: genres } });
  if (platforms.length) or.push({ platforms: { hasSome: platforms } });
  return { OR: or };
}

/** Up to `take` games for the search box: exact and prefix title matches first, then by rating. */
export async function suggestGames(q: string, take = 6): Promise<GameCardData[]> {
  const needle = q.trim().toLowerCase();
  if (needle.length < 2) return [];
  const found = await prisma.game.findMany({ where: textSearchWhere(q), select: cardSelect, orderBy: { rating: "desc" }, take: 30 });
  const rank = (title: string) => {
    const t = title.toLowerCase();
    if (t === needle) return 0;
    if (t.startsWith(needle)) return 1;
    if (t.split(/[\s:]+/).some((w) => w.startsWith(needle))) return 2;
    if (t.includes(needle)) return 3;
    return 4; // matched by genre or platform
  };
  return found.sort((a, b) => rank(a.title) - rank(b.title) || b.rating - a.rating).slice(0, take);
}

const activeSale = (now: Date): Prisma.GameWhereInput => ({ discountEndsAt: { gt: now } });
const noActiveSale = (now: Date): Prisma.GameWhereInput => ({
  OR: [{ discountEndsAt: { isSet: false } }, { discountEndsAt: null }, { discountEndsAt: { lte: now } }],
});

function buildWhere(f: GameFilters, now: Date): Prisma.GameWhereInput {
  const and: Prisma.GameWhereInput[] = [];
  if (f.q) and.push(textSearchWhere(f.q));
  if (f.genres.length) and.push({ genres: { hasSome: f.genres } });
  if (f.platforms.length) and.push({ platforms: { hasSome: f.platforms } });
  if (f.minRating !== undefined) and.push({ rating: { gte: f.minRating } });
  if (f.sale) and.push(activeSale(now));
  if (f.minPrice !== undefined || f.maxPrice !== undefined) {
    const range = { gte: f.minPrice, lte: f.maxPrice };
    // Filter on the price the customer actually pays.
    and.push({
      OR: [
        { AND: [activeSale(now), { discountPrice: range }] },
        { AND: [noActiveSale(now), { price: range }] },
      ],
    });
  }
  return and.length ? { AND: and } : {};
}

export async function searchGames(f: GameFilters): Promise<{ games: GameCardData[]; total: number; pages: number }> {
  const now = new Date();
  const where = buildWhere(f, now);
  const skip = (f.page - 1) * PAGE_SIZE;

  if (f.sort === "price-asc" || f.sort === "price-desc" || f.sort === "discount") {
    // Effective price and discount depend on whether a sale is active, so sort after fetching the filtered set.
    const all = await prisma.game.findMany({ where, select: cardSelect });
    if (f.sort === "discount") {
      const off = (g: GameCardData) => (isOnSale(g, now) ? discountPercent(g) : 0);
      all.sort((a, b) => off(b) - off(a) || b.rating - a.rating);
    } else {
      const dir = f.sort === "price-asc" ? 1 : -1;
      all.sort((a, b) => dir * (effectivePrice(a, now) - effectivePrice(b, now)));
    }
    return { games: all.slice(skip, skip + PAGE_SIZE), total: all.length, pages: Math.ceil(all.length / PAGE_SIZE) };
  }

  // "popular" puts the store's featured picks first; "rating" is purely by rating.
  const orderBy: Prisma.GameOrderByWithRelationInput[] =
    f.sort === "newest"
      ? [{ releaseDate: "desc" }]
      : f.sort === "rating"
        ? [{ rating: "desc" }, { title: "asc" }]
        : [{ featured: "desc" }, { rating: "desc" }, { title: "asc" }];
  const [games, total] = await Promise.all([
    prisma.game.findMany({ where, select: cardSelect, orderBy, skip, take: PAGE_SIZE }),
    prisma.game.count({ where }),
  ]);
  return { games, total, pages: Math.ceil(total / PAGE_SIZE) };
}

export function getFeaturedGames(take = 3) {
  return prisma.game.findMany({ where: { featured: true }, select: cardSelect, orderBy: { rating: "desc" }, take });
}

export function getWeeklyOffers(take = 4) {
  return prisma.game.findMany({
    where: activeSale(new Date()),
    select: cardSelect,
    orderBy: { discountEndsAt: "asc" },
    take,
  });
}

export function getNewestGames(take = 4) {
  return prisma.game.findMany({ select: cardSelect, orderBy: { releaseDate: "desc" }, take });
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
