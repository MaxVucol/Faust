"use client";

import { useCallback, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { PanelOffer } from "@/lib/purchase";

// Long waits are re-armed every hour (setTimeout can't wait more than ~24 days, and a sleeping laptop
// delays timers), so the moment is caught however long the page stays open.
const MAX_WAIT = 60 * 60 * 1000;

/**
 * How many of the given sale end dates (ISO strings) have passed, kept current while the page is open:
 * a timer is armed for the next one only. 0 on the server and while hydrating, so the page first shows
 * what the server rendered.
 */
function usePassedEnds(ends: (string | null)[]): { times: number[]; passed: number } {
  const key = [...new Set(ends.filter((e): e is string => !!e))].sort().join(" ");
  const times = useMemo(() => (key ? key.split(" ").map((e) => new Date(e).getTime()) : []), [key]);
  const subscribe = useCallback(
    (change: () => void) => {
      let timer: number | undefined;
      const arm = () => {
        const next = times.find((t) => t > Date.now());
        if (next === undefined) return;
        timer = window.setTimeout(() => {
          change();
          arm();
        }, Math.min(next - Date.now() + 50, MAX_WAIT));
      };
      arm();
      return () => window.clearTimeout(timer);
    },
    [times],
  );
  const passed = useSyncExternalStore(
    subscribe,
    () => times.filter((t) => t <= Date.now()).length,
    () => 0,
  );
  return { times, passed };
}

/**
 * The purchase UI's versions as they are now: a version whose sale has ended while the page was open goes
 * back to its regular price (no old price, no percentage, no end date). Only what is shown changes; the
 * cart and the order are priced on the server from the catalogue whatever the page says.
 */
export function useLiveOffers(offers: PanelOffer[]): PanelOffer[] {
  const { times, passed } = usePassedEnds(offers.map((o) => o.saleEndsAt));
  return useMemo(() => {
    if (passed === 0) return offers;
    const last = times[passed - 1];
    return offers.map((o) =>
      o.saleEndsAt && new Date(o.saleEndsAt).getTime() <= last && o.oldPrice !== null
        ? { ...o, price: o.oldPrice, oldPrice: null, percent: 0, saleEnds: null, saleEndsAt: null }
        : o,
    );
  }, [offers, times, passed]);
}

/**
 * Server-rendered sale markup (`children`) until `until`, then `after`: the same place as it looks once
 * the sale has ended (no badge, no old price, the regular price), without a reload. See untilSalesEnd().
 */
export function SaleSwitch({ until, after, children }: { until: string; after: ReactNode; children: ReactNode }) {
  const { passed } = usePassedEnds([until]);
  return passed > 0 ? after : children;
}
