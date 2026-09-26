/**
 * Generates the placeholder artwork in public/images (except hero.jpg, which is real art): flat-colour silhouette
 * scenes (ridges, keeps, knights) with a fine grain, so the store looks
 * finished before real game art is added. Deterministic per slug.
 *
 * Run: npx tsx scripts/generate-images.ts
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { games } from "../prisma/games-data";
import { GENRES } from "../lib/catalog";

const OUT = path.join(process.cwd(), "public", "images");

type Palette = { sky: string; cloud: string; ridges: [string, string, string]; ground: string; light: string };

const PALETTES: Record<string, Palette> = {
  ember: { sky: "#3b2a22", cloud: "#4a352a", ridges: ["#2c201b", "#221915", "#17110e"], ground: "#0f0b09", light: "#c98a4a" },
  ash: { sky: "#4a4a47", cloud: "#5a5955", ridges: ["#393936", "#2b2b29", "#1d1d1b"], ground: "#121210", light: "#b8b2a2" },
  blood: { sky: "#4a1414", cloud: "#5c1b18", ridges: ["#361010", "#260c0c", "#180808"], ground: "#0e0505", light: "#d0a060" },
  gold: { sky: "#5a4a2a", cloud: "#6b5833", ridges: ["#433722", "#302819", "#1f1a11"], ground: "#120f0a", light: "#e0c070" },
  frost: { sky: "#343c44", cloud: "#414a53", ridges: ["#283038", "#1e242a", "#14181c"], ground: "#0b0e10", light: "#c8b27a" },
  moss: { sky: "#343829", cloud: "#404532", ridges: ["#282b1f", "#1e2118", "#141610"], ground: "#0c0d09", light: "#b8a468" },
};
const PALETTE_KEYS = Object.keys(PALETTES);

function rngFrom(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type Rng = () => number;
const between = (r: Rng, a: number, b: number) => a + r() * (b - a);
const pts = (list: [number, number][]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function clouds(r: Rng, w: number, h: number, p: Palette): string {
  let out = "";
  for (let i = 0; i < 7; i++) {
    const y = between(r, h * 0.05, h * 0.45);
    const x = between(r, -w * 0.2, w * 0.9);
    const len = between(r, w * 0.3, w * 0.8);
    const th = between(r, h * 0.01, h * 0.035);
    out += `<polygon fill="${p.cloud}" opacity="${between(r, 0.5, 1).toFixed(2)}" points="${pts([
      [x, y], [x + len * 0.3, y - th], [x + len * 0.8, y - th * 0.6], [x + len, y], [x + len * 0.6, y + th * 0.7], [x + len * 0.1, y + th * 0.5],
    ])}"/>`;
  }
  return out;
}

function ridge(r: Rng, w: number, h: number, baseY: number, amp: number, fill: string): string {
  const list: [number, number][] = [[0, h]];
  let y = baseY;
  for (let x = 0; x <= w + 40; x += between(r, 20, 60)) {
    y = Math.min(h, Math.max(baseY - amp, y + between(r, -amp * 0.35, amp * 0.35)));
    list.push([x, y]);
  }
  list.push([w, h]);
  return `<polygon fill="${fill}" points="${pts(list)}"/>`;
}

function castle(r: Rng, cx: number, baseY: number, s: number, fill: string, light: string): string {
  let out = "";
  const towers = 3 + Math.floor(r() * 4);
  const span = s * 1.6;
  // curtain wall with crenellations
  const wallTop = baseY - s * 0.35;
  out += `<rect fill="${fill}" x="${cx - span / 2}" y="${wallTop}" width="${span}" height="${baseY - wallTop + s * 0.6}"/>`;
  for (let x = cx - span / 2; x < cx + span / 2; x += s * 0.06) {
    out += `<rect fill="${fill}" x="${x}" y="${wallTop - s * 0.04}" width="${s * 0.035}" height="${s * 0.04}"/>`;
  }
  for (let i = 0; i < towers; i++) {
    const main = i === 0;
    const tw = main ? s * 0.28 : between(r, s * 0.1, s * 0.18);
    const th = main ? s * 1.1 : between(r, s * 0.5, s * 0.9);
    const tx = main ? cx - tw / 2 : cx + between(r, -span / 2, span / 2 - tw);
    const ty = baseY - th;
    out += `<rect fill="${fill}" x="${tx}" y="${ty}" width="${tw}" height="${th + s * 0.6}"/>`;
    if (r() > 0.4) {
      out += `<polygon fill="${fill}" points="${pts([[tx - tw * 0.08, ty], [tx + tw / 2, ty - tw * between(r, 0.9, 1.6)], [tx + tw * 1.08, ty]])}"/>`;
    } else {
      for (let k = 0; k < 4; k++) {
        out += `<rect fill="${fill}" x="${tx + (k * tw) / 3.5}" y="${ty - tw * 0.12}" width="${tw * 0.16}" height="${tw * 0.12}"/>`;
      }
    }
    const windows = Math.floor(r() * 3);
    for (let k = 0; k < windows; k++) {
      out += `<rect fill="${light}" opacity="0.8" x="${tx + tw * between(r, 0.3, 0.6)}" y="${ty + th * between(r, 0.15, 0.6)}" width="${Math.max(2, tw * 0.1)}" height="${Math.max(3, tw * 0.18)}"/>`;
    }
  }
  return out;
}

/** Cloaked knight with a lowered sword, anchored at bottom centre (x, y), height hgt. */
function knight(x: number, y: number, hgt: number, fill: string, flip = false): string {
  const k = (px: number, py: number): [number, number] => [x + (flip ? -px : px) * hgt, y + py * hgt];
  const cloak = [
    [-0.11, -0.8], [0.11, -0.8], [0.14, -0.55], [0.17, -0.3], [0.2, -0.22], [0.14, -0.25], [0.12, -0.2], [0.06, -0.26],
    [0, -0.22], [-0.06, -0.27], [-0.12, -0.2], [-0.16, -0.26], [-0.21, -0.18], [-0.17, -0.45], [-0.14, -0.72],
  ] as [number, number][];
  const helm = [[-0.045, -0.86], [-0.05, -0.93], [0, -0.99], [0.05, -0.93], [0.045, -0.86]] as [number, number][];
  const pauldron = [[-0.13, -0.8], [-0.08, -0.87], [0.08, -0.87], [0.13, -0.8], [0.11, -0.76], [-0.11, -0.76]] as [number, number][];
  const legL = [[-0.08, -0.3], [-0.02, -0.3], [-0.025, 0], [-0.1, 0]] as [number, number][];
  const legR = [[0.02, -0.3], [0.08, -0.3], [0.11, 0], [0.04, 0]] as [number, number][];
  const sword = [[0.13, -0.52], [0.155, -0.53], [0.31, 0.0], [0.29, 0.005]] as [number, number][];
  const guard = [[0.1, -0.47], [0.19, -0.51], [0.195, -0.495], [0.105, -0.455]] as [number, number][];
  const toPts = (l: [number, number][]) => pts(l.map(([a, b]) => k(a, b)));
  return [legL, legR, cloak, helm, pauldron, sword, guard].map((l) => `<polygon fill="${fill}" points="${toPts(l)}"/>`).join("");
}

