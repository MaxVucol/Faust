"use client";

import { Check, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition, type KeyboardEvent } from "react";
import { CURRENCIES, type Currency } from "@/lib/currency";
import { setCurrency, setLocale } from "@/lib/i18n/actions";
import { LOCALE_NAMES, LOCALES, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";
import { useI18n } from "./I18nProvider";

type Option = { kind: "language"; value: Locale } | { kind: "currency"; value: Currency };

/**
 * One compact control for both site preferences: the button reads "RO · MDL", and the panel has a
 * Language section and a Currency section. Arrow keys move through every option in both sections,
 * Home/End jump to the ends, Escape closes and returns focus to the button, clicking outside closes.
 * Both choices are cookies read on the server, so changing one never resets the other.
 *
 * `align`: which edge of the button the panel lines up with.
 */
export function PreferencesMenu({ className, align = "right" }: { className?: string; align?: "left" | "right" }) {
  const { locale, currency, t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const focusOnOpen = useRef(false);
  const panelId = useId();

  const options: Option[] = [
    ...LOCALES.map((value): Option => ({ kind: "language", value })),
    ...CURRENCIES.map((value): Option => ({ kind: "currency", value })),
  ];
  const isSelected = (o: Option) => (o.kind === "language" ? o.value === locale : o.value === currency);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  // Opened from the keyboard: focus the selected language.
  useEffect(() => {
    if (!open || !focusOnOpen.current) return;
    focusOnOpen.current = false;
    optionRefs.current[Math.max(0, LOCALES.indexOf(locale))]?.focus();
  }, [open, locale]);

  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  };

  const choose = (o: Option) => {
    close(true);
    if (isSelected(o)) return;
    startTransition(async () => {
      if (o.kind === "language") await setLocale(o.value);
      else await setCurrency(o.value);
      router.refresh();
    });
  };

  const onButtonKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      focusOnOpen.current = true;
      setOpen(true);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      close(true);
    }
  };

  const onOptionKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const last = options.length - 1;
    const go = (n: number) => {
      e.preventDefault();
      optionRefs.current[n]?.focus();
    };
    if (e.key === "ArrowDown") go(i === last ? 0 : i + 1);
    else if (e.key === "ArrowUp") go(i === 0 ? last : i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(last);
    else if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    } else if (e.key === "Tab") setOpen(false);
  };

  const renderGroup = (kind: Option["kind"], heading: string) => (
    <div role="group" aria-label={heading}>
      <p className="px-4 pt-2 pb-1 font-display-ui text-[0.62rem] tracking-[0.2em] text-parchment-muted">{heading}</p>
      <ul>
        {options.map((o, i) => {
          if (o.kind !== kind) return null;
          const selected = isSelected(o);
          const label = o.kind === "language" ? LOCALE_NAMES[o.value] : `${o.value} — ${t.currencies[o.value]}`;
          return (
            <li key={`${o.kind}-${o.value}`}>
              <button
                ref={(el) => {
                  optionRefs.current[i] = el;
                }}
                type="button"
                lang={o.kind === "language" ? o.value : undefined}
                aria-current={selected ? "true" : undefined}
                tabIndex={open ? 0 : -1}
                onKeyDown={(e) => onOptionKey(e, i)}
                onClick={() => choose(o)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2 text-left text-[0.95rem] whitespace-nowrap transition-colors duration-150 outline-none hover:bg-white/[0.04] hover:text-gold-light focus-visible:bg-white/[0.04] focus-visible:text-gold-light",
                  selected ? "text-gold-light" : "text-parchment",
                )}
              >
                {/* The check marks the active option, so it doesn't rely on colour alone. */}
                <Check aria-hidden strokeWidth={2} className={cn("size-3.5 shrink-0", selected ? "opacity-100" : "opacity-0")} />
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${t.nav.preferences}: ${LOCALE_NAMES[locale]}, ${t.currencies[currency]}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKey}
        className={cn(
          "flex min-h-11 items-center gap-2 px-1 font-display-ui text-[0.78rem] tracking-[0.18em] transition-colors duration-200",
          open ? "text-gold-light" : "text-aged-gold hover:text-gold-light",
          pending && "opacity-60",
        )}
      >
        <span>{locale.toUpperCase()}</span>
        <span aria-hidden className="size-[3px] rounded-full bg-bronze" />
        <span>{currency}</span>
        <ChevronDown aria-hidden strokeWidth={1.5} className={cn("size-3 opacity-70 transition-transform duration-200", open && "rotate-180")} />
      </button>

      <div
        id={panelId}
        className={cn(
          "absolute top-full z-50 mt-2 w-64 border border-gold-dark/40 bg-[#0a0907] py-2 shadow-[0_10px_24px_rgb(0_0_0/0.55)] duration-150 ease-out",
          align === "right" ? "right-0" : "left-0",
          // Visibility flips on instantly when opening (so options can take focus) and waits for the fade when closing.
          open ? "visible translate-y-0 opacity-100 transition-[opacity,transform]" : "invisible -translate-y-1 opacity-0 transition-[opacity,transform,visibility]",
        )}
      >
        {renderGroup("language", t.nav.language)}
        <div aria-hidden className="mx-4 my-2 h-px bg-iron" />
        {renderGroup("currency", t.nav.currency)}
      </div>
    </div>
  );
}
