/**
 * Catalogue expansion and repricing, October 2026 (source: games-data.ts, game-descriptions.ts,
 * system-requirements.ts).
 *
 *   plan      Dry run: validates the target catalogue and prints what would change. Reads only.
 *   apply     Saves the current prices and sales of every game to expand-catalog-backup.json (only the
 *             first time), sets every existing game's price and sale to the target, and creates the
 *             games that are missing. Requires --yes.
 *   rollback  Deletes the games this script created and restores the saved prices and sales.
 *
 * Prices are MDL. A sale's price follows the seed's rule (whole lei minus one ban); its end date is
 * counted from the moment `apply` runs. Nothing else of an existing game is touched.
 *
 * Run: npx tsx --env-file=.env prisma/migrations/expand-catalog-2026-10.ts <plan|apply|rollback> [--yes]
 */
import { existsSync, statSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { GENRES, PLATFORMS } from "../../lib/catalog";
import { convert, formatAmount } from "../../lib/currency";
import { localizedDescriptionSchema } from "../../lib/localized-text";
import { gameDescriptions } from "../game-descriptions";
import { coverPath, games, screenshotPaths, type GameSeed } from "../games-data";
import { systemRequirements } from "../system-requirements";

const prisma = new PrismaClient();
const BACKUP = path.join(process.cwd(), "prisma", "migrations", "expand-catalog-backup.json");
const DAY = 24 * 60 * 60 * 1000;
const now = new Date();

type Pricing = { price: number; discountPrice: number | null; discountStartsAt: Date | null; discountEndsAt: Date | null };

/** The seed's sale rule (prisma/seed.ts): whole lei minus one ban. */
const salePrice = (price: number, percent: number) => Math.round(price * (1 - percent / 100)) - 0.01;
/** What the store shows as the percentage (lib/format.ts discountPercent). */
const shownPercent = (price: number, sale: number) => Math.round(((price - sale) / price) * 100);

function target(g: GameSeed): Pricing {
  return {
    price: g.price,
    discountPrice: g.discount ? salePrice(g.price, g.discount.percent) : null,
    discountStartsAt: null,
    discountEndsAt: g.discount ? new Date(now.getTime() + g.discount.days * DAY) : null,
  };
}

const activeSale = (p: Pricing) => p.discountPrice !== null && p.discountEndsAt !== null && p.discountPrice < p.price && p.discountEndsAt > now && !(p.discountStartsAt && p.discountStartsAt > now);
const mdl = (v: number) => v.toFixed(2);
const day = (d: Date) => d.toISOString().slice(0, 10);
const SHORT: Record<string, string> = { PC: "PC", "PlayStation 5": "PS5", "Xbox Series X|S": "XSX", "Nintendo Switch": "NS" };

async function current() {
  return prisma.game.findMany({ select: { slug: true, title: true, price: true, discountPrice: true, discountStartsAt: true, discountEndsAt: true } });
}

/** Every check from the brief; returns the problems found (empty when the target is consistent). */
function validate(existingSlugs: Set<string>, existingTitles: Map<string, string>) {
  const problems: string[] = [];
  const genreNames = new Set<string>(GENRES.map((g) => g.name));
  const platformNames = new Set<string>(PLATFORMS.map((p) => p.name));
  const slugs = new Map<string, number>();
  const titles = new Map<string, number>();
  const images = new Map<string, string>();
  for (const g of games) {
    slugs.set(g.slug, (slugs.get(g.slug) ?? 0) + 1);
    titles.set(g.title.toLowerCase(), (titles.get(g.title.toLowerCase()) ?? 0) + 1);
    const isNew = !existingSlugs.has(g.slug);
    if (isNew && existingTitles.has(g.title.toLowerCase())) problems.push(`${g.slug}: title already used by ${existingTitles.get(g.title.toLowerCase())}`);
    for (const genre of g.genres) if (!genreNames.has(genre)) problems.push(`${g.slug}: unknown genre ${genre}`);
    for (const p of g.platforms) if (!platformNames.has(p)) problems.push(`${g.slug}: unknown platform ${p}`);
    if (g.genres.length === 0 || g.platforms.length === 0) problems.push(`${g.slug}: no genre or platform`);
    const released = new Date(g.releaseDate);
    if (Number.isNaN(released.getTime()) || !/^\d{4}-\d{2}-\d{2}$/.test(g.releaseDate)) problems.push(`${g.slug}: invalid release date ${g.releaseDate}`);
    else if (released > now) problems.push(`${g.slug}: release date ${g.releaseDate} is in the future`);
    if (!(g.price > 0) || Math.round(g.price * 100) % 100 !== 99) problems.push(`${g.slug}: price ${g.price} is not a positive x.99 value`);
    if (g.discount) {
      const sale = salePrice(g.price, g.discount.percent);
      if (!(sale > 0 && sale < g.price)) problems.push(`${g.slug}: sale price ${sale} not between 0 and ${g.price}`);
      if (shownPercent(g.price, sale) !== g.discount.percent) problems.push(`${g.slug}: shows −${shownPercent(g.price, sale)}% instead of −${g.discount.percent}%`);
      if (g.discount.days < 21 || g.discount.days > 42) problems.push(`${g.slug}: sale lasts ${g.discount.days} days (3–6 weeks expected)`);
    }
    for (const img of [coverPath(g.slug, g.art), ...screenshotPaths(g.art)]) {
      const file = path.join(process.cwd(), "public", img);
      if (!existsSync(file)) problems.push(`${g.slug}: missing image ${img}`);
      if (images.has(img) && images.get(img) !== g.slug) problems.push(`${g.slug}: image ${img} also used by ${images.get(img)}`);
      images.set(img, g.slug);
    }
    if (isNew) {
      const text = gameDescriptions[g.slug];
      for (const lang of ["ro", "ru", "en"] as const) if (!text?.[lang]?.trim()) problems.push(`${g.slug}: no ${lang} description`);
      if (!g.developer.trim() || !g.publisher.trim() || !(g.stock > 0)) problems.push(`${g.slug}: incomplete developer/publisher/stock`);
    }
  }
  for (const [slug, n] of slugs) if (n > 1) problems.push(`duplicate slug ${slug}`);
  for (const [title, n] of titles) if (n > 1) problems.push(`duplicate title ${title}`);
  return problems;
}

async function plan() {
  const db = await current();
  const bySlug = new Map(db.map((g) => [g.slug, g]));
  const problems = validate(new Set(bySlug.keys()), new Map(db.map((g) => [g.title.toLowerCase(), g.slug])));
  const untouched = db.filter((g) => !games.some((s) => s.slug === g.slug));

  // ---- existing catalogue
  const prices = db.map((g) => g.price);
  console.log("== EXISTING CATALOGUE");
  console.log(`games: ${db.length}; prices ${mdl(Math.min(...prices))}–${mdl(Math.max(...prices))} MDL; on sale now: ${db.filter(activeSale).length}`);

  // ---- proposed catalogue
  const created = games.filter((g) => !bySlug.has(g.slug));
  const recent = games.filter((g) => g.releaseDate >= "2025-01-01");
  const family = games.filter((g) => g.genres.includes("Family"));
  console.log("\n== PROPOSED CATALOGUE");
  console.log(`games after: ${games.length + untouched.length}; new: ${created.length}; released 2025–2026: ${recent.length}; family/kids: ${family.length}${untouched.length ? `; in the DB but not in games-data (left as they are): ${untouched.map((g) => g.slug).join(", ")}` : ""}`);
  console.log(`by genre: ${GENRES.map((g) => `${g.name} ${games.filter((s) => s.genres.includes(g.name)).length}`).join(", ")}`);
  console.log(`by platform: ${PLATFORMS.map((p) => `${p.name} ${games.filter((s) => s.platforms.includes(p.name)).length}`).join(", ")}`);

  // ---- pricing, every game
  console.log("\n== PRICING (MDL; EUR at the store's rate)");
  console.log(["", "Game".padEnd(44), "Release   ", "Platforms      ", "Current".padStart(9), "Proposed".padStart(9), "Disc".padStart(5), "Final".padStart(9), "Final EUR".padStart(10)].join(" | "));
  const rows = [...games].sort((a, b) => b.price - a.price || a.title.localeCompare(b.title));
  for (const g of rows) {
    const t = target(g);
    const was = bySlug.get(g.slug);
    const final = t.discountPrice ?? t.price;
    const cur = was ? (activeSale(was) ? `${mdl(was.discountPrice as number)}*` : mdl(was.price)) : "new";
    console.log(
      [
        was ? " " : "+",
        g.title.slice(0, 44).padEnd(44),
        g.releaseDate,
        g.platforms.map((p) => SHORT[p] ?? p).join(",").padEnd(15),
        cur.padStart(9),
        mdl(t.price).padStart(9),
        (g.discount ? `−${g.discount.percent}%` : "").padStart(5),
        mdl(final).padStart(9),
        formatAmount(convert(final, "EUR"), "EUR").padStart(10),
      ].join(" | "),
    );
  }
  console.log("(+ new game; * current price is a running sale)");

  // ---- discounts
  const onSale = games.filter((g) => g.discount);
  const ends = onSale.map((g) => target(g).discountEndsAt as Date).sort((a, b) => a.getTime() - b.getTime());
  const byPercent = new Map<number, number>();
  for (const g of onSale) byPercent.set(g.discount!.percent, (byPercent.get(g.discount!.percent) ?? 0) + 1);
  console.log("\n== DISCOUNTS");
  console.log(`discounted: ${onSale.length} of ${games.length} (${Math.round((onSale.length / games.length) * 100)}%); expiry ${day(ends[0])} … ${day(ends[ends.length - 1])} if applied now`);
  console.log(`by size: ${[...byPercent].sort((a, b) => a[0] - b[0]).map(([p, n]) => `−${p}% ×${n}`).join(", ")}`);
  const finals = games.map((g) => target(g).discountPrice ?? g.price);
  console.log(`price range: list ${mdl(Math.min(...games.map((g) => g.price)))}–${mdl(Math.max(...games.map((g) => g.price)))} MDL, to pay ${mdl(Math.min(...finals))}–${mdl(Math.max(...finals))} MDL`);

  // ---- new assets
  console.log("\n== NEW ASSETS");
  for (const g of created) {
    const files = [coverPath(g.slug, g.art), ...screenshotPaths(g.art)].map((img) => {
      const file = path.join(process.cwd(), "public", img);
      return `${img} ${existsSync(file) ? `ok ${Math.round(statSync(file).size / 1024)} KB` : "MISSING"}`;
    });
    console.log(`${g.title} | ${g.slug} | ${files.join(" ; ")} | ${systemRequirements[g.slug]?.source ?? "no Steam page"}`);
  }

  // ---- checks
  console.log("\n== CHECKS");
  console.log(problems.length ? problems.map((p) => `PROBLEM ${p}`).join("\n") : "duplicate titles/slugs/images, images on disk, translations, genres, platforms, release dates, prices, sale maths: all OK");
  console.log("\nNothing was written (dry run).");
}

async function apply() {
  if (!process.argv.includes("--yes")) throw new Error("apply needs --yes");
  const db = await current();
  const bySlug = new Map(db.map((g) => [g.slug, g]));
  const problems = validate(new Set(bySlug.keys()), new Map(db.map((g) => [g.title.toLowerCase(), g.slug])));
  if (problems.length) throw new Error(`refusing to apply, ${problems.length} problem(s); run plan`);
  if (!existsSync(BACKUP)) {
    const saved = Object.fromEntries(db.map((g) => [g.slug, { price: g.price, discountPrice: g.discountPrice, discountStartsAt: g.discountStartsAt, discountEndsAt: g.discountEndsAt }]));
    await writeFile(BACKUP, JSON.stringify({ savedAt: now.toISOString(), pricing: saved, created: games.filter((g) => !bySlug.has(g.slug)).map((g) => g.slug) }, null, 2) + "\n");
    console.log(`backup: ${path.relative(process.cwd(), BACKUP)}`);
  }
  let repriced = 0;
  let created = 0;
  for (const g of games) {
    if (bySlug.has(g.slug)) {
      await prisma.game.update({ where: { slug: g.slug }, data: target(g) });
      repriced++;
      continue;
    }
    await prisma.game.create({
      data: {
        title: g.title,
        slug: g.slug,
        description: localizedDescriptionSchema.parse(gameDescriptions[g.slug]),
        ...target(g),
        genres: g.genres,
        platforms: g.platforms,
        rating: g.rating ?? null,
        releaseDate: new Date(g.releaseDate),
        developer: g.developer,
        publisher: g.publisher,
        stock: g.stock,
        featured: g.featured ?? false,
        coverImage: coverPath(g.slug, g.art),
        screenshots: screenshotPaths(g.art),
        systemRequirements: systemRequirements[g.slug] ?? null,
      },
    });
    created++;
  }
  console.log(`repriced: ${repriced}; created: ${created}; games now: ${await prisma.game.count()}`);
}

async function rollback() {
  if (!existsSync(BACKUP)) throw new Error("no backup: nothing to roll back");
  const backup: { pricing: Record<string, { price: number; discountPrice: number | null; discountStartsAt: string | null; discountEndsAt: string | null }>; created: string[] } = JSON.parse(await readFile(BACKUP, "utf8"));
  const { count } = await prisma.game.deleteMany({ where: { slug: { in: backup.created } } });
  for (const [slug, p] of Object.entries(backup.pricing)) {
    await prisma.game.update({
      where: { slug },
      data: { price: p.price, discountPrice: p.discountPrice, discountStartsAt: p.discountStartsAt ? new Date(p.discountStartsAt) : null, discountEndsAt: p.discountEndsAt ? new Date(p.discountEndsAt) : null },
    });
  }
  console.log(`deleted ${count} created games; restored the prices of ${Object.keys(backup.pricing).length}`);
}

const steps: Record<string, () => Promise<void>> = { plan, apply, rollback };
const step = steps[process.argv[2] ?? ""];
if (!step) {
  console.error("Usage: npx tsx --env-file=.env prisma/migrations/expand-catalog-2026-10.ts <plan|apply|rollback> [--yes]");
  process.exit(1);
}
step()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
