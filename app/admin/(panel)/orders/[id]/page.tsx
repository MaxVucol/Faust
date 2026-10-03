import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { adminDateTime, BackLink, mdl, ORDER_TONE, PageHeader, PAYMENT_TONE, Panel, Pill, Table, td, th, tr } from "@/components/admin/ui";
import { getOrder } from "@/lib/admin/data";
import { formatMoney, isCurrency } from "@/lib/currency";
import { getAdminI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getAdminI18n()).t.meta.order };
}

const dt = "mb-0.5 font-display-ui text-[0.56rem] tracking-[0.18em] text-parchment-muted";

export default async function OrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  const [order, { t, locale }] = await Promise.all([params.then((p) => getOrder(p.id)), getAdminI18n()]);
  if (!order) notFound();
  const T = t.order;
  const currency = isCurrency(order.currency) ? order.currency : "MDL";
  return (
    <>
      <BackLink href="/admin/orders">{t.common.allOrders}</BackLink>
      <PageHeader
        title={order.number}
        description={T.meta(adminDateTime(order.createdAt, locale), adminDateTime(order.updatedAt, locale))}
        actions={
          <span className="flex gap-2">
            <Pill tone={PAYMENT_TONE[order.paymentStatus]}>{t.status.payment[order.paymentStatus] ?? order.paymentStatus}</Pill>
            <Pill tone={ORDER_TONE[order.status]}>{t.status.order[order.status] ?? order.status}</Pill>
          </span>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Panel title={T.items}>
          <Table>
            <thead>
              <tr>
                <th className={th}>{T.columns.game}</th>
                <th className={th}>{T.columns.version}</th>
                <th className={th}>{T.columns.qty}</th>
                <th className={th}>{T.columns.unit}</th>
                <th className={th}>{T.columns.sum}</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((i, n) => (
                <tr key={n} className={tr}>
                  <td className={td}>
                    <Link href={`/produse/${i.slug}`} target="_blank" className="transition-colors hover:text-gold-light">{i.title}</Link>
                  </td>
                  <td className={`${td} text-sm text-parchment-muted`}>{[i.platform, i.edition].filter(Boolean).join(" · ")}</td>
                  <td className={`${td} tabular-nums`}>{i.quantity}</td>
                  <td className={`${td} whitespace-nowrap tabular-nums`}>{mdl(i.unitPrice)}</td>
                  <td className={`${td} whitespace-nowrap tabular-nums`}>{mdl(i.sum)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="flex items-baseline justify-between gap-4 border-t border-gold-dark/40 bg-panel-deep/50 px-5 py-4">
            <span className="font-display-ui text-[0.7rem] text-parchment-muted">{T.total}</span>
            <span className="text-right">
              <span className="text-gold block font-display text-2xl font-semibold tabular-nums">{mdl(order.totalMdl)}</span>
              {currency !== "MDL" && <span className="block text-sm text-parchment-muted">{T.shownAs(formatMoney(order.totalMdl, currency))}</span>}
            </span>
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel title={T.customer}>
            <dl className="divide-y divide-iron/55 px-5 py-1">
              <div className="py-3"><dt className={dt}>{T.name}</dt><dd>{order.name}</dd></div>
              <div className="py-3"><dt className={dt}>{T.email}</dt><dd><a href={`mailto:${order.email}`} className="break-all transition-colors hover:text-gold-light">{order.email}</a></dd></div>
              <div className="py-3"><dt className={dt}>{T.phone}</dt><dd><a href={`tel:${order.phone.replace(/[^\d+]/g, "")}`} className="transition-colors hover:text-gold-light">{order.phone}</a></dd></div>
              <div className="py-3"><dt className={dt}>{T.langCurrency}</dt><dd>{order.locale.toUpperCase()} · {order.currency}</dd></div>
              {order.comment && <div className="py-3"><dt className={dt}>{T.comment}</dt><dd className="whitespace-pre-line">{order.comment}</dd></div>}
            </dl>
          </Panel>
          <Panel title={T.status}>
            <OrderStatusForm id={order.id} status={order.status} paymentStatus={order.paymentStatus} />
          </Panel>
        </div>
      </div>
    </>
  );
}
