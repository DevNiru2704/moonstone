"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { unit } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const DEAD_ZONE = 8; // px of scroll before the direction counts

/**
 * Header chrome behaviour (renders nothing):
 * - the navbar ([data-nav]) slides up when scrolling down and back when scrolling up; on pages with a photo hero it only starts
 *   150 design px after the logo has flipped to the wordmark (and the flip has finished), elsewhere from the start
 * - the "Let's work together" pill ([data-pill]) fades out while a "Let's build something" box ([data-cta]) is reached, back at the footer or above it
 */
export function ChromeBehavior() {
  const path = usePathname();

  useEffect(() => {
    const nav = gsap.utils.toArray<HTMLElement>("[data-nav]");
    const pill = document.querySelector<HTMLElement>("[data-pill]");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hero = document.querySelector("[data-hero]");
    const cta = document.querySelector("[data-cta]");
    const footer = document.querySelector("footer");

    let enabled = !hero;
    let hidden = false;
    const setHidden = (hide: boolean) => {
      if (hide === hidden) return;
      hidden = hide;
      if (reduce) gsap.to(nav, { autoAlpha: hide ? 0 : 1, duration: 0.15, overwrite: "auto" });
      else gsap.to(nav, { y: hide ? -130 * unit() : 0, duration: 0.35, ease: "power2.out", overwrite: "auto" });
    };

    // the logo-to-wordmark flip (header-logo.tsx) must have finished showing the wordmark before the navbar may hide
    const flipped = () => document.querySelector<HTMLElement>("[data-flip]")?.dataset.flip === "word";

    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      if (y <= 0 || !enabled || !flipped()) {
        setHidden(false);
        last = y;
        return;
      }
      if (Math.abs(y - last) < DEAD_ZONE) return;
      // an open menu stays put
      setHidden(y > last && !document.querySelector("[data-open]"));
      last = y;
    };
    const onFocus = () => setHidden(false);
    addEventListener("scroll", onScroll, { passive: true });
    nav.forEach((n) => n.addEventListener("focusin", onFocus));

    const triggers: ScrollTrigger[] = [];
    if (hero) {
      triggers.push(
        ScrollTrigger.create({
          trigger: hero,
          start: () => `bottom top-=${50 * unit()}`, // the logo flips at "top+=100"; this is 150 design px later
          end: () => ScrollTrigger.maxScroll(window) + 1,
          onToggle: (self) => {
            enabled = self.isActive;
            if (!enabled) setHidden(false);
          },
        }),
      );
    }
    if (pill && cta) {
      triggers.push(
        ScrollTrigger.create({
          trigger: cta,
          start: () => `top bottom-=${110 * unit()}`, // the box's top edge reaches the top of the pill
          endTrigger: footer ?? cta,
          end: footer ? "top bottom" : "bottom top",
          onToggle: (self) => gsap.to(pill, { autoAlpha: self.isActive ? 0 : 1, duration: 0.3, overwrite: "auto" }),
        }),
      );
    }

    return () => {
      removeEventListener("scroll", onScroll);
      nav.forEach((n) => n.removeEventListener("focusin", onFocus));
      triggers.forEach((t) => t.kill());
      gsap.set(nav, { clearProps: "transform,opacity,visibility" });
      if (pill) gsap.set(pill, { clearProps: "opacity,visibility" });
    };
  }, [path]);

  return null;
}
