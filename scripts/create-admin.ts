/**
 * Creates the first admin account, or resets an existing account to an active admin with a new password.
 * The password is read from the environment of this one command and never stored anywhere but as a hash.
 *
 *   ADMIN_EMAIL=you@example.com ADMIN_NAME="Your Name" ADMIN_PASSWORD='…at least 10 characters…' npm run admin:create
 *
 * (PowerShell: $env:ADMIN_EMAIL="…"; $env:ADMIN_NAME="…"; $env:ADMIN_PASSWORD="…"; npm run admin:create)
 */
import { hashPassword } from "../lib/admin/password";
import { createUserSchema } from "../lib/admin/schemas";
import { prisma } from "../lib/prisma";

async function main() {
  const parsed = createUserSchema.safeParse({
    email: process.env.ADMIN_EMAIL ?? "",
    name: process.env.ADMIN_NAME ?? "",
    password: process.env.ADMIN_PASSWORD ?? "",
    role: "admin",
    status: "active",
  });
  if (!parsed.success) {
    for (const issue of parsed.error.issues) console.error(`${issue.path.join(".")}: ${issue.message}`);
    console.error("Set ADMIN_EMAIL, ADMIN_NAME and ADMIN_PASSWORD (10+ characters) for this command.");
    process.exitCode = 1;
    return;
  }
  const { password, ...data } = parsed.data;
  const passwordHash = await hashPassword(password);
  const existing = await prisma.user.findUnique({ where: { email: data.email }, select: { id: true } });
  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data: { name: data.name, role: "admin", status: "active", passwordHash } });
    console.log(`Updated ${data.email}: active admin, new password set.`);
  } else {
    await prisma.user.create({ data: { ...data, passwordHash } });
    console.log(`Created admin ${data.email}.`);
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
