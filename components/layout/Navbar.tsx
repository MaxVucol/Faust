"use client";

import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/use-cart";
import { SITE_NAME } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";
import { NAV_LINKS, isActive } from "./nav-links";

export function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-iron bg-base">
      <div className="mx-auto flex h-20 max-w-page items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 font-display text-base font-semibold tracking-[0.12em] whitespace-nowrap text-aged-gold uppercase sm:text-xl sm:tracking-[0.15em]"
        >
          {/* Pre-sized PNG, served as-is so the metal texture stays crisp. */}
          <Image src="/images/logo-tv.png" alt="" width={262} height={320} priority unoptimized className="h-14 w-auto" />
          {SITE_NAME}
        </Link>

        <nav aria-label="Navigare principală" className="hidden h-full md:block">
          <ul className="flex h-full items-center gap-10">
            {NAV_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href} className="flex h-full items-center">
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "border-b py-1.5 font-display-ui text-[0.7rem] transition-colors duration-300",
                      active
                        ? "border-aged-gold text-aged-gold"
                        : "border-transparent text-parchment-muted hover:text-parchment",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-4 sm:gap-5">
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-expanded={searchOpen}
            aria-controls="cautare"
            aria-label={searchOpen ? "Închide căutarea" : "Caută"}
            className="text-parchment-muted transition-colors duration-300 hover:text-parchment"
          >
            {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
          </button>
          <span aria-hidden className="hidden h-5 w-px bg-iron sm:block" />
          <Link
            href="/cos"
            className="flex items-center gap-2 text-sm text-parchment-muted transition-colors duration-300 hover:text-parchment"
          >
            <ShoppingCart aria-hidden className="size-5" />
            <span>Coș ({count})</span>
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
              Caută un joc
            </label>
            <input
              id="q-nav"
              name="q"
              type="search"
              autoFocus
              placeholder="Caută după titlu…"
              className="w-full border border-iron bg-base px-4 py-2.5 text-base text-parchment placeholder:text-parchment-muted/70 focus:border-aged-gold"
            />
            <button type="submit" className="bg-blood px-6 font-display-ui text-xs text-parchment hover:bg-blood-hover">
              Caută
            </button>
          </Form>
        </div>
      )}
    </header>
  );
}
