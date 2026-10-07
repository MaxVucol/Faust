"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { formatMoney } from "@/lib/currency";
import { platformShort } from "@/lib/catalog";
import { cartItemFor, type PanelOffer } from "@/lib/purchase";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "./AddToCartButton";
import { useLiveOffers } from "./SaleSwitch";

const noop = () => () => {};

/**
 * A slim bar fixed to the bottom of the screen once the purchase card (#cumpara) has scrolled up out of
 * view: the title, the platform(s), the price and "Buy now". It hides again when the card or the footer
 * is on screen, so it never sits over the purchase card or the page's last links. With one version
 * "Buy now" adds it and opens the cart; with several it goes back to the card, where the version is chosen.
 */
export function StickyPurchaseBar({ game, offers: rendered }: { game: { slug: string; title: string; coverImage: string }; offers: PanelOffer[] }) {
  const { t, currency } = useI18n();
  const offers = useLiveOffers(rendered);
  const g = t.game;
  const [visible, setVisible] = useState(false);
  // Rendered into <body> once in the browser: the page wrapper's entrance animation (app/template.tsx)
  // uses a transform, which would pin a fixed bar to the bottom of the page instead of the screen.
  const isClient = useSyncExternalStore(noop, () => true, () => false);

  useEffect(() => {
    const card = document.getElementById("cumpara");
    const footer = document.querySelector("footer");
    if (!card) return;
    let cardAbove = false;
    let footerSeen = false;
    const update = () => setVisible(cardAbove && !footerSeen);
    const watchCard = new IntersectionObserver(([e]) => {
      cardAbove = !e.isIntersecting && e.boundingClientRect.bottom < 0;
      update();
    });
    const watchFooter = new IntersectionObserver(([e]) => {
      footerSeen = e.isIntersecting;
      update();
    });
    watchCard.observe(card);
    if (footer) watchFooter.observe(footer);
    return () => {
      watchCard.disconnect();
      watchFooter.disconnect();
    };
  }, []);

  const buyable = offers.filter((o) => o.inStock);
  if (buyable.length === 0) return null;
  const cheapest = buyable.reduce((a, b) => (b.price < a.price ? b : a));
  const platforms = [...new Set(buyable.map((o) => platformShort(o.platform)))].join(" · ");
  if (!isClient) return null;

  return createPortal(
    <div
      role="region"
      aria-label={g.stickyAria}
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-gold-dark/70 bg-[#0a0907]/95 shadow-[0_-10px_30px_rgb(0_0_0/0.55)] backdrop-blur transition-[translate,opacity] duration-300 ease-out motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      )}
    >
      <div className="mx-auto flex max-w-page items-center gap-3 px-4 py-2.5 sm:gap-6 sm:px-6 sm:py-3 lg:px-8">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm tracking-[0.08em] text-parchment uppercase sm:text-base">{game.title}</p>
          <p className="truncate text-xs text-parchment-muted sm:text-sm">{platforms}</p>
        </div>
        <p className="shrink-0 font-display text-lg font-semibold text-gold-light tabular-nums sm:text-2xl">
          {new Set(buyable.map((o) => o.price)).size > 1 && <span className="text-xs font-normal text-parchment-muted">{g.fromPrice} </span>}
          {formatMoney(cheapest.price, currency)}
        </p>
        <div className="shrink-0">
          {buyable.length === 1 ? (
            <AddToCartButton buyNow size="sm" className="min-h-11 sm:px-6" inStock item={cartItemFor(game, cheapest)} />
          ) : (
            <Button
              size="sm"
              className="min-h-11 sm:px-6"
              onClick={() => {
                const card = document.getElementById("cumpara");
                card?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
                card?.querySelector<HTMLElement>("input")?.focus({ preventScroll: true });
              }}
            >
              {g.buyNow}
              <ArrowUp aria-hidden className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
