import { ArrowRight } from "lucide-react";
import { Diamond } from "@/components/ui/Ornaments";

/** Short labels separated by small bronze diamonds: "RPG ◆ Souls-like". */
export function MetaList({ items }: { items: string[] }) {
  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-2.5 text-sm text-parchment-muted">
      {items.map((item, i) => (
        <span key={item} className="flex items-center gap-2.5">
          {i > 0 && <Diamond className="size-1 bg-bronze" />}
          {item}
        </span>
      ))}
    </p>
  );
}

/** Arrow in the bottom-right of a card body; turns gold with the card on hover. */
export function CardArrow() {
  return (
    <ArrowRight
      aria-hidden
      className="size-4 shrink-0 text-parchment-muted transition-colors duration-300 group-hover:text-gold-light"
    />
  );
}
