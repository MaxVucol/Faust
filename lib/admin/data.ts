import "server-only";
import type { Prisma } from "@prisma/client";
import { GENRES, PLATFORMS } from "@/lib/catalog";
import { discountPercent, effectivePrice, isNewRelease, isOnSale } from "@/lib/format";
import { bestOffer, gameOffers, maxDiscountPercent } from "@/lib/offers";
import { prisma } from "@/lib/prisma";
import { searchKey } from "@/lib/utils";
import { requireAdmin } from "./auth";

/**
 * The admin panel's reads. Every function checks the session first (requireAdmin), so admin data can't
 * be reached from anywhere without admin rights, whichever page or action calls it. Prices, sales and
 * "new" use the shop's own helpers (lib/format.ts, lib/offers.ts), so the panel shows what the shop shows.
 */

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export const ORDER_STATUSES = ["new", "processing", "completed", "cancelled"] as const;
export const PAYMENT_STATUSES = ["unpaid", "paid", "refunded"] as const;
export const ADMIN_PAGE_SIZE = 25;

const pageOf = (sp: SP) => Math.max(1, Math.floor(Number(first(sp.page)) || 1));
const paginate = <T,>(rows: T[], page: number) => ({
  rows: rows.slice((page - 1) * ADMIN_PAGE_SIZE, page * ADMIN_PAGE_SIZE),
  total: rows.length,
  page,
  pages: Math.max(1, Math.ceil(rows.length / ADMIN_PAGE_SIZE)),
});

// ---------- Games ----------

const gameListSelect = {
  id: true,
  title: true,
  slug: true,
  coverImage: true,
  price: true,
  discountPrice: true,
  discountStartsAt: true,
  discountEndsAt: true,
  variants: true,
  platforms: true,
  genres: true,
  stock: true,
  featured: true,
  releaseDate: true,
  createdAt: true,
} satisfies Prisma.GameSelect;

export type AdminGameRow = {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  /** The card's version: its price before and after a running sale (MDL). */
  price: number;
  finalPrice: number;
  discount: number;
  genres: string[];
  platforms: string[];
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
  featured: boolean;
  createdAt: Date;
};

export const GAME_STATUS_FILTERS = ["in-stock", "out-of-stock", "on-sale", "featured", "new"] as const;
export const GAME_SORTS = ["added-desc", "added-asc", "title", "price-asc", "price-desc", "discount"] as const;

export async function listGames(sp: SP) {
  await requireAdmin();
  const now = new Date();
  const q = searchKey(first(sp.q).trim());
  const genre = first(sp.genre);
  const platform = first(sp.platform);
  const status = first(sp.status);
  const sort = (GAME_SORTS as readonly string[]).includes(first(sp.sort)) ? first(sp.sort) : "added-desc";
  const games = await prisma.game.findMany({ select: gameListSelect });
  const rows: AdminGameRow[] = games.map((g) => {
    const offers = gameOffers(g);
    const best = bestOffer(offers, now);
    return {
      id: g.id,
      title: g.title,
      slug: g.slug,
      coverImage: g.coverImage,
      price: best?.price ?? g.price,
      finalPrice: best ? effectivePrice(best, now) : g.price,
      discount: maxDiscountPercent(offers, now),
      genres: g.genres,
      platforms: g.platforms,
      inStock: offers.some((o) => o.stock > 0),
      onSale: offers.some((o) => isOnSale(o, now)),
      isNew: isNewRelease(g, now),
      featured: g.featured,
      createdAt: g.createdAt,
    };
  });
  const filtered = rows.filter(
    (r) =>
      (!q || searchKey(r.title).includes(q) || r.slug.includes(q)) &&
      (!genre || r.genres.includes(genre)) &&
      (!platform || r.platforms.includes(platform)) &&
      (!status ||
        (status === "in-stock" && r.inStock) ||
        (status === "out-of-stock" && !r.inStock) ||
        (status === "on-sale" && r.onSale) ||
        (status === "featured" && r.featured) ||
        (status === "new" && r.isNew)),
  );
  const byTitle = (a: AdminGameRow, b: AdminGameRow) => a.title.localeCompare(b.title);
  const sorters: Record<string, (a: AdminGameRow, b: AdminGameRow) => number> = {
    "added-desc": (a, b) => b.createdAt.getTime() - a.createdAt.getTime() || byTitle(a, b),
    "added-asc": (a, b) => a.createdAt.getTime() - b.createdAt.getTime() || byTitle(a, b),
    title: byTitle,
    "price-asc": (a, b) => a.finalPrice - b.finalPrice || byTitle(a, b),
    "price-desc": (a, b) => b.finalPrice - a.finalPrice || byTitle(a, b),
    discount: (a, b) => b.discount - a.discount || byTitle(a, b),
  };
  filtered.sort(sorters[sort]);
  return { ...paginate(filtered, pageOf(sp)), all: rows.length };
}

