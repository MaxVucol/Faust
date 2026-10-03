import type { Metadata } from "next";
import Link from "next/link";
import { Receipt, SearchX } from "lucide-react";
import { adminDateTime, EmptyState, FilterBar, filterField, filterLabel, mdl, ORDER_TONE, PageHeader, Pagination, PAYMENT_TONE, Panel, Pill, Table, td, th, tr } from "@/components/admin/ui";
import { listOrders, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/admin/data";
import { getAdminI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getAdminI18n()).t.meta.orders };
}

export default async function OrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const sp = await searchParams;
  const [{ rows, total, page, pages, all }, { t, locale }] = await Promise.all([listOrders(sp), getAdminI18n()]);
  const T = t.orders;
  const v = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const filtered = ["q", "status", "payment"].some((k) => v(k));
  return (
    <>
      <PageHeader title={T.title} description={T.description} />
      <Panel>
        <FilterBar basePath="/admin/orders" active={filtered} t={t}>
          <div className="md:min-w-56 md:flex-1">
            <label htmlFor="q" className={filterLabel}>{T.filters.search}</label>
            <input id="q" name="q" type="search" defaultValue={v("q")} placeholder={T.filters.searchPlaceholder} className={filterField + " md:w-full"} />
          </div>
          <div>
            <label htmlFor="status" className={filterLabel}>{T.filters.status}</label>
            <select id="status" name="status" defaultValue={v("status")} className={filterField}>
              <option value="">{t.common.any}</option>
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{t.status.order[s] ?? s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="payment" className={filterLabel}>{T.filters.payment}</label>
            <select id="payment" name="payment" defaultValue={v("payment")} className={filterField}>
              <option value="">{t.common.any}</option>
              {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{t.status.payment[s] ?? s}</option>)}
            </select>
          </div>
        </FilterBar>
        {rows.length === 0 ? (
          <EmptyState
            icon={all === 0 ? Receipt : SearchX}
            title={all === 0 ? T.empty.title : T.empty.filteredTitle}
            text={all === 0 ? T.empty.text : T.empty.filteredText}
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <th className={th}>{T.columns.order}</th>
                <th className={th}>{T.columns.customer}</th>
                <th className={`${th} hidden md:table-cell`}>{T.columns.date}</th>
                <th className={`${th} hidden lg:table-cell`}>{T.columns.items}</th>
                <th className={th}>{T.columns.total}</th>
                <th className={`${th} hidden sm:table-cell`}>{T.columns.currency}</th>
                <th className={th}>{T.columns.payment}</th>
                <th className={th}>{T.columns.status}</th>
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
                  <td className={`${td} hidden text-sm whitespace-nowrap text-parchment-muted md:table-cell`}>{adminDateTime(o.createdAt, locale)}</td>
                  <td className={`${td} hidden max-w-[16rem] text-sm text-parchment-muted lg:table-cell`}>
                    <span className="line-clamp-2">{o.items.map((i) => `${i.title} × ${i.quantity}`).join(", ")}</span>
                  </td>
                  <td className={`${td} whitespace-nowrap text-gold-light tabular-nums`}>{mdl(o.totalMdl)}</td>
                  <td className={`${td} hidden text-sm text-parchment-muted sm:table-cell`}>{o.currency}</td>
                  <td className={td}><Pill tone={PAYMENT_TONE[o.paymentStatus]}>{t.status.payment[o.paymentStatus] ?? o.paymentStatus}</Pill></td>
                  <td className={td}><Pill tone={ORDER_TONE[o.status]}>{t.status.order[o.status] ?? o.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Pagination page={page} pages={pages} total={total} params={sp} basePath="/admin/orders" t={t} />
      </Panel>
    </>
  );
}
