import Link from "next/link";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** "Home / Catalogue / Title" trail; the last crumb is the current page. */
export function Breadcrumbs({ items, label, className }: { items: Crumb[]; label: string; className?: string }) {
  return (
    <nav aria-label={label} className={cn("text-sm text-parchment-muted", className)}>
      <ol className="flex flex-wrap items-center">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center">
            {i > 0 && (
              <span aria-hidden className="px-2">
                /
              </span>
            )}
            {item.href && i < items.length - 1 ? (
              <Link href={item.href} className="transition-colors duration-200 hover:text-gold-light">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-parchment">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
