/**
 * Orders whose Telegram notification wasn't delivered (Telegram was down or not configured when they
 * were placed). The orders themselves are saved; this only announces them again.
 *
 *   npm run orders:notify            lists the pending ones (sends nothing)
 *   npm run orders:notify -- --send  sends them, oldest first, each at most once
 *
 * Runs with tsconfig.scripts.json so the app's server-only modules load outside Next.
 */
import { notifyOrder, pendingNotifications } from "../lib/orders";
import { prisma } from "../lib/prisma";

async function main() {
  const send = process.argv.includes("--send");
  const pending = await pendingNotifications(200);
  if (pending.length === 0) {
    console.log("No pending order notifications.");
    return;
  }
  console.log(`${pending.length} pending: ${pending.map((o) => `${o.number} (${o.notifyAttempts} tries)`).join(", ")}`);
  if (!send) {
    console.log("Nothing sent. Run with --send to send them.");
    return;
  }
  const results = { sent: 0, failed: 0, skipped: 0 };
  for (const o of pending) results[await notifyOrder(o.id)]++;
  console.log(`Sent ${results.sent}, failed ${results.failed}, skipped ${results.skipped}.`);
  if (results.failed) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
