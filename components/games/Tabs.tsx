"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Tabs({ tabs }: { tabs: { label: string; content: ReactNode }[] }) {
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
      <div role="tablist" aria-label="Informații despre joc" className="flex gap-8 overflow-x-auto border-b border-iron">
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
              "-mb-px border-b py-4 font-display-ui text-xs whitespace-nowrap transition-colors duration-300",
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
