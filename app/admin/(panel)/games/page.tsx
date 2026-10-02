import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Pencil, Plus, SearchX } from "lucide-react";
import { deleteGame } from "@/app/admin/actions";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { adminDate, btn, EmptyState, FilterBar, filterField, filterLabel, mdl, PageHeader, Pagination, Panel, Pill, Table, td, th, tr, UrlNotice } from "@/components/admin/ui";
import { platformShort } from "@/lib/catalog";
import { GAME_SORTS, GAME_STATUS_FILTERS, GENRE_NAMES, listGames, PLATFORM_NAMES } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Games" };

const STATUS_LABELS: Record<(typeof GAME_STATUS_FILTERS)[number], string> = { "in-stock": "In stock", "out-of-stock": "Out of stock", "on-sale": "On sale", featured: "Featured", new: "New release" };
const SORT_LABELS: Record<(typeof GAME_SORTS)[number], string> = { "added-desc": "Newest added", "added-asc": "Oldest added", title: "Title A–Z", "price-asc": "Price: low to high", "price-desc": "Price: high to low", discount: "Biggest discount" };

export default async function GamesPage({ searchParams }: PageProps<"/admin/games">) {
  const sp = await searchParams;
  const { rows, total, page, pages, all } = await listGames(sp);
  const v = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const filtered = ["q", "genre", "platform", "status"].some((k) => v(k));
  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Games"
        description={`${all} games in the catalogue. Prices are in MDL; the price shown is the version the shop's cards show.`}
        actions={
          <Link href="/admin/games/new" className={btn("primary", "md")}>
            <Plus aria-hidden className="size-4" /> Add game
          </Link>
        }
      />
      <UrlNotice code={sp.notice} />
      <Panel>
        <FilterBar basePath="/admin/games" active={filtered || !!v("sort")}>
          <div className="md:min-w-56 md:flex-1">
            <label htmlFor="q" className={filterLabel}>Search</label>
            <input id="q" name="q" type="search" defaultValue={v("q")} placeholder="Title or slug" className={filterField + " md:w-full"} />
          </div>
          <div>
            <label htmlFor="genre" className={filterLabel}>Genre</label>
            <select id="genre" name="genre" defaultValue={v("genre")} className={filterField}>
              <option value="">All genres</option>
              {GENRE_NAMES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="platform" className={filterLabel}>Platform</label>
            <select id="platform" name="platform" defaultValue={v("platform")} className={filterField}>
              <option value="">All platforms</option>
              {PLATFORM_NAMES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="status" className={filterLabel}>Status</label>
            <select id="status" name="status" defaultValue={v("status")} className={filterField}>
              <option value="">Any status</option>
              {GAME_STATUS_FILTERS.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className={filterLabel}>Sort</label>
            <select id="sort" name="sort" defaultValue={v("sort") || "added-desc"} className={filterField}>
              {GAME_SORTS.map((s) => <option key={s} value={s}>{SORT_LABELS[s]}</option>)}
            </select>
          </div>
        </FilterBar>

        {rows.length === 0 ? (
          <EmptyState
            icon={filtered ? SearchX : Gamepad2}
            title={filtered ? "No games match these filters" : "No games yet"}
            text={filtered ? "Try another search or reset the filters." : "Add the first game to the catalogue."}
            action={filtered ? <Link href="/admin/games" className={btn("ghost")}>Reset filters</Link> : <Link href="/admin/games/new" className={btn("primary")}>Add game</Link>}
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <th className={th}>Game</th>
                <th className={th}>Price</th>
                <th className={th}>Discount</th>
                <th className={th}>Final</th>
                <th className={`${th} hidden 2xl:table-cell`}>Genre</th>
                <th className={`${th} hidden md:table-cell`}>Platform</th>
                <th className={th}>Status</th>
                <th className={`${th} hidden 2xl:table-cell`}>Added</th>
                <th className={th}><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((g) => (
                <tr key={g.id} className={tr}>
                  <td className={td}>
                    <Link href={`/admin/games/${g.id}`} className="group flex items-center gap-3">
                      <span className="relative block aspect-[3/4] w-10 shrink-0 overflow-hidden border border-gold-dark/50 bg-panel-deep transition-colors group-hover:border-gold-light">
                        <Image src={g.coverImage} alt="" fill sizes="40px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="block max-w-[14rem] truncate text-parchment transition-colors group-hover:text-gold-light">{g.title}</span>
                        <span className="block max-w-[14rem] truncate text-xs text-parchment-muted">{g.slug}</span>
                      </span>
                    </Link>
                  </td>
                  <td className={`${td} tabular-nums whitespace-nowrap`}>{mdl(g.price)}</td>
                  <td className={`${td} tabular-nums`}>{g.discount > 0 ? <span className="text-blood-text">−{g.discount}%</span> : <span className="text-parchment-muted">—</span>}</td>
                  <td className={`${td} tabular-nums whitespace-nowrap text-gold-light`}>{mdl(g.finalPrice)}</td>
                  <td className={`${td} hidden text-sm text-parchment-muted 2xl:table-cell`}>{g.genres.join(", ")}</td>
                  <td className={`${td} hidden max-w-[9rem] text-sm text-parchment-muted md:table-cell`}>{g.platforms.map(platformShort).join(" · ")}</td>
                  <td className={td}>
                    <span className="flex flex-wrap gap-1">
                      <Pill tone={g.inStock ? "green" : "red"}>{g.inStock ? "In stock" : "Out of stock"}</Pill>
                      {g.onSale && <Pill tone="red">Sale</Pill>}
                      {g.isNew && <Pill tone="gold">New</Pill>}
                      {g.featured && <Pill tone="gold">Featured</Pill>}
                    </span>
                  </td>
                  <td className={`${td} hidden text-sm whitespace-nowrap text-parchment-muted 2xl:table-cell`}>{adminDate(g.createdAt)}</td>
                  <td className={td}>
                    <span className="flex justify-end gap-2">
                      <Link href={`/admin/games/${g.id}`} aria-label={`Edit ${g.title}`} className={btn("ghost", "icon")}>
                        <Pencil aria-hidden className="size-4" strokeWidth={1.75} />
                      </Link>
                      <ConfirmDelete action={deleteGame.bind(null, g.id)} name={g.title} compact />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Pagination page={page} pages={pages} total={total} params={sp} basePath="/admin/games" />
      </Panel>
    </>
  );
}
