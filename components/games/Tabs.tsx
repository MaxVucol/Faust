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
      {/* Still scrolls sideways on narrow screens, but never shows the native scrollbar or its arrows. */}
      <div
        role="tablist"
        aria-label={label}
        className="flex gap-10 overflow-x-auto overflow-y-hidden border-b border-iron [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              "-mb-px border-b py-4 font-display-ui text-sm whitespace-nowrap transition-colors duration-300 sm:text-[0.95rem]",
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
