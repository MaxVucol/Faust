import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/** Everything public may be crawled; the cart and favourites are personal pages (also noindex). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cos", "/favorite", "/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
