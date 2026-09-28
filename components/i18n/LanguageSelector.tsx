"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { setLocale } from "@/lib/i18n/actions";
import { LOCALE_NAMES, LOCALES, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { useI18n } from "./I18nProvider";

/** Same highlight as the central navigation: brighter gold text over a thin underline with a short glow. */
const itemHighlight =
  "relative border-b border-transparent transition-[color,border-color] duration-300 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-1.5 after:bg-[linear-gradient(to_top,rgb(224_196_135/0.2),transparent)] after:[mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] after:opacity-0 after:transition-opacity after:duration-300 hover:border-gold-light hover:text-gold-light hover:after:opacity-100 focus-visible:border-gold-light focus-visible:text-gold-light focus-visible:after:opacity-100";

export function LanguageSelector({ className, align = "right" }: { className?: string; align?: "left" | "right" }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`${t.nav.language}: ${LOCALE_NAMES[locale]}`}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-1 py-2 font-display-ui text-[0.82rem] text-aged-gold transition-colors duration-300 hover:text-gold-light",
          pending && "opacity-60",
        )}
      >
        {locale.toUpperCase()}
        <ChevronDown aria-hidden className={cn("size-4 transition-transform duration-300", open && "rotate-180")} />
      </button>

      <ul
        id={menuId}
        aria-label={t.nav.language}
        className={cn(
          "absolute top-full z-50 mt-4 min-w-48 border border-gold-dark/60 bg-[#0a0907] py-2 shadow-[0_12px_28px_rgb(0_0_0/0.6)] transition-[opacity,transform,visibility] duration-300",
          align === "right" ? "right-0" : "left-0",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        {LOCALES.map((code) => (
          <li key={code}>
            <button
              type="button"
              lang={code}
              aria-current={code === locale ? "true" : undefined}
              tabIndex={open ? 0 : -1}
              onClick={() => choose(code)}
              className="flex w-full px-5 py-2 text-left"
            >
              <span
                className={cn(
                  "py-1 font-display-ui text-[0.82rem] whitespace-nowrap",
                  code === locale ? "text-gold-light" : "text-white",
                  itemHighlight,
                )}
              >
                {code.toUpperCase()} — {LOCALE_NAMES[code]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
