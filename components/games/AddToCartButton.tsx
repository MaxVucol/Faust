"use client";

import { useRouter } from "next/navigation";
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
  /** "Buy now": the same line goes into the cart, then the cart opens (it prices the order from the catalogue). */
  buyNow?: boolean;
};

export function AddToCartButton({ item, inStock, label, size = "sm", className, variant = "primary", onAdded, buyNow = false }: AddToCartButtonProps) {
  const { t } = useI18n();
  const { add } = useCart();
  const router = useRouter();
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
        if (buyNow) router.push("/cos");
      }}
    >
      <span aria-live="polite">{added && !buyNow ? t.game.addedToCart : (label ?? (buyNow ? t.game.buyNow : t.game.addToCart))}</span>
    </Button>
  );
}
