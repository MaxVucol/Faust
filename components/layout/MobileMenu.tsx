"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, isActive } from "./nav-links";

export function MobileMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // Close the panel when navigation changes the route.
  if (open && openedAt !== pathname) {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="meniu-mobil"
        aria-label="Deschide meniul"
        onClick={() => {
          setOpenedAt(pathname);
          setOpen(true);
        }}
        className="text-parchment-muted hover:text-parchment"
      >
        <Menu className="size-6" />
      </button>
      {open && (
        <div
          id="meniu-mobil"
          role="dialog"
          aria-modal="true"
          aria-label="Meniu"
          className="fixed inset-0 z-50 flex flex-col bg-base px-6 py-5"
        >
          <div className="flex justify-end">
            <button
              type="button"
              aria-label="Închide meniul"
              onClick={() => setOpen(false)}
              className="text-parchment-muted hover:text-parchment"
            >
              <X className="size-7" />
            </button>
          </div>
          <nav aria-label="Navigare mobilă" className="mt-10">
            <ul className="border-t border-iron">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="border-b border-iron">
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block py-6 font-display text-2xl tracking-[0.15em] uppercase",
                      isActive(pathname, link.href) ? "text-aged-gold" : "text-parchment",
                    )}
                  >
                    {link.label}
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