export async function getGameForEdit(id: string) {
  await requireAdmin();
  if (!/^[a-f0-9]{24}$/.test(id)) return null;
  return prisma.game.findUnique({ where: { id } });
}

// ---------- Orders ----------

export type AdminOrderRow = Prisma.OrderGetPayload<object>;

export async function listOrders(sp: SP) {
  await requireAdmin();
  const q = searchKey(first(sp.q).trim());
  const status = first(sp.status);
  const payment = first(sp.payment);
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  const filtered = orders.filter(
    (o) =>
      (!q || [o.number, o.name, o.email, o.phone].some((v) => searchKey(v).includes(q))) &&
      (!status || o.status === status) &&
      (!payment || o.paymentStatus === payment),
  );
  return { ...paginate(filtered, pageOf(sp)), all: orders.length };
}

export async function getOrder(id: string) {
  await requireAdmin();
  if (!/^[a-f0-9]{24}$/.test(id)) return null;
  return prisma.order.findUnique({ where: { id } });
}

/** Revenue counts every order except cancelled ones. */
const counts = (o: { status: string }) => o.status !== "cancelled";

// ---------- Users ----------

export type AdminUserRow = { id: string; name: string; email: string; role: string; status: string; createdAt: Date; lastLoginAt: Date | null; orders: number; spent: number };

/** Orders are matched to accounts by email (the checkout has no sign-in). */
async function ordersByEmail() {
  const orders = await prisma.order.findMany({ select: { email: true, totalMdl: true, status: true } });
  const map = new Map<string, { orders: number; spent: number }>();
  for (const o of orders) {
    const k = o.email.trim().toLowerCase();
    const m = map.get(k) ?? { orders: 0, spent: 0 };
    m.orders++;
    if (counts(o)) m.spent += o.totalMdl;
    map.set(k, m);
  }
  return map;
}

const userSelect = { id: true, name: true, email: true, role: true, status: true, createdAt: true, lastLoginAt: true } satisfies Prisma.UserSelect;

export async function listUsers(sp: SP) {
  await requireAdmin();
  const q = searchKey(first(sp.q).trim());
  const role = first(sp.role);
  const status = first(sp.status);
  const [users, byEmail] = await Promise.all([prisma.user.findMany({ select: userSelect, orderBy: { createdAt: "desc" } }), ordersByEmail()]);
  const rows: AdminUserRow[] = users.map((u) => ({ ...u, ...(byEmail.get(u.email.toLowerCase()) ?? { orders: 0, spent: 0 }) }));
  const filtered = rows.filter((u) => (!q || searchKey(u.name).includes(q) || searchKey(u.email).includes(q)) && (!role || u.role === role) && (!status || u.status === status));
  return { ...paginate(filtered, pageOf(sp)), all: users.length };
}

