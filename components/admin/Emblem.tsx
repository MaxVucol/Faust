import { cn } from "@/lib/utils";

export type EmblemKind = "games" | "users" | "orders" | "revenue";

/** Dark edge drawn under a solid gold shape, so overlapping shapes stay separate. */
const EDGE = { stroke: "#0a0907", strokeWidth: 2, paintOrder: "stroke" } as const;

/**
 * A longsword pointing up, solid gold, its blade's middle on the medallion's centre (the swords emblem
 * turns two of them ±45° about it, so they cross mid-blade with the hilts apart below).
 */
function Sword({ gold }: { gold: string }) {
  return (
    <g fill={gold} {...EDGE}>
      <path d="M60 30.5 L62.6 36 V71 H57.4 V36 Z" />
      <rect x={50.5} y={71} width={19} height={3.4} rx={1.7} />
      <rect x={58.5} y={74.4} width={3} height={7} fill="#8c682f" />
      <circle cx={60} cy={83.6} r={2.6} />
      <path d="M60 37.5 V69" fill="none" stroke="#0a0907" strokeWidth={0.8} opacity={0.55} />
    </g>
  );
}

/** A struck coin: solid gold with a darker inner rim. */
function Coin({ cx, cy, r, gold }: { cx: number; cy: number; r: number; gold: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={gold} {...EDGE} strokeWidth={2.4} />
      <circle cx={cx} cy={cy} r={r * 0.78} fill="none" stroke="#0a0907" strokeWidth={0.8} opacity={0.5} />
    </g>
  );
}

/** The four glyphs, drawn on a 120×120 medallion with the gold gradient stroke. */
function Glyph({ kind, seal }: { kind: EmblemKind; seal: string }) {
  switch (kind) {
    case "games":
      return (
        <>
          <g transform="rotate(-45 60 57)">
            <Sword gold={seal} />
          </g>
          <g transform="rotate(45 60 57)">
            <Sword gold={seal} />
          </g>
        </>
      );
    case "users":
      return (
        <>
          {/* A heater shield in gold, an engraved border, a chevron and a gem below it. */}
          <path d="M43 40 H77 V56.5 C77 69.5 69 78 60 82.5 C51 78 43 69.5 43 56.5 Z" fill={seal} {...EDGE} strokeWidth={2.4} />
          <path d="M47 44 H73 V56.5 C73 67 66.6 74 60 77.8 C53.4 74 47 67 47 56.5 Z" fill="none" stroke="#0a0907" strokeWidth={0.9} opacity={0.5} />
          <path d="M48.5 64 L60 52.5 L71.5 64 V69.5 L60 58 L48.5 69.5 Z" fill="#0a0907" stroke="none" opacity={0.6} />
          <path d="M60 66 L63.4 70.5 L60 75 L56.6 70.5 Z" fill="#0a0907" stroke="none" opacity={0.6} />
          <path d="M43 40 H77" stroke="#e0c487" strokeWidth={0.8} opacity={0.6} />
        </>
      );
    case "orders":
      return (
        <>
          {/* A gold scroll: the sheet between two rolls, lines of text, and a red wax seal on ribbons. */}
          <rect x={46.5} y={46} width={25} height={32} fill={seal} {...EDGE} />
          <path d="M44.5 41.5 H71.5 a4.5 4.5 0 0 1 0 9 H44.5 a4.5 4.5 0 0 1 0 -9 Z" fill={seal} {...EDGE} />
          <circle cx={44.5} cy={46} r={2} fill="#8c682f" stroke="none" />
          <path d="M42.5 73.5 H69.5 a4.5 4.5 0 0 1 0 9 H42.5 a4.5 4.5 0 0 1 0 -9 Z" fill={seal} {...EDGE} />
          <circle cx={69.5} cy={78} r={2} fill="#8c682f" stroke="none" />
          <path d="M51 55.5 H67 M51 60.5 H67 M51 65.5 H61" stroke="#0a0907" strokeWidth={1.2} opacity={0.55} />
          <path d="M67.6 72.5 L65.2 83 L67.8 81.4 L69.4 84 L71 73.5 Z" fill="#5e1714" {...EDGE} strokeWidth={1.2} />
          <path d="M74.4 72.5 L76.8 83 L74.2 81.4 L72.6 84 L71 73.5 Z" fill="#5e1714" {...EDGE} strokeWidth={1.2} />
          <circle cx={71} cy={70.5} r={5.6} fill="#751f1c" {...EDGE} />
          <circle cx={71} cy={70.5} r={3.8} fill="none" stroke="#e0c487" strokeWidth={0.6} opacity={0.45} />
          <path d="M71 68.3 L72.9 70.5 L71 72.7 L69.1 70.5 Z" fill={seal} stroke="none" />
        </>
      );
    case "revenue":
      return (
        <>
          {/* A stack of coins seen from above, and one coin standing before it, bearing a cut gem. */}
          {[73, 67.5, 62, 56.5].map((y) => (
            <g key={y}>
              <path d={`M40 ${y} V${y + 3.2} A11.5 4.2 0 0 0 63 ${y + 3.2} V${y} Z`} fill="#8c682f" {...EDGE} strokeWidth={1.6} />
              <ellipse cx={51.5} cy={y} rx={11.5} ry={4.2} fill={seal} {...EDGE} strokeWidth={1.6} />
              <ellipse cx={51.5} cy={y} rx={8.4} ry={2.9} fill="none" stroke="#0a0907" strokeWidth={0.6} opacity={0.4} />
            </g>
          ))}
          <Coin cx={69} cy={67} r={11.5} gold={seal} />
          <path d="M69 60.5 L74 67 L69 73.5 L64 67 Z" fill="#0a0907" stroke="none" opacity={0.55} />
          <path d="M69 63.3 L71.9 67 L69 70.7 L66.1 67 Z" fill={seal} stroke="none" />
        </>
      );
  }
}

