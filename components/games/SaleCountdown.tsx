"use client";

import { useSyncExternalStore } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";

/**
 * How long a sale still runs, from its real end date (Game.discountEndsAt): "Ends in 3d 4h", updated once
 * a minute. Until the page is interactive it shows `fallback`, the end date the server rendered, so nothing
 * jumps or mismatches while hydrating; once the date has passed it shows nothing.
 */
// The time in 15-second steps, shared by every countdown on the page; null on the server and while hydrating.
const STEP = 15_000;
const subscribe = (tick: () => void) => {
  const timer = window.setInterval(tick, STEP);
  return () => window.clearInterval(timer);
};
const stepNow = () => Math.floor(Date.now() / STEP);
const noTime = () => null;

export function SaleCountdown({ endsAt, fallback, className }: { endsAt: string; fallback: string; className?: string }) {
  const { t } = useI18n();
  const step = useSyncExternalStore(subscribe, stepNow, noTime);
  if (step === null) return <p className={className}>{fallback}</p>;
  const left = new Date(endsAt).getTime() - step * STEP;
  // Ended while the page was open: the sale is gone (its badge and old price leave too), so is its line.
  if (left <= 0) return null;
  const minutes = Math.floor(left / 60_000);
  return (
    <p className={className}>
      <time dateTime={endsAt}>{t.game.endsIn(Math.floor(minutes / 1440), Math.floor((minutes % 1440) / 60), minutes % 60)}</time>
    </p>
  );
}
