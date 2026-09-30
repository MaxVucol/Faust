"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import { cn } from "@/lib/utils";

/**
 * Thumbnails that open a full-screen viewer (arrow keys, Escape). Works with any number of images:
 * one is shown wide, two side by side, and from three on the first (the key art) is featured
 * with the rest beside it. An image that fails to load is dropped instead of showing a broken frame.
 */
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const { t } = useI18n();
  const [failed, setFailed] = useState<string[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const shown = images.filter((src) => !failed.includes(src));

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  if (shown.length === 0) return null;
  const count = shown.length;
  const current = index === null ? null : Math.min(index, count - 1);
  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + count) % count));
  const drop = (src: string) => setFailed((f) => (f.includes(src) ? f : [...f, src]));

  return (
    <>
      <ul className={cn("grid gap-4", count === 1 ? "max-w-3xl grid-cols-1" : count === 2 ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4")}>
        {shown.map((src, i) => {
          const featured = count >= 3 && i === 0;
          return (
            <li key={src} className={cn(featured && "col-span-2 lg:row-span-2")}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block aspect-video w-full overflow-hidden border border-iron transition-colors duration-300 hover:border-aged-gold"
                aria-label={t.game.openShot(i + 1, title)}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes={count === 1 ? "(min-width: 768px) 768px, 100vw" : featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                  onError={() => drop(src)}
                  className="object-cover saturate-[0.85] transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
                />
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onKeyDown={(e) => {
          if (count < 2) return;
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        aria-label={t.game.galleryAria(title)}
        className="m-0 h-full max-h-none w-full max-w-none bg-black p-0 text-parchment backdrop:bg-black"
      >
        {current !== null && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="font-display-ui text-xs text-parchment-muted">{count > 1 ? `${current + 1} / ${count}` : ""}</p>
              <button type="button" onClick={() => setIndex(null)} aria-label={t.game.closeGallery} className="flex size-11 items-center justify-center text-parchment-muted hover:text-parchment">
                <X className="size-7" />
              </button>
            </div>
            <div className="relative flex-1">
              <Image src={shown[current]} alt={t.game.shotAlt(title, current + 1)} fill sizes="100vw" className="object-contain" />
            </div>
            {count > 1 && (
              <div className="flex justify-center gap-4 py-4">
                <button type="button" onClick={() => step(-1)} aria-label={t.game.prevShot} className="border border-iron p-3 hover:border-aged-gold">
                  <ChevronLeft className="size-5" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label={t.game.nextShot} className="border border-iron p-3 hover:border-aged-gold">
                  <ChevronRight className="size-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
