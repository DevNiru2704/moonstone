"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cards } from "@/components/cards";
import { u } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

// Figma radial dusk stops (white -> blue -> near black), stretched over the card area.
const sky = `radial-gradient(ellipse ${u(1700)} ${u(2000)} at 50% 0,
  rgb(255,255,255) 23.5%, rgb(192,207,216) 32%, rgb(129,160,178) 40.5%,
  rgb(97,136,158) 44.8%, rgb(65,112,139) 49%, rgb(34,88,119) 53.3%, rgb(18,76,110) 55.4%,
  rgb(2,64,100) 57.5%, rgb(12,48,70) 61.5%, rgb(21,31,40) 65.5%, rgb(20,22,17) 77.9%)`;

/** Cards on the dusk sky; a white "moon" rises behind them and floods the sky white. */
export function Moon() {
  const root = useRef<HTMLElement>(null);
  const moon = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      moon.current,
      { scale: 0.45 },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 60%",
          end: "bottom bottom",
          scrub: 0.6,
        },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-white"
      style={{
        height: u(1120),
        backgroundImage: sky,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        ref={moon}
        className="absolute left-1/2 rounded-[50%] bg-white"
        style={{
          top: u(930),
          width: u(2300),
          height: u(1100),
          marginLeft: u(-1150),
          transformOrigin: "50% 0",
        }}
      />
      <div className="relative" style={{ paddingTop: u(130) }}>
        <Cards />
      </div>
    </section>
  );
}
