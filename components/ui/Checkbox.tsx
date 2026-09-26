import { Check } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type CheckboxProps = Omit<ComponentProps<"input">, "type"> & { label: ReactNode };

export function Checkbox({ label, id, ...props }: CheckboxProps) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-3 py-1 text-base text-parchment">
      <span className="relative inline-flex size-4 shrink-0">
        <input
          id={id}
          type="checkbox"
          className="peer size-4 cursor-pointer appearance-none rounded-none border border-iron bg-base transition-colors duration-300 checked:border-aged-gold hover:border-parchment-muted"
          {...props}
        />
        <Check
          aria-hidden
          strokeWidth={3}
          className="pointer-events-none absolute inset-0.5 size-3 text-aged-gold opacity-0 peer-checked:opacity-100"
        />
      </span>
      {label}
    </label>
  );
}
