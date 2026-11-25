import { u } from "@/lib/lenis";

/** Figma "Rectangle 228": the dusk glow (white at the bottom centre, through blue, to near black) used behind Contact and How We Work. */
export const dusk = `radial-gradient(ellipse ${u(2640)} ${u(1016)} at 50% ${u(1049)},
  #fff 23.52%, #c0cfd8 35.8%, #81a0b2 48.07%, #61889e 54.21%, #41708b 60.35%, #225877 66.48%,
  #124c6e 69.55%, #024064 72.62%, #0c3046 77.32%, #151f28 82.02%, #101519 91.01%, #0a0a0a 100%)`;

/** The dusk on a white page: the bottom 260 design px fade to white so the box's lower corners (still blue in the radial) do not end in a hard line. */
export const duskOnWhite = `linear-gradient(to top, #fff 0, rgba(255,255,255,0) ${u(260)}), ${dusk}`;
