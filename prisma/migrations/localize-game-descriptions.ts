/**
 * One-off, non-destructive migration: Game.description String → { ro, ru, en }.
 *
 * 1. Every document whose `description` is still a string gets `description: { ro: <old text> }`,
 *    and the original string is also copied to `descriptionLegacy` as a backup.
 * 2. Russian and English texts from game-descriptions.ts are added by slug, but only
 *    where that language is still missing — nothing that already exists is overwritten.
 * 3. It verifies that every migrated `description.ro` equals its backup.
 *
 * Idempotent: running it again changes nothing. Uses raw MongoDB commands so it works whether the
 * generated Prisma client still has the old String field or the new composite type.
 *
 * Run: npm run migrate:descriptions
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { localizedDescriptionSchema } from "../../lib/localized-text";
import { gameDescriptions } from "../game-descriptions";

const prisma = new PrismaClient();

type CommandResult = { n?: number; nModified?: number; ok?: number };

async function countWhere(filter: Prisma.InputJsonObject): Promise<number> {
  const r = (await prisma.$runCommandRaw({ count: "Game", query: filter })) as CommandResult;
  return r.n ?? 0;
}

async function main() {
  const legacy = await countWhere({ description: { $type: "string" } });
  console.log(`Descrieri în format vechi (text simplu): ${legacy}`);

  if (legacy > 0) {
    const r = (await prisma.$runCommandRaw({
      update: "Game",
      updates: [
        {
          q: { description: { $type: "string" } },
          u: [{ $set: { descriptionLegacy: "$description", description: { ro: "$description" } } }],
          multi: true,
        },
      ],
    })) as CommandResult;
    console.log(`Convertite în { ro }: ${r.nModified ?? 0}`);
  }

  // Validate the translation set against the same schema any future admin form would use.
  let added = 0;
  for (const [slug, texts] of Object.entries(gameDescriptions)) {
    const parsed = localizedDescriptionSchema.parse(texts);
    for (const lang of ["ru", "en"] as const) {
      const text = parsed[lang];
      if (!text) continue;
      const r = (await prisma.$runCommandRaw({
        update: "Game",
        updates: [
          {
            q: {
              slug,
              $or: [{ [`description.${lang}`]: { $exists: false } }, { [`description.${lang}`]: null }, { [`description.${lang}`]: "" }],
            },
            u: { $set: { [`description.${lang}`]: text } },
          },
        ],
      })) as CommandResult;
      added += r.nModified ?? 0;
    }
  }
  console.log(`Traduceri adăugate (ru/en): ${added}`);

  const total = await countWhere({});
  const withRo = await countWhere({ "description.ro": { $type: "string", $ne: "" } });
  const stillString = await countWhere({ description: { $type: "string" } });
  const mismatched = await countWhere({ descriptionLegacy: { $exists: true }, $expr: { $ne: ["$description.ro", "$descriptionLegacy"] } });
  console.log(`Verificare: ${total} jocuri, ${withRo} cu descriere ro, ${stillString} rămase în format vechi, ${mismatched} diferențe față de backup.`);
  if (stillString > 0 || mismatched > 0) throw new Error("Migrarea nu s-a verificat. Nu s-a pierdut nimic: textul original e în descriptionLegacy.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
