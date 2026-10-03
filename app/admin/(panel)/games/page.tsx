import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Pencil, Plus, SearchX } from "lucide-react";
import { deleteGame } from "@/app/admin/actions";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { adminDate, btn, EmptyState, FilterBar, filterField, filterLabel, mdl, PageHeader, Pagination, Panel, Pill, Table, td, th, tr, UrlNotice } from "@/components/admin/ui";
import { genreLabel, platformShort } from "@/lib/catalog";
import { GAME_SORTS, GAME_STATUS_FILTERS, GENRE_NAMES, listGames, PLATFORM_NAMES } from "@/lib/admin/data";
import { getAdminI18n, getDictionary } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getAdminI18n()).t.meta.games };
}

export default async function GamesPage({ searchParams }: PageProps<"/admin/games">) {
  const sp = await searchParams;
  // Genre names come from the shop's own dictionary (they are fixed keys translated there).
  const [{ rows, total, page, pages, all }, { t, locale }, shop] = await Promise.all([listGames(sp), getAdminI18n(), getDictionary()]);
  const T = t.games;
  const v = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const filtered = ["q", "genre", "platform", "status"].some((k) => v(k));
  return (
    <>
      <PageHeader
        title={T.title}
        description={T.description(all)}
        actions={
          <Link href="/admin/games/new" className={btn("primary", "md")}>
            <Plus aria-hidden className="size-4" /> {T.add}
          </Link>
        }
      />
      <UrlNotice code={sp.notice} t={t} />
      <Panel>
        <FilterBar basePath="/admin/games" active={filtered || !!v("sort")} t={t}>
          <div className="md:min-w-56 md:flex-1">
            <label htmlFor="q" className={filterLabel}>{T.filters.search}</label>
            <input id="q" name="q" type="search" defaultValue={v("q")} placeholder={T.filters.searchPlaceholder} className={filterField + " md:w-full"} />
          </div>
          <div>
            <label htmlFor="genre" className={filterLabel}>{T.filters.genre}</label>
            <select id="genre" name="genre" defaultValue={v("genre")} className={filterField}>
              <option value="">{T.filters.allGenres}</option>
              {GENRE_NAMES.map((g) => <option key={g} value={g}>{genreLabel(shop.genres, g)}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="platform" className={filterLabel}>{T.filters.platform}</label>
            <select id="platform" name="platform" defaultValue={v("platform")} className={filterField}>
              <option value="">{T.filters.allPlatforms}</option>
              {PLATFORM_NAMES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="status" className={filterLabel}>{T.filters.status}</label>
            <select id="status" name="status" defaultValue={v("status")} className={filterField}>
              <option value="">{T.filters.anyStatus}</option>
              {GAME_STATUS_FILTERS.map((s) => <option key={s} value={s}>{T.statusFilters[s]}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className={filterLabel}>{T.filters.sort}</label>
            <select id="sort" name="sort" defaultValue={v("sort") || "added-desc"} className={filterField}>
              {GAME_SORTS.map((s) => <option key={s} value={s}>{T.sorts[s]}</option>)}
            </select>
          </div>
        </FilterBar>

        {rows.length === 0 ? (
          <EmptyState
            icon={filtered ? SearchX : Gamepad2}
            title={filtered ? T.empty.filteredTitle : T.empty.title}
            text={filtered ? T.empty.filteredText : T.empty.text}
            action={filtered ? <Link href="/admin/games" className={btn("ghost")}>{T.empty.resetFilters}</Link> : <Link href="/admin/games/new" className={btn("primary")}>{T.add}</Link>}
          />
        ) : (
          <Table>
            <thead>
              <tr>
                <th className={th}>{T.columns.game}</th>
                <th className={th}>{T.columns.price}</th>
                <th className={th}>{T.columns.discount}</th>
                <th className={th}>{T.columns.final}</th>
                <th className={`${th} hidden 2xl:table-cell`}>{T.columns.genre}</th>
                <th className={`${th} hidden md:table-cell`}>{T.columns.platform}</th>
                <th className={th}>{T.columns.status}</th>
                <th className={`${th} hidden 2xl:table-cell`}>{T.columns.added}</th>
                <th className={th}><span className="sr-only">{T.columns.actions}</span></th>
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
                  <td className={`${td} hidden text-sm text-parchment-muted 2xl:table-cell`}>{g.genres.map((x) => genreLabel(shop.genres, x)).join(", ")}</td>
                  <td className={`${td} hidden max-w-[9rem] text-sm text-parchment-muted md:table-cell`}>{g.platforms.map(platformShort).join(" · ")}</td>
                  <td className={td}>
                    <span className="flex flex-wrap gap-1">
                      <Pill tone={g.inStock ? "green" : "red"}>{g.inStock ? T.pills.inStock : T.pills.outOfStock}</Pill>
                      {g.onSale && <Pill tone="red">{T.pills.sale}</Pill>}
                      {g.isNew && <Pill tone="gold">{T.pills.new}</Pill>}
                      {g.featured && <Pill tone="gold">{T.pills.featured}</Pill>}
                    </span>
                  </td>
                  <td className={`${td} hidden text-sm whitespace-nowrap text-parchment-muted 2xl:table-cell`}>{adminDate(g.createdAt, locale)}</td>
                  <td className={td}>
                    <span className="flex justify-end gap-2">
                      <Link href={`/admin/games/${g.id}`} aria-label={T.editAria(g.title)} className={btn("ghost", "icon")}>
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
        <Pagination page={page} pages={pages} total={total} params={sp} basePath="/admin/games" t={t} />
      </Panel>
    </>
  );
}
