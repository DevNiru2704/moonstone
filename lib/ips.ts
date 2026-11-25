/** The four IPs on the Events & IP page (Figma component sets LBI, IndieMet, Moontronics, Eta Kar Tune). All positions are design px in a 1440 x 816 section. */
export type Ip = {
  key: string;
  /** photo on the right (text left, right-aligned) or on the left (text right) */
  photo: "right" | "left";
  /** logo box in the section: x, y, w, h */
  logo: [number, number, number, number];
  /** an SVG logo drawn in grey that turns crimson, or two PNGs that crossfade */
  logoFile: string;
  logoAlt?: string;
  heading?: string;
  textTop: number;
  paragraphs: string[];
};

export const IPS: Ip[] = [
  {
    key: "lbi",
    photo: "right",
    logo: [324.3, 242.4, 304.613, 165.274],
    logoFile: "lbi",
    logoAlt: "Little Bit Indie",
    textTop: 516.64,
    paragraphs: [
      "Little Bit Indie is a monthly live music series that takes place at Little Bit Sober, featuring curated musical themes, original artists, genre experimentation, and intimate audience experiences.",
    ],
  },
  {
    key: "indiemate",
    photo: "left",
    logo: [811.3, 227.1, 299.007, 150.836],
    logoFile: "indiemate",
    logoAlt: "IndieMate",
    textTop: 417.92,
    paragraphs: [
      "IndieMate is a live music experience built around the spirit of independent music and the intimacy of shared spaces. Bringing together emerging artists, distinctive sounds, and curious audiences. From regional sounds and experimental genres to original compositions, it celebrates artists who bring their own voice to the stage.",
      "More than a gig, it is a space where independent music finds a home and audiences become part of the experience.",
    ],
  },
  {
    key: "moontronics",
    photo: "right",
    logo: [329.9, 189.4, 299.006, 264.286],
    logoFile: "moontronics",
    logoAlt: "Moontronics",
    textTop: 493.64,
    paragraphs: [
      "Moontronics is about exploring the many dimensions of contemporary electronic sound. Rooted in experimentation, it brings together diverse sonic influences, artists, and approaches to create immersive musical experiences.",
      "Each edition offers a different perspective on electronic music, its possibilities, and its evolving culture.",
    ],
  },
  {
    key: "eta",
    photo: "left",
    logo: [811.29, 265.01, 364.877, 93.972],
    logoFile: "eta",
    logoAlt: "Eta Kar Tune?",
    textTop: 398.99,
    paragraphs: [
      "Eta Kar Tune? Network is a music IP built for the unconventional, the unexpected, and the hard-to-categorise. Inspired by the idea of a network for people with distinct musical tastes, it brings together artists and listeners who find their place outside the usual genres.",
      "A space for niche sounds, curious minds, and music that refuses to fit into a box.",
    ],
  },
];
