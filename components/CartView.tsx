"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { getCartPrices } from "@/app/actions";
import { CheckoutForm } from "@/components/CheckoutForm";
import { PriceBlock } from "@/components/games/PriceBlock";
import { useI18n } from "@/components/i18n/I18nProvider";
import { ButtonLink } from "@/components/ui/Button";
import { Diamond } from "@/components/ui/Ornaments";
import { cartStore, lineKey, type FreshLine } from "@/lib/cart-store";
import { convert, formatAmount, formatMoney } from "@/lib/currency";
import { discountPercent } from "@/lib/format";
import { useCart } from "@/lib/use-cart";

const noop = () => () => {};

/** False during server render and hydration, true once the browser (and the saved cart) is available. */
function useIsClient() {
  return useSyncExternalStore(noop, () => true, () => false);
}

/**
 * Prices the saved lines from the catalogue once the cart is read, again whenever a line is added or
 * removed, and on `refresh`: the saved prices are replaced with the current ones (cartStore.reprice), so
 * the page shows what the order is charged. Lines that can't be bought any more come back in
 * `unavailable`; `updated` is set once a saved price turned out to differ. If the request fails, the
 * saved prices stay and the server still checks the total when the order is sent.
 */
function useFreshPrices(lineKeys: string) {
  const [round, setRound] = useState(0);
  const [state, setState] = useState<{ unavailable: ReadonlySet<string>; updated: boolean }>({ unavailable: new Set(), updated: false });
  useEffect(() => {
    const lines = cartStore.getSnapshot();
    if (lines.length === 0) return;
    let cancelled = false;
    getCartPrices(lines.map(({ slug, platform, edition }) => ({ slug, platform, edition })))
      .then((prices) => {
        if (cancelled || !prices) return;
        const fresh = new Map<string, FreshLine>();
        const unavailable = new Set<string>();
        lines.forEach((line, i) => {
          const p = prices[i];
          if (p) fresh.set(lineKey(line), { title: p.title, coverImage: p.coverImage, price: p.price, oldPrice: p.oldPrice });
          else unavailable.add(lineKey(line));
        });
        const changed = cartStore.reprice(fresh);
        setState((s) => ({ unavailable, updated: s.updated || changed }));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [lineKeys, round]);
  return { ...state, refresh: () => setRound((r) => r + 1) };
}

/** Small gold section title with a rule under it, shared by the ledger's three sections. */
function SectionTitle({ id, children, aside }: { id?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-gold-dark/50 pb-3">
      <h2 id={id} className="flex items-center gap-2.5 font-display-ui text-[0.72rem] text-gold-light">
        <Diamond className="size-1.5 bg-gold-dark" />
        {children}
      </h2>
      {aside}
    </div>
  );
}

/** A centred message inside the ledger (empty cart, order sent), with one way onwards. */
function LedgerMessage({ title, text, action, status = false }: { title: string; text: string; action: ReactNode; status?: boolean }) {
  return (
    <div role={status ? "status" : undefined} className="flex flex-col items-center border-t border-iron/80 px-6 py-14 text-center sm:py-20">
      <span aria-hidden className="flex size-16 items-center justify-center border border-gold-dark/70 bg-[#100d0a]">
        <ShoppingCart className="size-7 text-gold-light" strokeWidth={1.5} />
      </span>
      <p className="mt-6 font-display text-xl tracking-[0.12em] text-parchment uppercase">{title}</p>
      <p className="mt-2 max-w-md text-parchment-muted">{text}</p>
      <div className="mt-8">{action}</div>
    </div>
  );
}

/**
 * The cart ledger's content: the chosen games on the left, the order summary and the order details on
 * the right (stacked in that order on phones). Cart state, quantities, totals and the order form are
 * the existing ones; this only lays them out.
 */
export function CartView() {
  const { t, currency } = useI18n();
  const c = t.cart;
  const { items, setQuantity, clear } = useCart();
  const { unavailable, updated, refresh } = useFreshPrices(items.map(lineKey).join("\n"));
  // Only lines that can still be bought go into the order and its totals.
  const orderable = items.filter((i) => !unavailable.has(lineKey(i)));
  const count = orderable.reduce((sum, i) => sum + i.quantity, 0);
  const total = orderable.reduce((sum, i) => sum + i.price * i.quantity, 0);
  // What the lines would cost without their sales.
  const subtotal = orderable.reduce((sum, i) => sum + (i.oldPrice ?? i.price) * i.quantity, 0);
  // Totals are converted and rounded first; the discount is their difference, so the summary
  // always adds up in every currency.
  const shownSubtotal = convert(subtotal, currency);
  const shownTotal = convert(total, currency);
  const shownSavings = Math.round((shownSubtotal - shownTotal) * 100) / 100;
  const isClient = useIsClient();
  // Confirmation of a sent order; the cart is emptied at the same moment.
  const [placed, setPlaced] = useState<string | null>(null);

  if (placed) {
    return (
      <LedgerMessage
        status
        title={c.order.successTitle}
        text={placed}
        action={
          <ButtonLink href="/produse" variant="gold">
            {c.browse}
          </ButtonLink>
        }
      />
    );
  }

  // The cart lives in this browser, so the server can't render it: show its outline until it's read.
  if (!isClient) {
    return (
      <div aria-busy="true" aria-label={c.loading} className="grid border-t border-iron/80 lg:grid-cols-[minmax(0,1fr)_minmax(340px,38%)]">
        <div className="space-y-5 px-4 py-6 sm:px-8 sm:py-8">
          <div className="h-4 w-40 animate-pulse bg-white/[0.05]" />
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4 border-b border-iron/70 pb-5 sm:gap-6">
              <div className="aspect-[3/4] w-[5.5rem] shrink-0 animate-pulse bg-white/[0.04] sm:w-28" />
              <div className="flex-1 space-y-3 pt-1">
                <div className="h-4 w-1/2 animate-pulse bg-white/[0.05]" />
                <div className="h-4 w-1/4 animate-pulse bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-80 border-t border-iron/80 bg-[#100d0a] lg:h-auto lg:border-t-0 lg:border-l" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <LedgerMessage
        title={c.empty}
        text={c.emptyText}
        action={
          <ButtonLink href="/produse" variant="gold">
            {c.browse}
          </ButtonLink>
        }
      />
    );
  }

  return (
    <div className="grid border-t border-iron/80 lg:grid-cols-[minmax(0,1fr)_minmax(340px,38%)]">
      <section aria-labelledby="cos-jocuri" className="px-4 py-6 sm:px-8 sm:py-8">
        <SectionTitle id="cos-jocuri" aside={<span className="text-sm text-parchment-muted">{c.items(items.reduce((sum, i) => sum + i.quantity, 0))}</span>}>
          {c.itemsTitle}
        </SectionTitle>
        <ul>
          {items.map((item) => {
            const key = lineKey(item);
            const href = `/produse/${item.slug}`;
            const percent = item.oldPrice ? discountPercent({ price: item.oldPrice, discountPrice: item.price, discountEndsAt: null }) : 0;
            return (
              <li key={key} className="flex gap-4 border-b border-iron/70 py-5 last:border-b-0 sm:gap-6 sm:py-6">
                <Link href={href} prefetch={false} tabIndex={-1} aria-hidden className="relative aspect-[3/4] w-[5.5rem] shrink-0 self-start overflow-hidden border border-gold-dark/50 sm:w-28">
                  <Image src={item.coverImage} alt="" fill sizes="(min-width: 640px) 112px, 88px" className="object-cover saturate-[0.85]" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <Link prefetch href={href} className="font-display text-base font-semibold tracking-[0.1em] text-parchment uppercase transition-colors duration-200 hover:text-gold-light sm:text-lg">
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm text-parchment-muted">
                      {item.platform ? (
                        <>
                          {t.game.platform}: <span className="text-parchment">{[item.platform, item.edition].filter(Boolean).join(" · ")}</span>
                        </>
                      ) : (
                        c.platformUnknown
                      )}
                    </p>
                    {unavailable.has(key) && <p className="mt-2 text-sm text-stock-out">{c.lineUnavailable}</p>}
                    <PriceBlock price={item.price} oldPrice={item.oldPrice ?? null} percent={percent} currency={currency} labels={t.game} className="mt-3 text-xl" />
                    {item.quantity > 1 && (
                      <p className="mt-1.5 text-sm text-parchment-muted tabular-nums">
                        {c.total}: <span className="text-parchment">{formatMoney(item.price * item.quantity, currency)}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    {/* Compact stepper: −, the quantity, + in one framed strip. */}
                    <div role="group" aria-label={c.quantity} className="flex items-stretch border border-iron bg-base">
                      <button
                        type="button"
                        aria-label={c.decrease(item.title)}
                        onClick={() => setQuantity(key, item.quantity - 1)}
                        className="flex size-9 items-center justify-center text-parchment-muted transition-colors duration-200 hover:bg-white/[0.04] hover:text-gold-light"
                      >
                        <Minus aria-hidden className="size-3.5" />
                      </button>
                      <span aria-live="polite" className="flex w-10 items-center justify-center border-x border-iron font-display text-base text-parchment tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={c.increase(item.title)}
                        onClick={() => setQuantity(key, item.quantity + 1)}
                        className="flex size-9 items-center justify-center text-parchment-muted transition-colors duration-200 hover:bg-white/[0.04] hover:text-gold-light"
                      >
                        <Plus aria-hidden className="size-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      aria-label={c.remove(item.title)}
                      onClick={() => setQuantity(key, 0)}
                      className="inline-flex min-h-9 items-center gap-1.5 text-sm text-parchment-muted underline-offset-4 transition-colors duration-200 hover:text-blood-text hover:underline"
                    >
                      <X aria-hidden className="size-3.5" />
                      {c.removeLabel}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-end border-t border-iron/70 pt-4">
          <button type="button" onClick={clear} className="min-h-9 font-display-ui text-[0.65rem] text-parchment-muted transition-colors duration-200 hover:text-parchment">
            {c.clear}
          </button>
        </div>
      </section>

      <aside aria-label={c.summary} className="border-t border-iron/80 bg-[#100d0a] px-4 py-6 sm:px-8 sm:py-8 lg:border-t-0 lg:border-l">
        <SectionTitle>{c.summary}</SectionTitle>
        <dl className="mt-3 text-base">
          <div className="flex justify-between gap-4 py-1.5">
            <dt className="text-parchment-muted">{c.quantity}</dt>
            <dd className="tabular-nums">{c.items(count)}</dd>
          </div>
          <div className="flex justify-between gap-4 py-1.5">
            <dt className="text-parchment-muted">{c.subtotal}</dt>
            <dd className="tabular-nums">{formatAmount(shownSubtotal, currency)}</dd>
          </div>
          {shownSavings > 0 && (
            <div className="flex justify-between gap-4 py-1.5">
              <dt className="text-parchment-muted">{c.discount}</dt>
              <dd className="text-blood-text tabular-nums">−{formatAmount(shownSavings, currency)}</dd>
            </div>
          )}
          <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-gold-dark/60 pt-4">
            <dt className="font-display-ui text-[0.75rem] text-gold-light">{c.total}</dt>
            <dd className="font-display text-3xl font-semibold text-gold-light tabular-nums sm:text-[2.1rem]">{formatAmount(shownTotal, currency)}</dd>
          </div>
        </dl>
        {currency !== "MDL" && <p className="mt-2 text-sm text-parchment-muted">{t.game.currencyNote}</p>}
        {updated && (
          <p role="status" className="mt-2 text-sm text-parchment-muted">
            {c.pricesUpdated}
          </p>
        )}

        {orderable.length > 0 && (
          <div className="mt-9">
            <CheckoutForm
              items={orderable}
              total={Math.round(total * 100) / 100}
              onPlaced={(message) => {
                setPlaced(message);
                clear();
              }}
              onCartChanged={refresh}
            />
          </div>
        )}
      </aside>
    </div>
  );
}
