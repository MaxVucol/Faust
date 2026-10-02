import type { CartItem } from "@/types";

const KEY = "iron-vault-cart";
const EMPTY: CartItem[] = [];
/** The most of one line an order may hold (orderSchema in lib/schemas.ts). */
export const MAX_QUANTITY = 99;
const listeners = new Set<() => void>();
let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY };

const SLUG = /^[a-z0-9-]{1,120}$/;
const isText = (v: unknown): v is string => typeof v === "string" && v.trim() !== "";
const isAmount = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0;

/**
 * One saved line, checked field by field: storage can hold anything (edited by hand, an older format,
 * another script), and a bad line must never reach the page. Returns null for a line that can't be
 * used; a valid line comes back as the same object, so clean storage reads back unchanged.
 */
function toItem(value: unknown): CartItem | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.slug !== "string" || !SLUG.test(v.slug) || !isText(v.title)) return null;
  // A local image path only: next/image refuses other hosts.
  if (typeof v.coverImage !== "string" || !v.coverImage.startsWith("/") || v.coverImage.startsWith("//")) return null;
  if (!isAmount(v.price)) return null;
  if (typeof v.quantity !== "number" || !Number.isInteger(v.quantity) || v.quantity < 1) return null;
  // Absent only on lines saved before platforms existed; never null (the order would refuse it).
  if (v.platform !== undefined && !isText(v.platform)) return null;
  if (v.edition != null && typeof v.edition !== "string") return null;
  const item = value as CartItem;
  const oldPriceOk = v.oldPrice == null || (isAmount(v.oldPrice) && v.oldPrice > v.price);
  if (v.quantity <= MAX_QUANTITY && oldPriceOk) return item;
  return { ...item, quantity: Math.min(v.quantity, MAX_QUANTITY), oldPrice: oldPriceOk ? item.oldPrice : null };
}

/** The valid lines of a saved cart, each line once; anything else (bad JSON, not a list) is an empty cart. */
function parse(raw: string | null): CartItem[] {
  let parsed: unknown;
  try {
    parsed = raw ? JSON.parse(raw) : [];
  } catch {
    return EMPTY;
  }
  if (!Array.isArray(parsed)) return EMPTY;
  const seen = new Set<string>();
  const items: CartItem[] = [];
  for (const value of parsed) {
    const item = toItem(value);
    if (!item || seen.has(lineKey(item))) continue;
    seen.add(lineKey(item));
    items.push(item);
  }
  return items.length ? items : EMPTY;
}

function read(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return cache.items;
  }
  if (raw === cache.raw) return cache.items;
  const items = parse(raw);
  // Save the cleaned cart back, so dropped lines are gone for good rather than re-checked on every read.
  const clean = raw === null ? null : JSON.stringify(items);
  if (clean !== raw) {
    try {
      window.localStorage.setItem(KEY, clean as string);
    } catch {
      // Storage unavailable: the cleaned list is still what the page uses.
    }
  }
  cache = { raw: clean, items };
  return items;
}

function write(items: CartItem[]) {
  const raw = JSON.stringify(items);
  cache = { raw, items };
  try {
    window.localStorage.setItem(KEY, raw);
  } catch {
    // Storage unavailable (private mode): keep the in-memory cart for this session.
  }
  listeners.forEach((l) => l());
}

/** A cart line is one game on one platform (and edition). */
export function lineKey(item: Pick<CartItem, "slug" | "platform" | "edition">): string {
  return [item.slug, item.platform ?? "", item.edition ?? ""].join("|");
}

/** The catalogue's current details of a line (see getCartPrices in app/actions.ts). */
export type FreshLine = Pick<CartItem, "title" | "coverImage" | "price" | "oldPrice">;

export const cartStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => e.key === KEY && listener();
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot: read,
  getServerSnapshot: () => EMPTY,
  add(item: Omit<CartItem, "quantity">) {
    const items = read();
    const key = lineKey(item);
    const existing = items.find((i) => lineKey(i) === key);
    write(
      existing
        ? items.map((i) => (lineKey(i) === key ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY) } : i))
        : [...items, { ...item, quantity: 1 }],
    );
  },
  /** `key` from lineKey(); 0 or less removes the line. */
  setQuantity(key: string, quantity: number) {
    if (!Number.isFinite(quantity)) return;
    const q = Math.min(Math.floor(quantity), MAX_QUANTITY);
    write(q <= 0 ? read().filter((i) => lineKey(i) !== key) : read().map((i) => (lineKey(i) === key ? { ...i, quantity: q } : i)));
  },
  /**
   * Replaces the saved price, sale, title and cover of each line in `fresh` (keyed by lineKey) with the
   * catalogue's. Returns whether any price or sale changed.
   */
  reprice(fresh: Map<string, FreshLine>): boolean {
    let changed = false;
    let priceChanged = false;
    const next = read().map((i) => {
      const f = fresh.get(lineKey(i));
      if (!f) return i;
      const samePrice = f.price === i.price && (f.oldPrice ?? null) === (i.oldPrice ?? null);
      if (samePrice && f.title === i.title && f.coverImage === i.coverImage) return i;
      changed = true;
      if (!samePrice) priceChanged = true;
      return { ...i, ...f };
    });
    if (changed) write(next);
    return priceChanged;
  },
  clear() {
    write([]);
  },
};
