/**
 * Home-page landscape artwork, October 2026: points `cardImage` of 55 games at their new
 * public/images/games/<slug>/card-capsule.jpg (16:7, official artwork with the game's logo).
 *
 *   plan      Dry run: checks every file and game and prints each row that would change. Reads only.
 *   apply     Saves the current `cardImage` of the affected games to card-capsule-backup.json (only the
 *             first time), then sets `cardImage` to the new file. Requires --yes.
 *   rollback  Restores the saved `cardImage` values (null where there was none).
 *
 * Only `cardImage` is written; it is used by the home-page cards alone (FeaturedCard, OfferCard,
 * NewsCard). Covers, key art, screenshots and every other field stay as they are.
 *
 * Run: npx tsx --env-file=.env prisma/migrations/card-capsule-2026-10.ts <plan|apply|rollback> [--yes]
 */
import { existsSync, readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BACKUP = path.join(process.cwd(), "prisma", "migrations", "card-capsule-backup.json");
const FILE = "card-capsule.jpg";

/** Slug → where the artwork comes from (all official; nothing generated or upscaled). */
const SOURCES: Record<string, string> = {
  "assassins-creed-shadows": "Steam library_hero_2x + Steam library logo",
  balatro: "Steam library_hero_2x + Steam library logo",
  "baldurs-gate-3": "Steam header_2x",
  "blasphemous-2": "Steam library_hero_2x + Steam library logo",
  "bluey-the-videogame": "Steam library_hero_2x + Steam library logo",
  "cities-skylines-ii": "Steam header_2x",
  "code-vein-ii": "Steam library_hero_2x + official logo (bandainamcoent.com)",
  "crimson-desert": "Microsoft Store TitledHeroArt (logo included), edge continued",
  "crusader-kings-iii": "Steam library_hero_2x + official logo (paradoxinteractive.com)",
  "cyberpunk-2077": "Steam header_2x",
  "darkest-dungeon-ii": "Steam library_hero_2x + Steam library logo",
  "dave-the-diver": "Steam library_hero_2x + Steam library logo",
  "dead-space": "Steam library_hero_2x + Steam library logo",
  "disney-dreamlight-valley": "Steam library_hero_2x + Steam library logo",
  "doom-the-dark-ages": "Steam library_hero_2x + Steam library logo",
  "dragon-quest-vii-reimagined": "Steam library_hero_2x + official logo (square-enix-games.com)",
  "ea-sports-fc-26": "Steam library_hero_2x + official logo (ea.com)",
  "euro-truck-simulator-2": "Steam library_hero_2x + Steam library logo",
  "europa-universalis-v": "Steam library_hero_2x + official logo (paradoxinteractive.com)",
  "forza-horizon-5": "Steam library_hero_2x + Steam library logo",
  "frostpunk-2": "Steam header_2x",
  "god-of-war-ragnarok": "Steam library_hero_2x + Steam library logo",
  "hades-ii": "Steam library_hero_2x + official logo (Supergiant Games press kit)",
  "hollow-knight-silksong": "Steam library_hero_2x + Steam library logo",
  "hot-wheels-unleashed-2-turbocharged": "Steam library_hero_2x + Steam library logo",
  "lego-batman-legacy-of-the-dark-knight": "Steam library_hero_2x + official logo (wbgames.com)",
  "lego-horizon-adventures": "Steam library_hero_2x + Steam library logo",
  "lego-star-wars-the-skywalker-saga": "Steam library_hero_2x + Steam library logo",
  "lies-of-p": "Steam library_hero_2x + Steam library logo",
  "little-nightmares-iii": "Steam library_hero_2x + Steam library logo",
  "lords-of-the-fallen": "Steam library_hero_2x + Steam library logo",
  "microsoft-flight-simulator-2024": "Steam header_2x",
  "minecraft-dungeons": "Steam library_hero_2x + Steam library logo",
  "minecraft-dungeons-ii": "Microsoft Store TitledHeroArt (logo included), edge continued",
  "nba-2k26": "Steam library_hero_2x + official logo (nba.2k.com)",
  "ninja-gaiden-4": "Steam header_2x",
  "nioh-3": "Steam header_2x",
  "octopath-traveler-0": "Microsoft Store TitledHeroArt (logo included), edge continued",
  "overcooked-all-you-can-eat": "Steam library_hero_2x + Steam library logo",
  "paw-patrol-world": "Steam library_hero_2x + Steam library logo",
  "planet-coaster-2": "Steam library_hero_2x + Steam library logo",
  "powerwash-simulator": "Steam library_hero_2x + Steam library logo",
  "red-dead-redemption-2": "Steam library_hero_2x + Steam library logo",
  "sonic-racing-crossworlds": "Steam library_hero_2x + Steam library logo",
  "sonic-x-shadow-generations": "Steam library_hero_2x + Steam library logo",
  "split-fiction": "Steam library_hero_2x + Steam library logo",
  "spongebob-squarepants-titans-of-the-tide": "Steam header_2x",
  "stardew-valley": "Steam library_hero_2x + Steam library logo",
  "subnautica-2": "Steam header_2x",
  "the-elder-scrolls-v-skyrim-special-edition": "Steam library_hero_2x + Steam library logo",
  "the-last-of-us-part-ii-remastered": "Steam header_2x",
  "the-outer-worlds-2": "Steam library_hero_2x + Steam library logo",
  "tony-hawks-pro-skater-3-4": "Steam header_2x",
  "total-war-warhammer-iii": "Steam library_hero_2x + Steam library logo",
  "two-point-museum": "Steam library_hero_2x + Steam library logo",
};

const target = (slug: string) => `/images/games/${slug}/${FILE}`;

/** Width and height from a baseline/progressive JPEG's SOF marker. */
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
  const db = await prisma.game.findMany({ where: { slug: { in: Object.keys(SOURCES) } }, select: { slug: true, title: true, cardImage: true, screenshots: true, coverImage: true } });
  return new Map(db.map((g) => [g.slug, g]));
}

