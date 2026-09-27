import { Diamond } from "@/components/ui/Ornaments";
import { Divider } from "@/components/ui/Divider";
import { SITE_NAME } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";

/** Barely-there grain so the panel reads as dark leather/stone rather than flat black. */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.85 0 0 0 0 0.75 0 0 0 0 0.6 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const GOLD = "#a68a4b";
const GOLD_LIGHT = "#c09a55";
const GOLD_DARK = "#8c682f";
const BRONZE = "#51402a";
const RECESS = "#2a2016";

/**
 * The W monogram, drawn stroke by stroke like a Roman capital: heavy outer diagonals tapering to
 * sharp points, lighter inner diagonals, wedge serifs, an engraved line down each heavy stroke and
 * a small diamond on the centre apex. Mirror-symmetric about x = 100; the letter is about as wide
 * as it is tall so it reads as a plain W, not a stretched glyph.
 */
const W_STROKES = [
  "35,56 56,56 74,140 71,146", // left heavy
  "68,141 96,64 104,64 76,146", // left light
  "165,56 144,56 126,140 129,146", // right heavy (mirror)
  "132,141 104,64 96,64 124,146", // right light (mirror)
  "27,56 64,56 57,61 34,61", // left serif
  "173,56 136,56 143,61 166,61", // right serif
];

/**
 * The Cyrillic М for the Russian version, in the same hand as the W: same cap height (56–146),
 * same overall width, heavy upright stems with engraved centre lines, lighter diagonals meeting
 * in a sharp point on the baseline, and wedge serifs at head and foot. Mirror-symmetric about x = 100.
 */
const M_STROKES = [
  "40,58 58,58 58,144 40,144", // left heavy stem
  "142,58 160,58 160,144 142,144", // right heavy stem (mirror)
  "58,58 66,58 103,138 100,146 97,146", // left light diagonal
  "142,58 134,58 97,138 100,146 103,146", // right light diagonal (mirror)
  "30,56 66,56 60,61 36,61", // left head serif
  "170,56 134,56 140,61 164,61", // right head serif
  "30,146 68,146 62,141 36,141", // left foot serif
  "170,146 132,146 138,141 164,141", // right foot serif
];

/**
 * The N for the Romanian version, in the same hand: light upright stems, one heavy diagonal from
 * the top-left to a sharp point at the bottom-right (the classic Roman N stress), an engraved line
 * down the diagonal and the same wedge serifs. Same cap height and optical weight as W and М.
 */
const N_STROKES = [
  "58,58 67,58 67,144 58,144", // left light stem
  "133,58 142,58 142,146 133,138", // right light stem, ending in the diagonal's point
  "58,58 78,58 142,146 122,146", // heavy diagonal
  "50,56 78,56 74,61 54,61", // left head serif
  "124,56 150,56 146,61 128,61", // right head serif
  "50,146 75,146 71,141 54,141", // left foot serif
];

const LETTERS = {
  W: { strokes: W_STROKES, engraving: [[45.5, 61, 71.5, 139], [154.5, 61, 128.5, 139]] },
  M: { strokes: M_STROKES, engraving: [[49, 63, 49, 138], [151, 63, 151, 138]] },
  N: { strokes: N_STROKES, engraving: [[70, 63, 130, 139]] },
} as const;

/** Four compass studs on the ring. */
const STUDS = [
  [100, 12],
  [188, 100],
  [100, 188],
  [12, 100],
];

function Emblem({ letter }: { letter: keyof typeof LETTERS }) {
  const { strokes, engraving } = LETTERS[letter];
  return (
    <svg viewBox="6 6 188 188" aria-hidden className="size-[8.9rem] shrink-0 sm:size-[10rem] lg:size-[11.15rem]">
      {/* A single hairline ring sitting close around the letter, with four tiny studs. */}
      <circle cx="100" cy="100" r="88" fill="none" stroke={GOLD_DARK} strokeWidth="1" />
      {STUDS.map(([x, y]) => (
        <polygon key={`${x}-${y}`} points={`${x},${y - 5} ${x + 3.5},${y} ${x},${y + 5} ${x - 3.5},${y}`} fill="#0b0907" stroke={GOLD_LIGHT} strokeWidth="1" />
      ))}

      {/* Recessed copy offset down-right reads as the engraving's depth. */}
      <g transform="translate(1.4 1.4)" fill={RECESS}>
        {strokes.map((p) => (
          <polygon key={p} points={p} />
        ))}
      </g>
      <g fill={GOLD} stroke={GOLD_LIGHT} strokeWidth="0.6" strokeLinejoin="miter">
        {strokes.map((p) => (
          <polygon key={p} points={p} />
        ))}
      </g>
      {/* Engraved centre lines down the heavy strokes. */}
      <g stroke={BRONZE} strokeWidth="1.1">
        {engraving.map(([x1, y1, x2, y2]) => (
          <line key={`${x1}-${y1}`} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <polygon points="100,50 104,57 100,64 96,57" fill={GOLD_LIGHT} />
    </svg>
  );
}

const EMBLEM_LETTER: Record<Locale, keyof typeof LETTERS> = { en: "W", ro: "N", ru: "M" };

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
        The emblem shares a row with the slogan only, so its centre lines up with the two-line block;
        the divider and signature sit beneath the text column and never cross the emblem.
        Optical centring: the thin ring weighs less than the dense slogan, so the group is nudged right,
        and the light signature row reads as empty space, so the group sits slightly below the midline.
      */}
      <div className="flex justify-center px-6 pt-16 pb-9 sm:pt-[4.5rem] sm:pb-11">
        <div className="grid md:translate-x-5 lg:translate-x-8 items-center justify-items-center gap-y-6 text-center md:grid-cols-[auto_auto] md:justify-items-start md:gap-x-9 md:gap-y-0 md:text-left lg:gap-x-[2.9rem]">
          {/* The mark is the slogan's initial: W (EN), N (RO), Cyrillic М (RU), all in the same hand. */}
          <Emblem letter={EMBLEM_LETTER[locale]} />
          <blockquote className={`font-editorial text-[2.08rem] font-semibold ${SLOGAN_SPACING[locale]} text-balance text-parchment uppercase sm:text-[2.5rem] lg:text-[3.02rem] 2xl:text-[3.64rem]`}>
            <p>
              {first}
              <br />
              {second}
            </p>
          </blockquote>
          <div className="flex w-full flex-col items-center md:col-start-2 md:mt-3">
            <div aria-hidden className="flex w-[55%] max-w-[22rem] items-center gap-2.5">
              <span className="h-px flex-1 bg-gold-dark/70" />
              <Diamond className="size-1 border border-gold-light bg-[#0b0907]" />
              <span className="h-px flex-1 bg-gold-dark/70" />
            </div>
            <p className="mt-1.5 font-display-ui text-[1rem] font-semibold tracking-[0.3em] text-gold-light">{SITE_NAME}</p>
          </div>
        </div>
      </div>
      <Divider double subtle />
    </section>
  );
}
