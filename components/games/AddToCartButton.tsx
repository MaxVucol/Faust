"use client";

import { useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
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

export function AddToCartButton({ item, inStock, label, size = "sm", className }: AddToCartButtonProps) {
  const { t } = useI18n();
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  if (!inStock) {
    return (
      <Button size={size} variant="ghost" disabled className={className}>
        {t.game.outOfStock}
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
      <span aria-live="polite">{added ? t.game.addedToCart : (label ?? t.game.addToCart)}</span>
    </Button>
  );
}
