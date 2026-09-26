import { ArrowRight } from "lucide-react";
import Link from "next/link";

type SectionHeadingProps = { title: string; href?: string; linkLabel?: string; id?: string };

export function SectionHeading({ title, href, linkLabel = "Vezi toate", id }: SectionHeadingProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-5">
      <h2
        id={id}
        className="min-w-0 font-display text-xl font-semibold tracking-[0.15em] text-parchment uppercase sm:text-2xl"
      >
        {title}
      </h2>
      <span aria-hidden className="hidden h-px flex-1 bg-iron sm:block" />
      {href && (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-2 font-display-ui text-[0.65rem] text-parchment-muted transition-colors duration-300 hover:text-aged-gold"
        >
          {linkLabel}
          <ArrowRight aria-hidden className="size-3" />
        </Link>
      )}
    </div>
  );
}
