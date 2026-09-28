"use client";

import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/use-cart";
import { LanguageSelector } from "@/components/i18n/LanguageSelector";
import { useI18n } from "@/components/i18n/I18nProvider";
import { SITE_NAME } from "@/lib/catalog";
import { MobileMenu } from "./MobileMenu";
import { NAV_LINKS, isActive } from "./nav-links";

export function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();
  const { t } = useI18n();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gold-dark bg-[#0a0907] shadow-[0_1px_12px_rgb(192_154_85/0.15),0_8px_24px_rgb(0_0_0/0.6)]">
      <div className="mx-auto grid h-20 max-w-page grid-cols-[auto_1fr] items-center gap-4 lg:grid-cols-[auto_1fr_auto] xl:grid-cols-[1fr_auto_1fr] px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="col-start-1 flex items-center gap-3 justify-self-start font-brand text-base font-semibold tracking-[0.12em] whitespace-nowrap text-aged-gold uppercase sm:text-xl sm:tracking-[0.15em]"
        >
          {/* Pre-sized PNG, served as-is so the metal texture stays crisp. */}
          <Image src="/images/logo-tv.png" alt="" width={262} height={320} priority unoptimized className="h-14 w-auto" />
          {SITE_NAME}
        </Link>

        <nav aria-label={t.nav.mainAria} className="hidden h-full justify-self-center lg:block">
          <ul className="flex h-full items-center gap-7 xl:gap-14 2xl:gap-16">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href} className="flex h-full items-center">
                  <Link
                    prefetch
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    // The gold highlight follows the pointer (or keyboard focus) rather than
                    // marking the current page; aria-current still tells assistive tech.
                    // The glow is a short vertical fade clipped to the link's width, so nothing spills sideways.
                    className="relative border-b border-transparent px-1.5 py-2.5 font-display-ui text-[0.8rem] tracking-[0.16em] whitespace-nowrap text-white transition-[color,border-color] duration-300 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-1.5 after:bg-[linear-gradient(to_top,rgb(224_196_135/0.2),transparent)] after:[mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] after:opacity-0 after:transition-opacity after:duration-300 hover:border-gold-light hover:text-gold-light hover:after:opacity-100 focus-visible:border-gold-light focus-visible:text-gold-light focus-visible:after:opacity-100 xl:text-[0.82rem] xl:tracking-[0.18em]"
                  >
                    {t.nav[link.key]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-4 justify-self-end sm:gap-5">
          <LanguageSelector className="hidden sm:block" />
          <span aria-hidden className="hidden h-5 w-px bg-iron sm:block" />
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-expanded={searchOpen}
            aria-controls="cautare"
            aria-label={searchOpen ? t.nav.closeSearch : t.nav.search}
            className="text-white transition-[color,filter] duration-300 hover:text-gold-light hover:drop-shadow-[0_0_6px_rgb(192_154_85/0.6)] focus-visible:text-gold-light"
          >
            {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
          </button>
          <span aria-hidden className="hidden h-5 w-px bg-iron sm:block" />
          <Link
            href="/cos"
            className="flex items-center gap-2 text-sm text-white transition-[color,filter] duration-300 hover:text-gold-light hover:drop-shadow-[0_0_6px_rgb(192_154_85/0.6)] focus-visible:text-gold-light"
          >
            <ShoppingCart aria-hidden className="size-5" />
            <span>{t.nav.cart(count)}</span>
          </Link>
          <MobileMenu pathname={pathname} />
        </div>
      </div>

      {searchOpen && (
        <div id="cautare" className="border-t border-iron bg-surface">
          <Form
            action="/produse"
            onSubmit={() => setSearchOpen(false)}
            className="mx-auto flex max-w-page gap-3 px-4 py-4 sm:px-6 lg:px-8"
          >
            <label htmlFor="q-nav" className="sr-only">
              {t.nav.searchLabel}
            </label>
            <input
              id="q-nav"
              name="q"
              type="search"
              autoFocus
              placeholder={t.nav.searchPlaceholder}
              className="w-full border border-iron bg-base px-4 py-2.5 text-base text-parchment placeholder:text-parchment-muted/70 focus:border-aged-gold"
            />
            <button type="submit" className="bg-blood px-6 font-display-ui text-xs text-parchment hover:bg-blood-hover">
              {t.nav.searchButton}
            </button>
          </Form>
        </div>
      )}
    </header>
  );
}
