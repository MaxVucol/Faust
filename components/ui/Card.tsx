import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type CardProps = ComponentProps<"div"> & { interactive?: boolean };

/**
 * Blackened-metal panel with a thin antique-gold frame that brightens on hover. It is also a size container
 * (its width always comes from the grid or carousel slot around it), so what sits on a card's cover, like
 * the sale badge, can size itself to the card rather than to the viewport.
 */
export function Card({ interactive = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "@container relative border border-gold-dark bg-[#100d0a] glow-gold",
        interactive && "group transition-[border-color,box-shadow] duration-300 focus-within:border-gold-light hover:border-gold-light hover:glow-gold-strong",
        className,
      )}
      {...props}
    />
  );
}
