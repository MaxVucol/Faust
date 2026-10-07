"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();

  return (
    <ul className="border-t border-iron">
      {items.map((item, i) => {
        const expanded = open === i;
        return (
          <li key={item.question} className="border-b border-iron">
            <h3>
              <button
                type="button"
                id={`${id}-q-${i}`}
                aria-expanded={expanded}
                aria-controls={`${id}-a-${i}`}
                onClick={() => setOpen(expanded ? null : i)}
                className="flex min-h-11 w-full items-center justify-between gap-6 py-5 text-left font-display text-lg leading-snug font-semibold tracking-[0.02em] transition-colors duration-300 hover:text-aged-gold sm:text-xl"
              >
                {item.question}
                <span aria-hidden className="font-display text-xl text-aged-gold">
                  {expanded ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={`${id}-a-${i}`}
              role="region"
              aria-labelledby={`${id}-q-${i}`}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden" inert={!expanded}>
                <p className="pb-5 text-parchment-muted">{item.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
