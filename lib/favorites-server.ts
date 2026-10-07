import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { getSessionUser } from "./auth/user";
import { FAVORITES_COOKIE, parseFavorites } from "./favorites";
import { prisma } from "./prisma";

/**
 * The wishlist (named "favorites" in the code). A guest's lives in the "favorites" cookie. A signed-in
 * user's lives in their account (prisma Wishlist, id = user id) and follows them to other devices; the
 * cookie only mirrors it (FavoritesProvider). A guest list joins the account once, when signing in
 * (lib/auth/user.ts startSession), and the cookie leaves with the session on sign-out.
 */

/** The signed-in user's saved list, or null for a guest (or if it can't be read: then the cookie is used). */
export const getAccountFavorites = cache(async (): Promise<string[] | null> => {
  const user = await getSessionUser().catch(() => null);
  if (!user || user.status !== "active") return null;
  try {
    const list = await prisma.wishlist.findUnique({ where: { id: user.id }, select: { slugs: true } });
    return parseFavorites((list?.slugs ?? []).join("."));
  } catch (error) {
    console.error("[wishlist] account list unavailable", error instanceof Error ? error.message : "unknown error");
    return null;
  }
});

/** Slugs the visitor has saved, newest first: the account's when signed in, otherwise this browser's. */
export const getFavorites = cache(async (): Promise<string[]> => {
  const [jar, account] = await Promise.all([cookies(), getAccountFavorites()]);
  return account ?? parseFavorites(jar.get(FAVORITES_COOKIE)?.value);
});
