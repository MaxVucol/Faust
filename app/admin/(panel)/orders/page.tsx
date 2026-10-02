import type { Metadata } from "next";
import Link from "next/link";
import { Receipt, SearchX } from "lucide-react";
import { adminDateTime, EmptyState, FilterBar, filterField, filterLabel, mdl, ORDER_TONE, PageHeader, Pagination, PAYMENT_TONE, Panel, Pill, Table, td, th, tr } from "@/components/admin/ui";
import { listOrders, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const sp = await searchParams;
  const { rows, total, page, pages, all } = await listOrders(sp);
  const v = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const filtered = ["q", "status", "payment"].some((k) => v(k));
  return (
    <>
      <PageHeader eyebrow="Trade" title="Orders" description="Orders sent from the cart. Amounts are charged in MDL; the currency column is what the customer was viewing." />
      <Panel>
        <FilterBar basePath="/admin/orders" active={filtered}>
          <div className="md:min-w-56 md:flex-1">
            <label htmlFor="q" className={filterLabel}>Search</label>
            <input id="q" name="q" type="search" defaultValue={v("q")} placeholder="Order number, name, email or phone" className={filterField + " md:w-full"} />
          </div>
          <div>
            <label htmlFor="status" className={filterLabel}>Order status</label>
            <select id="status" name="status" defaultValue={v("status")} className={filterField}>
              <option value="">Any</option>
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="payment" className={filterLabel}>Payment</label>
            <select id="payment" name="payment" defaultValue={v("payment")} className={filterField}>
              <option value="">Any</option>
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </FilterBar>
        {rows.length === 0 ? (
          <EmptyState
            icon={all === 0 ? Receipt : SearchX}
            title={all === 0 ? "No orders yet" : "No orders match these filters"}
            text={all === 0 ? "Orders are saved here from now on, as customers send them from the cart (earlier ones went to Telegram only)." : "Try another search or reset the filters."}
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <th className={th}>Order</th>
                <th className={th}>Customer</th>
                <th className={`${th} hidden md:table-cell`}>Date</th>
                <th className={`${th} hidden lg:table-cell`}>Items</th>
                <th className={th}>Total</th>
                <th className={`${th} hidden sm:table-cell`}>Currency</th>
                <th className={th}>Payment</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className={tr}>
                  <td className={td}>
                    <Link href={`/admin/orders/${o.id}`} className="font-display tracking-[0.05em] whitespace-nowrap text-parchment hover:text-gold-light">{o.number}</Link>
                  </td>
                  <td className={td}>
                    <span className="block max-w-[12rem] truncate">{o.name}</span>
                    <span className="block max-w-[12rem] truncate text-xs text-parchment-muted">{o.email}</span>
                  </td>
                  <td className={`${td} hidden text-sm whitespace-nowrap text-parchment-muted md:table-cell`}>{adminDateTime(o.createdAt)}</td>
                  <td className={`${td} hidden max-w-[16rem] text-sm text-parchment-muted lg:table-cell`}>
                    <span className="line-clamp-2">{o.items.map((i) => `${i.title} × ${i.quantity}`).join(", ")}</span>
                  </td>
                  <td className={`${td} whitespace-nowrap text-gold-light tabular-nums`}>{mdl(o.totalMdl)}</td>
                  <td className={`${td} hidden text-sm text-parchment-muted sm:table-cell`}>{o.currency}</td>
                  <td className={td}><Pill tone={PAYMENT_TONE[o.paymentStatus]}>{o.paymentStatus}</Pill></td>
                  <td className={td}><Pill tone={ORDER_TONE[o.status]}>{o.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Pagination page={page} pages={pages} total={total} params={sp} basePath="/admin/orders" />
      </Panel>
    </>
  );
}
