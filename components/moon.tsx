"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cards } from "@/components/cards";
import { u } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

// Figma radial dusk (white -> blue -> near black): ellipse 3533 x 1360 centred at (720, -30.76).
const sky = `radial-gradient(ellipse ${u(3533)} ${u(1359.6)} at 50% ${u(-30.76)},
  rgb(255,255,255) 23.5%, rgb(192,207,216) 32%, rgb(129,160,178) 40.5%,
  rgb(97,136,158) 44.8%, rgb(65,112,139) 49%, rgb(34,88,119) 53.3%, rgb(18,76,110) 55.4%,
  rgb(2,64,100) 57.5%, rgb(12,48,70) 61.5%, rgb(21,31,40) 65.5%, rgb(20,22,17) 77.9%)`;

/** Cards on the dusk sky over the sunset; a small moon at the horizon grows and floods the section white. */
export function Moon() {
  const root = useRef<HTMLElement>(null);
  const moon = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      moon.current,
      { scale: 1, opacity: 0.2 },
      {
        scale: 17,
        opacity: 1,
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
      style={{ height: u(1761) }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/hills-1.jpg"
        alt=""
        className="absolute left-0 max-w-none object-cover"
        style={{ top: u(1018.4), width: u(1539.849), height: u(1024) }}
      />
      <div
        className="absolute inset-x-0"
        style={{
          top: u(2),
          height: u(1018.413),
          backgroundImage: sky,
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        ref={moon}
        className="absolute left-1/2 rounded-full bg-white"
        style={{
          top: u(1587.43),
          width: u(230.675),
          height: u(230.675),
          marginLeft: u(-115.338),
          opacity: 0.2,
        }}
      />
      <div className="relative" style={{ paddingTop: u(130) }}>
        <Cards />
      </div>
    </section>
  );
}
