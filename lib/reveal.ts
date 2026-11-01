import gsap from "gsap";

/** Left-to-right reveal of a box that overshoots to the right, springs back and settles (same feel as the hero captions). */
export const bounceReveal = (el: gsap.TweenTarget, over = 112) =>
  gsap
    .timeline()
    .to(el, { width: `${over}%`, duration: 0.6, ease: "power2.out" })
    .to(el, { width: "97%", duration: 0.3, ease: "sine.inOut" })
    .to(el, { width: "100%", duration: 0.3, ease: "sine.out" });

/** Erase: the box sweeps left down to a thin line, springs out to the right, back to a line, out a little less, then vanishes. */
export const bounceErase = (el: gsap.TweenTarget) =>
  gsap
    .timeline()
    .to(el, { width: "1%", duration: 0.45, ease: "power2.inOut" })
    .to(el, { width: "34%", duration: 0.22, ease: "power2.out" })
    .to(el, { width: "1%", duration: 0.22, ease: "power2.in" })
    .to(el, { width: "16%", duration: 0.18, ease: "power2.out" })
    .to(el, { width: 0, duration: 0.22, ease: "power2.in" });
