"use server";

import { z } from "zod";
import { getSessionUser } from "@/lib/auth/user";
import { MAX_FAVORITES } from "@/lib/favorites";
import { prisma } from "@/lib/prisma";
import { allowAttempt } from "@/lib/rate-limit";

const SAVES_PER_MINUTE = 30;
const listSchema = z.array(z.string().regex(/^[a-z0-9-]{1,80}$/)).max(MAX_FAVORITES);

/**
 * Saves the signed-in user's wishlist (the whole list, newest first). The account is the session's,
 * never one named by the request; only slugs of games in the catalogue are kept. A guest's call does
 * nothing (their list is the cookie). Returns whether it was saved.
 */
export async function saveWishlistAction(slugs: unknown): Promise<boolean> {
  const parsed = listSchema.safeParse(slugs);
  if (!parsed.success) return false;
  const user = await getSessionUser();
  if (!user || user.status !== "active") return false;
  // Per account, in memory (lib/rate-limit.ts): far above anyone clicking hearts (saves are debounced),
  // low enough that a script can't turn it into a stream of database writes.
  if (!allowAttempt(`wishlist:${user.id}`, SAVES_PER_MINUTE, 60_000)) return false;
  const unique = [...new Set(parsed.data)];
  const known = new Set((await prisma.game.findMany({ where: { slug: { in: unique } }, select: { slug: true } })).map((g) => g.slug));
  const kept = unique.filter((s) => known.has(s));
  try {
    await prisma.wishlist.upsert({ where: { id: user.id }, create: { id: user.id, slugs: kept }, update: { slugs: kept } });
    return true;
  } catch (error) {
    console.error("[wishlist] save failed", error instanceof Error ? error.message : "unknown error");
    return false;
  }
}
