"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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

export function MobileMenu({ pathname }: { pathname: string }) {
  const { t } = useI18n();
  const favorites = useFavorites();
  const [open, setOpen] = useState(false);
  // The panel stays mounted while it fades out, then leaves the page (so its links aren't prefetched).
  const [rendered, setRendered] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  const close = useCallback(() => {
    setOpen(false);
    // No transition runs with reduced motion, so there is no transitionend to wait for.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setRendered(false);
  }, []);

  // Close the panel when navigation changes the route.
  if (open && openedAt !== pathname) {
    close();
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  // Opening: the panel fades in and its contents glide down 10px into place (the entry state comes
  // from @starting-style). Closing reverses it a little faster. The header's menu button turns into
  // a cross under the panel while the panel's own close button, drawn the same way and in the same
  // spot, fades in over it, so it reads as one icon changing.
  const glide = cn("transition-[translate]", open ? cn("translate-y-0 starting:-translate-y-2.5", OPEN_TIMING) : cn("-translate-y-2.5", CLOSE_TIMING));

  return (
    <div className="flex lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="meniu-mobil"
        aria-label={t.nav.openMenu}
        onClick={() => {
          setOpenedAt(pathname);
          setOpen(true);
          setRendered(true);
        }}
        className="flex size-6 items-center justify-center text-parchment-muted hover:text-parchment"
      >
        <MenuIcon open={open} />
      </button>
      {rendered && (
        <div
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
          {/* Exactly over the header's menu button (same size, same corner). */}
          <button
            type="button"
            aria-label={t.nav.closeMenu}
            onClick={close}
            className="absolute top-7 right-4 z-20 flex size-6 items-center justify-center text-parchment-muted hover:text-parchment sm:right-6"
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
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
