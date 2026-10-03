import type { Metadata } from "next";
import Link from "next/link";
import { Plus, SearchX, Users } from "lucide-react";
import { adminDate, btn, EmptyState, FilterBar, filterField, filterLabel, mdl, PageHeader, Pagination, Panel, Pill, Table, td, th, tr, UrlNotice } from "@/components/admin/ui";
import { listUsers } from "@/lib/admin/data";
import { getAdminI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getAdminI18n()).t.meta.users };
}

export default async function UsersPage({ searchParams }: PageProps<"/admin/users">) {
  const sp = await searchParams;
  const [{ rows, total, page, pages, all }, { t, locale }] = await Promise.all([listUsers(sp), getAdminI18n()]);
  const T = t.users;
  const v = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const filtered = ["q", "role", "status"].some((k) => v(k));
  return (
    <>
      <PageHeader
       
        title={T.title}
        description={T.description}
        actions={<Link href="/admin/users/new" className={btn("primary", "md")}><Plus aria-hidden className="size-4" /> {T.add}</Link>}
      />
      <UrlNotice code={sp.notice} t={t} />
      <Panel>
        <FilterBar basePath="/admin/users" active={filtered} t={t}>
          <div className="md:min-w-56 md:flex-1">
            <label htmlFor="q" className={filterLabel}>{T.filters.search}</label>
            <input id="q" name="q" type="search" defaultValue={v("q")} placeholder={T.filters.searchPlaceholder} className={filterField + " md:w-full"} />
          </div>
          <div>
            <label htmlFor="role" className={filterLabel}>{T.filters.role}</label>
            <select id="role" name="role" defaultValue={v("role")} className={filterField}>
              <option value="">{t.common.any}</option>
              <option value="admin">{t.status.role.admin}</option>
              <option value="user">{t.status.role.user}</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className={filterLabel}>{T.filters.status}</label>
            <select id="status" name="status" defaultValue={v("status")} className={filterField}>
              <option value="">{t.common.any}</option>
              <option value="active">{t.status.account.active}</option>
              <option value="blocked">{t.status.account.blocked}</option>
            </select>
          </div>
        </FilterBar>
        {rows.length === 0 ? (
          <EmptyState icon={all === 0 ? Users : SearchX} title={all === 0 ? T.empty.title : T.empty.filteredTitle} text={all === 0 ? undefined : T.empty.filteredText} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th className={th}>{T.columns.name}</th>
                <th className={th}>{T.columns.email}</th>
                <th className={th}>{T.columns.role}</th>
                <th className={`${th} hidden md:table-cell`}>{T.columns.registered}</th>
                <th className={`${th} hidden sm:table-cell`}>{T.columns.orders}</th>
                <th className={`${th} hidden lg:table-cell`}>{T.columns.spent}</th>
                <th className={th}>{T.columns.status}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className={tr}>
                  <td className={td}><Link href={`/admin/users/${u.id}`} className="text-parchment transition-colors hover:text-gold-light">{u.name}</Link></td>
                  <td className={`${td} max-w-[14rem] truncate text-sm text-parchment-muted`}>{u.email}</td>
                  <td className={td}><Pill tone={u.role === "admin" ? "gold" : "muted"}>{t.status.role[u.role] ?? u.role}</Pill></td>
                  <td className={`${td} hidden text-sm whitespace-nowrap text-parchment-muted md:table-cell`}>{adminDate(u.createdAt, locale)}</td>
                  <td className={`${td} hidden tabular-nums sm:table-cell`}>{u.orders}</td>
                  <td className={`${td} hidden whitespace-nowrap tabular-nums lg:table-cell`}>{mdl(u.spent)}</td>
                  <td className={td}><Pill tone={u.status === "active" ? "green" : "red"}>{t.status.account[u.status] ?? u.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Pagination page={page} pages={pages} total={total} params={sp} basePath="/admin/users" t={t} />
      </Panel>
    </>
  );
}
