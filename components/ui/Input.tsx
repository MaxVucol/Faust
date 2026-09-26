import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const fieldClasses =
  "w-full rounded-none border border-iron bg-base px-4 py-3 text-base text-parchment placeholder:text-parchment-muted/70 transition-colors duration-300 focus:border-aged-gold aria-invalid:border-blood";

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("mb-2 block font-display-ui text-[0.7rem] text-parchment-muted", className)} {...props} />;
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldClasses, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(fieldClasses, "min-h-40 resize-y", className)} {...props} />;
}

export function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <p id={id} className="mt-2 text-sm text-blood-text">
      {errors[0]}
    </p>
  );
}
