import Image from "next/image";
import { Diamond } from "@/components/ui/Ornaments";
import { Divider } from "@/components/ui/Divider";
import { SITE_NAME } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";

/** Barely-there grain so the panel reads as dark leather/stone rather than flat black. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.85 0 0 0 0 0.75 0 0 0 0 0.6 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/**
 * Romanian caps (JOCURI, ÎNTREGI) sit tighter in Cormorant, so they get a touch more tracking,
 * and the circumflex on Î needs extra room between the lines.
 */
const SLOGAN_SPACING: Record<Locale, string> = {
  en: "leading-[0.95] tracking-[0.015em]",
  ru: "leading-[0.95] tracking-[0.015em]",
  ro: "leading-[1.12] tracking-[0.05em]",
};

export async function Manifesto() {
  const { locale, t } = await getI18n();
  const [first, second] = t.home.manifesto;
  return (
    <section aria-label={t.home.manifestoAria} className="bg-[#0b0907]" style={{ backgroundImage: GRAIN }}>
      <Divider double subtle />
      {/*
        The logo shares a row with the slogan only, so its centre lines up with the two-line block.
        Optical centring: the narrow logo weighs less than the dense slogan, so that group is nudged right,
        and the light signature row reads as empty space, so the group sits slightly below the midline.
        The signature (rule and name) is outside the nudge: on the panel's exact centre, in line with the
        diamonds on the frame above and below.
      */}
      <div className="flex flex-col items-center px-6 pt-16 pb-9 sm:pt-[4.5rem] sm:pb-11">
        <div className="grid md:translate-x-5 lg:translate-x-8 items-center justify-items-center gap-y-6 text-center md:grid-cols-[auto_auto] md:justify-items-start md:gap-x-9 md:gap-y-0 md:text-left lg:gap-x-[2.9rem]">
          {/* The store's logo, the same file as in the header (served as-is, transparent), identical in every
              language. Decorative here: the store's name is written under the slogan. At most 160px tall, half its
              320px height, so it stays sharp on 2x screens. */}
          <Image src="/images/logo-tv.png" alt="" width={262} height={320} unoptimized className="h-[8.5rem] w-auto shrink-0 sm:h-[9.5rem] lg:h-[10rem]" />
          <blockquote className={`font-editorial text-[2.08rem] font-semibold ${SLOGAN_SPACING[locale]} text-balance text-parchment uppercase sm:text-[2.5rem] lg:text-[3.02rem] 2xl:text-[3.64rem]`}>
            <p>
              {first}
              <br />
              {second}
            </p>
          </blockquote>
        </div>
        <div className="mt-6 flex w-full flex-col items-center md:mt-3">
          <div aria-hidden className="flex w-[55%] max-w-[22rem] items-center gap-2.5">
            <span className="h-px flex-1 bg-gold-dark/70" />
            <Diamond className="size-1 border border-gold-light bg-[#0b0907]" />
            <span className="h-px flex-1 bg-gold-dark/70" />
          </div>
          {/* Letter spacing also follows the last letter; the same space before the first keeps the name centred. */}
          <p className="mt-1.5 pl-[0.3em] font-display-ui text-[1rem] font-semibold tracking-[0.3em] text-gold-light">{SITE_NAME}</p>
        </div>
      </div>
      <Divider double subtle />
    </section>
  );
}
