"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { LogOut, Shield, UserRound } from "lucide-react";
import { signOutAction } from "@/app/auth/actions";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

/** What the header knows about the signed-in visitor (from the server, per request). */
export type HeaderAccount = { name: string; admin: boolean } | null;

const item =
  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-[0.95rem] whitespace-nowrap text-parchment transition-colors duration-150 outline-none hover:bg-white/[0.04] hover:text-gold-light focus-visible:bg-white/[0.04] focus-visible:text-gold-light";

/**
 * The header's profile control: a small menu with sign-in and registration for guests; the account and
 * sign-out once signed in; Administration too for an admin. Showing the link is only a convenience:
 * /admin checks the role on the server.
 */
export function AccountMenu({ account, className }: { account: HeaderAccount; className?: string }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  if (open && openedAt !== pathname) setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !rootRef.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={account ? `${t.nav.profile}: ${account.name}` : t.nav.profile}
        onClick={() => {
          setOpenedAt(pathname);
          setOpen((v) => !v);
        }}
        className={cn(
          "flex h-11 min-w-11 items-center justify-center text-white transition-[color,filter] duration-300 hover:text-gold-light hover:drop-shadow-[0_0_6px_rgb(192_154_85/0.6)] focus-visible:text-gold-light sm:-mx-2.5 sm:min-w-0 sm:px-2.5",
          open && "text-gold-light",
        )}
      >
        <UserRound aria-hidden strokeWidth={1.75} className={cn("size-5", account && "text-aged-gold")} />
      </button>
      <div
        id={panelId}
        className={cn(
          "absolute top-full right-0 z-50 mt-2 min-w-56 border border-gold-dark/40 bg-[#0a0907] py-2 shadow-[0_10px_24px_rgb(0_0_0/0.55)] duration-150 ease-out",
          open ? "visible translate-y-0 opacity-100 transition-[opacity,transform]" : "invisible -translate-y-1 opacity-0 transition-[opacity,transform,visibility]",
        )}
      >
        {account ? (
          <>
            <p className="truncate px-4 pt-1 pb-2 font-display-ui text-[0.62rem] tracking-[0.2em] text-parchment-muted">{account.name}</p>
            <div aria-hidden className="mx-4 mb-1 h-px bg-iron" />
            <Link href="/account" className={item} tabIndex={open ? 0 : -1}>
              <UserRound aria-hidden strokeWidth={1.75} className="size-4 shrink-0 text-aged-gold" />
              {t.nav.account}
            </Link>
            {account.admin && (
              <Link href="/admin" className={item} tabIndex={open ? 0 : -1}>
                <Shield aria-hidden strokeWidth={1.75} className="size-4 shrink-0 text-aged-gold" />
                {t.nav.administration}
              </Link>
            )}
            <div aria-hidden className="mx-4 my-1 h-px bg-iron" />
            <form action={signOutAction}>
              <button type="submit" className={item} tabIndex={open ? 0 : -1}>
                <LogOut aria-hidden strokeWidth={1.75} className="size-4 shrink-0 text-aged-gold" />
                {t.nav.logout}
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className={item} tabIndex={open ? 0 : -1}>
              {t.nav.login}
            </Link>
            <Link href="/register" className={item} tabIndex={open ? 0 : -1}>
              {t.nav.register}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
