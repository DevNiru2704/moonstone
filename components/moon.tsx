"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { u } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

// Figma "moonstone-moon" (1440x1761): white sky fading into dusk, hills, and a pale moon.
const hills = {
  left: u(720 + 49.92 - 1539.85 / 2),
  top: u(880.5 + 649.91 - 512),
  width: u(1539.85),
  height: u(1024),
};
const sky = `radial-gradient(ellipse ${u(3533)} ${u(1360)} at ${u(720)} ${u(-30.76)},
  rgb(255,255,255) 23.5%, rgb(192,207,216) 32%, rgb(129,160,178) 40.5%,
  rgb(97,136,158) 44.8%, rgb(65,112,139) 49%, rgb(34,88,119) 53.3%, rgb(18,76,110) 55.4%,
  rgb(2,64,100) 57.5%, rgb(12,48,70) 61.5%, rgb(21,31,40) 65.5%, rgb(20,22,17) 77.9%)`;

export function Moon() {
  const root = useRef<HTMLElement>(null);
  const moon = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const scrollTrigger = { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: 0.6 };
      gsap.fromTo(moon.current, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "none", scrollTrigger });
      gsap.fromTo(bg.current, { yPercent: -4 }, { yPercent: 0, ease: "none", scrollTrigger });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-white" style={{ height: u(1761) }}>
      <div ref={bg} className="absolute inset-0">
        <div className="absolute" style={hills}>
          <Image src="/img/hills-1.png" alt="" fill sizes="110vw" className="object-cover" />
        </div>
        <div className="absolute inset-x-0" style={{ top: u(2), height: u(1018.41), backgroundImage: sky }} />
        <div className="absolute" style={hills}>
          <Image src="/img/hills-2.png" alt="" fill sizes="110vw" className="object-cover" />
        </div>
      </div>
      <div
        ref={moon}
        className="absolute"
        style={{ left: u(720 - 115.34), top: u(1587.43), width: u(230.68), height: u(230.68) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/moon.svg" alt="" className="block size-full" />
      </div>
    </section>
  );
}