/**
 * A heraldic medallion for a figure card: a double diamond frame with diamond tips, a coin-like rim of
 * notches (it turns slowly when the card is hovered) and the section's emblem in cast gold. Decorative only.
 */
export function Emblem({ kind, className }: { kind: EmblemKind; className?: string }) {
  const gold = `iv-emblem-gold-${kind}`;
  const glow = `iv-emblem-glow-${kind}`;
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={cn("overflow-visible", className)}>
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e0c487" />
          <stop offset="45%" stopColor="#c09a55" />
          <stop offset="100%" stopColor="#8c682f" />
        </linearGradient>
        <radialGradient id={glow}>
          <stop offset="0%" stopColor="rgb(192 154 85 / 0.22)" />
          <stop offset="100%" stopColor="rgb(192 154 85 / 0)" />
        </radialGradient>
      </defs>
      <circle cx={60} cy={60} r={60} fill={`url(#${glow})`} />

      {/* Frame: two diamonds, tipped with small solid diamonds. */}
      <g fill="none" stroke="#8c682f" strokeWidth={0.8}>
        <path d="M60 4 L116 60 L60 116 L4 60 Z" opacity={0.6} />
        <path d="M60 12 L108 60 L60 108 L12 60 Z" opacity={0.3} />
      </g>
      <g fill={`url(#${gold})`}>
        {[
          [60, 4],
          [116, 60],
          [60, 116],
          [4, 60],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y - 3} L${x + 3} ${y} L${x} ${y + 3} L${x - 3} ${y} Z`} />
        ))}
      </g>

      {/* The rim: two rings and a ring of notches, like a struck coin. */}
      <g className="origin-center transition-transform duration-[1600ms] ease-out [transform-box:fill-box] group-hover:rotate-[30deg]" fill="none" stroke={`url(#${gold})`}>
        <circle cx={60} cy={60} r={35} strokeWidth={0.9} opacity={0.75} />
        <circle cx={60} cy={60} r={30.5} strokeWidth={0.6} opacity={0.45} />
        {ticks.map((a) => (
          <line key={a} x1={60} y1={25.6} x2={60} y2={a % 30 === 0 ? 29.4 : 27.6} strokeWidth={a % 30 === 0 ? 1 : 0.6} transform={`rotate(${a} 60 60)`} opacity={0.7} />
        ))}
      </g>
      <circle cx={60} cy={60} r={29.6} fill="rgb(10 9 7 / 0.85)" />

      <g fill="none" stroke={`url(#${gold})`} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
        <Glyph kind={kind} seal={`url(#${gold})`} />
      </g>
    </svg>
  );
}
