import { ArrowRight } from "lucide-react";
import { Diamond } from "@/components/ui/Ornaments";

/**
 * `sizes` for card images in the home carousels, matched to the measured card width: about 69vw on
 * phones (one card plus the edge of the next), 36–38vw on tablets (two cards) and 19–21vw from 1024px
 * (four cards), each rounded up slightly. With 100vw a DPR-3 phone downloaded ~1920px images for a
 * ~300px card.
 */
export const CAROUSEL_CARD_SIZES = "(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 70vw";

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
