/**
 * Replaces each game's description with the current texts from game-descriptions.ts.
 * The description being replaced is kept in `descriptionPrevious`, so nothing is lost.
 * Matches by slug and only touches games listed in that file.
 *
 * Run: npm run update:descriptions
 */
import { PrismaClient } from "@prisma/client";
import { localizedDescriptionSchema } from "../lib/localized-text";
import { gameDescriptions } from "./game-descriptions";

const prisma = new PrismaClient();

type CommandResult = { n?: number; nModified?: number };

async function main() {
  let matched = 0;
  let modified = 0;
  for (const [slug, texts] of Object.entries(gameDescriptions)) {
    const description = localizedDescriptionSchema.parse(texts);
    const r = (await prisma.$runCommandRaw({
      update: "Game",
      updates: [
        {
          q: { slug },
          // Pipeline update: the backup copies the old value in the same atomic write.
          u: [{ $set: { descriptionPrevious: "$description", description: { $literal: description } } }],
        },
      ],
    })) as CommandResult;
    matched += r.n ?? 0;
    modified += r.nModified ?? 0;
  }
  console.log(`Jocuri găsite: ${matched}/${Object.keys(gameDescriptions).length}, descrieri actualizate: ${modified}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
