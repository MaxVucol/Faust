import { cn } from "@/lib/utils";

export function Divider({ double = false, className }: { double?: boolean; className?: string }) {
  if (double) {
    return <div role="separator" className={cn("h-[5px] border-y border-iron", className)} />;
  }
  return <hr className={cn("border-0 border-t border-iron", className)} />;
}
