import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { adminDate, EmptyState, FilterBar, filterField, filterLabel, mdl, PageHeader, Pagination, Panel, Pill, Table, td, th, UrlNotice } from "@/components/admin/ui";
import { ButtonLink } from "@/components/ui/Button";
import { listUsers } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage({ searchParams }: PageProps<"/admin/users">) {
  const sp = await searchParams;
  const { rows, total, page, pages, all } = await listUsers(sp);
  const v = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : "");
  const filtered = ["q", "role", "status"].some((k) => v(k));
  return (
    <>
      <PageHeader
        title="Users"
        description="Accounts that can sign in here. Customers order without an account; their orders are matched to an account by email."
        actions={<ButtonLink href="/admin/users/new" variant="gold" size="sm"><Plus aria-hidden className="size-4" /> Add user</ButtonLink>}
      />
      <UrlNotice code={sp.notice} />
      <Panel>
        <FilterBar basePath="/admin/users" active={filtered}>
          <div className="md:min-w-56 md:flex-1">
            <label htmlFor="q" className={filterLabel}>Search</label>
            <input id="q" name="q" type="search" defaultValue={v("q")} placeholder="Name or email" className={filterField + " md:w-full"} />
          </div>
          <div>
            <label htmlFor="role" className={filterLabel}>Role</label>
            <select id="role" name="role" defaultValue={v("role")} className={filterField}>
              <option value="">Any</option>
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className={filterLabel}>Status</label>
            <select id="status" name="status" defaultValue={v("status")} className={filterField}>
              <option value="">Any</option>
              <option value="active">active</option>
              <option value="blocked">blocked</option>
            </select>
          </div>
        </FilterBar>
        {rows.length === 0 ? (
          <EmptyState title={all === 0 ? "No users yet" : "No users match these filters"} text={all === 0 ? undefined : "Try another search or reset the filters."} />
        ) : (
          <Table>
            <thead>
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Email</th>
                <th className={th}>Role</th>
                <th className={`${th} hidden md:table-cell`}>Registered</th>
                <th className={`${th} hidden sm:table-cell`}>Orders</th>
                <th className={`${th} hidden lg:table-cell`}>Spent</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02]">
                  <td className={td}><Link href={`/admin/users/${u.id}`} className="hover:text-gold-light">{u.name}</Link></td>
                  <td className={`${td} max-w-[14rem] truncate text-sm text-parchment-muted`}>{u.email}</td>
                  <td className={td}><Pill tone={u.role === "admin" ? "gold" : "muted"}>{u.role}</Pill></td>
                  <td className={`${td} hidden text-sm whitespace-nowrap text-parchment-muted md:table-cell`}>{adminDate(u.createdAt)}</td>
                  <td className={`${td} hidden tabular-nums sm:table-cell`}>{u.orders}</td>
                  <td className={`${td} hidden whitespace-nowrap tabular-nums lg:table-cell`}>{mdl(u.spent)}</td>
                  <td className={td}><Pill tone={u.status === "active" ? "green" : "red"}>{u.status}</Pill></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Pagination page={page} pages={pages} total={total} params={sp} basePath="/admin/users" />
      </Panel>
    </>
  );
}
