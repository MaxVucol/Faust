import type { ReactNode } from "react";
import { Corners, OrnateDivider } from "@/components/ui/Ornaments";
import { cn } from "@/lib/utils";

/**
 * The account pages' frame: the cart's "ledger" (a near-black panel in a double frame of dark gold and
 * iron), so sign-in, registration and the account read as part of the same shop.
 */
export function AuthFrame({ title, subtitle, children, wide = false }: { title: string; subtitle?: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={cn("mx-auto px-3 py-8 sm:px-6 sm:py-14 lg:px-8", wide ? "max-w-5xl" : "max-w-xl")}>
      <div className="relative border border-gold-dark/70 bg-[#0b0907] p-1.5 sm:p-2">
        <Corners />
        <div className="border border-iron/80 bg-[#0d0b09]">
          <header className="px-5 pt-9 pb-7 text-center sm:px-10 sm:pt-11 sm:pb-8">
            <h1 className="font-display text-3xl font-semibold tracking-[0.16em] text-parchment uppercase sm:text-[2.3rem]">{title}</h1>
            {subtitle && <p className="mt-3 font-editorial text-lg text-parchment-muted italic">{subtitle}</p>}
            <OrnateDivider className="mx-auto mt-6 max-w-sm" />
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
