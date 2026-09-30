import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { FAVORITES_COOKIE, parseFavorites } from "./favorites";

/** Slugs the visitor has starred, newest first. */
export const getFavorites = cache(async (): Promise<string[]> => parseFavorites((await cookies()).get(FAVORITES_COOKIE)?.value));
