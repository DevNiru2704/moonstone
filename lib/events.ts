export type Event = {
  slug: string;
  title: string;
  subtitle: string;
  poster: string;
  /** display strings, shown as written */
  date: string;
  time: string;
  venue: string;
  ticketUrl: string;
  /** for search engines (sitemap, page description, Event structured data): keep in step with the display strings */
  start: string; // ISO 8601 with the India offset, e.g. 2026-11-14T19:00:00+05:30
  venueName: string;
  address: string;
  city: string;
};

/** The one event on the site for now. The home row and the event page both read it. */
export const OLINDO: Event = {
  slug: "olindo",
  title: "Indieমেট V",
  subtitle: "ft. Olindo",
  poster: "/img/olindo.jpg",
  date: "Date - November 14, 2026",
  time: "Time - 7 PM Onwards",
  venue: "Venue: The Creative Arts Academy, Kalighat, Kolkata",
  ticketUrl: "https://www.district.in/events/indie-mate-olindo-live-nov12-2026-buy-tickets",
  start: "2026-11-14T19:00:00+05:30",
  venueName: "The Creative Arts Academy",
  address: "Kalighat, Kolkata, West Bengal, India",
  city: "Kolkata",
};

/** Every event that has its own page at /events/<slug>. The sitemap and the SEO data are built from this list. */
export const EVENTS: Event[] = [OLINDO];
