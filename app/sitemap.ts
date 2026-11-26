import type { MetadataRoute } from "next";
import { EVENTS } from "@/lib/events";
import { eventPage, PAGES, url } from "@/lib/seo";

// Indexable pages only: /meow and the /services and /faq redirects are not in PAGES. No lastModified: there is no reliable date for it.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...Object.keys(PAGES), ...EVENTS.map((e) => eventPage(e).path)];
  return paths.map((p) => ({ url: url(p) }));
}
