"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BadgePercent, ChevronDown, ExternalLink, FolderTree, Gamepad2, ImageIcon, LayoutDashboard, LogOut, Menu, Receipt, Settings, UserRound, Users, X } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { Diamond } from "@/components/ui/Ornaments";
import { cn } from "@/lib/utils";
import { AvatarPicture } from "@/components/auth/AvatarPicture";
import { useAdminI18n } from "./AdminI18n";
import { LanguageMenu } from "./LanguageMenu";

/** Every section of the panel, grouped as the work is; `group` and `label` are keys of the admin dictionary's `shell`. */
const NAV = [
  { group: "overview", items: [{ href: "/admin", label: "dashboard", icon: LayoutDashboard }] },
  {
    group: "catalogue",
    items: [
      { href: "/admin/games", label: "games", icon: Gamepad2 },
      { href: "/admin/categories", label: "categories", icon: FolderTree },
      { href: "/admin/discounts", label: "discounts", icon: BadgePercent },
      { href: "/admin/media", label: "media", icon: ImageIcon },
    ],
  },
  {
    group: "trade",
    items: [
      { href: "/admin/orders", label: "orders", icon: Receipt },
      { href: "/admin/users", label: "users", icon: Users },
    ],
  },
  { group: "system", items: [{ href: "/admin/settings", label: "settings", icon: Settings }] },
] as const;

const active = (pathname: string, href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));

/** The shop's crest and wordmark, with the panel's name under it. */
function Brand({ compact = false }: { compact?: boolean }) {
  const { t } = useAdminI18n();
  return (
    <Link href="/admin" className="flex min-w-0 items-center gap-3">
      {/* Pre-sized PNG, served as-is so the metal texture stays crisp (as in the shop's header). */}
      <Image src="/images/logo-tv.png" alt="" width={262} height={320} unoptimized className={cn("w-auto shrink-0", compact ? "h-9" : "h-11")} />
      <span className="min-w-0">
        <span className="block font-brand text-[0.95rem] leading-tight font-semibold tracking-[0.12em] whitespace-nowrap text-aged-gold uppercase">The Iron Vault</span>
        <span className="mt-0.5 flex items-center gap-2 font-display-ui text-[0.55rem] tracking-[0.3em] text-parchment-muted">
          <span aria-hidden className="h-px w-3 bg-gold-dark" />
          {t.shell.brandSub}
        </span>
      </span>
    </Link>
  );
}

