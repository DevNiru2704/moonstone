"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { unit } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const TOP = 130; // design px kept between the top of the window and the text while it sticks

/**
 * Renders nothing. Keeps the elements marked [data-stick] in view while the [data-poster] beside them scrolls past, then lets them go
 * with it. Each element is moved on its own (a wrapper would isolate the mix-blend-mode of the paragraph from the page behind it).
 */
export function StickyText() {
  useEffect(() => {
    const els = gsap.utils.toArray<HTMLElement>("[data-stick]");
    const poster = document.querySelector<HTMLElement>("[data-poster]");
    if (!els.length || !poster) return;
    const first = els[0];
    const last = els[els.length - 1];
    const mainTop = () => (first.offsetParent as HTMLElement).getBoundingClientRect().top + scrollY;
    const start = () => mainTop() + first.offsetTop - TOP * unit();
    const travel = () => Math.max(0, poster.offsetTop + poster.offsetHeight - (last.offsetTop + last.offsetHeight));
    const tween = gsap.to(els, {
      y: travel,
      ease: "none",
      scrollTrigger: { start, end: () => start() + travel(), scrub: true, invalidateOnRefresh: true },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(els, { clearProps: "transform" });
    };
  }, []);
  return null;
}
