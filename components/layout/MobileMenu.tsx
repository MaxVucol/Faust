"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { HeaderAccount } from "@/components/auth/AccountMenu";
import { PreferencesMenu } from "@/components/i18n/PreferencesMenu";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import { NAV_LINKS, isActive } from "./nav-links";

// Opening settles in a little slower than closing; both move only opacity and transform.
const OPEN_TIMING = "duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)]";
const CLOSE_TIMING = "duration-[180ms] ease-[cubic-bezier(0.4,0,1,1)]";

/** Three bars (drawn like the usual menu icon) that fold into a cross when `open`. */
function MenuIcon({ open }: { open: boolean }) {
  const bar = cn("absolute left-1 h-0.5 w-4 rounded-full bg-current transition-[translate,rotate,opacity]", open ? OPEN_TIMING : CLOSE_TIMING);
  return (
    <span aria-hidden className="relative block size-6">
      <span className={cn(bar, "top-[5px]", open && "translate-y-[6px] rotate-45")} />
      <span className={cn(bar, "top-[11px]", open && "opacity-0")} />
      <span className={cn(bar, "top-[17px]", open && "-translate-y-[6px] -rotate-45")} />
    </span>
  );
}

export function MobileMenu({ pathname, account }: { pathname: string; account: HeaderAccount }) {
  const { t } = useI18n();
  const favorites = useFavorites();
  const [open, setOpen] = useState(false);
  // The panel stays mounted while it fades out, then leaves the page (so its links aren't prefetched).
  const [rendered, setRendered] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    // No transition runs with reduced motion, so there is no transitionend to wait for.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setRendered(false);
  }, []);

  // Close the panel when navigation changes the route.
  if (open && openedAt !== pathname) {
    close();
  }

  // Closed by the visitor (Escape or the close button): focus returns to the menu button.
  const dismiss = useCallback(() => {
    close();
    triggerRef.current?.focus();
  }, [close]);

  // While open the panel is a modal dialog, as in the catalogue's filter panel: focus moves into it
  // (the close button) and stays there (Tab wraps), and the page behind doesn't scroll. Widening the
  // window to the full navigation (xl) closes it, since the header then shows the same links.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      // An Escape the preferences dropdown has already handled (closing itself) leaves the menu open.
      if (e.key === "Escape" && !e.defaultPrevented) dismiss();
      else if (e.key === "Tab" && panelRef.current) {
        const focusable = [...panelRef.current.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea")].filter(
          (el) => !el.hasAttribute("disabled") && el.tabIndex >= 0,
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!panelRef.current.contains(document.activeElement)) {
          e.preventDefault();
          first?.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    const wide = window.matchMedia("(min-width: 1280px)");
    const onWide = () => wide.matches && close();
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      document.body.style.overflow = "";
    };
  }, [open, close, dismiss]);

  // Opening: the panel fades in and its contents glide down 10px into place (the entry state comes
  // from @starting-style). Closing reverses it a little faster. The header's menu button turns into
  // a cross under the panel while the panel's own close button, drawn the same way and in the same
  // spot, fades in over it, so it reads as one icon changing.
  const glide = cn("transition-[translate]", open ? cn("translate-y-0 starting:-translate-y-2.5", OPEN_TIMING) : cn("-translate-y-2.5", CLOSE_TIMING));

  return (
    <div className="flex xl:hidden">
      {/* A 44px touch target around the 24px icon; the negative margins keep the icon where it was. */}
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="meniu-mobil"
        aria-label={t.nav.openMenu}
        onClick={() => {
          setOpenedAt(pathname);
          setOpen(true);
          setRendered(true);
        }}
        className="-mr-2.5 flex size-11 items-center justify-center text-parchment-muted hover:text-parchment sm:-ml-2.5"
      >
        <MenuIcon open={open} />
      </button>
      {rendered && (
        <div
          ref={panelRef}
          id="meniu-mobil"
          role="dialog"
          aria-modal="true"
          aria-label={t.nav.menu}
          inert={!open}
          onTransitionEnd={(e) => {
            if (!open && e.target === e.currentTarget && e.propertyName === "opacity") setRendered(false);
          }}
          className={cn(
            "fixed inset-0 z-50 flex flex-col bg-base px-6 py-5 transition-[opacity]",
            open ? cn("opacity-100 starting:opacity-0", OPEN_TIMING) : cn("opacity-0", CLOSE_TIMING),
          )}
        >
          {/* Above the links: the glide makes both rows separate layers, and the preferences dropdown overlaps the list. */}
          <div className={cn("relative z-10 flex items-center justify-between", glide)}>
            <PreferencesMenu align="left" />
          </div>
          {/* Exactly over the header's menu button (same 44px box, same corner: the header's side padding
              less the button's 10px negative margin). */}
          <button
            ref={closeRef}
            type="button"
            aria-label={t.nav.closeMenu}
            onClick={dismiss}
            className="absolute top-4.5 right-1.5 z-20 flex size-11 items-center justify-center text-parchment-muted hover:text-parchment sm:right-3.5 lg:right-5.5"
          >
            <MenuIcon open />
          </button>
          <nav aria-label={t.nav.mobileAria} className={cn("mt-10", glide)}>
            <ul className="border-t border-iron">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="border-b border-iron">
                  <Link
                    prefetch
                    href={link.href}
                    onClick={close}
                    className={cn(
                      "block py-6 font-display text-2xl tracking-[0.15em] uppercase",
                      isActive(pathname, link.href) ? "text-aged-gold" : "text-parchment",
                    )}
                  >
                    {t.nav[link.key]}
                  </Link>
                </li>
              ))}
              <li className="border-b border-iron">
                <Link
                  href="/favorite"
                  onClick={close}
                  className={cn(
                    "block py-6 font-display text-2xl tracking-[0.15em] uppercase",
                    isActive(pathname, "/favorite") ? "text-aged-gold" : "text-parchment",
                  )}
                >
                  {t.favorites.title}
                  {favorites.count > 0 && <span className="ml-3 text-parchment-muted tabular-nums">{favorites.count}</span>}
                </Link>
              </li>
              {/* The account: sign-in for guests; the account (and Administration for an admin) once signed in. */}
              {(account ? [{ href: "/account", label: t.nav.account }, ...(account.admin ? [{ href: "/admin", label: t.nav.administration }] : [])] : [{ href: "/login", label: t.nav.login }]).map((l) => (
                <li key={l.href} className="border-b border-iron">
                  <Link
                    href={l.href}
                    onClick={close}
                    className={cn("block py-6 font-display text-2xl tracking-[0.15em] uppercase", isActive(pathname, l.href) ? "text-aged-gold" : "text-parchment")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
