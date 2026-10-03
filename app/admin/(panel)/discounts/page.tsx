import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SaleEditor } from "@/components/admin/SaleEditor";
import { BadgePercent } from "lucide-react";
import { adminDateTime, EmptyState, FilterBar, filterField, filterLabel, mdl, PageHeader, Pagination, Panel, Pill, Table, td, th, tr } from "@/components/admin/ui";
import { DISCOUNT_FILTERS, listDiscounts, type SaleState } from "@/lib/admin/data";
import { getAdminI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getAdminI18n()).t.meta.discounts };
}

const TONE: Record<SaleState, "green" | "gold" | "muted" | "red"> = { active: "green", scheduled: "gold", expired: "muted", none: "muted" };

export default async function DiscountsPage({ searchParams }: PageProps<"/admin/discounts">) {
  const sp = await searchParams;
  const [{ rows, total, page, pages, tally }, { t, locale }] = await Promise.all([listDiscounts(sp), getAdminI18n()]);
  const D = t.discounts;
  const label = (s: SaleState) => t.status.sale[s];
  const v = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  return (
    <>
      <PageHeader
       
        title={D.title}
        description={D.description}
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {DISCOUNT_FILTERS.map((s) => (
          <Link key={s} href={`/admin/discounts?state=${s}`} aria-current={v("state") === s ? "page" : undefined} className="flex min-h-10 items-center gap-2.5 border border-iron bg-panel px-3.5 font-display-ui text-[0.62rem] text-parchment-muted transition-colors hover:border-aged-gold hover:text-parchment aria-[current=page]:border-gold-light aria-[current=page]:bg-gold-light/[0.07] aria-[current=page]:text-gold-light">
            {label(s)} <span className="border-l border-iron pl-2.5 font-body text-sm tracking-normal text-parchment normal-case tabular-nums">{tally[s]}</span>
          </Link>
        ))}
      </div>
      <Panel>
        <FilterBar basePath="/admin/discounts" active={!!(v("q") || v("state"))} t={t}>
          <div className="md:min-w-56 md:flex-1">
            <label htmlFor="q" className={filterLabel}>{D.search}</label>
            <input id="q" name="q" type="search" defaultValue={v("q")} placeholder={D.searchPlaceholder} className={filterField + " md:w-full"} />
          </div>
          <div>
            <label htmlFor="state" className={filterLabel}>{D.saleFilter}</label>
            <select id="state" name="state" defaultValue={v("state")} className={filterField}>
              <option value="">{D.anySale}</option>
              {DISCOUNT_FILTERS.map((s) => <option key={s} value={s}>{label(s)}</option>)}
            </select>
          </div>
        </FilterBar>
        {rows.length === 0 ? (
          <EmptyState icon={BadgePercent} title={D.emptyTitle} text={v("state") === "none" ? D.emptyAllSet : D.emptyNone} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th className={th}>{D.columns.game}</th>
                <th className={th}>{D.columns.price}</th>
                <th className={th}>{D.columns.sale}</th>
                <th className={`${th} hidden md:table-cell`}>{D.columns.starts}</th>
                <th className={th}>{D.columns.ends}</th>
                <th className={th}>{D.columns.status}</th>
                <th className={th}><span className="sr-only">{D.columns.edit}</span></th>
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
                        <span className="block max-w-[14rem] truncate text-xs text-parchment-muted">{r.label ?? D.basePrice}</span>
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
                  <td className={`${td} hidden text-sm whitespace-nowrap text-parchment-muted md:table-cell`}>{r.startsAt ? adminDateTime(r.startsAt, locale) : r.discountPrice != null ? D.rightAway : "—"}</td>
                  <td className={`${td} text-sm whitespace-nowrap text-parchment-muted`}>{r.endsAt ? adminDateTime(r.endsAt, locale) : "—"}</td>
                  <td className={td}><Pill tone={TONE[r.state]}>{label(r.state)}</Pill></td>
                  <td className={td}>
                    <SaleEditor sale={{ gameId: r.gameId, variant: r.variant, title: r.title, label: r.label, price: r.price, discountPrice: r.discountPrice, startsAt: r.startsAt?.toISOString() ?? null, endsAt: r.endsAt?.toISOString() ?? null }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Pagination page={page} pages={pages} total={total} params={sp} basePath="/admin/discounts" t={t} />
      </Panel>
    </>
  );
}
