import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Game art rarely changes; let browsers reuse optimized images for a week instead of
    // revalidating them on every page change (files get a new name when the art is replaced).
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
};

export default nextConfig;
