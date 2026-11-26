// SEO checks against a running build: `npm run build && npm start`, then `npm run check:seo` (or `node scripts/check-seo.mjs http://localhost:3000`).
// Checks titles, descriptions, canonicals, social tags, JSON-LD, sitemap, robots, the hidden /meow page, redirects and internal links.
const BASE = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.moonstonemultimedia.com").replace(/\/$/, "");

const PAGES = ["/", "/about", "/how-we-work", "/events", "/events/olindo", "/moonstoned", "/contact", "/privacy-policy", "/terms-of-service"];
const LD_TYPES = {
  "/": ["Organization", "WebSite", "WebPage"],
  "/about": ["AboutPage", "BreadcrumbList"],
  "/moonstoned": ["Service", "BreadcrumbList"],
  "/contact": ["ContactPage", "FAQPage"],
  "/events/olindo": ["MusicEvent", "BreadcrumbList"],
};

let failed = 0;
const check = (ok, msg) => {
  if (!ok) failed++;
  console.log(`${ok ? "ok  " : "FAIL"} ${msg}`);
};
const get = (path, init) => fetch(BASE + path, init);
const attr = (html, re) => html.match(re)?.[1]?.replace(/&amp;/g, "&");
const meta = (html, key) =>
  attr(html, new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`)) ??
  attr(html, new RegExp(`<meta content="([^"]*)" (?:name|property)="${key}"`));
const ldTypes = (html) => {
  const types = [];
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const data = JSON.parse(json); // throws on invalid JSON-LD
    for (const node of data["@graph"] ?? [data]) types.push(node["@type"]);
  }
  return types;
};

const titles = new Set();
const descriptions = new Set();
const links = new Set();
for (const path of PAGES) {
  const res = await get(path);
  const html = await res.text();
  check(res.status === 200, `${path} 200`);
  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = meta(html, "description");
  check(title && !titles.has(title), `${path} unique title: ${title}`);
  check(desc && desc.length >= 70 && desc.length <= 170 && !descriptions.has(desc), `${path} unique description (${desc?.length} chars)`);
  titles.add(title);
  descriptions.add(desc);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  check(canonical === (path === "/" ? SITE : SITE + path), `${path} canonical ${canonical}`);
  for (const k of ["og:title", "og:description", "og:image", "og:url", "twitter:card", "twitter:image"]) check(meta(html, k), `${path} ${k}`);
  check(meta(html, "og:url") === canonical, `${path} og:url matches canonical`);
  check(!/noindex/.test(meta(html, "robots") ?? ""), `${path} indexable`);
  check((html.match(/<h1[\s>]/g) ?? []).length === 1, `${path} one h1`);
  let types = [];
  try {
    types = ldTypes(html);
    check(types.length > 0, `${path} JSON-LD parses (${types.join(", ")})`);
  } catch (e) {
    check(false, `${path} JSON-LD parses: ${e.message}`);
  }
  for (const t of LD_TYPES[path] ?? ["WebPage", "BreadcrumbList"]) check(types.includes(t), `${path} JSON-LD has ${t}`);
  const img = meta(html, "og:image");
  if (img) {
    const r = await get(new URL(img).pathname);
    check(r.ok && /image\//.test(r.headers.get("content-type")), `${path} og:image served (${new URL(img).pathname})`);
  }
  for (const [, href] of html.matchAll(/<a [^>]*href="(\/[^"#]*)/g)) links.add(href);
}

const sitemap = await (await get("/sitemap.xml")).text();
const locs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
check(
  locs.length === PAGES.length && PAGES.every((p) => locs.includes(p === "/" ? SITE : SITE + p)),
  `sitemap lists exactly the ${PAGES.length} pages`,
);
check(!locs.some((l) => /meow|\/services|\/faq/.test(l)), "sitemap has no /meow or redirects");

const robots = await (await get("/robots.txt")).text();
check(robots.includes(`Sitemap: ${SITE}/sitemap.xml`), "robots.txt points to the sitemap");
check(!/Disallow: \/\s*$/m.test(robots), "robots.txt does not block the site");

const meow = await get("/meow");
const meowHtml = await meow.text();
check(meow.status === 200, "/meow still works");
check(/noindex/.test(meow.headers.get("x-robots-tag") ?? ""), "/meow X-Robots-Tag noindex");
check(/noindex, ?nofollow/.test(meta(meowHtml, "robots") ?? ""), "/meow meta robots noindex, nofollow");
check(!/rel="canonical"|og:|application\/ld\+json/.test(meowHtml), "/meow has no canonical, Open Graph or JSON-LD");

for (const [from, to] of [["/services", "/moonstoned#services"], ["/faq", "/contact#faq"]]) {
  const r = await get(from, { redirect: "manual" });
  check(r.status === 307 && r.headers.get("location")?.endsWith(to), `${from} -> ${to} (${r.status})`);
}

for (const href of links) {
  const r = await get(href, { redirect: "manual" });
  check(r.status === 200 || r.status === 307 || r.status === 308, `link ${href} (${r.status})`);
}

console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
process.exit(failed ? 1 : 0);
