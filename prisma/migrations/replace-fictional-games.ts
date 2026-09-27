/**
 * One-off catalogue update: the 11 fictional games become popular 2025–2026 releases, and the
 * real games get their correct studio, publisher, release date and platforms.
 *
 * Existing records are updated in place (matched by their old slug, or by the new one if the script
 * has already run), so price, discount, stock, featured status and ids are kept. Each game's
 * previous description is copied to `descriptionPrevious` before it is replaced.
 *
 * Idempotent. Run: npx tsx --env-file=.env prisma/migrations/replace-fictional-games.ts
 */
import { PrismaClient } from "@prisma/client";
import { localizedDescriptionSchema } from "../../lib/localized-text";
import { gameDescriptions } from "../game-descriptions";
import { coverPath, games, screenshotPaths } from "../games-data";

const prisma = new PrismaClient();

/** New slug → the fictional game's slug it replaces. */
const REPLACES: Record<string, string> = {
  "europa-universalis-v": "iron-covenant",
  "kingdom-come-deliverance-ii": "blood-of-the-marches",
  "silent-hill-f": "the-drowned-abbey",
  "anno-117-pax-romana": "winterhold-siege",
  "death-stranding-2-on-the-beach": "lantern-of-the-deep-wood",
  "civilization-vii": "kingdom-of-rust",
  "clair-obscur-expedition-33": "the-pale-cartographer",
  "doom-the-dark-ages": "mourning-blade",
  "resident-evil-requiem": "hymn-of-the-barrow",
  "ghost-of-yotei": "crows-over-varenholm",
  "monster-hunter-wilds": "black-tithe",
};

type CommandResult = { n?: number; nModified?: number };

async function main() {
  let updated = 0;
  for (const g of games) {
    const slugs = [g.slug, REPLACES[g.slug]].filter((s): s is string => Boolean(s));
    const existing = await prisma.game.findFirst({ where: { slug: { in: slugs } }, select: { id: true, slug: true } });
    if (!existing) {
      console.warn(`Nu există în baza de date: ${g.slug} (sărit)`);
      continue;
    }

    const description = localizedDescriptionSchema.parse(gameDescriptions[g.slug]);
    // Back up the current description in the same write (raw pipeline update).
    await prisma.$runCommandRaw({
      update: "Game",
      updates: [{ q: { slug: existing.slug }, u: [{ $set: { descriptionPrevious: "$description" } }] }],
    }) as CommandResult;

    await prisma.game.update({
      where: { id: existing.id },
      data: {
        title: g.title,
        slug: g.slug,
        genres: g.genres,
        platforms: g.platforms,
        rating: g.rating,
        releaseDate: new Date(g.releaseDate),
        developer: g.developer,
        publisher: g.publisher,
        description,
        coverImage: coverPath(g.slug, g.art),
        screenshots: screenshotPaths(g.slug, g.art),
        cardImage: g.art?.card ?? null,
        pageCoverImage: g.art?.pageCover ?? null,
      },
    });
    updated++;
    if (existing.slug !== g.slug) console.log(`${existing.slug} → ${g.slug}`);
  }
  console.log(`Jocuri actualizate: ${updated}/${games.length}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
