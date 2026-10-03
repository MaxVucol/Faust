"use client";

import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { setLocale } from "@/lib/i18n/actions";
import { LOCALE_NAMES, LOCALES, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { useAdminI18n } from "./AdminI18n";

/**
 * The panel's language: "RO ▾", opening the languages by their own names. It sets the same `lang`
 * cookie as the shop's selector (lib/i18n/actions.ts), so the panel and the shop always share one language.
 */
export function LanguageMenu({ className }: { className?: string }) {
  const { locale, t } = useAdminI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    items.current[Math.max(0, LOCALES.indexOf(locale))]?.focus();
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, locale]);

  const close = () => {
    setOpen(false);
    button.current?.focus();
  };
  const choose = (next: Locale) => {
    close();
    if (next === locale) return;
    start(async () => {
      await setLocale(next);
      router.refresh();
    });
  };

  return (
    <div ref={ref} className={cn("relative", className)} onKeyDown={(e) => e.key === "Escape" && open && (e.preventDefault(), close())}>
      <button
        ref={button}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${t.shell.language}: ${LOCALE_NAMES[locale]}`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex min-h-11 items-center gap-1.5 border border-transparent px-2.5 font-display-ui text-[0.7rem] tracking-[0.18em] transition-colors hover:border-gold-dark/50",
          open ? "border-gold-dark/50 text-gold-light" : "text-aged-gold hover:text-gold-light",
          pending && "opacity-60",
        )}
      >
        {locale.toUpperCase()}
        <ChevronDown aria-hidden strokeWidth={1.5} className={cn("size-3.5 opacity-70 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div id={panelId} className="absolute top-full right-0 z-50 mt-1 w-48 border border-gold-dark/70 bg-[#0d0b08] py-1 shadow-[0_18px_40px_rgb(0_0_0/0.7)]">
          <p className="px-4 pt-2 pb-1 font-display-ui text-[0.56rem] tracking-[0.22em] text-parchment-muted">{t.shell.language}</p>
          <ul>
            {LOCALES.map((l, i) => (
              <li key={l}>
                <button
                  ref={(el) => {
                    items.current[i] = el;
                  }}
                  type="button"
                  lang={l}
                  aria-current={l === locale ? "true" : undefined}
                  onClick={() => choose(l)}
                  onKeyDown={(e) => {
                    const go = (n: number) => (e.preventDefault(), items.current[(n + LOCALES.length) % LOCALES.length]?.focus());
                    if (e.key === "ArrowDown") go(i + 1);
                    else if (e.key === "ArrowUp") go(i - 1);
                    else if (e.key === "Tab") setOpen(false);
                  }}
                  className={cn(
                    "flex min-h-10 w-full items-center gap-3 px-4 text-left text-[0.95rem] transition-colors outline-none hover:bg-gold-light/[0.06] focus-visible:bg-gold-light/[0.06]",
                    l === locale ? "text-gold-light" : "text-parchment",
                  )}
                >
                  <Check aria-hidden strokeWidth={2} className={cn("size-3.5 shrink-0", l === locale ? "opacity-100" : "opacity-0")} />
                  <span className="flex-1">{LOCALE_NAMES[l]}</span>
                  <span aria-hidden className="font-display-ui text-[0.58rem] text-parchment-muted">{l.toUpperCase()}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
