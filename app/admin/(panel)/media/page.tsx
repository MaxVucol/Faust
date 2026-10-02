import type { Metadata } from "next";
import { MediaGrid } from "@/components/admin/MediaGrid";
import { EmptyState, FilterBar, filterField, filterLabel, PageHeader, Panel } from "@/components/admin/ui";
import { listMedia } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Media" };

const KINDS = [
  { value: "cover", label: "Covers" },
  { value: "home", label: "Home cards" },
  { value: "page", label: "Page covers" },
  { value: "key", label: "Key art" },
  { value: "screenshot", label: "Screenshots" },
];

export default async function MediaPage({ searchParams }: PageProps<"/admin/media">) {
  const sp = await searchParams;
  const { items, total } = await listMedia(sp);
  const v = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  return (
    <>
      <PageHeader
        title="Media"
        description={`${total} images used by the catalogue. The files ship with the site (public/images) and are served by the CDN; to add one, add the file to the project and deploy, then use its path in a game.`}
      />
      <Panel>
        <FilterBar basePath="/admin/media" active={!!(v("q") || v("kind"))}>
          <div className="md:min-w-56 md:flex-1">
            <label htmlFor="q" className={filterLabel}>Search</label>
            <input id="q" name="q" type="search" defaultValue={v("q")} placeholder="File name, path or game" className={filterField + " md:w-full"} />
          </div>
          <div>
            <label htmlFor="kind" className={filterLabel}>Used as</label>
            <select id="kind" name="kind" defaultValue={v("kind")} className={filterField}>
              <option value="">Anything</option>
              {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
            </select>
          </div>
        </FilterBar>
        {items.length === 0 ? <EmptyState title="No images match" text="Try another search." /> : <MediaGrid items={items} />}
        <p className="px-5 pb-4 text-sm text-parchment-muted">{items.length} of {total} shown</p>
      </Panel>
    </>
  );
}
