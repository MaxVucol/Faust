/**
 * Stores each game's verified PC system requirements (prisma/system-requirements.ts, copied from the
 * game's official Steam page) in the `systemRequirements` field.
 *
 * Only that field is written; games without verified requirements are left without it, and every
 * other field stays as it is. Older builds ignore the field, so it is safe to run before or after a
 * deploy.
 *
 * Idempotent. Run: npx tsx --env-file=.env prisma/migrations/add-system-requirements.ts
 */
import { PrismaClient } from "@prisma/client";
import { systemRequirements } from "../system-requirements";

const prisma = new PrismaClient();

async function main() {
  let updated = 0;
  const missing: string[] = [];
  for (const [slug, requirements] of Object.entries(systemRequirements)) {
    const { count } = await prisma.game.updateMany({ where: { slug }, data: { systemRequirements: requirements } });
    if (count === 0) missing.push(slug);
    updated += count;
  }
  const total = await prisma.game.count();
  console.log(`Cerințe salvate pentru ${updated} jocuri; fără cerințe verificate: ${total - updated}.`);
  if (missing.length) console.warn(`Nu există în baza de date: ${missing.join(", ")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
