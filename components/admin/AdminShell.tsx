"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BadgePercent, FolderTree, Gamepad2, ImageIcon, LayoutDashboard, LogOut, Menu, Receipt, Settings, Users, X } from "lucide-react";
import { logout } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/games", label: "Games", icon: Gamepad2 },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/discounts", label: "Discounts", icon: BadgePercent },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

const active = (pathname: string, href: string) => (href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(`${href}/`));

function Brand() {
  return (
    <Link href="/admin" className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
      <span className="font-brand text-base tracking-[0.14em] whitespace-nowrap text-gold-light uppercase">The Iron Vault</span>
      <span className="border border-gold-dark/70 px-1.5 font-display-ui text-[0.6rem] text-parchment-muted">Admin</span>
    </Link>
  );
}

function Nav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 py-5">
      <ul className="space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const on = active(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-3 border-l-2 px-3 font-display-ui text-[0.72rem] transition-colors duration-200",
                  on ? "border-gold-light bg-gold-light/[0.07] text-gold-light" : "border-transparent text-parchment-muted hover:bg-white/[0.03] hover:text-parchment",
                )}
              >
                <Icon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Profile({ name, email }: { name: string; email: string }) {
  return (
    <div className="border-t border-iron px-4 py-4">
      <div className="flex items-center gap-3">
        <span aria-hidden className="flex size-9 shrink-0 items-center justify-center border border-gold-dark/70 font-display text-sm text-gold-light uppercase">
          {name.trim().charAt(0) || "A"}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm text-parchment">{name}</p>
          <p className="truncate text-xs text-parchment-muted">{email}</p>
        </div>
      </div>
      <form action={logout} className="mt-3">
        <button type="submit" className="flex min-h-10 w-full items-center gap-2 px-1 font-display-ui text-[0.68rem] text-parchment-muted transition-colors hover:text-blood-text">
          <LogOut aria-hidden className="size-4" strokeWidth={1.75} />
          Logout
        </button>
      </form>
      <Link href="/" className="mt-1 block px-1 text-xs text-parchment-muted underline-offset-4 hover:text-parchment hover:underline">
        View the shop
      </Link>
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
    <div className="min-h-screen bg-base lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-iron bg-[#100d0a] lg:flex">
        <div className="border-b border-iron px-5 py-5">
          <Brand />
        </div>
        <Nav pathname={pathname} />
        <Profile {...user} />
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-iron bg-[#100d0a]/95 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
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
          className="flex size-11 items-center justify-center border border-iron text-parchment transition-colors hover:border-aged-gold hover:text-gold-light"
        >
          <Menu aria-hidden className="size-5" />
        </button>
      </header>

      {/* In <body>, outside the page wrapper: its entrance animation (app/template.tsx) uses a transform,
          which would make a fixed panel inside it as tall as the page. */}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-40 lg:hidden">
            <button type="button" aria-label="Close admin menu" tabIndex={-1} onClick={() => setOpen(false)} className="absolute inset-0 bg-black/70" />
            <div id="admin-drawer" role="dialog" aria-modal="true" aria-label="Admin menu" className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col border-r border-iron bg-[#100d0a] shadow-2xl">
              <div className="flex items-center justify-between border-b border-iron px-4 py-3">
                <Brand />
                <button ref={closeRef} type="button" aria-label="Close admin menu" onClick={() => setOpen(false)} className="flex size-11 items-center justify-center text-parchment-muted hover:text-parchment">
                  <X aria-hidden className="size-5" />
                </button>
              </div>
              <Nav pathname={pathname} />
              <Profile {...user} />
            </div>
          </div>,
          document.body,
        )}

      <div className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</div>
    </div>
  );
}
