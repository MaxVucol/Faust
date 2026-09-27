import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CardProps = ComponentProps<"div"> & { interactive?: boolean };

/** Blackened-metal panel with a thin antique-gold frame that brightens on hover. */
export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative border border-gold-dark bg-[#100d0a] glow-gold",
        interactive && "group transition-[border-color,box-shadow] duration-300 focus-within:border-gold-light hover:border-gold-light hover:glow-gold-strong",
        className,
      )}
      {...props}
    />
  );
}
