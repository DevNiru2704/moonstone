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

/** The splash sets this when it finishes (or is skipped) so intros can start. */
export const READY_EVENT = "moonstone:ready";

export const onReady = (cb: () => void) => {
  if ((window as unknown as { __ready?: boolean }).__ready) {
    cb();
    return () => {};
  }
  window.addEventListener(READY_EVENT, cb, { once: true });
  return () => window.removeEventListener(READY_EVENT, cb);
};

export const markReady = () => {
  (window as unknown as { __ready?: boolean }).__ready = true;
  window.dispatchEvent(new Event(READY_EVENT));
};
