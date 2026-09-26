import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = { children: ReactNode; variant?: "outline" | "blood" | "moss"; className?: string };

const variants = {
  outline: "border-iron text-parchment-muted",
  blood: "border-blood bg-blood text-parchment",
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
