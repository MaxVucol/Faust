"use client";

import { X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { cartItemFor, type PanelOffer } from "@/lib/purchase";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";
import { PlatformPicker } from "./PlatformPicker";
import { PriceBlock } from "./PriceBlock";

type QuickAddProps = {
  game: { slug: string; title: string; coverImage: string };
  /** The game's versions from purchaseOptions(), as on the product page. */
  offers: PanelOffer[];
  className?: string;
};

/**
 * "Add to cart" on a home card, outside the card's link so it never opens the game. One version goes
 * straight into the cart; several open a small dialog with the product page's platform choice, price
 * and button. The cart line is built by cartItemFor(), exactly as on the product page.
 */
export function QuickAdd({ game, offers, className }: QuickAddProps) {
  const { t, currency } = useI18n();
  const g = t.game;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [index, setIndex] = useState(() => Math.max(0, offers.findIndex((o) => o.inStock)));
  const [added, setAdded] = useState(false);
  // Each opening starts with a fresh "Add to cart" button inside the dialog.
  const [round, setRound] = useState(0);

  if (offers.length === 0) return null;
  if (offers.length === 1) {
    return <AddToCartButton variant="outline" className={cn("w-full", className)} inStock={offers[0].inStock} item={cartItemFor(game, offers[0])} />;
  }

  const offer = offers[index];
  const inStock = offers.some((o) => o.inStock);
  const close = () => dialogRef.current?.close();

  return (
    <>
      <Button
        size="sm"
        variant={inStock ? "outline" : "ghost"}
        className={cn("w-full", className)}
        disabled={!inStock}
        aria-haspopup="dialog"
        onClick={() => {
          setRound((r) => r + 1);
          dialogRef.current?.showModal();
        }}
      >
        <span aria-live="polite">{!inStock ? g.outOfStock : added ? g.addedToCart : g.addToCart}</span>
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        // A click on the backdrop (the dialog element itself, outside its content) closes it.
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto w-[min(26rem,calc(100%-2rem))] border border-gold-dark bg-[#0b0907] p-0 text-parchment opacity-100 transition-opacity duration-200 backdrop:bg-black/75 starting:opacity-0"
      >
        <div className="relative p-5 sm:p-6">
          <button
            type="button"
            onClick={close}
            aria-label={t.common.close}
            className="absolute top-2 right-2 flex size-10 items-center justify-center text-parchment-muted hover:text-parchment"
          >
            <X aria-hidden className="size-5" />
          </button>
          <h2 id={titleId} className="pr-10 font-display text-lg tracking-[0.12em] uppercase">
            {game.title}
          </h2>
          <div className="mt-5">
            <PlatformPicker offers={offers} index={index} onChange={setIndex} />
          </div>
          <div className="mt-5 border-t border-iron pt-4" aria-live="polite">
            <PriceBlock price={offer.price} oldPrice={offer.oldPrice} percent={offer.percent} currency={currency} labels={g} className="font-display text-2xl" saleRowClassName="font-body text-sm" />
          </div>
          <AddToCartButton
            key={round}
            size="md"
            className="mt-5 w-full"
            inStock={offer.inStock}
            item={cartItemFor(game, offer)}
            onAdded={() => {
              setAdded(true);
              close();
            }}
          />
        </div>
      </dialog>
    </>
  );
}
