/**
 * The site's public origin, for canonical URLs, Open Graph, structured data, robots.txt and the
 * sitemap. Set NEXT_PUBLIC_SITE_URL in the deployment's environment. Without it, a Vercel deployment
 * falls back to its production domain (a system variable Vercel provides), and local development to
 * the dev server.
 */
function resolveSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const SITE_URL = resolveSiteUrl();

/** Absolute URL for a site path ("/produse/x") or an already absolute URL. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}
