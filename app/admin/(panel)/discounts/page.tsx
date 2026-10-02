import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SaleEditor } from "@/components/admin/SaleEditor";
import { BadgePercent } from "lucide-react";
import { adminDateTime, EmptyState, FilterBar, filterField, filterLabel, mdl, PageHeader, Pagination, Panel, Pill, Table, td, th, tr } from "@/components/admin/ui";
import { DISCOUNT_FILTERS, listDiscounts, type SaleState } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Discounts" };

const STATE: Record<SaleState, { label: string; tone: "green" | "gold" | "muted" | "red" }> = {
  active: { label: "Active", tone: "green" },
  scheduled: { label: "Scheduled", tone: "gold" },
  expired: { label: "Expired", tone: "muted" },
  none: { label: "No sale", tone: "muted" },
};

export default async function DiscountsPage({ searchParams }: PageProps<"/admin/discounts">) {
  const sp = await searchParams;
  const { rows, total, page, pages, tally } = await listDiscounts(sp);
  const v = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Discounts"
        description="Sales on games and on versions with their own price: a sale price with an end date (and an optional start). The shop shows a sale only while it runs, so expired ones change nothing. There are no promo codes."
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {DISCOUNT_FILTERS.map((s) => (
          <Link key={s} href={`/admin/discounts?state=${s}`} aria-current={v("state") === s ? "page" : undefined} className="flex min-h-10 items-center gap-2.5 border border-iron bg-panel px-3.5 font-display-ui text-[0.62rem] text-parchment-muted transition-colors hover:border-aged-gold hover:text-parchment aria-[current=page]:border-gold-light aria-[current=page]:bg-gold-light/[0.07] aria-[current=page]:text-gold-light">
            {STATE[s].label} <span className="border-l border-iron pl-2.5 font-body text-sm tracking-normal text-parchment normal-case tabular-nums">{tally[s]}</span>
          </Link>
        ))}
      </div>
      <Panel>
        <FilterBar basePath="/admin/discounts" active={!!(v("q") || v("state"))}>
          <div className="md:min-w-56 md:flex-1">
            <label htmlFor="q" className={filterLabel}>Search</label>
            <input id="q" name="q" type="search" defaultValue={v("q")} placeholder="Game title" className={filterField + " md:w-full"} />
          </div>
          <div>
            <label htmlFor="state" className={filterLabel}>Sale</label>
            <select id="state" name="state" defaultValue={v("state")} className={filterField}>
              <option value="">Any sale (no “No sale”)</option>
              {DISCOUNT_FILTERS.map((s) => <option key={s} value={s}>{STATE[s].label}</option>)}
            </select>
          </div>
        </FilterBar>
        {rows.length === 0 ? (
          <EmptyState icon={BadgePercent} title="Nothing here" text={v("state") === "none" ? "Every game has a sale set." : "No sales match. Pick “No sale” to start one on a game."} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th className={th}>Game</th>
                <th className={th}>Price</th>
                <th className={th}>Sale</th>
                <th className={`${th} hidden md:table-cell`}>Starts</th>
                <th className={th}>Ends</th>
                <th className={th}>Status</th>
                <th className={th}><span className="sr-only">Edit</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.gameId}-${r.variant ?? "g"}`} className={tr}>
                  <td className={td}>
                    <Link href={`/admin/games/${r.gameId}`} className="group flex items-center gap-3">
                      <span className="relative block aspect-[3/4] w-9 shrink-0 overflow-hidden border border-gold-dark/50 bg-panel-deep transition-colors group-hover:border-gold-light">
                        <Image src={r.coverImage} alt="" fill sizes="36px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="block max-w-[14rem] truncate text-parchment transition-colors group-hover:text-gold-light">{r.title}</span>
                        <span className="block max-w-[14rem] truncate text-xs text-parchment-muted">{r.label}</span>
                      </span>
                    </Link>
                  </td>
                  <td className={`${td} whitespace-nowrap tabular-nums`}>{mdl(r.price)}</td>
                  <td className={`${td} whitespace-nowrap tabular-nums`}>
                    {r.discountPrice != null ? (
                      <>
                        <span className="text-gold-light">{mdl(r.discountPrice)}</span> <span className="text-blood-text">−{r.percent}%</span>
                      </>
                    ) : (
                      <span className="text-parchment-muted">—</span>
                    )}
                  </td>
                  <td className={`${td} hidden text-sm whitespace-nowrap text-parchment-muted md:table-cell`}>{r.startsAt ? adminDateTime(r.startsAt) : r.discountPrice != null ? "Right away" : "—"}</td>
                  <td className={`${td} text-sm whitespace-nowrap text-parchment-muted`}>{r.endsAt ? adminDateTime(r.endsAt) : "—"}</td>
                  <td className={td}><Pill tone={STATE[r.state].tone}>{STATE[r.state].label}</Pill></td>
                  <td className={td}>
                    <SaleEditor sale={{ gameId: r.gameId, variant: r.variant, title: r.title, label: r.label, price: r.price, discountPrice: r.discountPrice, startsAt: r.startsAt?.toISOString() ?? null, endsAt: r.endsAt?.toISOString() ?? null }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Pagination page={page} pages={pages} total={total} params={sp} basePath="/admin/discounts" />
      </Panel>
    </>
  );
}
