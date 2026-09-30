"use client";

import { useSyncExternalStore } from "react";
import { cartStore } from "./cart-store";

export function useCart() {
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  // What the lines would cost without their sales. The discount shown is the difference of the two
  // after conversion to the display currency (CartView), so it always adds up.
  const subtotal = items.reduce((sum, i) => sum + (i.oldPrice ?? i.price) * i.quantity, 0);
  return { items, count, subtotal, total, ...cartStore };
}
