import { cn } from "@/lib/utils";

/** A flat square turned 45°, the base unit of every ornament. */
export function Diamond({ className }: { className?: string }) {
  return <span aria-hidden className={cn("inline-block shrink-0 rotate-45", className)} />;
}

/**
 * Forged corner brackets for a `relative` frame. `lg` adds an engraved diamond
 * inside each corner, for the hero and other large frames.
 */
export function Corners({ size = "sm" }: { size?: "sm" | "lg" }) {
  // Bright gold is reserved for the large frames; card corners stay a quieter dark gold.
  const box = size === "lg" ? "size-6" : "size-3";
  const base = cn("pointer-events-none absolute z-10", size === "lg" ? "border-gold-light" : "border-gold-dark", box);
  const positions = [
    "-top-px -left-px border-t border-l",
    "-top-px -right-px border-t border-r",
    "-bottom-px -left-px border-b border-l",
    "-bottom-px -right-px border-b border-r",
  ];
  const diamonds = ["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"];
  return (
    <>
      {positions.map((p) => (
        <span key={p} aria-hidden className={cn(base, p)} />
      ))}
      {size === "lg" &&
        diamonds.map((p) => <Diamond key={p} className={cn("pointer-events-none absolute z-10 size-1.5 bg-gold-light", p)} />)}
    </>
  );
}

/**
 * Full-width section separator: bronze rule with iron tips (a flat stand-in for a
 * fade) meeting at a small cluster of diamonds.
 */
export function OrnateDivider({ className }: { className?: string }) {
  return (
    <div role="separator" className={cn("flex items-center gap-3", className)}>
      <span aria-hidden className="h-px w-[6%] bg-bronze" />
      <span aria-hidden className="-ml-3 h-px flex-1 bg-gold-dark/70" />
      <Diamond className="size-1 bg-gold-dark" />
      <Diamond className="size-2.5 border border-gold-light" />
      <Diamond className="size-1 bg-gold-dark" />
      <span aria-hidden className="h-px flex-1 bg-gold-dark/70" />
      <span aria-hidden className="-ml-3 h-px w-[6%] bg-bronze" />
    </div>
  );
}
