import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";

const IMAGE = /\.(avif|webp|png|jpe?g)$/i;

/**
 * Images for a game's gallery: the ones listed in its data (key art first), then every image file
 * dropped into public/images/games/<slug>/screenshots/, sorted by name ("01.jpg", "02.jpg"…).
 * Adding real screenshots is just adding files to that folder; no code or data change needed.
 * The folder is included in the server bundle (next.config.ts) so this also works when deployed.
 */
export async function galleryImages(slug: string, listed: string[]): Promise<string[]> {
  let found: string[] = [];
  try {
    const dir = path.join(process.cwd(), "public", "images", "games", slug, "screenshots");
    found = (await readdir(dir))
      .filter((f) => IMAGE.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f) => `/images/games/${slug}/screenshots/${encodeURIComponent(f)}`);
  } catch {
    // No screenshots folder for this game yet.
  }
  return [...new Set([...listed, ...found])];
}
