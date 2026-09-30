import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { absoluteUrl } from "@/lib/site";

// Rebuilt at most hourly, so games added to the catalogue appear without a redeploy.
export const revalidate = 3600;

/** Public, indexable pages. The cart and favourites are personal and stay out. */
const PAGES = ["/", "/produse", "/despre-noi", "/contact", "/intrebari-frecvente", "/livrare-si-plata", "/termeni", "/confidentialitate"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = await prisma.game.findMany({ select: { slug: true, updatedAt: true }, orderBy: { slug: "asc" } });
  return [
    ...PAGES.map((path) => ({ url: absoluteUrl(path) })),
    ...games.map((game) => ({ url: absoluteUrl(`/produse/${game.slug}`), lastModified: game.updatedAt })),
  ];
}
