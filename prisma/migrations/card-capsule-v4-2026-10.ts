/**
 * Home-page landscape artwork, revision 4 (October 2026): points `cardImage` of two games at their corrected
 * files, which the home cards (16:9, 16:7, 3:1) show with object-cover:
 *   ghost-of-yotei          card-capsule-v2.jpg -> card-capsule-v4.jpg
 *   euro-truck-simulator-2  card-capsule-v2.jpg -> card-capsule-v3.jpg
 * The v2 files show small art in a lot of empty space: Ghost of Yōtei's is a 3:1 art shrunk to the bottom of
 * the frame inside a blurred surround of itself, Euro Truck Simulator 2's keeps a small logo in the bottom
 * left of a mostly black frame. The new files fill the frame: Ghost of Yōtei is composed from the official
 * PlayStation Store layers (background, character, logo; the character placed as in the official 4:3
 * banner), Euro Truck Simulator 2 is a tighter window of the Steam library hero with the Steam logo.
 *
 *   plan      Dry run (also `--plan`): checks both files and games and prints each row that would change. Reads only.
 *   apply     Saves the current `cardImage` of these games to card-capsule-v4-backup.json (only the first
 *             time, so a second run keeps the original values), then sets `cardImage` to the new file.
 *             Requires --yes. Refuses if a game's current value is neither the expected old file nor the
 *             new one (the data changed since this was written). Running it again changes nothing.
 *   rollback  Restores the saved `cardImage` values.
 *
 * Only `cardImage` of these two games is written. The old files and every other field stay as they are.
 *
 * Run: npx tsx --env-file=.env prisma/migrations/card-capsule-v4-2026-10.ts <plan|apply|rollback> [--yes]
 */
import { existsSync, readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BACKUP = path.join(process.cwd(), "prisma", "migrations", "card-capsule-v4-backup.json");

/** Slug → expected current value, the new file and where the artwork comes from (all official; nothing generated or upscaled). */
const CHANGES: Record<string, { from: string; file: string; source: string }> = {
  "ghost-of-yotei": {
    from: "/images/games/ghost-of-yotei/card-capsule-v2.jpg",
    file: "card-capsule-v4.jpg",
    source: "PlayStation Store BACKGROUND_LAYER_ART + HERO_CHARACTER + LOGO",
  },
  "euro-truck-simulator-2": {
    from: "/images/games/euro-truck-simulator-2/card-capsule-v2.jpg",
    file: "card-capsule-v3.jpg",
    source: "Steam library_hero_2x (app 227300) + Steam logo_2x",
  },
};

const target = (slug: string) => `/images/games/${slug}/${CHANGES[slug].file}`;

/** Width and height from a JPEG's SOF marker. */
function jpegSize(file: string): { width: number; height: number } | null {
  const b = readFileSync(file);
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) return null;
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}

async function rows() {
  const db = await prisma.game.findMany({ where: { slug: { in: Object.keys(CHANGES) } }, select: { id: true, slug: true, title: true, cardImage: true } });
  return new Map(db.map((g) => [g.slug, g]));
}

function validate(found: Awaited<ReturnType<typeof rows>>): string[] {
  const problems: string[] = [];
  for (const [slug, change] of Object.entries(CHANGES)) {
    const g = found.get(slug);
    if (!g) problems.push(`${slug}: no such game`);
    else if (g.cardImage !== change.from && g.cardImage !== target(slug)) problems.push(`${slug}: cardImage is ${g.cardImage ?? "null"}, expected ${change.from}`);
    const file = path.join(process.cwd(), "public", target(slug));
    if (!existsSync(file)) { problems.push(`${slug}: ${target(slug)} missing`); continue; }
    const size = jpegSize(file);
    if (!size) { problems.push(`${slug}: not a JPEG`); continue; }
    if (Math.abs(size.width / size.height - 16 / 7) > 0.005) problems.push(`${slug}: ${size.width}x${size.height} is not 16:7`);
    if (size.width < 900) problems.push(`${slug}: ${size.width}px is too narrow for the home cards`);
  }
  return problems;
}

async function plan() {
  const found = await rows();
  const problems = validate(found);
  console.log(`games: ${Object.keys(CHANGES).length}; found in the database: ${found.size}\n`);
  console.log("| id | slug | current cardImage | new cardImage | file | source |");
  console.log("|---|---|---|---|---|---|");
  let changes = 0;
  for (const [slug, { source }] of Object.entries(CHANGES)) {
    const g = found.get(slug);
    const file = path.join(process.cwd(), "public", target(slug));
    const size = existsSync(file) ? jpegSize(file) : null;
    if (g && g.cardImage !== target(slug)) changes++;
    console.log(`| ${g?.id ?? "—"} | ${slug} | ${g ? (g.cardImage ?? "null") : "—"} | ${target(slug)} | ${size ? `${size.width}x${size.height}` : "MISSING"} | ${source} |`);
  }
  console.log(`\nrows that would change: ${changes} (field: cardImage only)`);
  console.log(`checks: ${problems.length ? `${problems.length} PROBLEM(S)\n  ${problems.join("\n  ")}` : "every game exists with the expected current value; every file exists, is a JPEG, 16:7 and at least 900 px wide"}`);
  if (problems.length) process.exitCode = 1;
}

async function apply() {
  if (!process.argv.includes("--yes")) throw new Error("apply needs --yes");
  const found = await rows();
  const problems = validate(found);
  if (problems.length) throw new Error(`refusing to apply, ${problems.length} problem(s); run plan`);
  if (!existsSync(BACKUP)) {
    const saved = Object.fromEntries([...found.values()].map((g) => [g.slug, g.cardImage]));
    await writeFile(BACKUP, JSON.stringify({ savedAt: new Date().toISOString(), cardImage: saved }, null, 2) + "\n");
    console.log(`backup: ${path.relative(process.cwd(), BACKUP)}`);
  }
  let updated = 0;
  for (const slug of Object.keys(CHANGES)) {
    if (found.get(slug)?.cardImage === target(slug)) continue;
    await prisma.game.update({ where: { slug }, data: { cardImage: target(slug) } });
    updated++;
  }
  console.log(`cardImage set on ${updated} games (${Object.keys(CHANGES).length - updated} already up to date)`);
}

async function rollback() {
  if (!existsSync(BACKUP)) throw new Error("no backup: nothing to roll back");
  const backup: { cardImage: Record<string, string | null> } = JSON.parse(await readFile(BACKUP, "utf8"));
  for (const [slug, cardImage] of Object.entries(backup.cardImage)) {
    await prisma.game.update({ where: { slug }, data: { cardImage } });
  }
  console.log(`cardImage restored on ${Object.keys(backup.cardImage).length} games`);
}

const steps: Record<string, () => Promise<void>> = { plan, "--plan": plan, apply, rollback };
const step = steps[process.argv[2] ?? ""];
if (!step) {
  console.error("Usage: npx tsx --env-file=.env prisma/migrations/card-capsule-v4-2026-10.ts <plan|apply|rollback> [--yes]");
  process.exit(1);
}
step()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
