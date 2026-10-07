"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { Diamond } from "@/components/ui/Ornaments";
import { formatMoney } from "@/lib/currency";
import { cartItemFor, type PanelOffer } from "@/lib/purchase";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";
import { GameImage } from "./GameImage";
import { PlatformPicker } from "./PlatformPicker";
import { useLiveOffers } from "./SaleSwitch";

type QuickAddProps = {
  game: { slug: string; title: string; coverImage: string };
  /** The game's versions from purchaseOptions(), as on the product page. */
  offers: PanelOffer[];
  className?: string;
  /** "Buy now" instead of "Add to cart": after adding, the cart opens. */
  buyNow?: boolean;
  /** The trigger's look; the cards keep the quiet outline. */
  variant?: "outline" | "primary";
  size?: "sm" | "md";
};

/**
 * "Add to cart" on a home or catalogue card, outside the card's link so it never opens the game. One
 * version goes straight into the cart; several open the purchase dialog: the game's cover, its title,
 * the platform choice, the price and the button. The cart line is built by cartItemFor(), exactly as
 * on the product page.
 */
export function QuickAdd({ game, offers: rendered, className, buyNow = false, variant = "outline", size = "sm" }: QuickAddProps) {
  const { t, currency } = useI18n();
  const offers = useLiveOffers(rendered);
  const g = t.game;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [index, setIndex] = useState(() => Math.max(0, offers.findIndex((o) => o.inStock)));
  const [added, setAdded] = useState(false);
  // The dialog's content exists only while it is open: a grid of cards carries no hidden covers,
  // prices or pickers, the cover is fetched only when someone opens it, and every opening starts with
  // a fresh "Add to cart" button.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  if (offers.length === 0) return null;
  if (offers.length === 1) {
    return <AddToCartButton variant={variant} size={size} buyNow={buyNow} className={cn("w-full", className)} inStock={offers[0].inStock} item={cartItemFor(game, offers[0])} />;
  }

  const offer = offers[index];
  const inStock = offers.some((o) => o.inStock);
  const onSale = offer.oldPrice !== null && offer.oldPrice > offer.price;
  // Every way of closing (×, Escape, a click outside) ends in the dialog's "close" event, which clears `open`.
  const close = () => dialogRef.current?.close();

  return (
    <>
      <Button size={size} variant={inStock ? variant : "ghost"} className={cn("w-full", className)} disabled={!inStock} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <span aria-live="polite">{!inStock ? g.outOfStock : buyNow ? g.buyNow : added ? g.addedToCart : g.addToCart}</span>
      </Button>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        // A click on the backdrop (the dialog element itself, outside its content) closes it.
        onClick={(e) => e.target === e.currentTarget && close()}
        className={cn(
          // A double frame, as on the cart ledger: antique gold outside, iron inside, near-black within.
          "m-auto max-h-[calc(100dvh-1.5rem)] w-[min(50rem,calc(100%-1.5rem))] overflow-y-auto overscroll-contain border border-gold-dark/80 bg-[#0b0907] p-1.5 text-parchment sm:p-2",
          // Enters with a short fade and an 8px rise; no movement with reduced motion.
          "translate-y-0 opacity-100 transition-[opacity,translate] duration-200 ease-out backdrop:bg-black/80 starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none",
        )}
      >
        {open && (
          <div className="relative grid border border-iron/80 bg-[#0d0b09] md:grid-cols-[minmax(0,38%)_minmax(0,1fr)]">
            <button
              type="button"
              onClick={close}
              aria-label={t.common.close}
              className="absolute top-1.5 right-1.5 z-10 flex size-11 items-center justify-center border border-transparent text-aged-gold transition-colors duration-200 hover:border-gold-dark hover:text-gold-light"
            >
              <X aria-hidden strokeWidth={1.5} className="size-[1.1rem]" />
            </button>

            {/* The cover: the game's own art in a thin gold frame, on the darkest ground of the dialog. */}
            <div className="flex items-center justify-center border-b border-iron/80 bg-[#080706] px-6 pt-12 pb-7 md:border-r md:border-b-0 md:p-8">
              <div className="relative aspect-[3/4] h-[min(15rem,30dvh)] overflow-hidden border border-gold-dark/70 shadow-[0_16px_32px_-12px_rgb(0_0_0/0.9)] md:h-auto md:w-full">
                <GameImage src={game.coverImage} alt="" sizes="(min-width: 768px) 260px, 180px" />
              </div>
            </div>

            <div className="flex flex-col px-5 pt-6 pb-6 sm:px-8 md:py-9 md:pr-10">
              <h2 id={titleId} className="font-display text-2xl leading-tight font-semibold tracking-[0.1em] text-parchment uppercase sm:text-[1.65rem] md:pr-8">
                {game.title}
              </h2>
              <div aria-hidden className="mt-4 flex items-center gap-2">
                <span className="h-px w-8 bg-gold-dark/80" />
                <Diamond className="size-1.5 bg-gold-dark" />
                <span className="h-px w-8 bg-gold-dark/80" />
              </div>

              <div className="mt-6 md:mt-7">
                <PlatformPicker offers={offers} index={index} onChange={setIndex} layout="stacked" />
              </div>

              {/* The chosen version's price: the old one struck above, the price to pay with the sale percentage. */}
              <div className="mt-6 border-t border-iron/80 pt-5 md:mt-7" aria-live="polite">
                <p className="font-display-ui text-[0.7rem] text-parchment-muted">{t.catalog.price(currency)}</p>
                {onSale && (
                  <p className="mt-2 text-sm text-parchment-muted tabular-nums">
                    <span className="sr-only">{g.oldPrice} </span>
                    <s className="decoration-parchment-muted/70">{formatMoney(offer.oldPrice as number, currency)}</s>
                  </p>
                )}
                <p className={cn("flex flex-wrap items-center gap-x-3 gap-y-1", onSale ? "mt-1" : "mt-2")}>
                  <span className="font-display text-3xl leading-none font-semibold text-gold-light tabular-nums">
                    {onSale && <span className="sr-only">{g.newPrice} </span>}
                    {formatMoney(offer.price, currency)}
                  </span>
                  {onSale && offer.percent > 0 && (
                    <span className="bg-crimson px-1.5 py-1 text-sm leading-none text-parchment tabular-nums">
                      <span className="sr-only">{g.discountLabel} </span>−{offer.percent}%
                    </span>
                  )}
                </p>
                {currency !== "MDL" && <p className="mt-3 text-xs leading-relaxed text-parchment-muted">{g.currencyNote}</p>}
              </div>

              <AddToCartButton
                size="md"
                className="mt-6 w-full md:mt-7"
                inStock={offer.inStock}
                item={cartItemFor(game, offer)}
                buyNow={buyNow}
                onAdded={() => {
                  setAdded(true);
                  close();
                }}
              />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
