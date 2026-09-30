import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Diamond } from "./Ornaments";

type SectionHeadingProps = { title: string; href?: string; linkLabel?: string; id?: string };

export function SectionHeading({ title, href, linkLabel, id }: SectionHeadingProps) {
  return (
    // Narrow screens: the title keeps its line and the link wraps below it when both don't fit.
    <div className="mb-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 sm:flex-nowrap">
      <h2 id={id} className="flex max-w-full flex-none items-center gap-3 sm:min-w-0 sm:flex-initial">
        <span aria-hidden className="flex items-center gap-1">
          <span className="h-3 w-px bg-gold-dark" />
          <Diamond className="size-2 border border-gold-light" />
          <span className="h-3 w-px bg-gold-dark" />
        </span>
        <span className="text-gold font-display text-xl font-semibold tracking-[0.1em] uppercase sm:text-2xl sm:tracking-[0.14em]">{title}</span>
      </h2>
      {/* Engraved rule held by a diamond at its centre. */}
      <span aria-hidden className="hidden flex-1 items-center gap-2 sm:flex">
        <span className="h-px flex-1 bg-gold-dark/60" />
        <Diamond className="size-2 border border-gold-light" />
        <span className="h-px flex-1 bg-gold-dark/60" />
      </span>
      {href && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-2 font-display-ui text-[0.65rem] text-parchment-muted transition-colors duration-300 hover:text-gold-light"
        >
          {linkLabel}
          <ArrowRight aria-hidden className="size-3" />
        </Link>
      )}
    </div>
  );
}
