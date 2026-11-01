import gsap from "gsap";

/** Left-to-right reveal of a box that overshoots to the right, springs back and settles (same feel as the hero captions). */
export const bounceReveal = (el: gsap.TweenTarget, over = 112) =>
  gsap
    .timeline()
    .to(el, { width: `${over}%`, duration: 0.6, ease: "power2.out" })
    .to(el, { width: "97%", duration: 0.3, ease: "sine.inOut" })
    .to(el, { width: "100%", duration: 0.3, ease: "sine.out" });

/** The reverse: dips, swells past the edge, then sweeps shut toward the left. */
export const bounceErase = (el: gsap.TweenTarget, over = 112) =>
  gsap
    .timeline()
    .to(el, { width: "97%", duration: 0.3, ease: "sine.inOut" })
    .to(el, { width: `${over}%`, duration: 0.3, ease: "sine.inOut" })
    .to(el, { width: 0, duration: 0.6, ease: "power2.in" });
