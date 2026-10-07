"use client";

import { Check, Globe } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cartItemFor, type PanelOffer } from "@/lib/purchase";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";
import { PlatformPicker } from "./PlatformPicker";
import { PriceBlock } from "./PriceBlock";
import { useLiveOffers } from "./SaleSwitch";

export type { PanelOffer };

type PurchasePanelProps = {
  game: { slug: string; title: string; coverImage: string };
  offers: PanelOffer[];
};

/**
 * Purchase card: pick the version (platform); its activation region, plainly (or, when the catalogue
 * doesn't know it, saying so); its price; "Add to cart" and "Buy now" (the same cart line, then the cart);
 * then what to know before buying: a digital key, how it is delivered, how it is activated (or that this
 * isn't known), the edition. Nothing the data doesn't have is guessed.
 */
export function PurchasePanel({ game, offers: rendered }: PurchasePanelProps) {
  const { t, currency } = useI18n();
  const offers = useLiveOffers(rendered);
  const g = t.game;
  const [index, setIndex] = useState(() => Math.max(0, offers.findIndex((o) => o.inStock)));
  const offer = offers[index];
  if (!offer) return null;

  const facts: { label: string; value?: string; known: boolean }[] = [
    { label: g.goodDigital, known: true },
    { label: g.goodDelivery, value: g.deliveryValue, known: true },
    offer.activation ? { label: g.activation, value: offer.activation, known: true } : { label: g.activationUnknown, known: false },
    ...(offer.edition ? [{ label: g.edition, value: offer.edition, known: true }] : []),
  ];

  return (
    <div id="cumpara" className="scroll-mt-28 border border-gold-dark/60 bg-[#0a0907]/80 p-5 sm:p-6">
      <PlatformPicker offers={offers} index={index} onChange={setIndex} />

      {/* The region, where the decision is made. */}
      <p className={cn("mt-5 flex items-center gap-2.5 border-t border-iron pt-4 text-base", offer.region ? "text-parchment" : "text-parchment-muted")}>
        <Globe aria-hidden strokeWidth={1.6} className="size-[1.1rem] shrink-0 text-gold-light" />
        {offer.region ? (
          <span>
            <span className="font-display-ui text-[0.68rem] text-parchment-muted">{g.region}: </span>
            <span className="font-display tracking-[0.08em] uppercase">{offer.region}</span>
          </span>
        ) : (
          g.regionUnknown
        )}
      </p>

      <div className="mt-4 border-t border-iron pt-5" aria-live="polite">
        <PriceBlock
          price={offer.price}
          oldPrice={offer.oldPrice}
          percent={offer.percent}
          currency={currency}
          labels={g}
          className="gap-2 font-display text-3xl"
          saleRowClassName="font-body text-base"
        />
        {offer.saleEnds && <p className="mt-1 text-sm text-parchment-muted">{g.expires(offer.saleEnds)}</p>}
        {currency !== "MDL" && <p className="mt-1 text-sm text-parchment-muted">{g.currencyNote}</p>}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <AddToCartButton size="md" className="w-full" inStock={offer.inStock} item={cartItemFor(game, offer)} />
        {offer.inStock && <AddToCartButton size="md" variant="outline" buyNow className="w-full" inStock item={cartItemFor(game, offer)} />}
      </div>

      <h3 className="mt-6 font-display-ui text-[0.66rem] text-gold-light">{g.goodToKnow}</h3>
      <ul className="mt-2.5 space-y-1.5 text-sm">
        {facts.map((f) => (
          <li key={f.label} className={cn("flex gap-2", f.known ? "text-parchment" : "text-parchment-muted")}>
            <Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", f.known ? "text-aged-gold" : "text-iron")} />
            <span>
              {f.label}
              {f.value && <span className="text-parchment-muted">: {f.value}</span>}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-iron pt-3 text-sm text-parchment-muted">{g.paymentNote}</p>
    </div>
  );
}
