"use client";

import { Check } from "lucide-react";
import { useId, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";

/** One version as the product page shows it; prices are MDL and already resolved for "now" on the server. */
export type PanelOffer = {
  platform: string;
  edition: string | null;
  activation: string | null;
  region: string | null;
  inStock: boolean;
  price: number;
  /** Set only while a sale runs. */
  oldPrice: number | null;
  percent: number;
  /** Pre-formatted end date of the running sale. */
  saleEnds: string | null;
};

type PurchasePanelProps = {
  game: { slug: string; title: string; coverImage: string };
  offers: PanelOffer[];
};

/**
 * Purchase card: pick the version (platform), see exactly what it is — edition, activation and region
 * when the catalogue has them, and how it is delivered — then its price and the button. Details the
 * data doesn't have are left out rather than guessed.
 */
export function PurchasePanel({ game, offers }: PurchasePanelProps) {
  const { t, currency } = useI18n();
  const g = t.game;
  const [index, setIndex] = useState(() => Math.max(0, offers.findIndex((o) => o.inStock)));
  const groupId = useId();
  const offer = offers[index];
  if (!offer) return null;
  const money = (v: number) => formatMoney(v, currency);
  const label = (o: PanelOffer) => (o.edition ? `${o.platform} · ${o.edition}` : o.platform);

  const details: [string, string][] = [
    ...(offer.edition ? [[g.edition, offer.edition] as [string, string]] : []),
    ...(offer.activation ? [[g.activation, offer.activation] as [string, string]] : []),
    ...(offer.region ? [[g.region, offer.region] as [string, string]] : []),
    [g.delivery, g.deliveryValue],
  ];

  return (
    <div id="cumpara" className="scroll-mt-28 border border-gold-dark/60 bg-[#0a0907]/80 p-5 sm:p-6">
      <fieldset>
        <legend id={groupId} className="mb-3 font-display-ui text-[0.7rem] text-parchment-muted">
          {offers.length > 1 ? g.choosePlatform : g.platform}
        </legend>
        {/* Native radios: arrow keys move between versions, and the choice is announced. */}
        <div className="flex flex-wrap gap-2">
          {offers.map((o, i) => (
            <label
              key={label(o)}
              className={cn(
                "relative flex min-h-11 cursor-pointer items-center gap-2 border px-4 text-base transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-parchment",
                i === index ? "border-aged-gold bg-aged-gold/10 text-gold-light" : "border-iron text-parchment hover:border-parchment-muted",
                !o.inStock && "text-parchment-muted",
              )}
            >
              <input type="radio" name={`${groupId}-platform`} checked={i === index} onChange={() => setIndex(i)} className="sr-only" />
              {i === index && <Check aria-hidden className="size-4" />}
              {label(o)}
              {!o.inStock && <span className="text-sm">({g.outOfStock.toLowerCase()})</span>}
            </label>
          ))}
        </div>
      </fieldset>

      <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-iron pt-5 text-base">
        {details.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-parchment-muted">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 border-t border-iron pt-5" aria-live="polite">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {offer.oldPrice !== null && (
            <>
              <span className="sr-only">{g.oldPrice}</span>
              <s className="text-lg text-parchment-muted">{money(offer.oldPrice)}</s>
              <span className="sr-only">{g.newPrice}</span>
            </>
          )}
          <span className="font-display text-3xl font-semibold text-gold-light">{money(offer.price)}</span>
          {offer.oldPrice !== null && (
            <span className="bg-crimson px-2 py-0.5 text-sm text-parchment">
              <span className="sr-only">{g.discountLabel} </span>−{offer.percent}%
            </span>
          )}
        </p>
        {offer.saleEnds && <p className="mt-1 text-sm text-parchment-muted">{g.expires(offer.saleEnds)}</p>}
        {currency !== "MDL" && <p className="mt-1 text-sm text-parchment-muted">{g.currencyNote}</p>}
      </div>

      <AddToCartButton
        size="md"
        className="mt-5 w-full"
        inStock={offer.inStock}
        item={{
          slug: game.slug,
          title: game.title,
          platform: offer.platform,
          edition: offer.edition,
          price: offer.price,
          oldPrice: offer.oldPrice,
          coverImage: game.coverImage,
        }}
      />

      <ul className="mt-5 space-y-1.5 text-sm text-parchment-muted">
        {g.purchaseFacts.map((fact) => (
          <li key={fact} className="flex gap-2">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-aged-gold" />
            {fact}
          </li>
        ))}
      </ul>
      <p className="mt-3 border-t border-iron pt-3 text-sm text-parchment-muted">{g.paymentNote}</p>
    </div>
  );
}
