import { Divider } from "@/components/ui/Divider";
import { SITE_NAME } from "@/lib/catalog";

export function Manifesto() {
  return (
    <section aria-label="Manifestul magazinului">
      <Divider double />
      <figure className="flex flex-col items-center px-4 py-12 text-center">
        <blockquote className="flex items-start gap-3">
          <span aria-hidden className="font-fraktur text-7xl leading-[0.85] text-aged-gold sm:text-8xl">
            N
          </span>
          <p className="text-left font-display text-lg font-semibold tracking-[0.15em] text-parchment uppercase sm:text-2xl">
            <span className="sr-only">N</span>u doar vindem jocuri,
            <br />
            ci oferim lumi întregi.
          </p>
        </blockquote>
        <figcaption className="mt-4 font-display-ui text-[0.7rem] text-aged-gold">{SITE_NAME}</figcaption>
      </figure>
      <Divider double />
    </section>
  );
}
