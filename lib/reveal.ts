import gsap from "gsap";
import { unit } from "@/lib/lenis";

export const ink = (el: HTMLElement, hidden: boolean) =>
  hidden ? el.style.setProperty("-webkit-text-fill-color", "transparent") : el.style.removeProperty("-webkit-text-fill-color");

/** Left-to-right reveal of a box that overshoots to the right, springs back and settles (same feel as the hero captions). */
export const bounceReveal = (el: HTMLElement, over = 112) =>
  gsap
    .timeline()
    .call(ink, [el, false])
    .to(el, { width: `${over}%`, duration: 0.6, ease: "power2.out" })
    .to(el, { width: "97%", duration: 0.3, ease: "sine.inOut" })
    .to(el, { width: "100%", duration: 0.3, ease: "sine.out" });

/** Erase: the box sweeps left down to a thin line, springs out to the right, back to a line, out a little less, then vanishes. The springs are fixed widths (design px), not a share of the phrase. */
export const bounceErase = (el: HTMLElement) =>
  gsap
    .timeline()
    .call(ink, [el, true]) // the box empties first: no text while it shrinks
    .to(el, { width: "1%", duration: 0.45, ease: "power2.inOut" })
    .to(el, { width: () => 52 * unit(), duration: 0.22, ease: "power2.out" })
    .to(el, { width: "1%", duration: 0.22, ease: "power2.in" })
    .to(el, { width: () => 30 * unit(), duration: 0.18, ease: "power2.out" })
    .to(el, { width: 0, duration: 0.22, ease: "power2.in" });