export async function getUser(id: string) {
  await requireAdmin();
  if (!/^[a-f0-9]{24}$/.test(id)) return null;
  const user = await prisma.user.findUnique({ where: { id }, select: { ...userSelect, googleId: true, passwordHash: true } });
  if (!user) return null;
  // How the account signs in, as two flags: the hash and the Google id stay here.
  const { googleId, passwordHash, ...shown } = user;
  const signIn = { password: Boolean(passwordHash), google: Boolean(googleId) };
  const orders = await prisma.order.findMany({
    where: { email: { equals: user.email, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    select: { id: true, number: true, createdAt: true, totalMdl: true, status: true, paymentStatus: true },
  });
  return { user: shown, signIn, orders, spent: orders.filter(counts).reduce((s, o) => s + o.totalMdl, 0) };
}

// ---------- Dashboard ----------

export async function getDashboard() {
  await requireAdmin();
  const now = new Date();
  const since = new Date(now);
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - 29);
  const [games, users, orders, recentGames, messages, subscribers] = await Promise.all([
    prisma.game.findMany({ select: { price: true, discountPrice: true, discountStartsAt: true, discountEndsAt: true, variants: true, platforms: true, stock: true } }),
    prisma.user.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.game.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, coverImage: true, createdAt: true, slug: true } }),
    prisma.contactMessage.count(),
    prisma.newsletterSubscriber.count(),
  ]);
  const valid = orders.filter(counts);
  const revenue = valid.reduce((s, o) => s + o.totalMdl, 0);

  const sold = new Map<string, { slug: string; title: string; quantity: number; revenue: number }>();
  for (const o of valid)
    for (const i of o.items) {
      const m = sold.get(i.slug) ?? { slug: i.slug, title: i.title, quantity: 0, revenue: 0 };
      m.quantity += i.quantity;
      m.revenue += i.sum;
      sold.set(i.slug, m);
    }
  const topSellers = [...sold.values()].sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue).slice(0, 5);

  // Last 30 days, one bar per day (local server dates).
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    return { date: d, orders: 0, revenue: 0 };
  });
  for (const o of valid) {
    if (o.createdAt < since) continue;
    const idx = Math.floor((o.createdAt.getTime() - since.getTime()) / 86_400_000);
    const day = days[Math.min(Math.max(idx, 0), 29)];
    day.orders++;
    day.revenue += o.totalMdl;
  }

  return {
    gameCount: games.length,
    outOfStock: games.filter((g) => gameOffers(g).every((o) => o.stock <= 0)).length,
    onSale: games.filter((g) => gameOffers(g).some((o) => isOnSale(o, now))).length,
    userCount: users,
    orderCount: orders.length,
    openOrders: orders.filter((o) => o.status === "new" || o.status === "processing").length,
    revenue,
    recentOrders: orders.slice(0, 6),
    recentGames,
    topSellers,
    days,
    messages,
    subscribers,
  };
}

// ---------- Categories (genres) ----------

export async function getGenreStats() {
  await requireAdmin();
  const games = await prisma.game.findMany({ select: { genres: true } });
  const known = new Set<string>(GENRES.map((g) => g.name));
  const count = (name: string) => games.filter((g) => g.genres.includes(name)).length;
  const unknown = [...new Set(games.flatMap((g) => g.genres).filter((x) => !known.has(x)))];
  return { genres: GENRES.map((g) => ({ name: g.name, slug: g.slug, games: count(g.name) })), unknown: unknown.map((name) => ({ name, games: count(name) })), total: games.length };
}

// ---------- Discounts ----------

export type SaleState = "active" | "scheduled" | "expired" | "none";
export type DiscountRow = {
  gameId: string;
  title: string;
  slug: string;
  coverImage: string;
  /** null for the game's own price; otherwise the variant's index in `variants`. */
  variant: number | null;
  /** The version (platform · edition), the platforms, or null for a game's base price shared by versions without their own. */
  label: string | null;
  price: number;
  discountPrice: number | null;
  startsAt: Date | null;
  endsAt: Date | null;
  percent: number;
  state: SaleState;
};

function saleState(s: { price: number; discountPrice: number | null; discountStartsAt?: Date | null; discountEndsAt: Date | null }, now: Date): SaleState {
  if (s.discountPrice == null) return "none";
  if (isOnSale(s, now)) return "active";
  if (s.discountStartsAt && s.discountStartsAt > now && (!s.discountEndsAt || s.discountEndsAt > now)) return "scheduled";
  return "expired";
}

export const DISCOUNT_FILTERS = ["active", "scheduled", "expired", "none"] as const;

