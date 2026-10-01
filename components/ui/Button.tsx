import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "glass" | "ghost" | "gold" | "outline";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 rounded-none font-display-ui disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-blood text-parchment transition-colors duration-300 hover:bg-blood-hover",
  // Hero actions: a clear pane in a gold frame that fills with soft metallic light on hover.
  // The fill is a pseudo-element so its gradient can fade in (gradients can't transition directly).
  glass:
    "relative isolate border border-gold-light/80 bg-black/15 text-gold-light transition-[color,border-color,box-shadow] duration-500 " +
    "before:absolute before:inset-0 before:-z-10 before:bg-[linear-gradient(180deg,rgb(224_196_135/0.38)_0%,rgb(164_123_56/0.22)_100%)] before:opacity-0 before:transition-opacity before:duration-500 " +
    "hover:border-[#E0C487] hover:text-[#F0DDA8] hover:shadow-[inset_0_0_14px_rgb(224_196_135/0.3),0_0_18px_rgb(192_154_85/0.3)] hover:before:opacity-100 " +
    "focus-visible:before:opacity-100",
  ghost: "border border-iron text-parchment transition-colors duration-300 hover:border-aged-gold hover:text-aged-gold",
  // The checkout's final action: solid antique gold with dark lettering, a shade lighter on hover,
  // darker and nudged down when pressed. No glow.
  gold: "border border-gold-light bg-gold-light text-ink transition-[background-color,border-color,translate] duration-200 hover:border-[#cfab68] hover:bg-[#cfab68] active:translate-y-px active:border-aged-gold active:bg-aged-gold",
  // A secondary action that must not outweigh what it sits next to (e.g. "Add to cart" on a home card,
  // where the cover and its sale badge lead): a thin dark-gold frame, gold lettering, a faint fill on hover.
  outline:
    "border border-gold-dark/80 text-gold-light transition-[background-color,border-color,color] duration-300 hover:border-gold-light hover:bg-gold-light/[0.08] hover:text-[#e0c487]",
};

const sizes: Record<Size, string> = {
  md: "px-7 py-3.5 text-xs",
  sm: "px-4 py-2.5 text-[0.7rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
