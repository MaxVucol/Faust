import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChartNoAxesColumn, Coins, Gamepad2, PackageOpen, Receipt, Trophy, Users } from "lucide-react";
import { adminDate, adminDateTime, EmptyState, mdl, ORDER_TONE, PageHeader, Panel, PanelLink, Pill, StatCard, tr } from "@/components/admin/ui";
import { getDashboard } from "@/lib/admin/data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const d = await getDashboard();
  const max = Math.max(1, ...d.days.map((x) => x.revenue));
  const last30 = d.days.reduce((s, x) => s + x.revenue, 0);
  const orders30 = d.days.reduce((s, x) => s + x.orders, 0);
  return (
    <>
      <PageHeader eyebrow="Overview" title="Dashboard" description="The shop at a glance. Revenue counts every order except cancelled ones, in MDL." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Gamepad2} label="Games" value={d.gameCount} note={`${d.onSale} on sale · ${d.outOfStock} out of stock`} href="/admin/games" />
        <StatCard icon={Users} label="Users" value={d.userCount} note="Admin panel accounts" href="/admin/users" />
        <StatCard icon={Receipt} label="Orders" value={d.orderCount} note={`${d.openOrders} awaiting processing`} href="/admin/orders" />
        <StatCard icon={Coins} label="Revenue" value={mdl(d.revenue)} note={`${d.subscribers} newsletter subscribers · ${d.messages} messages`} />
      </div>

      <Panel title="Sales · last 30 days" aside={<span className="text-sm text-parchment-muted tabular-nums">{orders30} orders · <span className="text-gold-light">{mdl(last30)}</span></span>} className="mt-6">
        {orders30 === 0 ? (
          <EmptyState icon={ChartNoAxesColumn} title="No sales in the last 30 days" text="Orders placed at checkout appear here." />
        ) : (
          <div className="px-5 pt-6 pb-4">
            <div className="relative">
              {/* Quarter lines, faint as ruled paper. */}
              <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {[0, 1, 2, 3].map((i) => <span key={i} className="h-px bg-iron/50" />)}
              </div>
              <div role="img" aria-label={`Daily revenue for the last 30 days, ${mdl(last30)} in total`} className="relative flex h-44 items-end gap-[3px] border-b border-gold-dark/60">
                {d.days.map((day) => (
                  <div key={day.date.toISOString()} title={`${adminDate(day.date)}: ${day.orders} orders, ${mdl(day.revenue)}`} className="group flex h-full flex-1 items-end">
                    <div
                      className={cn("w-full transition-colors", day.revenue > 0 ? "bg-[linear-gradient(180deg,#c09a55,#8c682f)] group-hover:bg-[linear-gradient(180deg,#e0c487,#a68a4b)]" : "bg-iron/60")}
                      style={{ height: `${Math.max(day.revenue > 0 ? 4 : 1, (day.revenue / max) * 100)}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-parchment-muted">
              <span>{adminDate(d.days[0].date)}</span>
              <span>{adminDate(d.days[d.days.length - 1].date)}</span>
            </div>
          </div>
        )}
      </Panel>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Latest orders" aside={<PanelLink href="/admin/orders">All orders</PanelLink>}>
          {d.recentOrders.length === 0 ? (
            <EmptyState icon={Receipt} title="No orders yet" text="Orders are saved here from now on, as customers send them from the cart." />
          ) : (
            <ul>
              {d.recentOrders.map((o) => (
                <li key={o.id} className="border-b border-iron/55 last:border-b-0">
                  <Link href={`/admin/orders/${o.id}`} className={cn("flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3", tr)}>
                    <span className="min-w-0">
                      <span className="font-display tracking-[0.06em] text-parchment">{o.number}</span>
                      <span className="block truncate text-sm text-parchment-muted">
                        {o.name} · {adminDateTime(o.createdAt)}
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-gold-light tabular-nums">{mdl(o.totalMdl)}</span>
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
            <EmptyState icon={Trophy} title="No sales yet" text="The most ordered games appear here once orders come in." />
          ) : (
            <ol>
              {d.topSellers.map((s, i) => (
                <li key={s.slug} className="flex items-center justify-between gap-4 border-b border-iron/55 px-5 py-3 last:border-b-0">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center border border-gold-dark/60 font-display text-sm text-gold-light tabular-nums">{i + 1}</span>
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

      <Panel title="Recently added games" aside={<PanelLink href="/admin/games/new">Add a game</PanelLink>} className="mt-6">
        {d.recentGames.length === 0 ? (
          <EmptyState icon={PackageOpen} title="No games yet" />
        ) : (
          <ul className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 lg:grid-cols-5">
            {d.recentGames.map((g) => (
              <li key={g.id}>
                <Link href={`/admin/games/${g.id}`} className="group block">
                  <span className="relative block aspect-[3/4] overflow-hidden border border-gold-dark/60 bg-panel-deep transition-colors group-hover:border-gold-light">
                    <Image src={g.coverImage} alt="" fill sizes="(min-width: 1024px) 12vw, 40vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </span>
                  <span className="mt-2 block truncate text-parchment transition-colors group-hover:text-gold-light">{g.title}</span>
                  <span className="block text-sm text-parchment-muted">Added {adminDate(g.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
