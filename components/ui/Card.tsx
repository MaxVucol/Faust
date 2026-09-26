import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CardProps = ComponentProps<"div"> & { interactive?: boolean };

export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border border-iron bg-surface",
        interactive && "group transition-colors duration-300 focus-within:border-aged-gold hover:border-aged-gold",
        className,
      )}
      {...props}
    />
  );
}
