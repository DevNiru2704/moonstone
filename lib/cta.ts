/** Hover of the "Let's build something." box: lifts a little with a soft shadow (Tailwind 4 moves it with `translate`, so that is what eases). */
export const CTA_HOVER =
  "transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3)]";

/** Figma "cta" box height and the space between it and the footer (60 on every page, as in Figma Privacy Policy / Terms). */
export const CTA_H = 342.04;
export const CTA_FOOTER_GAP = 60;
/** Design px where a page ends when its CTA box starts at `top`. */
export const ctaEnd = (top: number) => top + CTA_H + CTA_FOOTER_GAP;
