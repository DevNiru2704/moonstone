import type Lenis from "lenis";

let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Design px (1440 wide comp) -> CSS length. */
export const u = (n: number) => `calc(var(--u) * ${n})`;

/** Current px value of one design px. */
export const unit = () => window.innerWidth / 1440;
