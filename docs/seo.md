# SEO

Everything uses the built-in Next.js Metadata API and metadata routes, with no SEO library.

## Where things live

| What | File |
| --- | --- |
| Site URL, page titles, descriptions, social images, JSON-LD builders | `lib/seo.ts` |
| Root defaults (`metadataBase`, title template, default description) | `app/layout.tsx` |
| Per-page metadata | each `app/**/page.tsx`: `export const metadata = pageMetadata("/about")` |
| JSON-LD output | `components/json-ld.tsx`, rendered by each page |
| Sitemap | `app/sitemap.ts` → `/sitemap.xml` |
| robots.txt | `app/robots.ts` → `/robots.txt` |
| Social preview images (1200×630) | `public/og/*.jpg` |
| Checks | `scripts/check-seo.mjs` (`npm run check:seo`) |

## Site URL and canonicals

- `SITE_URL` comes from `NEXT_PUBLIC_SITE_URL` and defaults to `https://www.moonstonemultimedia.com` (the apex domain redirects to www). It is normalised to the origin, with no trailing slash.
- Set `NEXT_PUBLIC_SITE_URL` only for another deployment, such as a staging copy. A wrong value makes every canonical point at the wrong host.
- Every indexable page has a canonical link to `SITE_URL + path`, and `og:url` matches it.
- The root layout deliberately has no canonical and no Open Graph, so a page without its own SEO (the hidden `/meow`) inherits none.
- A page's `openGraph` replaces its parent's rather than merging with it. That is why `metadataFor()` writes the whole object every time.

## Adding a page

1. Add an entry to `PAGES` in `lib/seo.ts` with:
   - a name (used in breadcrumbs);
   - a title (`%s | Moonstone Multimedia` is added for you);
   - a description of roughly 120–165 characters, written from the page's real copy;
   - an image and its alt text (a new 1200×630 JPEG in `public/og/`, or reuse `home.jpg`).
2. In the page: `export const metadata = pageMetadata("/new-page")` and `<JsonLd data={pageGraph(page("/new-page"))} />` inside `<main>`.
3. The sitemap picks the page up from `PAGES`. Add the path to `PAGES` in `scripts/check-seo.mjs` as well.

## Events

Event SEO is generated from `lib/events.ts`, the same data the pages show. When an event changes, edit only that file:

- the display strings (`date`, `time`, `venue`) as shown on the page;
- the machine fields: `start` (ISO 8601 with the `+05:30` offset), `venueName`, `address` and `city`. Keep them in step with the display strings;
- `EVENTS` lists every event that has a page at `/events/<slug>`. The sitemap, the event page's description, its social image (the poster) and its `MusicEvent` JSON-LD all come from there.

Remove an event from `EVENTS` (and its page) once it is over, or Google will keep a past event listed as scheduled.

## Structured data

All JSON-LD is server-rendered:

| Page | Types |
| --- | --- |
| Home | `Organization`, `WebSite`, `WebPage` |
| Every other page | `WebPage` (`AboutPage`, `ContactPage` where it fits) and `BreadcrumbList` |
| Moonstone\*d | one `Service` per row of the services list (`lib/moonstoned.ts`) |
| Contact | `FAQPage` from `lib/faq.ts` |
| Event pages | `MusicEvent` |

The data only states what the site shows:

- **Organization:** the email and phone from the Contact page, and the social links from `lib/links.ts`.
- **Locations:** Kolkata and Mumbai are `areaServed` cities, not addresses. There is no `LocalBusiness`, because the site gives no street address. Add one only when there is a real, public address.
- **Left out:** no ratings, reviews or prices.

## The hidden /meow page

`/meow` is a developer easter egg and must never be indexed. It is protected four ways:

- **Meta tag:** its page metadata sets `robots: { index: false, follow: false }`.
- **HTTP header:** `next.config.ts` adds `X-Robots-Tag: noindex, nofollow` for `/meow`.
- **No promotion:** it is not in the sitemap, and it has no canonical, Open Graph or JSON-LD. The root layout carries none of these, so the page inherits none.
- **Not disallowed in robots.txt, on purpose.** A crawler blocked by robots.txt never sees the noindex and can still list the bare URL.

`npm run check:seo` checks all of this.

## Checking

```bash
npm run build && npm start      # in one terminal
npm run check:seo               # in another (defaults to http://localhost:3000; pass a URL to check another host)
```

The script checks that each page has:

- a unique title and description;
- a canonical URL;
- Open Graph and Twitter tags, with an image that loads;
- exactly one `h1`;
- JSON-LD that parses.

It also checks:

- the sitemap and robots.txt;
- the `/meow` protection;
- the `/services` and `/faq` redirects;
- every internal link.

After a deploy, also run:

- [Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/) on Home, Contact, Moonstone\*d and an event page;
- [PageSpeed Insights](https://pagespeed.web.dev/) on mobile and desktop.

## Search Console (owner's Google account)

1. Add a **Domain** property for `moonstonemultimedia.com` in [Google Search Console](https://search.google.com/search-console), and verify it with the DNS TXT record it gives you (at the domain registrar or in Vercel DNS).
2. Go to **Sitemaps** and submit `https://www.moonstonemultimedia.com/sitemap.xml`.
3. Use **URL inspection** on the home page and request indexing. Repeat for any new page.
4. Optionally, do the same in Bing Webmaster Tools (it can import the Search Console property).

Being indexed and ranking take Google time and depend on more than these tags. Nothing in this setup guarantees either.

## Known gaps

- **Small tap targets on phones (Lighthouse).** The site is the 1440 px design scaled to the screen width, so small text links (the footer especially) sit close together on phones. Fixing this needs a phone layout.
- **Next.js overhead.** Lighthouse flags render-blocking CSS and a little legacy/unused JavaScript. These come from Next.js itself.
- **Social images.** `public/og/*.jpg` were made from the site's own photos, logo, fonts and colours (an HTML layout rendered at 1200×630). To change one, keep the size and stay under about 300 KB.
