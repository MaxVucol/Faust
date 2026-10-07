"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ tabs, label }: { tabs: { label: string; content: ReactNode }[]; label: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

  const focus = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div>
      {/* Phones: the tabs share the width in equal columns and a long label wraps, so none is cut off at
          the edge. From sm: one row, still scrolling sideways if ever needed, without a native scrollbar. */}
      <div
        role="tablist"
        aria-label={label}
        className="grid auto-cols-fr grid-flow-col border-b border-iron sm:flex sm:gap-10 sm:overflow-x-auto sm:overflow-y-hidden sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${id}-tab-${i}`}
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") focus(i + 1);
              if (e.key === "ArrowLeft") focus(i - 1);
            }}
            className={cn(
              "-mb-px min-h-11 border-b px-1 py-3 text-center font-display-ui text-[0.7rem] leading-snug transition-colors duration-300 sm:px-0 sm:py-4 sm:text-left sm:text-[0.95rem] sm:whitespace-nowrap",
              i === active ? "border-aged-gold text-aged-gold" : "border-transparent text-parchment-muted hover:text-parchment",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.label}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={i !== active}
          tabIndex={0}
          className="pt-8"
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
