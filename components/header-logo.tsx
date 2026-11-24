"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { u, unit } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

// pages with a photo hero start on the logo; every other page shows the wordmark from the start
const HERO_PATHS = ["/", "/about", "/events", "/moonstoned"];
const LOGO = { w: 98.33, h: 70 };
const WORD = { w: 230, h: 230 * (235 / 1230) };

/** The header mark: the logo, which flips into the wordmark once the page's hero (`[data-hero]`) has scrolled away. */
export function HeaderLogo() {
  const path = usePathname();
  const heroPage = HERO_PATHS.includes(path);
  const logo = useRef<HTMLImageElement>(null);
  const word = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const a = logo.current!;
    const b = word.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const show = (on: boolean) => {
      gsap.set(a, { opacity: on ? 0 : 1 });
      gsap.set(b, { opacity: on ? 1 : 0 });
    };
    gsap.set([a, b], { rotationY: 0 });
    const hero = document.querySelector("[data-hero]");
    show(!hero);
    if (!hero) return;

    let tl: gsap.core.Timeline | undefined;
    const flip = (on: boolean, animate: boolean) => {
      tl?.kill();
      const [from, to] = on ? [a, b] : [b, a];
      if (!animate || reduce) return void show(on);
      tl = gsap
        .timeline()
        .to(from, { rotationY: 90, duration: 0.2, ease: "power1.in" })
        .set(from, { opacity: 0 })
        .set(to, { opacity: 1, rotationY: -90 })
        .to(to, { rotationY: 0, duration: 0.25, ease: "power1.out" });
    };

    const st = ScrollTrigger.create({
      trigger: hero,
      start: () => `bottom top+=${100 * unit()}`, // the hero's bottom edge reaches the bottom of the logo
      end: () => ScrollTrigger.maxScroll(window) + 1, // active from there to the end of the page
      onToggle: (self) => flip(self.isActive, true),
    });
    // a reload part-way down the page: start on the right face without a flip
    if (st.isActive) show(true);

    return () => {
      st.kill();
      tl?.kill();
    };
  }, [path]);

  return (
    <span className="relative block" style={{ width: u(WORD.w), height: u(LOGO.h), perspective: 600 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={logo} src="/img/logo.svg" alt="" className="absolute left-0 top-0 block" style={{ width: u(LOGO.w), height: u(LOGO.h), opacity: heroPage ? 1 : 0 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={word}
        src="/img/moonstoone%20wordmark.svg"
        alt=""
        className="absolute left-0 top-0 block"
        style={{ opacity: heroPage ? 0 : 1, width: u(WORD.w), height: u(WORD.h), top: u((LOGO.h - WORD.h) / 2) }}
      />
    </span>
  );
}