function Nav({ pathname }: { pathname: string }) {
  const { t } = useAdminI18n();
  return (
    <nav aria-label={t.shell.navAria} className="flex-1 overflow-y-auto px-3 py-4">
      {NAV.map(({ group, items }) => (
        <div key={group} className="mb-4 last:mb-0">
          <p aria-hidden className="mb-1.5 flex items-center gap-2 px-3 font-display-ui text-[0.52rem] tracking-[0.28em] text-parchment-muted/70">
            {t.shell.groups[group]}
            <span className="h-px flex-1 bg-iron/70" />
          </p>
          <ul className="space-y-0.5">
            {items.map(({ href, label, icon: Icon }) => {
              const on = active(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={on ? "page" : undefined}
                    className={cn(
                      "group relative flex min-h-11 items-center gap-3 border px-3 font-display-ui text-[0.7rem] transition-colors duration-200",
                      on
                        ? "border-gold-dark/50 bg-[linear-gradient(90deg,rgb(192_154_85/0.12),rgb(192_154_85/0.02))] text-parchment"
                        : "border-transparent text-parchment-muted hover:bg-gold-light/[0.04] hover:text-parchment",
                    )}
                  >
                    {/* The active item's gold edge. */}
                    <span aria-hidden className={cn("absolute inset-y-0 -left-px w-0.5", on ? "bg-gold-light" : "bg-transparent")} />
                    <Icon aria-hidden className={cn("size-4 shrink-0 transition-colors", on ? "text-gold-light" : "text-gold-dark group-hover:text-gold-light")} strokeWidth={1.6} />
                    <span className="flex-1">{t.shell.nav[label]}</span>
                    {on && <Diamond className="size-1.5 bg-gold-light" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** The signed-in admin as the layout passes them: `avatarVersion` is when their picture last changed (ms), or null. */
type ShellUser = { name: string; email: string; avatarVersion: number | null };

function Profile({ name, email, avatarVersion }: ShellUser) {
  const { t } = useAdminI18n();
  const link = "flex min-h-9 items-center gap-2 text-sm text-parchment-muted transition-colors hover:text-gold-light";
  return (
    <div className="border-t border-gold-dark/30 bg-panel-deep/70 px-4 pt-4 pb-3">
      <div className="flex items-center gap-3">
        {/* Their picture in a round frame, or the initial on a small diamond plate. */}
        {avatarVersion ? (
          <span aria-hidden className="relative size-10 shrink-0 overflow-hidden rounded-full border border-gold-dark/80 bg-[#0b0907]">
            <AvatarPicture name={name} version={avatarVersion} alt="" sizes="40px" initialClassName="text-base" />
          </span>
        ) : (
          <span aria-hidden className="relative flex size-10 shrink-0 items-center justify-center">
            <span className="absolute inset-1 rotate-45 border border-gold-dark bg-panel" />
            <span className="relative font-display text-base text-gold-light uppercase">{name.trim().charAt(0) || "A"}</span>
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-[0.95rem] leading-tight text-parchment">{name}</p>
          <p className="truncate text-xs text-parchment-muted">{email}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-3 border-t border-iron/70 pt-2">
        <Link href="/account" className={link}>
          <UserRound aria-hidden className="size-3.5" strokeWidth={1.75} />
          {t.shell.myAccount}
        </Link>
        <Link href="/" className={link}>
          <ExternalLink aria-hidden className="size-3.5" strokeWidth={1.75} />
          {t.shell.viewShop}
        </Link>
      </div>
      <form action={logout} className="mt-1">
        <button
          type="submit"
          className="flex min-h-10 w-full items-center justify-center gap-2 border border-iron font-display-ui text-[0.62rem] text-parchment-muted transition-colors hover:border-blood/70 hover:bg-blood/10 hover:text-blood-text"
        >
          <LogOut aria-hidden className="size-3.5" strokeWidth={1.75} />
          {t.shell.logout}
        </button>
      </form>
    </div>
  );
}

/** The signed-in admin, top right: picture (or initial), name and role; opens a small menu (account, the shop, logout). */
function ProfileMenu({ name, avatarVersion }: Pick<ShellUser, "name" | "avatarVersion">) {
  const { t } = useAdminI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  const item = "flex min-h-11 w-full items-center gap-3 px-4 text-left text-[0.95rem] text-parchment-muted transition-colors hover:bg-gold-light/[0.06] hover:text-parchment";
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="admin-profile-menu"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-12 items-center gap-3 px-2 text-left transition-colors hover:text-gold-light"
      >
        <span aria-hidden className="relative size-9 shrink-0 overflow-hidden rounded-full border border-gold-dark/80 bg-black/50">
          <AvatarPicture name={name} version={avatarVersion} alt="" sizes="36px" initialClassName="text-base" />
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block max-w-40 truncate font-display text-[0.95rem] leading-tight font-semibold text-gold-light">{name}</span>
          <span className="block text-xs leading-tight text-parchment-muted">{t.shell.administrator}</span>
        </span>
        <ChevronDown aria-hidden className={cn("size-4 text-parchment-muted transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div id="admin-profile-menu" role="menu" className="absolute top-full right-0 z-50 mt-1 w-56 border border-gold-dark/70 bg-[#0d0b08] py-1 shadow-[0_18px_40px_rgb(0_0_0/0.7)]">
          <Link role="menuitem" href="/account" className={item} onClick={() => setOpen(false)}>
            <UserRound aria-hidden className="size-4 text-gold-dark" strokeWidth={1.75} /> {t.shell.myAccount}
          </Link>
          <Link role="menuitem" href="/" className={item} onClick={() => setOpen(false)}>
            <ExternalLink aria-hidden className="size-4 text-gold-dark" strokeWidth={1.75} /> {t.shell.viewShop}
          </Link>
          <div className="my-1 h-px bg-iron" />
          <form action={logout}>
            <button role="menuitem" type="submit" className={cn(item, "hover:text-blood-text")}>
              <LogOut aria-hidden className="size-4" strokeWidth={1.75} /> {t.shell.logout}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

/** The work area's top bar (from lg up), in the sidebar's colour: the language and the profile menu on the right. */
function TopBar(user: Pick<ShellUser, "name" | "avatarVersion">) {
  return (
    <div className="relative z-20 hidden h-[3.75rem] items-center justify-end gap-3 border-b border-gold-dark/40 bg-[#0a0907] px-6 shadow-[0_8px_24px_rgb(0_0_0/0.35)] lg:flex">
      <LanguageMenu />
      <span aria-hidden className="h-6 w-px bg-iron" />
      <ProfileMenu {...user} />
    </div>
  );
}

/**
 * The panel's frame: a fixed sidebar from lg up; below lg a top bar whose menu button opens the same
 * navigation as a drawer (a modal: Escape or the backdrop closes it, the page behind doesn't scroll,
 * and it closes on navigation).
 */
export function AdminShell({ user, children }: { user: ShellUser; children: ReactNode }) {
  const { t } = useAdminI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  if (open && openedAt !== pathname) setOpen(false);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const wide = window.matchMedia("(min-width: 64rem)");
    const onWide = () => wide.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      document.body.style.overflow = overflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    // No fill of its own: the work area sits on the storefront's vault-hall background (body::before).
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-gold-dark/40 bg-[#0a0907] shadow-[1px_0_0_rgb(0_0_0/0.6),8px_0_24px_rgb(0_0_0/0.35)] lg:flex">
        <div className="px-5 pt-5 pb-4">
          <Brand />
        </div>
        <div aria-hidden className="mx-5 flex items-center gap-2">
          <span className="h-px flex-1 bg-gold-dark/60" />
          <Diamond className="size-1.5 border border-gold-light" />
          <span className="h-px flex-1 bg-gold-dark/60" />
        </div>
        {/* The account and Logout live in the top bar's profile menu from lg up. */}
        <Nav pathname={pathname} />
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-gold-dark/60 bg-[#0a0907]/95 px-4 py-2.5 shadow-[0_8px_24px_rgb(0_0_0/0.5)] backdrop-blur lg:hidden">
        <Brand compact />
        <div className="flex shrink-0 items-center gap-1">
          <LanguageMenu />
          <button
            ref={triggerRef}
            type="button"
            aria-label={t.shell.openMenu}
            aria-expanded={open}
            aria-controls="admin-drawer"
            onClick={() => {
              setOpenedAt(pathname);
              setOpen(true);
            }}
            className="flex size-11 shrink-0 items-center justify-center border border-gold-dark/60 text-gold-light transition-colors hover:border-gold-light hover:bg-gold-light/[0.06]"
          >
            <Menu aria-hidden className="size-5" />
          </button>
        </div>
      </header>

      {/* In <body>, outside the page wrapper: its entrance animation (app/template.tsx) uses a transform,
          which would make a fixed panel inside it as tall as the page. */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-40 lg:hidden">
            <button type="button" aria-label={t.shell.closeMenu} tabIndex={-1} onClick={() => setOpen(false)} className="absolute inset-0 bg-black/75" />
            <div id="admin-drawer" role="dialog" aria-modal="true" aria-label={t.shell.drawerLabel} className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col border-r border-gold-dark/50 bg-[#0a0907] shadow-2xl">
              <div className="flex items-center justify-between gap-2 border-b border-gold-dark/40 py-2.5 pr-2 pl-4">
                <Brand compact />
                <button ref={closeRef} type="button" aria-label={t.shell.closeMenu} onClick={() => setOpen(false)} className="flex size-11 shrink-0 items-center justify-center text-parchment-muted transition-colors hover:text-gold-light">
                  <X aria-hidden className="size-5" />
                </button>
              </div>
              <Nav pathname={pathname} />
              <Profile {...user} />
            </div>
          </div>,
          document.body,
        )}

      <div className="min-w-0">
        <TopBar name={user.name} avatarVersion={user.avatarVersion} />
        <div className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8 2xl:px-14">
          <div className="mx-auto max-w-[110rem]">{children}</div>
        </div>
      </div>
    </div>
  );
}
