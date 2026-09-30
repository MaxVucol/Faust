/**
 * Catalogue expansion: adds the games from games-data.ts that are not in the database yet.
 *
 * Only creates missing games (matched by slug); existing records — prices, sales, stock, featured
 * status, descriptions — are never touched. New games get no store rating and no sale.
 *
 * Run it only after the code that treats `rating` as optional is deployed: older builds require a
 * rating on every game and would fail to read the new records.
 *
 * Idempotent. Run: npx tsx --env-file=.env prisma/migrations/add-catalog-expansion.ts
 */
import { PrismaClient } from "@prisma/client";
import { localizedDescriptionSchema } from "../../lib/localized-text";
import { gameDescriptions } from "../game-descriptions";
import { coverPath, games, screenshotPaths } from "../games-data";

const prisma = new PrismaClient();

async function main() {
  const existing = new Set((await prisma.game.findMany({ select: { slug: true } })).map((g) => g.slug));
  const missing = games.filter((g) => !existing.has(g.slug));

  for (const g of missing) {
    const text = gameDescriptions[g.slug];
    if (!text) throw new Error(`Lipsește descrierea pentru ${g.slug}`);
    await prisma.game.create({
      data: {
        title: g.title,
        slug: g.slug,
        description: localizedDescriptionSchema.parse(text),
        price: g.price,
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
        cardImage: g.art?.card ?? null,
        pageCoverImage: g.art?.pageCover ?? null,
      },
    });
    console.log(`+ ${g.slug}`);
  }
  console.log(`Jocuri adăugate: ${missing.length}. Total în catalog: ${existing.size + missing.length}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
