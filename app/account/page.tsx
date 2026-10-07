import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, KeyRound, LogOut } from "lucide-react";
import { signOutAction, signOutEverywhereAction } from "@/app/auth/actions";
import { AuthFrame } from "@/components/auth/AuthFrame";
import { ProfileDetails } from "@/components/auth/ProfileDetails";
import { GameImage } from "@/components/games/GameImage";
import { ButtonLink } from "@/components/ui/Button";
import { Diamond } from "@/components/ui/Ornaments";
import { isAdmin } from "@/lib/admin/auth";
import { googleConfigured, googleMessage } from "@/lib/auth/google";
import { requireUser } from "@/lib/auth/user";
import { formatAmount } from "@/lib/currency";
import { getAccountFavorites } from "@/lib/favorites-server";
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

/** One figure of the vault's summary: a label, the count, and where it leads. */
function Stat({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a href={href} className="group block border border-iron bg-[#0b0907] px-5 py-4 transition-colors duration-200 hover:border-gold-dark">
      <span className="block font-display-ui text-[0.62rem] text-parchment-muted">{label}</span>
      <span className="mt-1.5 block font-display text-xl tracking-[0.04em] text-parchment transition-colors duration-200 group-hover:text-gold-light">{value}</span>
    </a>
  );
}

/**
 * The signed-in visitor's vault: a greeting and a summary (orders, wishlist, library), the profile,
 * the orders and the games bought. Orders are only those placed from this account (Order.userId), never
 * matched by email; the library lists the lines of orders marked paid (activation keys are sent by
 * email and never stored on the site, so none is shown or copied here). Administration appears for an
 * active admin only, rendered on the server.
 */
export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const session = await requireUser("/account");
  const [{ locale, t }, sp] = await Promise.all([getI18n(), searchParams]);
  const a = t.account;
  const [account, avatar, orders, wishlist] = await Promise.all([
    // How the account signs in (only whether there is a password; the hash never leaves this line).
    prisma.user.findUnique({ where: { id: session.id }, select: { createdAt: true, googleId: true, passwordHash: true } }),
    // Only whether there is a picture and when it changed: the image itself is served by app/account/avatar.
    prisma.avatar.findUnique({ where: { id: session.id }, select: { updatedAt: true } }),
    prisma.order.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, number: true, createdAt: true, items: true, totalMdl: true, status: true, paymentStatus: true },
    }),
    getAccountFavorites(),
  ]);
  // Bought games: every line of a paid order that wasn't cancelled, newest first.
  const library = orders
    .filter((o) => o.paymentStatus === "paid" && o.status !== "cancelled")
    .flatMap((o) => o.items.map((item, n) => ({ ...item, key: `${o.id}-${n}`, date: o.createdAt })));
  const covers = new Map(
    library.length
      ? (await prisma.game.findMany({ where: { slug: { in: [...new Set(library.map((l) => l.slug))] } }, select: { slug: true, coverImage: true } })).map((g) => [g.slug, g.coverImage])
      : [],
  );
  const admin = isAdmin(session);
  const googleLinked = Boolean(account?.googleId);
  const google = {
    available: googleConfigured(),
    linked: googleLinked,
    canUnlink: googleLinked && Boolean(account?.passwordHash),
    admin: session.role === "admin",
  };

  return (
    <AuthFrame title={a.title} subtitle={a.subtitle} wide>
      <section aria-label={a.title} className="border-t border-iron/80 px-5 py-7 sm:px-10">
        <p className="font-display text-xl tracking-[0.06em] text-parchment sm:text-2xl">{a.hello(session.name)}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Stat label={a.statOrders} value={a.countOrders(orders.length)} href="#comenzi" />
          <Stat label={a.statWishlist} value={a.countGames(wishlist?.length ?? 0)} href="/favorite" />
          <Stat label={a.statLibrary} value={a.countGames(library.length)} href="#biblioteca" />
        </div>
      </section>

      <Section title={a.details}>
        <ProfileDetails
          name={session.name}
          email={session.email}
          statusText={a.statusActive}
          memberSince={account ? formatDate(account.createdAt, locale) : null}
          avatarVersion={avatar ? avatar.updatedAt.getTime() : null}
          google={google}
          initialNotice={googleMessage(t, sp.google)}
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

      <div id="comenzi" className="scroll-mt-24">
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
      </div>

      <div id="biblioteca" className="scroll-mt-24">
        <Section title={a.library}>
          <p className="mt-3 text-sm text-parchment-muted">{a.libraryNote}</p>
          {library.length === 0 ? (
            <div className="mt-6 border border-iron/70 bg-[#0b0907] px-5 py-8 text-center">
              <p className="font-display text-lg tracking-[0.1em] text-parchment uppercase">{a.libraryEmpty}</p>
              <p className="mt-1.5 text-parchment-muted">{a.libraryEmptyText}</p>
            </div>
          ) : (
            <ul className="mt-4">
              {library.map((item) => (
                <li key={item.key} className="flex items-center gap-4 border-b border-iron/60 py-4 last:border-b-0">
                  <span className="relative aspect-[3/4] w-12 shrink-0 overflow-hidden border border-iron">
                    {covers.get(item.slug) && <GameImage src={covers.get(item.slug) as string} alt="" sizes="48px" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={`/produse/${item.slug}`} className="font-display tracking-[0.06em] text-parchment uppercase hover:text-gold-light">
                      {item.title}
                    </Link>
                    <p className="mt-0.5 text-sm text-parchment-muted">
                      {[item.platform, item.edition].filter(Boolean).join(" · ")} · {a.purchased} {formatDate(item.date, locale)}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-parchment">
                      <KeyRound aria-hidden className="size-3.5 text-gold-light" strokeWidth={1.75} />
                      {a.keyByEmail}
                    </p>
                  </div>
                  <Link href="/intrebari-frecvente" className="hidden shrink-0 font-display-ui text-[0.62rem] text-parchment-muted underline-offset-4 hover:text-gold-light hover:underline sm:block">
                    {a.howToActivate}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>

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
