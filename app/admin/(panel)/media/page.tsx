import type { Metadata } from "next";
import { Images } from "lucide-react";
import { MediaGrid } from "@/components/admin/MediaGrid";
import { EmptyState, FilterBar, filterField, filterLabel, PageHeader, Panel } from "@/components/admin/ui";
import { listMedia, MEDIA_KINDS } from "@/lib/admin/data";
import { getAdminI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getAdminI18n()).t.meta.media };
}

const KINDS = Object.keys(MEDIA_KINDS) as (keyof typeof MEDIA_KINDS)[];

export default async function MediaPage({ searchParams }: PageProps<"/admin/media">) {
  const sp = await searchParams;
  const [{ items, total }, { t }] = await Promise.all([listMedia(sp), getAdminI18n()]);
  const M = t.media;
  const v = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  return (
    <>
      <PageHeader
       
        title={M.title}
        description={M.description(total)}
      />
      <Panel>
        <FilterBar basePath="/admin/media" active={!!(v("q") || v("kind"))} t={t}>
          <div className="md:min-w-56 md:flex-1">
            <label htmlFor="q" className={filterLabel}>{M.search}</label>
            <input id="q" name="q" type="search" defaultValue={v("q")} placeholder={M.searchPlaceholder} className={filterField + " md:w-full"} />
          </div>
          <div>
            <label htmlFor="kind" className={filterLabel}>{M.usedAs}</label>
            <select id="kind" name="kind" defaultValue={v("kind")} className={filterField}>
              <option value="">{M.anything}</option>
              {KINDS.map((k) => <option key={k} value={k}>{M.kinds[k]}</option>)}
            </select>
          </div>
        </FilterBar>
        {items.length === 0 ? <EmptyState icon={Images} title={M.emptyTitle} text={M.emptyText} /> : <MediaGrid items={items} />}
        <p className="px-5 pb-4 text-sm text-parchment-muted">{M.shown(items.length, total)}</p>
      </Panel>
    </>
  );
}
