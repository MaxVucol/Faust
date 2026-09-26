"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/use-cart";
import type { CartItem } from "@/types";

type AddToCartButtonProps = {
  item: Omit<CartItem, "quantity">;
  inStock: boolean;
  label?: string;
  size?: "md" | "sm";
  className?: string;
};

export function AddToCartButton({ item, inStock, label = "Adaugă în coș", size = "sm", className }: AddToCartButtonProps) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (!inStock) {
    return (
      <Button size={size} variant="ghost" disabled className={className}>
        Stoc epuizat
      </Button>
    );
  }
  return (
    <Button
      size={size}
      className={className}
      onClick={() => {
        add(item);
        setAdded(true);
      }}
    >
      <span aria-live="polite">{added ? "Adăugat în coș" : label}</span>
    </Button>
  );
}
