export const SOCIAL: Record<string, string> = {
  Instagram: "https://www.instagram.com/moonstone.multimedia",
  Youtube: "https://www.youtube.com/@MoonstoneMultimedia",
  Linkedin: "https://www.linkedin.com/company/moonstone-multimedia/",
};

/** Internal pages by the label shown in the footer and the menu. */
export const ROUTES: Record<string, string> = {
  ABOUT: "/about",
  "HOW WE WORK": "/how-we-work",
  SERVICES: "/moonstoned#services", // the services live on Moonstone*d; /services redirects there too
  CONTACT: "/contact",
  "Privacy Policy": "/privacy-policy",
  "Terms of Service": "/terms-of-service",
  "Terms of Services": "/terms-of-service",
  FAQ: "/contact#faq", // the FAQ sits on the Contact page; /faq redirects there too
};

export const PAGES: [string, string][] = ["ABOUT", "HOW WE WORK", "SERVICES", "CONTACT"].map((l) => [l, ROUTES[l]]);

export const LEGAL: [string, string][] = ["Privacy Policy", "Terms of Services", "FAQ"].map((l) => [l, ROUTES[l]]);
