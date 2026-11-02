import { u } from "@/lib/lenis";

/** Scroll distance (px) the how-we-work constellation stays locked for. */
export const ORBIT_SCROLL = 2600;
/** Top of the 1024-high stage when it is centred on the screen (negative on short screens). */
export const ORBIT_OFF = `calc((100svh - ${u(1024)}) / 2)`;
