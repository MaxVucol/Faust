import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden border border-iron">
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
      <div className="flex min-h-[440px] flex-col justify-center px-6 py-16 sm:px-10 lg:aspect-[1983/793] lg:min-h-0 lg:px-14">
        <div className="max-w-xl">
          <h1
            id="hero-title"
            className="font-display text-4xl leading-tight font-semibold tracking-[0.12em] text-parchment uppercase sm:text-5xl lg:text-6xl"
          >
            Jocuri care te definesc
          </h1>
          <p className="mt-6 max-w-md text-lg text-parchment">
            Intră într-o lume a aventurii, a strategiei și a legendelor. Descoperă cele mai bune jocuri video, selectate
            cu grijă pentru adevărații pasionați.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/produse">Vezi jocurile</ButtonLink>
            <ButtonLink href="/produse?sale=1" variant="secondary">
              Ofertele săptămânii
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
