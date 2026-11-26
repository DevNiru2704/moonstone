import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// /meow is not disallowed on purpose: crawlers must be able to fetch it to see its noindex.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` };
}