function deadTree(r: Rng, x: number, y: number, len: number, angle: number, width: number, fill: string, depth = 0): string {
  const x2 = x + Math.cos(angle) * len;
  const y2 = y + Math.sin(angle) * len;
  let out = `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${fill}" stroke-width="${width}" stroke-linecap="square"/>`;
  if (depth < 4) {
    const n = 2 + Math.floor(r() * 2);
    for (let i = 0; i < n; i++) {
      out += deadTree(r, x2, y2, len * between(r, 0.55, 0.75), angle + between(r, -0.7, 0.7), width * 0.65, fill, depth + 1);
    }
  }
  return out;
}

type Kind = "castle" | "knight" | "battle" | "forest" | "ruins";

function scene(seed: string, w: number, h: number, paletteKey: string, kind: Kind, opts: { emptyLeft?: boolean } = {}): string {
  const r = rngFrom(seed);
  const p = PALETTES[paletteKey];
  const [far, mid, near] = p.ridges;
  let body = `<rect width="${w}" height="${h}" fill="${p.sky}"/>`;
  body += clouds(r, w, h, p);
  body += ridge(r, w, h, h * 0.55, h * 0.18, far);

  const leftBound = opts.emptyLeft ? w * 0.5 : 0;
  if (kind === "castle" || kind === "ruins" || (kind === "knight" && r() > 0.3)) {
    const s = kind === "castle" ? h * 0.42 : h * 0.3;
    const cx = between(r, Math.max(leftBound, w * 0.2) + s, w - s * 0.6);
    body += castle(r, cx, h * 0.68, s, mid, p.light);
  }
  body += ridge(r, w, h, h * 0.72, h * 0.08, mid);

  if (kind === "forest" || kind === "ruins") {
    for (let i = 0; i < 6; i++) {
      const tx = between(r, leftBound, w);
      body += deadTree(r, tx, h * 0.95, h * between(r, 0.12, 0.22), -Math.PI / 2 + between(r, -0.15, 0.15), h * 0.012, near);
    }
  }
  if (kind === "battle") {
    const count = 9 + Math.floor(r() * 6);
    for (let i = 0; i < count; i++) {
      body += knight(between(r, w * 0.05, w * 0.95), h * between(r, 0.82, 0.9), h * between(r, 0.14, 0.2), near, r() > 0.5);
    }
    for (let i = 0; i < 5; i++) {
      const bx = between(r, 0, w);
      body += `<line x1="${bx}" y1="${h * 0.86}" x2="${bx + h * 0.05}" y2="${h * 0.5}" stroke="${near}" stroke-width="${h * 0.006}"/>`;
    }
  }
  body += ridge(r, w, h, h * 0.9, h * 0.05, p.ground);

  if (kind === "knight" || kind === "forest") {
    const kx = opts.emptyLeft ? w * 0.6 : between(r, w * 0.3, w * 0.7);
    const kh = kind === "knight" ? h * 0.72 : h * 0.4;
    body += knight(kx, h * 0.93, kh, p.ground, r() > 0.5 && !opts.emptyLeft);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
}

function grain(w: number, h: number, seed: string, alpha = 22): Buffer {
  const r = rngFrom(seed);
  const buf = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const v = Math.floor(r() * 255);
    buf[i * 4] = v;
    buf[i * 4 + 1] = v;
    buf[i * 4 + 2] = v;
    buf[i * 4 + 3] = alpha;
  }
  return buf;
}

