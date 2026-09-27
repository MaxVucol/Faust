import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = { children: ReactNode; variant?: "outline" | "blood" | "moss"; className?: string };

const variants = {
  outline: "border-iron text-parchment-muted",
  // Sale pennant: crimson flag with a swallow-tail notch on the right.
  blood: "border-transparent bg-crimson pr-3.5 pl-2 text-parchment [clip-path:polygon(0_0,100%_0,calc(100%-6px)_50%,100%_100%,0_100%)]",
  moss: "border-moss text-parchment",
};

export function Badge({ children, variant = "outline", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block border px-2 py-0.5 font-display text-[0.65rem] leading-5 tracking-[0.12em] uppercase",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
