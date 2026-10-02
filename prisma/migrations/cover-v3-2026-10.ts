/**
 * Catalogue / game page portrait covers, October 2026: points `coverImage` of five games at corrected 3:4
 * files. The old files were artwork of another shape padded to 3:4 with blurred bands of itself above and
 * below (Monster Hunter Wilds and Dark Souls III: a square art plus 12.5% bands; Clair Obscur, Europa
 * Universalis V and Ghost of Yōtei: thinner bands), which the 3:4 card shows in full.
 *   monster-hunter-wilds        cover-v2.jpg -> cover-v3.jpg   Steam library_600x900, crop to 600x800
 *   dark-souls-iii              cover-v2.png -> cover-v3.jpg   Steam library_600x900, crop to 600x800
 *   clair-obscur-expedition-33  cover-v2.jpg -> cover-v3.jpg   Steam library_600x900, crop to 600x800
 *   europa-universalis-v        cover-v3.jpg -> cover-v4.jpg   Steam library_600x900, crop to 600x800
 *   ghost-of-yotei              cover-v2.jpg -> cover-v4.jpg   PlayStation Store layers (background, character, logo)
 * Nothing is upscaled or generated.
 *
 *   plan      Dry run (also `--plan`): checks every file and game and prints each row that would change. Reads only.
 *   apply     Saves the current `coverImage` of these games to cover-v3-backup.json (only the first time, so a
 *             second run keeps the original values), then sets `coverImage` to the new file. Requires --yes.
 *             Refuses if a game's current value is neither the expected old file nor the new one (the data
 *             changed since this was written). Running it again changes nothing.
 *   rollback  Restores the saved `coverImage` values.
 *
 * Only `coverImage` of these five games is written. The old files and every other field stay as they are.
 *
 * Run: npx tsx --env-file=.env prisma/migrations/cover-v3-2026-10.ts <plan|apply|rollback> [--yes]
 */
import { existsSync, readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BACKUP = path.join(process.cwd(), "prisma", "migrations", "cover-v3-backup.json");

/** Slug → expected current value, the new file and where the artwork comes from (all official). */
const CHANGES: Record<string, { from: string; file: string; source: string }> = {
  "monster-hunter-wilds": { from: "/images/games/monster-hunter-wilds/cover-v2.jpg", file: "cover-v3.jpg", source: "Steam library_600x900 (app 2246340)" },
  "dark-souls-iii": { from: "/images/games/dark-souls-iii/cover-v2.png", file: "cover-v3.jpg", source: "Steam library_600x900 (app 374320)" },
  "clair-obscur-expedition-33": { from: "/images/games/clair-obscur-expedition-33/cover-v2.jpg", file: "cover-v3.jpg", source: "Steam library_600x900 (app 1903340)" },
  "europa-universalis-v": { from: "/images/games/europa-universalis-v/cover-v3.jpg", file: "cover-v4.jpg", source: "Steam library_600x900 (app 3450310)" },
  "ghost-of-yotei": { from: "/images/games/ghost-of-yotei/cover-v2.jpg", file: "cover-v4.jpg", source: "PlayStation Store BACKGROUND_LAYER_ART + HERO_CHARACTER + LOGO" },
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
  const db = await prisma.game.findMany({ where: { slug: { in: Object.keys(CHANGES) } }, select: { id: true, slug: true, coverImage: true, pageCoverImage: true } });
  return new Map(db.map((g) => [g.slug, g]));
}

function validate(found: Awaited<ReturnType<typeof rows>>): string[] {
  const problems: string[] = [];
  for (const [slug, change] of Object.entries(CHANGES)) {
    const g = found.get(slug);
    if (!g) problems.push(`${slug}: no such game`);
    else if (g.coverImage !== change.from && g.coverImage !== target(slug)) problems.push(`${slug}: coverImage is ${g.coverImage}, expected ${change.from}`);
    const file = path.join(process.cwd(), "public", target(slug));
    if (!existsSync(file)) { problems.push(`${slug}: ${target(slug)} missing`); continue; }
    const size = jpegSize(file);
    if (!size) { problems.push(`${slug}: not a JPEG`); continue; }
    if (Math.abs(size.width / size.height - 3 / 4) > 0.005) problems.push(`${slug}: ${size.width}x${size.height} is not 3:4`);
    if (size.width < 600) problems.push(`${slug}: ${size.width}px is too narrow for the covers`);
  }
  return problems;
}

async function plan() {
  const found = await rows();
  const problems = validate(found);
  console.log(`games: ${Object.keys(CHANGES).length}; found in the database: ${found.size}\n`);
  console.log("| id | slug | current coverImage | new coverImage | file | pageCoverImage | source |");
  console.log("|---|---|---|---|---|---|---|");
  let changes = 0;
  for (const [slug, { source }] of Object.entries(CHANGES)) {
    const g = found.get(slug);
    const file = path.join(process.cwd(), "public", target(slug));
    const size = existsSync(file) ? jpegSize(file) : null;
    if (g && g.coverImage !== target(slug)) changes++;
    console.log(`| ${g?.id ?? "—"} | ${slug} | ${g?.coverImage ?? "—"} | ${target(slug)} | ${size ? `${size.width}x${size.height}` : "MISSING"} | ${g ? (g.pageCoverImage ?? "null (page uses coverImage)") : "—"} | ${source} |`);
  }
  console.log(`\nrows that would change: ${changes} (field: coverImage only)`);
  console.log(`checks: ${problems.length ? `${problems.length} PROBLEM(S)\n  ${problems.join("\n  ")}` : "every game exists with the expected current value; every file exists, is a JPEG, 3:4 and at least 600 px wide"}`);
  if (problems.length) process.exitCode = 1;
}

async function apply() {
  if (!process.argv.includes("--yes")) throw new Error("apply needs --yes");
  const found = await rows();
  const problems = validate(found);
  if (problems.length) throw new Error(`refusing to apply, ${problems.length} problem(s); run plan`);
  if (!existsSync(BACKUP)) {
    const saved = Object.fromEntries([...found.values()].map((g) => [g.slug, g.coverImage]));
    await writeFile(BACKUP, JSON.stringify({ savedAt: new Date().toISOString(), coverImage: saved }, null, 2) + "\n");
    console.log(`backup: ${path.relative(process.cwd(), BACKUP)}`);
  }
  let updated = 0;
  for (const slug of Object.keys(CHANGES)) {
    if (found.get(slug)?.coverImage === target(slug)) continue;
    await prisma.game.update({ where: { slug }, data: { coverImage: target(slug) } });
    updated++;
  }
  console.log(`coverImage set on ${updated} games (${Object.keys(CHANGES).length - updated} already up to date)`);
}

async function rollback() {
  if (!existsSync(BACKUP)) throw new Error("no backup: nothing to roll back");
  const backup: { coverImage: Record<string, string> } = JSON.parse(await readFile(BACKUP, "utf8"));
  for (const [slug, coverImage] of Object.entries(backup.coverImage)) {
    await prisma.game.update({ where: { slug }, data: { coverImage } });
  }
  console.log(`coverImage restored on ${Object.keys(backup.coverImage).length} games`);
}

const steps: Record<string, () => Promise<void>> = { plan, "--plan": plan, apply, rollback };
const step = steps[process.argv[2] ?? ""];
if (!step) {
  console.error("Usage: npx tsx --env-file=.env prisma/migrations/cover-v3-2026-10.ts <plan|apply|rollback> [--yes]");
  process.exit(1);
}
step()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
