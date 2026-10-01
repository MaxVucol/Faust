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
  /** "outline" where the button is secondary (home cards); the product page keeps the solid one. */
  variant?: "primary" | "outline";
  /** Runs after the item is in the cart (e.g. to close the platform dialog). */
  onAdded?: () => void;
};

export function AddToCartButton({ item, inStock, label, size = "sm", className, variant = "primary", onAdded }: AddToCartButtonProps) {
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
      variant={variant}
      className={className}
      onClick={() => {
        add(item);
        setAdded(true);
        onAdded?.();
      }}
    >
      <span aria-live="polite">{added ? t.game.addedToCart : (label ?? t.game.addToCart)}</span>
    </Button>
  );
}
