import Image from "next/image";
import { cn } from "@/lib/utils";

type GameImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

/** Fills its (relative, sized) parent; desaturated slightly and zooms slowly on card hover. */
export function GameImage({ src, alt, sizes, className, priority }: GameImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn(
        "object-cover saturate-[0.85] transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100",
        className,
      )}
    />
  );
}
