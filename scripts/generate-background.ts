/**
 * Generates public/images/background.png: a seamless, tileable, near-black
 * texture somewhere between weathered stone, aged parchment and worn leather.
 * Every layer wraps around the tile edges, so it repeats without seams.
 *
 * Run: npx tsx scripts/generate-background.ts
 */
import path from "node:path";
import sharp from "sharp";

const SIZE = 1024;
const OUT = path.join(process.cwd(), "public", "images", "background.png");

// Palette endpoints: the page base and the surface brown, plus a warm grey-brown accent.
const BASE = [0x0e, 0x0d, 0x0b];
const BROWN = [0x17, 0x15, 0x0f];
const WARM_GREY = [0x1a, 0x18, 0x15];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const wrap = (v: number) => ((v % SIZE) + SIZE) % SIZE;
// Quintic fade: no visible lattice creases, unlike smoothstep.
const smooth = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Periodic value noise: a random lattice of `cells` × `cells` that wraps at the tile edge. */
function periodicNoise(cells: number, rand: () => number): Float32Array {
  const lattice = Float32Array.from({ length: cells * cells }, () => rand() * 2 - 1);
  const out = new Float32Array(SIZE * SIZE);
  const step = SIZE / cells;
  for (let y = 0; y < SIZE; y++) {
    const gy = y / step;
    const y0 = Math.floor(gy);
    const ty = smooth(gy - y0);
    const r0 = (y0 % cells) * cells;
    const r1 = ((y0 + 1) % cells) * cells;
    for (let x = 0; x < SIZE; x++) {
      const gx = x / step;
      const x0 = Math.floor(gx);
      const tx = smooth(gx - x0);
      const c0 = x0 % cells;
      const c1 = (x0 + 1) % cells;
      const top = lattice[r0 + c0] + (lattice[r0 + c1] - lattice[r0 + c0]) * tx;
      const bottom = lattice[r1 + c0] + (lattice[r1 + c1] - lattice[r1 + c0]) * tx;
      out[y * SIZE + x] = top + (bottom - top) * ty;
    }
  }
  return out;
}

function fbm(octaves: [cells: number, weight: number][], rand: () => number): Float32Array {
  const out = new Float32Array(SIZE * SIZE);
  let total = 0;
  for (const [cells, weight] of octaves) {
    const layer = periodicNoise(cells, rand);
    for (let i = 0; i < out.length; i++) out[i] += layer[i] * weight;
    total += weight;
  }
  for (let i = 0; i < out.length; i++) out[i] /= total;
  return out;
}

/** Deposits a soft 1px stroke along a wandering path, wrapping around the edges. */
function stroke(buf: Float32Array, rand: () => number, x: number, y: number, length: number, angle: number, amount: number, curl: number) {
  for (let i = 0; i < length; i++) {
    angle += (rand() - 0.5) * curl;
    x += Math.cos(angle);
    y += Math.sin(angle);
    // Taper both ends so strokes fade in and out instead of starting abruptly.
    const taper = Math.sin((i / length) * Math.PI);
    const ix = wrap(Math.round(x));
    const iy = wrap(Math.round(y));
    buf[iy * SIZE + ix] += amount * taper;
  }
}

async function main() {
  const rand = rng(0x1e0d0b);

  // Material density: no very low octaves, so repeated tiles don't reveal large blotches.
  const density = fbm([[8, 0.45], [16, 0.6], [32, 0.5], [64, 0.35], [128, 0.22], [256, 0.12]], rand);
  // Separate slow field that shifts some areas towards the warm grey-brown (tint only).
  const warmth = fbm([[4, 1], [8, 0.6], [16, 0.3]], rand);

  // Fibres: short, slightly curved strands with a faint horizontal grain, like parchment or leather.
  const fibres = new Float32Array(SIZE * SIZE);
  for (let i = 0; i < 9000; i++) {
    const angle = (rand() - 0.5) * 1.1 + (rand() < 0.25 ? Math.PI / 2 : 0);
    stroke(fibres, rand, rand() * SIZE, rand() * SIZE, 8 + rand() * 40, angle, (rand() < 0.5 ? -1 : 1) * (0.35 + rand() * 0.4), 0.25);
  }

  // Faint scratches: fewer, longer, straighter and only ever lighter.
  const scratches = new Float32Array(SIZE * SIZE);
  for (let i = 0; i < 70; i++) {
    stroke(scratches, rand, rand() * SIZE, rand() * SIZE, 60 + rand() * 220, rand() * Math.PI * 2, 0.5 + rand() * 0.5, 0.04);
  }

  // Tiny pits and density flecks.
  const grain = new Float32Array(SIZE * SIZE);
  for (let i = 0; i < grain.length; i++) grain[i] = rand() * 2 - 1;
  for (let i = 0; i < 2600; i++) {
    const cx = Math.floor(rand() * SIZE);
    const cy = Math.floor(rand() * SIZE);
    const r = 1 + Math.floor(rand() * 2);
    const v = -(0.6 + rand() * 0.8);
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r) grain[wrap(cy + dy) * SIZE + wrap(cx + dx)] += v;
  }

  const px = Buffer.alloc(SIZE * SIZE * 3);
  for (let i = 0; i < SIZE * SIZE; i++) {
    // t = 0 is the base colour, t = 1 the surface brown. Kept low so the page stays near-black.
    // Only ~9 colour levels separate the two, so fibres need enough weight to register as 1-2 levels.
    let t = 0.24 + density[i] * 0.5 + fibres[i] * 0.2 + scratches[i] * 0.22 + grain[i] * 0.06;
    t = Math.min(1, Math.max(0, t));
    const w = Math.min(1, Math.max(0, 0.5 + warmth[i])) * 0.35;
    for (let c = 0; c < 3; c++) {
      const tone = BROWN[c] + (WARM_GREY[c] - BROWN[c]) * w;
      // Stochastic rounding dithers sub-level variation into a fine, even grain.
      px[i * 3 + c] = Math.floor(BASE[c] + (tone - BASE[c]) * t + rand());
    }
  }

  await sharp(px, { raw: { width: SIZE, height: SIZE, channels: 3 } })
    // Lossless: JPEG blocks and smears variations this small.
    .png({ compressionLevel: 9, palette: true, colours: 256, dither: 0 })
    .toFile(OUT);
  console.log(`Fundal generat: ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
