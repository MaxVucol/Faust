import { PrismaClient } from "@prisma/client";
import { localizedDescriptionSchema } from "../lib/localized-text";
import { gameDescriptions } from "./game-descriptions";
import { coverPath, games, screenshotPaths } from "./games-data";

const prisma = new PrismaClient();
const DAY = 24 * 60 * 60 * 1000;

async function main() {
  await prisma.game.deleteMany();

  const now = Date.now();
  for (const [i, g] of games.entries()) {
    const { discount, art, ...rest } = g;
    const description = localizedDescriptionSchema.parse(gameDescriptions[g.slug]);
    await prisma.game.create({
      data: {
        ...rest,
        description,
        featured: g.featured ?? false,
        releaseDate: new Date(g.releaseDate),
        coverImage: coverPath(g.slug, art),
        screenshots: screenshotPaths(g.slug, art),
        cardImage: art?.card ?? null,
        pageCoverImage: art?.pageCover ?? null,
        ...(discount && {
          discountPrice: Math.round(g.price * (1 - discount.percent / 100)) - 0.01,
          discountEndsAt: new Date(now + discount.days * DAY),
        }),
        // Stagger createdAt so "Noutăți" has a stable order.
        createdAt: new Date(now - (games.length - i) * DAY),
      },
    });
  }
  console.log(`Seed complet: ${games.length} jocuri.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
