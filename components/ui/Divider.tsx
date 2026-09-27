import { cn } from "@/lib/utils";
import { Diamond } from "./Ornaments";

type DividerProps = { double?: boolean; subtle?: boolean; className?: string };

/**
 * Single bronze rule, or an engraved double rule held by a small gold diamond.
 * `subtle` shrinks the diamond to a fine outline, for sections where the rule is only a quiet frame.
 */
export function Divider({ double = false, subtle = false, className }: DividerProps) {
  if (double) {
    return (
      <div role="separator" className={cn("relative h-[5px] border-y border-bronze", className)}>
        <Diamond
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border",
            subtle ? "size-1.5 border-gold-dark bg-base" : "size-2.5 border-gold-light bg-gold-dark",
          )}
        />
      </div>
    );
  }
  return <hr className={cn("border-0 border-t border-bronze", className)} />;
}
