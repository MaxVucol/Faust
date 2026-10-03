import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, LogOut } from "lucide-react";
import { signOutAction, signOutEverywhereAction } from "@/app/auth/actions";
import { AuthFrame } from "@/components/auth/AuthFrame";
import { ProfileDetails } from "@/components/auth/ProfileDetails";
import { ButtonLink } from "@/components/ui/Button";
import { Diamond } from "@/components/ui/Ornaments";
import { isAdmin } from "@/lib/admin/auth";
import { requireUser } from "@/lib/auth/user";
import { formatAmount } from "@/lib/currency";
import { formatDate } from "@/lib/format";
import { getI18n } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.account.metaTitle, robots: { index: false } };
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-iron/80 px-5 py-7 sm:px-10">
      <h2 className="flex items-center gap-2.5 border-b border-gold-dark/50 pb-3 font-display-ui text-[0.72rem] text-gold-light">
        <Diamond className="size-1.5 bg-gold-dark" />
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * The signed-in visitor's account. Orders are only those placed from this account (Order.userId);
 * never matched by email. Administration appears for an active admin only, rendered on the server.
 */
export default async function AccountPage() {
  const session = await requireUser("/account");
  const { locale, t } = await getI18n();
  const a = t.account;
  const [account, avatar, orders] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.id }, select: { createdAt: true } }),
    // Only whether there is a picture and when it changed: the image itself is served by app/account/avatar.
    prisma.avatar.findUnique({ where: { id: session.id }, select: { updatedAt: true } }),
    prisma.order.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, number: true, createdAt: true, items: true, totalMdl: true, status: true, paymentStatus: true },
    }),
  ]);
  const admin = isAdmin(session);

  return (
    <AuthFrame title={a.title} subtitle={a.subtitle} wide>
      <Section title={a.details}>
        <ProfileDetails
          name={session.name}
          email={session.email}
          statusText={a.statusActive}
          memberSince={account ? formatDate(account.createdAt, locale) : null}
          avatarVersion={avatar ? avatar.updatedAt.getTime() : null}
        />
      </Section>

      {admin && (
        <Section title={a.administration}>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-parchment-muted">{a.administrationText}</p>
            <ButtonLink href="/admin" variant="outline" size="sm" className="shrink-0">
              {a.openAdministration}
              <ArrowRight aria-hidden className="size-3.5" />
            </ButtonLink>
          </div>
        </Section>
      )}

      <Section title={a.orders}>
        <p className="mt-3 text-sm text-parchment-muted">{a.ordersNote}</p>
        {orders.length === 0 ? (
          <div className="mt-6 flex flex-col items-start gap-4">
            <p className="text-parchment">{a.noOrders}</p>
            <ButtonLink href="/produse" variant="ghost" size="sm">
              {t.cart.browse}
            </ButtonLink>
          </div>
        ) : (
          <ul className="mt-4">
            {orders.map((o) => (
              <li key={o.id} className="border-b border-iron/60 py-4 last:border-b-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="font-display tracking-[0.06em] text-parchment">{o.number}</p>
                  <p className="font-display text-lg text-gold-light tabular-nums">{formatAmount(o.totalMdl, "MDL")}</p>
                </div>
                <p className="mt-1 text-sm text-parchment-muted">
                  {a.orderPlaced} {formatDate(o.createdAt, locale)} · {a.orderStatus[o.status] ?? o.status} · {a.paymentStatus[o.paymentStatus] ?? o.paymentStatus}
                </p>
                <ul className="mt-2 space-y-0.5 text-sm">
                  {o.items.map((i, n) => (
                    <li key={n} className="flex justify-between gap-4">
                      <span className="min-w-0">
                        <Link href={`/produse/${i.slug}`} className="hover:text-gold-light">
                          {i.title}
                        </Link>{" "}
                        <span className="text-parchment-muted">
                          {[i.platform, i.edition].filter(Boolean).join(" · ")} × {i.quantity}
                        </span>
                      </span>
                      <span className="shrink-0 text-parchment-muted tabular-nums">{formatAmount(i.sum, "MDL")}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title={a.security}>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <form action={signOutAction}>
            <button type="submit" className="inline-flex min-h-11 items-center gap-2 border border-iron px-5 font-display-ui text-[0.7rem] text-parchment transition-colors hover:border-aged-gold hover:text-gold-light">
              <LogOut aria-hidden className="size-4" strokeWidth={1.75} />
              {a.logout}
            </button>
          </form>
          <form action={signOutEverywhereAction} className="sm:ml-auto">
            <button type="submit" className="min-h-11 px-1 text-left font-display-ui text-[0.66rem] text-parchment-muted underline-offset-4 hover:text-blood-text hover:underline">
              {a.logoutEverywhere}
            </button>
          </form>
        </div>
        <p className="mt-2 text-sm text-parchment-muted sm:text-right">{a.logoutEverywhereText}</p>
      </Section>
    </AuthFrame>
  );
}
