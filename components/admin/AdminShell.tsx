"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BadgePercent, ExternalLink, FolderTree, Gamepad2, ImageIcon, LayoutDashboard, LogOut, Menu, Receipt, Settings, UserRound, Users, X } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { Diamond } from "@/components/ui/Ornaments";
import { cn } from "@/lib/utils";

/** Every section of the panel, grouped as the work is: the catalogue, the trade, the configuration. */
const NAV = [
  { group: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    group: "Catalogue",
    items: [
      { href: "/admin/games", label: "Games", icon: Gamepad2 },
      { href: "/admin/categories", label: "Categories", icon: FolderTree },
      { href: "/admin/discounts", label: "Discounts", icon: BadgePercent },
      { href: "/admin/media", label: "Media", icon: ImageIcon },
    ],
  },
  {
    group: "Trade",
    items: [
      { href: "/admin/orders", label: "Orders", icon: Receipt },
      { href: "/admin/users", label: "Users", icon: Users },
    ],
  },
  { group: "System", items: [{ href: "/admin/settings", label: "Settings", icon: Settings }] },
] as const;

const active = (pathname: string, href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));

/** The shop's crest and wordmark, with the panel's name under it. */
function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/admin" className="flex min-w-0 items-center gap-3">
      {/* Pre-sized PNG, served as-is so the metal texture stays crisp (as in the shop's header). */}
      <Image src="/images/logo-tv.png" alt="" width={262} height={320} unoptimized className={cn("w-auto shrink-0", compact ? "h-9" : "h-11")} />
      <span className="min-w-0">
        <span className="block font-brand text-[0.95rem] leading-tight font-semibold tracking-[0.12em] whitespace-nowrap text-aged-gold uppercase">The Iron Vault</span>
        <span className="mt-0.5 flex items-center gap-2 font-display-ui text-[0.55rem] tracking-[0.3em] text-parchment-muted">
          <span aria-hidden className="h-px w-3 bg-gold-dark" />
          Administration
        </span>
      </span>
    </Link>
  );
}

function Nav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-4">
      {NAV.map(({ group, items }) => (
        <div key={group} className="mb-4 last:mb-0">
          <p aria-hidden className="mb-1.5 flex items-center gap-2 px-3 font-display-ui text-[0.52rem] tracking-[0.28em] text-parchment-muted/70">
            {group}
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
                    <span className="flex-1">{label}</span>
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

function Profile({ name, email }: { name: string; email: string }) {
  const link = "flex min-h-9 items-center gap-2 text-sm text-parchment-muted transition-colors hover:text-gold-light";
  return (
    <div className="border-t border-gold-dark/30 bg-panel-deep/70 px-4 pt-4 pb-3">
      <div className="flex items-center gap-3">
        {/* The initial on a small diamond plate. */}
        <span aria-hidden className="relative flex size-10 shrink-0 items-center justify-center">
          <span className="absolute inset-1 rotate-45 border border-gold-dark bg-panel" />
          <span className="relative font-display text-base text-gold-light uppercase">{name.trim().charAt(0) || "A"}</span>
        </span>
        <div className="min-w-0">
          <p className="truncate text-[0.95rem] leading-tight text-parchment">{name}</p>
          <p className="truncate text-xs text-parchment-muted">{email}</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-3 border-t border-iron/70 pt-2">
        <Link href="/account" className={link}>
          <UserRound aria-hidden className="size-3.5" strokeWidth={1.75} />
          My account
        </Link>
        <Link href="/" className={link}>
          <ExternalLink aria-hidden className="size-3.5" strokeWidth={1.75} />
          View the shop
        </Link>
      </div>
      <form action={logout} className="mt-1">
        <button
          type="submit"
          className="flex min-h-10 w-full items-center justify-center gap-2 border border-iron font-display-ui text-[0.62rem] text-parchment-muted transition-colors hover:border-blood/70 hover:bg-blood/10 hover:text-blood-text"
        >
          <LogOut aria-hidden className="size-3.5" strokeWidth={1.75} />
          Logout
        </button>
      </form>
    </div>
  );
}

/**
 * The panel's frame: a fixed sidebar from lg up; below lg a top bar whose menu button opens the same
 * navigation as a drawer (a modal: Escape or the backdrop closes it, the page behind doesn't scroll,
 * and it closes on navigation).
 */
export function AdminShell({ user, children }: { user: { name: string; email: string }; children: ReactNode }) {
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
    // A faint warm light falls from the top of the work area, as from the shop's header; nothing more.
    <div className="min-h-screen bg-base bg-[radial-gradient(ellipse_80%_40%_at_60%_0%,rgb(192_154_85/0.05),transparent)] lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-gold-dark/40 bg-[#0a0907] shadow-[1px_0_0_rgb(0_0_0/0.6),8px_0_24px_rgb(0_0_0/0.35)] lg:flex">
        <div className="px-5 pt-5 pb-4">
          <Brand />
        </div>
        <div aria-hidden className="mx-5 flex items-center gap-2">
          <span className="h-px flex-1 bg-gold-dark/60" />
          <Diamond className="size-1.5 border border-gold-light" />
          <span className="h-px flex-1 bg-gold-dark/60" />
        </div>
        <Nav pathname={pathname} />
        <Profile {...user} />
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-gold-dark/60 bg-[#0a0907]/95 px-4 py-2.5 shadow-[0_8px_24px_rgb(0_0_0/0.5)] backdrop-blur lg:hidden">
        <Brand compact />
        <button
          ref={triggerRef}
          type="button"
          aria-label="Open admin menu"
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
      </header>

      {/* In <body>, outside the page wrapper: its entrance animation (app/template.tsx) uses a transform,
          which would make a fixed panel inside it as tall as the page. */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-40 lg:hidden">
            <button type="button" aria-label="Close admin menu" tabIndex={-1} onClick={() => setOpen(false)} className="absolute inset-0 bg-black/75" />
            <div id="admin-drawer" role="dialog" aria-modal="true" aria-label="Admin menu" className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col border-r border-gold-dark/50 bg-[#0a0907] shadow-2xl">
              <div className="flex items-center justify-between gap-2 border-b border-gold-dark/40 py-2.5 pr-2 pl-4">
                <Brand compact />
                <button ref={closeRef} type="button" aria-label="Close admin menu" onClick={() => setOpen(false)} className="flex size-11 shrink-0 items-center justify-center text-parchment-muted transition-colors hover:text-gold-light">
                  <X aria-hidden className="size-5" />
                </button>
              </div>
              <Nav pathname={pathname} />
              <Profile {...user} />
            </div>
          </div>,
          document.body,
        )}

      <div className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-9 2xl:px-14">
        <div className="mx-auto max-w-[110rem]">{children}</div>
      </div>
    </div>
  );
}
