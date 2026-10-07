import type { ReactNode } from "react";
import { nextSaleEnd, type Offer } from "@/lib/offers";
import { SaleSwitch } from "./SaleSwitch";

/**
 * `render(now)`, and, when a running sale among `offers` ends while the page stays open, `render(end)`
 * in its place (again for a later end): the badge and the old price leave at the end date itself, not at
 * the next reload. Both states are rendered here on the server by the same price rules.
 */
export function untilSalesEnd(offers: Offer[], now: Date, render: (now: Date) => ReactNode): ReactNode {
  const node = render(now);
  const end = nextSaleEnd(offers, now);
  if (!end) return node;
  return (
    <SaleSwitch until={end.toISOString()} after={untilSalesEnd(offers, end, render)}>
      {node}
    </SaleSwitch>
  );
}
