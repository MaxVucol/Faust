"use client";

import { useSyncExternalStore } from "react";
import { cartStore } from "./cart-store";

export function useCart() {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return { items, count, total, ...cartStore };
}
