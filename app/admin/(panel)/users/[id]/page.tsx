import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Receipt } from "lucide-react";
import { deleteUser } from "@/app/admin/actions";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { UserForm } from "@/components/admin/UserForm";
import { adminDate, adminDateTime, BackLink, EmptyState, mdl, ORDER_TONE, PageHeader, Panel, Pill, StatCard, tr, UrlNotice } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import { requireAdmin } from "@/lib/admin/auth";
import { getUser } from "@/lib/admin/data";
import { getAdminI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getAdminI18n()).t.meta.user };
}

export default async function UserPage({ params, searchParams }: PageProps<"/admin/users/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [me, data, { t, locale }] = await Promise.all([requireAdmin(), getUser(id), getAdminI18n()]);
  const T = t.user;
  if (!data) notFound();
  const { user, signIn, orders, spent } = data;
  return (
    <>
      <BackLink href="/admin/users">{t.common.allUsers}</BackLink>
      <PageHeader
       
        title={user.name}
        description={T.meta(adminDate(user.createdAt, locale), user.lastLoginAt ? adminDateTime(user.lastLoginAt, locale) : null)}
        actions={me.id === user.id ? <Pill tone="gold">{t.common.thisIsYou}</Pill> : <ConfirmDelete action={deleteUser.bind(null, user.id)} name={user.email} redirectTo="/admin/users" />}
      />
      <UrlNotice code={sp.notice} t={t} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label={T.orders} value={orders.length} />
        <StatCard label={T.spent} value={mdl(spent)} note={T.spentNote} />
        <StatCard label={T.status} value={<span className={user.status === "active" ? "text-stock-in" : "text-stock-out"}>{t.status.account[user.status] ?? user.status}</span>} note={T.roleNote(t.status.role[user.role] ?? user.role)} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={T.account} className="px-5 pb-6 sm:px-6">
          <div className="pt-5">
            <p className="mb-5 text-sm text-parchment-muted">
              {T.signIn}:{" "}
              <span className="text-parchment">{[signIn.password && T.methodPassword, signIn.google && T.methodGoogle].filter(Boolean).join(" · ") || "—"}</span>
            </p>
            <UserForm id={user.id} initial={{ name: user.name, email: user.email, role: user.role, status: user.status, password: "" }} />
          </div>
        </Panel>
        <Panel title={T.ordersWithEmail}>
          {orders.length === 0 ? (
            <EmptyState icon={Receipt} title={T.noOrders} />
          ) : (
            <ul>
              {orders.map((o) => (
                <li key={o.id} className="border-b border-iron/60 last:border-b-0">
                  <Link href={`/admin/orders/${o.id}`} className={cn("flex flex-wrap items-center justify-between gap-3 px-5 py-3", tr)}>
                    <span>
                      <span className="font-display tracking-[0.05em]">{o.number}</span>
                      <span className="block text-sm text-parchment-muted">{adminDateTime(o.createdAt, locale)}</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-gold-light tabular-nums">{mdl(o.totalMdl)}</span>
                      <Pill tone={ORDER_TONE[o.status]}>{t.status.order[o.status] ?? o.status}</Pill>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
