import type { CartItem } from "@/types";

const KEY = "iron-vault-cart";
const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();
let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY };

function read(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return cache.items;
  }
  if (raw === cache.raw) return cache.items;
  let items: CartItem[] = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) items = parsed as CartItem[];
  } catch {
    items = EMPTY;
  }
  cache = { raw, items };
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
        ? items.map((i) => (lineKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i))
        : [...items, { ...item, quantity: 1 }],
    );
  },
  /** `key` from lineKey(); 0 or less removes the line. */
  setQuantity(key: string, quantity: number) {
    write(
      quantity <= 0
        ? read().filter((i) => lineKey(i) !== key)
        : read().map((i) => (lineKey(i) === key ? { ...i, quantity } : i)),
    );
  },
  clear() {
    write([]);
  },
};
