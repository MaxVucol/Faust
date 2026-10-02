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

export const metadata: Metadata = { title: "User" };

export default async function UserPage({ params, searchParams }: PageProps<"/admin/users/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [me, data] = await Promise.all([requireAdmin(), getUser(id)]);
  if (!data) notFound();
  const { user, orders, spent } = data;
  return (
    <>
      <BackLink href="/admin/users">All users</BackLink>
      <PageHeader
       
        title={user.name}
        description={<>Registered {adminDate(user.createdAt)} · {user.lastLoginAt ? `last sign-in ${adminDateTime(user.lastLoginAt)}` : "never signed in"}</>}
        actions={me.id === user.id ? <Pill tone="gold">This is you</Pill> : <ConfirmDelete action={deleteUser.bind(null, user.id)} name={user.email} redirectTo="/admin/users" />}
      />
      <UrlNotice code={sp.notice} />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Orders" value={orders.length} />
        <StatCard label="Total spent" value={mdl(spent)} note="Cancelled orders not counted" />
        <StatCard label="Status" value={<span className={user.status === "active" ? "text-stock-in" : "text-stock-out"}>{user.status}</span>} note={`Role: ${user.role}`} />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Account" className="px-5 pb-6 sm:px-6">
          <div className="pt-5">
            <UserForm id={user.id} initial={{ name: user.name, email: user.email, role: user.role, status: user.status, password: "" }} />
          </div>
        </Panel>
        <Panel title="Orders with this email">
          {orders.length === 0 ? (
            <EmptyState icon={Receipt} title="No orders" />
          ) : (
            <ul>
              {orders.map((o) => (
                <li key={o.id} className="border-b border-iron/60 last:border-b-0">
                  <Link href={`/admin/orders/${o.id}`} className={cn("flex flex-wrap items-center justify-between gap-3 px-5 py-3", tr)}>
                    <span>
                      <span className="font-display tracking-[0.05em]">{o.number}</span>
                      <span className="block text-sm text-parchment-muted">{adminDateTime(o.createdAt)}</span>
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
      </div>
    </>
  );
}
