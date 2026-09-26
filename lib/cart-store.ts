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
    const existing = items.find((i) => i.slug === item.slug);
    write(
      existing
        ? items.map((i) => (i.slug === item.slug ? { ...i, quantity: i.quantity + 1 } : i))
        : [...items, { ...item, quantity: 1 }],
    );
  },
  setQuantity(slug: string, quantity: number) {
    write(
      quantity <= 0
        ? read().filter((i) => i.slug !== slug)
        : read().map((i) => (i.slug === slug ? { ...i, quantity } : i)),
    );
  },
  clear() {
    write([]);
  },
};
