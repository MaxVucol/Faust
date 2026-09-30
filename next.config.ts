import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Game art rarely changes; let browsers reuse optimized images for a week instead of
    // revalidating them on every page change (files get a new name when the art is replaced).
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  // Game pages list the files in each game's screenshots folder (lib/gallery.ts), so the deployed
  // server function needs those folders too, not only the CDN.
  outputFileTracingIncludes: {
    "/produse/*": ["./public/images/games/*/screenshots/**/*"],
  },
};

export default nextConfig;