function validate(found: Map<string, unknown>): string[] {
  const problems: string[] = [];
  for (const slug of Object.keys(SOURCES)) {
    if (!found.has(slug)) problems.push(`${slug}: no such game`);
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
  console.log(`games: ${Object.keys(SOURCES).length}; found in the database: ${found.size}\n`);
  console.log("| slug | current home-card image (field) | new cardImage | size | source |");
  console.log("|---|---|---|---|---|");
  let changes = 0;
  for (const [slug, source] of Object.entries(SOURCES)) {
    const g = found.get(slug);
    const size = existsSync(path.join(process.cwd(), "public", target(slug))) ? jpegSize(path.join(process.cwd(), "public", target(slug))) : null;
    const shown = g ? (g.cardImage ? `${g.cardImage} (cardImage)` : g.screenshots[0] ? `${g.screenshots[0]} (screenshots[0])` : `${g.coverImage} (coverImage)`) : "—";
    if (g && g.cardImage !== target(slug)) changes++;
    console.log(`| ${slug} | ${shown} | ${target(slug)} | ${size ? `${size.width}x${size.height}` : "MISSING"} | ${source} |`);
  }
  console.log(`\nrows that would change: ${changes} (field: cardImage only)`);
  console.log(`checks: ${problems.length ? `${problems.length} PROBLEM(S)\n  ${problems.join("\n  ")}` : "every game exists; every file exists, is a JPEG, 16:7 and at least 900 px wide"}`);
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
  for (const slug of Object.keys(SOURCES)) {
    await prisma.game.update({ where: { slug }, data: { cardImage: target(slug) } });
    updated++;
  }
  console.log(`cardImage set on ${updated} games`);
}

async function rollback() {
  if (!existsSync(BACKUP)) throw new Error("no backup: nothing to roll back");
  const backup: { cardImage: Record<string, string | null> } = JSON.parse(await readFile(BACKUP, "utf8"));
  for (const [slug, cardImage] of Object.entries(backup.cardImage)) {
    await prisma.game.update({ where: { slug }, data: { cardImage } });
  }
  console.log(`cardImage restored on ${Object.keys(backup.cardImage).length} games`);
}

const steps: Record<string, () => Promise<void>> = { plan, apply, rollback };
const step = steps[process.argv[2] ?? ""];
if (!step) {
  console.error("Usage: npx tsx --env-file=.env prisma/migrations/card-capsule-2026-10.ts <plan|apply|rollback> [--yes]");
  process.exit(1);
}
step()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
