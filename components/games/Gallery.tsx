"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  const step = (d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length));

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group relative block aspect-video w-full overflow-hidden border border-iron transition-colors duration-300 hover:border-aged-gold"
              aria-label={`Deschide captura ${i + 1} din ${title}`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover saturate-[0.85] transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        aria-label={`Galerie ${title}`}
        className="m-0 h-full max-h-none w-full max-w-none bg-black p-0 text-parchment backdrop:bg-black"
      >
        {index !== null && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="font-display-ui text-xs text-parchment-muted">
                {index + 1} / {images.length}
              </p>
              <button type="button" onClick={() => setIndex(null)} aria-label="Închide galeria" className="text-parchment-muted hover:text-parchment">
                <X className="size-7" />
              </button>
            </div>
            <div className="relative flex-1">
              <Image src={images[index]} alt={`${title}, captura ${index + 1}`} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="flex justify-center gap-4 py-4">
              <button type="button" onClick={() => step(-1)} aria-label="Captura anterioară" className="border border-iron p-3 hover:border-aged-gold">
                <ChevronLeft className="size-5" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Captura următoare" className="border border-iron p-3 hover:border-aged-gold">
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
