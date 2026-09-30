"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { lineKey } from "@/lib/cart-store";
import { convert, formatAmount, formatMoney } from "@/lib/currency";
import { useCart } from "@/lib/use-cart";

const noop = () => () => {};

/** False during server render and hydration, true once the browser (and the saved cart) is available. */
function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function CartView() {
  const { t, currency } = useI18n();
  const c = t.cart;
  const { items, count, subtotal, total, setQuantity, clear } = useCart();
  const money = (v: number) => formatMoney(v, currency);
  // Totals are converted and rounded first; the discount is their difference, so the summary
  // always adds up in every currency.
  const shownSubtotal = convert(subtotal, currency);
  const shownTotal = convert(total, currency);
  const shownSavings = Math.round((shownSubtotal - shownTotal) * 100) / 100;
  const isClient = useIsClient();

  // The cart lives in this browser, so the server can't render it: show its outline until it's read.
  if (!isClient) {
    return (
      <div aria-busy="true" aria-label={c.loading} className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5 border-t border-iron pt-5">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4 border-b border-iron pb-5">
              <div className="aspect-[3/4] w-20 shrink-0 animate-pulse bg-white/[0.04]" />
              <div className="flex-1 space-y-3 pt-1">
                <div className="h-4 w-1/2 animate-pulse bg-white/[0.05]" />
                <div className="h-4 w-1/4 animate-pulse bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-64 animate-pulse border border-iron bg-surface" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="border border-iron bg-surface px-6 py-16 text-center">
        <p className="font-display text-xl text-parchment">{c.empty}</p>
        <p className="mt-2 text-parchment-muted">{c.emptyText}</p>
        <ButtonLink href="/produse" className="mt-6">
          {c.browse}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <ul className="border-t border-iron">
        {items.map((item) => {
          const key = lineKey(item);
          const percent = item.oldPrice ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0;
          return (
            <li key={key} className="flex gap-4 border-b border-iron py-5">
              <div className="relative aspect-[3/4] w-20 shrink-0 border border-iron">
                <Image src={item.coverImage} alt="" fill sizes="80px" className="object-cover saturate-[0.85]" />
              </div>
              <div className="flex flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <Link prefetch href={`/produse/${item.slug}`} className="font-display text-sm font-semibold tracking-[0.1em] uppercase hover:text-aged-gold">
                    {item.title}
                  </Link>
                  <p className="text-sm text-parchment-muted">
                    {item.platform ? [item.platform, item.edition].filter(Boolean).join(" · ") : c.platformUnknown}
                  </p>
                  <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                    {item.oldPrice ? (
                      <>
                        <span className="sr-only">{t.game.oldPrice}</span>
                        <s className="text-sm text-parchment-muted">{money(item.oldPrice)}</s>
                        <span className="sr-only">{t.game.newPrice}</span>
                      </>
                    ) : null}
                    <span className="font-semibold text-gold-light">{money(item.price)}</span>
                    {percent > 0 && (
                      <span className="text-sm text-blood-text">
                        <span className="sr-only">{t.game.discountLabel} </span>−{percent}%
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <button
                      type="button"
                      aria-label={c.decrease(item.title)}
                      onClick={() => setQuantity(key, item.quantity - 1)}
                      className="flex size-10 items-center justify-center border border-iron hover:border-aged-gold"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-10 text-center" aria-label={c.quantity}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={c.increase(item.title)}
                      onClick={() => setQuantity(key, item.quantity + 1)}
                      className="flex size-10 items-center justify-center border border-iron hover:border-aged-gold"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label={c.remove(item.title)}
                    onClick={() => setQuantity(key, 0)}
                    className="flex min-h-10 items-center gap-1.5 px-1 text-sm text-parchment-muted transition-colors duration-200 hover:text-blood-text"
                  >
                    <X aria-hidden className="size-4" />
                    {c.removeLabel}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <aside aria-label={c.summary} className="h-fit border border-iron bg-surface p-6">
        <p className="text-sm text-parchment-muted">{c.items(count)}</p>
        <dl className="mt-4 space-y-2 text-base">
          <div className="flex justify-between gap-4">
            <dt className="text-parchment-muted">{c.subtotal}</dt>
            <dd>{formatAmount(shownSubtotal, currency)}</dd>
          </div>
          {shownSavings > 0 && (
            <div className="flex justify-between gap-4">
              <dt className="text-parchment-muted">{c.discount}</dt>
              <dd className="text-blood-text">−{formatAmount(shownSavings, currency)}</dd>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-4 border-t border-iron pt-3">
            <dt className="font-display-ui text-[0.7rem] text-parchment-muted">{c.total}</dt>
            <dd className="font-display text-2xl font-semibold text-gold-light">{formatAmount(shownTotal, currency)}</dd>
          </div>
        </dl>
        {currency !== "MDL" && <p className="mt-2 text-sm text-parchment-muted">{t.game.currencyNote}</p>}
        <Divider className="my-6" />
        <Button className="w-full" disabled aria-describedby="checkout-note">
          {c.checkout}
        </Button>
        <p id="checkout-note" className="mt-3 text-sm text-parchment-muted">
          {c.checkoutSoon}
        </p>
        <button type="button" onClick={clear} className="mt-6 min-h-10 font-display-ui text-[0.65rem] text-parchment-muted hover:text-parchment">
          {c.clear}
        </button>
      </aside>
    </div>
  );
}
