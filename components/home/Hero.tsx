import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Corners, Diamond } from "@/components/ui/Ornaments";
import { getDictionary } from "@/lib/i18n/server";

export async function Hero() {
  const t = await getDictionary();
  return (
    <section aria-labelledby="hero-title" className="relative isolate border border-gold-dark glow-gold-strong">
      <Image
        src="/images/hero-vault.png"
        alt=""
        fill
        priority
        // Served byte-for-byte as the original PNG: no resizing or recompression.
        unoptimized
        sizes="(min-width: 2400px) 2336px, 100vw"
        className="-z-10 object-cover object-[60%_40%]"
      />
      {/* From lg up the box takes the image's own ratio, so the artwork is shown uncropped. */}
      <div className="flex min-h-[440px] flex-col justify-center px-6 py-16 sm:px-10 lg:aspect-[1983/793] lg:min-h-0 lg:px-16">
        <div className="max-w-xl">
          <h1
            id="hero-title"
            className="text-gold font-display text-4xl leading-tight font-semibold tracking-[0.08em] uppercase sm:text-5xl lg:text-6xl"
          >
            {t.hero.title[0]}
            <br />
            {t.hero.title[1]}
          </h1>
          <p className="mt-6 max-w-md text-lg text-parchment">
            {t.hero.text}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/produse" variant="glass">
              {t.hero.browse}
              <ArrowRight aria-hidden className="size-3.5" />
            </ButtonLink>
            <ButtonLink href="/produse?sale=1" variant="glass">
              {t.hero.offers}
              <ArrowRight aria-hidden className="size-3.5" />
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Double frame: the gold outer edge plus a fainter inner line set 6px inside it. */}
      <span aria-hidden className="pointer-events-none absolute inset-1.5 border border-gold-light/35" />
      <Corners size="lg" />

      {/* Top-centre crest: a diamond with flourishes riding the frame. */}
      <span aria-hidden className="absolute -top-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
        <span className="h-px w-10 bg-gold-light" />
        <Diamond className="size-1.5 bg-gold-light" />
        <Diamond className="size-3.5 border border-gold-light bg-base" />
        <Diamond className="size-1.5 bg-gold-light" />
        <span className="h-px w-10 bg-gold-light" />
      </span>
      {/* Mid-left stud on the frame, level with the copy. */}
      <Diamond className="absolute top-1/2 -left-[6px] z-10 hidden size-2.5 -translate-y-1/2 border border-gold-light bg-base sm:block" />
      {/* Bottom-centre clasp: the brand emblem set into the frame. */}
      <span aria-hidden className="absolute -bottom-5 left-1/2 z-10 -translate-x-1/2">
        <Image src="/images/logo-tv.png" alt="" width={262} height={320} unoptimized className="h-10 w-auto" />
      </span>
    </section>
  );
}