export async function listDiscounts(sp: SP) {
  await requireAdmin();
  const now = new Date();
  const q = searchKey(first(sp.q).trim());
  const state = first(sp.state);
  const games = await prisma.game.findMany({ select: gameListSelect, orderBy: { title: "asc" } });
  const rows: DiscountRow[] = [];
  for (const g of games) {
    const own = { price: g.price, discountPrice: g.discountPrice, discountStartsAt: g.discountStartsAt, discountEndsAt: g.discountEndsAt };
    rows.push({ gameId: g.id, title: g.title, slug: g.slug, coverImage: g.coverImage, variant: null, label: g.variants.length ? null : g.platforms.join(", "), ...pick(own), percent: discountPercent(own), state: saleState(own, now) });
    g.variants.forEach((v, i) => {
      if (v.price == null) return; // inherits the game's price and sale
      const s = { price: v.price, discountPrice: v.discountPrice, discountStartsAt: v.discountStartsAt, discountEndsAt: v.discountEndsAt };
      rows.push({ gameId: g.id, title: g.title, slug: g.slug, coverImage: g.coverImage, variant: i, label: [v.platform, v.edition].filter(Boolean).join(" · "), ...pick(s), percent: discountPercent(s), state: saleState(s, now) });
    });
  }
  const order: Record<SaleState, number> = { active: 0, scheduled: 1, expired: 2, none: 3 };
  const filtered = rows
    .filter((r) => (!q || searchKey(r.title).includes(q)) && (state ? r.state === state : r.state !== "none"))
    .sort((a, b) => order[a.state] - order[b.state] || (a.endsAt?.getTime() ?? Infinity) - (b.endsAt?.getTime() ?? Infinity) || a.title.localeCompare(b.title));
  const tally = Object.fromEntries(DISCOUNT_FILTERS.map((s) => [s, rows.filter((r) => r.state === s).length])) as Record<SaleState, number>;
  return { ...paginate(filtered, pageOf(sp)), tally };
}

function pick(s: { price: number; discountPrice: number | null; discountStartsAt?: Date | null; discountEndsAt: Date | null }) {
  return { price: s.price, discountPrice: s.discountPrice, startsAt: s.discountStartsAt ?? null, endsAt: s.discountEndsAt };
}

// ---------- Media ----------

/** How a game uses an image; the panel shows it in its own language. `n`: a screenshot's position. */
export type MediaField = "cover" | "card" | "pageCover" | "keyArt" | "screenshot";
export type MediaItem = { url: string; name: string; type: string; folder: string; usedBy: { title: string; id: string; field: MediaField; n: number }[] };

/** The "Used as" filter's values (kept as they were, so saved links still work) and the fields they match. */
export const MEDIA_KINDS = { cover: "cover", home: "card", page: "pageCover", key: "keyArt", screenshot: "screenshot" } as const satisfies Record<string, MediaField>;

/**
 * Every image the catalogue uses, from the database (the files themselves ship with the site in
 * public/images and are served by the CDN; size and dimensions are read in the browser).
 */
export async function listMedia(sp: SP) {
  await requireAdmin();
  const q = searchKey(first(sp.q).trim());
  const kind = first(sp.kind);
  const games = await prisma.game.findMany({ select: { id: true, title: true, coverImage: true, cardImage: true, pageCoverImage: true, screenshots: true }, orderBy: { title: "asc" } });
  const map = new Map<string, MediaItem>();
  const add = (url: string | null, field: MediaField, g: { id: string; title: string }, n = 0) => {
    if (!url) return;
    const item = map.get(url) ?? { url, name: url.split("/").pop() ?? url, type: (url.split(".").pop() ?? "").toUpperCase(), folder: url.split("/").slice(0, -1).join("/"), usedBy: [] };
    item.usedBy.push({ title: g.title, id: g.id, field, n });
    map.set(url, item);
  };
  for (const g of games) {
    add(g.coverImage, "cover", g);
    add(g.cardImage, "card", g);
    add(g.pageCoverImage, "pageCover", g);
    g.screenshots.forEach((s, i) => add(s, i === 0 ? "keyArt" : "screenshot", g, i + 1));
  }
  const all = [...map.values()];
  const field = Object.hasOwn(MEDIA_KINDS, kind) ? MEDIA_KINDS[kind as keyof typeof MEDIA_KINDS] : null;
  const filtered = all.filter((m) => (!q || searchKey(m.url).includes(q) || m.usedBy.some((u) => searchKey(u.title).includes(q))) && (!field || m.usedBy.some((u) => u.field === field)));
  return { items: filtered, total: all.length };
}

export const PLATFORM_NAMES = PLATFORMS.map((p) => p.name);
export const GENRE_NAMES = GENRES.map((g) => g.name);
