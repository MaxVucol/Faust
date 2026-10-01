import Image from "next/image";
import { cn } from "@/lib/utils";

type GameImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** Fills its (relative, sized) parent; desaturated slightly. Stays still on card hover (no zoom). */
export function GameImage({ src, alt, sizes, className, priority }: GameImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover saturate-[0.85]", className)}
    />
  );
}
