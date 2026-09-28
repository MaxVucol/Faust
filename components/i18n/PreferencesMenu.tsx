"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { CurrencySelector } from "./CurrencySelector";
import { LanguageSelector } from "./LanguageSelector";

type Which = "language" | "currency" | null;

/**
 * Language and currency as one quiet group — "RO ⌄ · EUR ⌄". Two separate controls sharing
 * one piece of state, so opening one closes the other.
 *
 * `header`: the currency panel opens leftwards, clear of the window edge. `panel`: both open rightwards.
 */
export function PreferencesMenu({ className, placement = "header" }: { className?: string; placement?: "header" | "panel" }) {
  const [openMenu, setOpenMenu] = useState<Which>(null);
  const control = useCallback(
    (which: Exclude<Which, null>) => ({
      open: openMenu === which,
      onOpenChange: (next: boolean) => setOpenMenu((cur) => (next ? which : cur === which ? null : cur)),
    }),
    [openMenu],
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <LanguageSelector {...control("language")} />
      <span aria-hidden className="size-[3px] rounded-full bg-bronze" />
      <CurrencySelector {...control("currency")} align={placement === "header" ? "right" : "left"} />
    </div>
  );
}
