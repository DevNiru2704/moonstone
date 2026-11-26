import type { Metadata } from "next";
import type { Event } from "@/lib/events";

/** The canonical origin: https, no trailing slash. Override with NEXT_PUBLIC_SITE_URL (e.g. for a staging copy). */
function origin(raw: string | undefined) {
  try {
    const url = new URL(raw?.trim() || "https://www.moonstonemultimedia.com");
    return url.origin;
  } catch {
    return "https://www.moonstonemultimedia.com";
  }
}
export const SITE_URL = origin(process.env.NEXT_PUBLIC_SITE_URL);

export const SITE = {
  name: "Moonstone Multimedia",
  legalName: "Moonstone Multimedia LLP",
  description:
    "Moonstone Multimedia is an independent creative company in Kolkata and Mumbai working across music, culture and marketing: a record label, live experiences, original IPs and Moonstone*d, its creative and marketing wing.",
  email: "contact@moonstonemultimedia.com", // as on the Contact page
  phone: "+91 9073822783",
  cities: ["Kolkata", "Mumbai"],
  logo: "/img/logo.png",
};

export type PageSeo = {
  path: string;
  /** breadcrumb and short name */
  name: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

const DEFAULT_IMAGE = { image: "/og/home.jpg", imageAlt: "Moonstone Multimedia" };

/** Every indexable page. The metadata, sitemap and breadcrumbs all read this list (events come from lib/events.ts). */
export const PAGES = {
  "/": {
    name: "Home",
    title: "Moonstone Multimedia | Creative, Music & Marketing Company in Kolkata and Mumbai",
    description: SITE.description,
    image: "/og/home.jpg",
    imageAlt: "Moonstone Multimedia: built on culture, streaming the future",
  },
  "/about": {
    name: "About",
    title: "About Us",
    description:
      "Moonstone Multimedia is a Kolkata-based production house, record label and live experience curator. Read our ideal and our intent, and meet the team behind Moonstone.",
    image: "/og/about.jpg",
    imageAlt: "About Moonstone Multimedia",
  },
  "/how-we-work": {
    name: "How we work",
    title: "How We Work",
    description:
      "How Moonstone works: cooking up live experiences, marketing the future, keeping everyone in the loop, and local frequencies for global ears. Our process with artists and brands.",
    image: "/og/how-we-work.jpg",
    imageAlt: "How Moonstone Multimedia works",
  },
  "/events": {
    name: "Events & IP",
    title: "Events & Original IPs",
    description:
      "Upcoming live music events and the original IPs of Moonstone Multimedia: intimate gigs for independent artists and audiences in Kolkata.",
    image: "/og/events.jpg",
    imageAlt: "Moonstone Multimedia events and IPs",
  },
  "/moonstoned": {
    name: "Moonstone*d",
    title: "Moonstone*d | Branding & Marketing Agency in Kolkata and Mumbai",
    description:
      "Moonstone*d is the marketing arm of Moonstone Multimedia: brand strategy, identity, product styling and visuals, e-commerce, social media, performance marketing, audience outreach and event pop-ups.",
    image: "/og/moonstoned.jpg",
    imageAlt: "Moonstone*d, the marketing arm of Moonstone Multimedia",
  },
  "/contact": {
    name: "Contact",
    title: "Contact Us",
    description:
      "Get in touch with Moonstone Multimedia in Kolkata and Mumbai for brand work, collaborations, artist enquiries and events. Email, phone and answers to common questions.",
    image: "/og/contact.jpg",
    imageAlt: "Contact Moonstone Multimedia",
  },
  "/privacy-policy": {
    name: "Privacy Policy",
    title: "Privacy Policy",
    description: "How Moonstone Multimedia collects, uses and protects your personal information on this website, at our events and in our services.",
    ...DEFAULT_IMAGE,
  },
  "/terms-of-service": {
    name: "Terms of Service",
    title: "Terms of Service",
    description: "The terms for using the Moonstone Multimedia website, bookings and services.",
    ...DEFAULT_IMAGE,
  },
} satisfies Record<string, Omit<PageSeo, "path">>;

export type PagePath = keyof typeof PAGES;

export const url = (path: string) => (path === "/" ? SITE_URL : SITE_URL + path);

export function page(path: PagePath): PageSeo {
  return { path, ...PAGES[path] };
}

/** Event pages: everything comes from the event data, so editing lib/events.ts keeps the SEO in step. */
export function eventPage(e: Event): PageSeo {
  const when = new Date(e.start).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
  return {
    path: `/events/${e.slug}`,
    name: `${e.title} ${e.subtitle}`,
    title: `${e.title} ${e.subtitle} | Live in ${e.city}`,
    description: `${e.title} ${e.subtitle}, live at ${e.venueName}, ${e.address.split(",")[0]}, ${e.city} on ${when}. A Moonstone Multimedia live music experience.`,
    image: e.poster,
    imageAlt: `${e.title} ${e.subtitle} poster`,
  };
}

/** Complete metadata for one page: Open Graph and Twitter are written out in full because a page's openGraph replaces the parent's. */
export function metadataFor(p: PageSeo, opts: { imageSize?: [number, number] } = {}): Metadata {
  const [width, height] = opts.imageSize ?? [1200, 630];
  const images = [{ url: p.image, width, height, alt: p.imageAlt }];
  return {
    title: p.path === "/" ? { absolute: p.title } : p.title,
    description: p.description,
    alternates: { canonical: url(p.path) },
    openGraph: {
      type: "website",
      url: url(p.path),
      siteName: SITE.name,
      locale: "en_IN",
      title: p.path === "/" ? p.title : `${p.title} | ${SITE.name}`,
      description: p.description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: p.path === "/" ? p.title : `${p.title} | ${SITE.name}`,
      description: p.description,
      images,
    },
  };
}

export const pageMetadata = (path: PagePath) => metadataFor(page(path));
