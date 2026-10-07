import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Diamond } from "./Ornaments";

type SectionHeadingProps = {
  title: string;
  href?: string;
  linkLabel?: string;
  id?: string;
  /** A small archive label above the title ("The Forge", "New arrivals"). */
  eyebrow?: string;
  /** One quiet line under the title. */
  subtitle?: string;
};

export function SectionHeading({ title, href, linkLabel, id, eyebrow, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-7">
      {eyebrow && (
        <p className="mb-2.5 flex items-center gap-2 font-display-ui text-[0.6rem] tracking-[0.3em] text-aged-gold">
          <span aria-hidden className="h-px w-5 bg-gold-dark" />
          {eyebrow}
        </p>
      )}
      <HeadingRow title={title} href={href} linkLabel={linkLabel} id={id} />
      {subtitle && <p className="mt-2 text-base text-parchment-muted">{subtitle}</p>}
    </div>
  );
}

function HeadingRow({ title, href, linkLabel, id }: Pick<SectionHeadingProps, "title" | "href" | "linkLabel" | "id">) {
  return (
    // Phones: the title keeps its line and the link wraps below it when both don't fit. From sm, one row:
    // title, the engraved rule with its diamond, link (the halves below are `contents` until md, so these
    // are the row's own items). From md, three columns: the diamond sits in the middle one, at the exact
    // centre of the row (the page's centre), and the rule runs out from it to the title and to the link.
    // A title longer than half the row keeps its line and widens its column, moving the diamond aside.
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 sm:flex-nowrap md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-2">
      <div className="contents md:flex md:items-center md:gap-x-6">
        <h2 id={id} className="flex max-w-full flex-none items-center gap-3 sm:min-w-0 sm:flex-initial md:flex-none md:whitespace-nowrap">
          <span aria-hidden className="flex items-center gap-1">
            <span className="h-3 w-px bg-gold-dark" />
            <Diamond className="size-2 border border-gold-light" />
            <span className="h-3 w-px bg-gold-dark" />
          </span>
          <span className="text-gold font-display text-xl font-semibold tracking-[0.1em] uppercase sm:text-2xl sm:tracking-[0.14em]">{title}</span>
        </h2>
        <span aria-hidden className="hidden h-px min-w-0 flex-1 bg-gold-dark/60 sm:block" />
      </div>
      {/* Until md it sits between the rule's halves in the row (pulled in to the rule's own 8px spacing). */}
      <span aria-hidden className="hidden items-center sm:-mx-4 sm:flex md:mx-0">
        <Diamond className="size-2 border border-gold-light" />
      </span>
      <div className="contents md:flex md:items-center md:gap-x-6">
        <span aria-hidden className="hidden h-px min-w-0 flex-1 bg-gold-dark/60 sm:block" />
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
    </div>
  );
}
