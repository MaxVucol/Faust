import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { adminDate, adminDateTime, EmptyState, mdl, ORDER_TONE, PageHeader, Panel, Pill, StatCard } from "@/components/admin/ui";
import { getDashboard } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const d = await getDashboard();
  const max = Math.max(1, ...d.days.map((x) => x.revenue));
  const last30 = d.days.reduce((s, x) => s + x.revenue, 0);
  const orders30 = d.days.reduce((s, x) => s + x.orders, 0);
  return (
    <>
      <PageHeader title="Dashboard" description="The shop at a glance. Revenue counts every order except cancelled ones, in MDL." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Games" value={d.gameCount} note={`${d.onSale} on sale · ${d.outOfStock} out of stock`} href="/admin/games" />
        <StatCard label="Users" value={d.userCount} note="Admin panel accounts" href="/admin/users" />
        <StatCard label="Orders" value={d.orderCount} note={`${d.openOrders} awaiting processing`} href="/admin/orders" />
        <StatCard label="Revenue" value={mdl(d.revenue)} note={`${d.subscribers} newsletter subscribers · ${d.messages} messages`} />
      </div>

      <Panel title="Sales · last 30 days" aside={<span className="text-sm text-parchment-muted tabular-nums">{orders30} orders · {mdl(last30)}</span>} className="mt-6">
        {orders30 === 0 ? (
          <EmptyState title="No sales in the last 30 days" text="Orders placed at checkout appear here." />
        ) : (
          <div className="px-5 pt-6 pb-4">
            <div role="img" aria-label={`Daily revenue for the last 30 days, ${mdl(last30)} in total`} className="flex h-40 items-end gap-[3px]">
              {d.days.map((day) => (
                <div key={day.date.toISOString()} title={`${adminDate(day.date)}: ${day.orders} orders, ${mdl(day.revenue)}`} className="flex h-full flex-1 items-end">
                  <div className="w-full bg-gold-dark/80" style={{ height: `${Math.max(day.revenue > 0 ? 4 : 1, (day.revenue / max) * 100)}%`, opacity: day.revenue > 0 ? 1 : 0.25 }} />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-parchment-muted">
              <span>{adminDate(d.days[0].date)}</span>
              <span>{adminDate(d.days[d.days.length - 1].date)}</span>
            </div>
          </div>
        )}
      </Panel>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Latest orders" aside={<Link href="/admin/orders" className="text-sm text-parchment-muted hover:text-gold-light">All orders</Link>}>
          {d.recentOrders.length === 0 ? (
            <EmptyState title="No orders yet" text="Orders are saved here from now on, as customers send them from the cart." />
          ) : (
            <ul>
              {d.recentOrders.map((o) => (
                <li key={o.id} className="border-b border-iron/60 last:border-b-0">
                  <Link href={`/admin/orders/${o.id}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3 hover:bg-white/[0.02]">
                    <span className="min-w-0">
                      <span className="font-display tracking-[0.06em] text-parchment">{o.number}</span>
                      <span className="block truncate text-sm text-parchment-muted">
                        {o.name} · {adminDateTime(o.createdAt)}
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="tabular-nums">{mdl(o.totalMdl)}</span>
                      <Pill tone={ORDER_TONE[o.status]}>{o.status}</Pill>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Best sellers">
          {d.topSellers.length === 0 ? (
            <EmptyState title="No sales yet" text="The most ordered games appear here once orders come in." />
          ) : (
            <ol>
              {d.topSellers.map((s, i) => (
                <li key={s.slug} className="flex items-center justify-between gap-4 border-b border-iron/60 px-5 py-3 last:border-b-0">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="w-5 font-display text-gold-light tabular-nums">{i + 1}</span>
                    <span className="truncate">{s.title}</span>
                  </span>
                  <span className="shrink-0 text-sm text-parchment-muted tabular-nums">
                    {s.quantity} sold · {mdl(s.revenue)}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>

      <Panel title="Recently added games" aside={<Link href="/admin/games/new" className="text-sm text-parchment-muted hover:text-gold-light">Add a game</Link>} className="mt-6">
        <ul className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 lg:grid-cols-5">
          {d.recentGames.map((g) => (
            <li key={g.id}>
              <Link href={`/admin/games/${g.id}`} className="group block">
                <span className="relative block aspect-[3/4] overflow-hidden border border-iron transition-colors group-hover:border-gold-light">
                  <Image src={g.coverImage} alt="" fill sizes="(min-width: 1024px) 12vw, 40vw" className="object-cover" />
                </span>
                <span className="mt-2 block truncate text-parchment group-hover:text-gold-light">{g.title}</span>
                <span className="block text-sm text-parchment-muted">Added {adminDate(g.createdAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
