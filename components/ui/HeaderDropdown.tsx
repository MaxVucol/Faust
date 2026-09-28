"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export type DropdownOption<T extends string> = { value: T; label: string; lang?: string };

type HeaderDropdownProps<T extends string> = {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  /** Short text on the closed button, e.g. "RO" or "MDL". */
  buttonLabel: string;
  /** Accessible name of the control, e.g. "Language: Română". */
  ariaLabel: string;
  listLabel: string;
  /** Controlled by the parent so only one header dropdown is open at a time. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pending?: boolean;
  className?: string;
  /** Which edge of the button the panel lines up with. */
  align?: "left" | "right";
};

/**
 * Compact text dropdown for header preferences (language, currency): a small caps label with a
 * fine chevron, opening a dark panel directly beneath it. Arrow keys move between options,
 * Escape closes and returns focus to the button, clicking outside closes.
 */
export function HeaderDropdown<T extends string>({
  value,
  options,
  onChange,
  buttonLabel,
  ariaLabel,
  listLabel,
  open,
  onOpenChange,
  pending = false,
  className,
  align = "left",
}: HeaderDropdownProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const focusOnOpen = useRef(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open, onOpenChange]);

  // Opened from the keyboard: move focus onto the selected option.
  useEffect(() => {
    if (!open || !focusOnOpen.current) return;
    focusOnOpen.current = false;
    const i = Math.max(0, options.findIndex((o) => o.value === value));
    optionRefs.current[i]?.focus();
  }, [open, options, value]);

  const close = (refocus: boolean) => {
    onOpenChange(false);
    if (refocus) buttonRef.current?.focus();
  };

  const onButtonKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      focusOnOpen.current = true;
      onOpenChange(true);
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
    } else if (e.key === "Tab") close(false);
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={ariaLabel}
        onClick={() => onOpenChange(!open)}
        onKeyDown={onButtonKey}
        className={cn(
          "flex min-h-11 items-center gap-1.5 px-1 font-display-ui text-[0.78rem] tracking-[0.18em] transition-colors duration-200",
          open ? "text-gold-light" : "text-aged-gold hover:text-gold-light",
          pending && "opacity-60",
        )}
      >
        {buttonLabel}
        <ChevronDown
          aria-hidden
          strokeWidth={1.5}
          className={cn("size-3 opacity-70 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <ul
        id={menuId}
        aria-label={listLabel}
        className={cn(
          "absolute top-full z-50 mt-2 min-w-44 border border-gold-dark/40 bg-[#0a0907] py-1.5 shadow-[0_10px_24px_rgb(0_0_0/0.55)] duration-150 ease-out",
          align === "right" ? "right-0" : "left-0",
          // Visibility flips on instantly when opening (so options can take focus) and waits for the fade when closing.
          open ? "visible translate-y-0 opacity-100 transition-[opacity,transform]" : "invisible -translate-y-1 opacity-0 transition-[opacity,transform,visibility]",
        )}
      >
        {options.map((o, i) => {
          const selected = o.value === value;
          return (
            <li key={o.value}>
              <button
                ref={(el) => {
                  optionRefs.current[i] = el;
                }}
                type="button"
                lang={o.lang}
                aria-current={selected ? "true" : undefined}
                tabIndex={open ? 0 : -1}
                onKeyDown={(e) => onOptionKey(e, i)}
                onClick={() => {
                  close(true);
                  if (!selected) onChange(o.value);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left font-display-ui text-[0.78rem] tracking-[0.14em] whitespace-nowrap transition-colors duration-150 outline-none hover:bg-white/[0.04] hover:text-gold-light focus-visible:bg-white/[0.04] focus-visible:text-gold-light",
                  selected ? "text-gold-light" : "text-parchment",
                )}
              >
                {/* The check marks the active option, so it doesn't rely on colour alone. */}
                <Check aria-hidden strokeWidth={2} className={cn("size-3 shrink-0", selected ? "opacity-100" : "opacity-0")} />
                {o.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