async function render(svg: string, w: number, h: number, file: string, seed: string, brightness = 1) {
  await mkdir(path.dirname(file), { recursive: true });
  await sharp(Buffer.from(svg))
    .modulate({ brightness })
    .composite([{ input: grain(w, h, seed), raw: { width: w, height: h, channels: 4 }, blend: "overlay" }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(file);
}

const escapeXml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

async function main() {
  const kinds: Kind[] = ["knight", "castle", "battle", "forest", "ruins"];

  for (const [i, g] of games.entries()) {
    const palette = PALETTE_KEYS[i % PALETTE_KEYS.length];
    const dir = path.join(OUT, "games", g.slug);
    for (let n = 1; n <= 4; n++) {
      const kind = kinds[(i + n - 1) % kinds.length];
      await render(scene(`${g.slug}-${n}`, 1280, 720, palette, kind), 1280, 720, path.join(dir, `shot-${n}.jpg`), `${g.slug}-${n}`);
    }
    // Cover: portrait scene with the title set in capitals at the top.
    const base = scene(`${g.slug}-cover`, 600, 800, palette, kinds[i % kinds.length]);
    const words = g.title.toUpperCase().split(" ");
    const lines: string[] = [];
    for (const word of words) {
      const last = lines[lines.length - 1];
      if (last && (last + " " + word).length <= 14) lines[lines.length - 1] = `${last} ${word}`;
      else lines.push(word);
    }
    const title = lines
      .map((l, k) => `<text x="300" y="${110 + k * 62}" text-anchor="middle" font-family="Cinzel, Trajan Pro, Georgia, serif" font-size="50" font-weight="600" letter-spacing="6" fill="#D9CFB8">${escapeXml(l)}</text>`)
      .join("");
    const cover = base.replace("</svg>", `<rect x="40" y="${130 + (lines.length - 1) * 62}" width="520" height="1" fill="#A68A4B"/>${title}</svg>`);
    await render(cover, 600, 800, path.join(dir, "cover.jpg"), `${g.slug}-cover`);
  }


  const genreKinds: Record<string, [Kind, string]> = {
    action: ["knight", "ember"],
    rpg: ["castle", "frost"],
    strategy: ["battle", "gold"],
    horror: ["forest", "blood"],
    "souls-like": ["ruins", "ash"],
    adventure: ["castle", "moss"],
  };
  for (const genre of GENRES) {
    const [kind, palette] = genreKinds[genre.slug];
    await render(scene(`genre-${genre.slug}`, 640, 420, palette, kind), 640, 420, path.join(OUT, "genres", `${genre.slug}.jpg`), genre.slug);
  }

  // Team portraits: head-and-shoulders silhouettes on flat stone backgrounds.
  const teamBg = ["#3a362e", "#2f2a22", "#35302a", "#2b2925"];
  for (let n = 1; n <= 4; n++) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="480"><rect width="480" height="480" fill="${teamBg[n - 1]}"/><ellipse cx="240" cy="190" rx="${70 + n * 3}" ry="88" fill="#17150f"/><polygon fill="#17150f" points="80,480 110,360 180,300 300,300 370,360 400,480"/></svg>`;
    await render(svg, 480, 480, path.join(OUT, "team", `${n}.jpg`), `team-${n}`);
  }

  console.log(`Imagini generate în ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
