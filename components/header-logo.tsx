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

/**
 * The header mark. On a page with a photo hero (`[data-hero]`) it is the wave logo, fixed at the top left. Just before the hero ends
 * the logo is let go: a copy of it stays in the page at that spot and scrolls away with the hero, while the wordmark slides up into
 * the navbar from below. Scrolling back up reverses it: the wordmark slides out and the logo is fixed in the navbar again.
 */
export function HeaderLogo() {
  const path = usePathname();
  const heroPage = HERO_PATHS.includes(path);
  const root = useRef<HTMLSpanElement>(null);
  const logo = useRef<HTMLImageElement>(null);
  const word = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const a = logo.current!;
    const b = word.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // the navbar auto-hide waits for data-flip="word": the wordmark is showing and the slide has finished
    const mark = (v: string) => (root.current!.dataset.flip = v);
    const hero = document.querySelector("[data-hero]");
    if (!hero) {
      mark("word");
      gsap.set(a, { opacity: 0 });
      gsap.set(b, { opacity: 1, y: 0 });
      return;
    }

    // the logo that stays behind in the page: same size, same blend as the header, placed by the trigger below
    const stay = document.createElement("img");
    stay.src = "/img/logo.svg";
    stay.alt = "";
    stay.style.cssText = "position:absolute;z-index:50;pointer-events:none;mix-blend-mode:difference;opacity:0";
    document.body.appendChild(stay);
    // the header has a 30 design px padding, so the logo is fixed 30 design px from the top left
    const place = (start: number) => {
      const k = unit();
      Object.assign(stay.style, { left: `${30 * k}px`, top: `${start + 30 * k}px`, width: `${LOGO.w * k}px`, height: `${LOGO.h * k}px` });
    };

    const show = (on: boolean) => {
      mark(on ? "word" : "logo");
      gsap.set(a, { opacity: on ? 0 : 1 });
      gsap.set(stay, { opacity: on ? 1 : 0 });
      gsap.set(b, { opacity: on ? 1 : 0, y: 0 });
    };
    show(false);

    let tl: gsap.core.Timeline | undefined;
    const release = (on: boolean) => {
      tl?.kill();
      if (reduce) return void show(on);
      mark("busy");
      const d = (LOGO.h + 10) * unit();
      // the logo hands over to / takes back from its copy in the page without moving: same spot on screen
      gsap.set(a, { opacity: on ? 0 : 1 });
      gsap.set(stay, { opacity: on ? 1 : 0 });
      if (on) gsap.set(b, { opacity: 1, y: d });
      tl = gsap
        .timeline({
          defaults: { duration: 0.3, ease: "power2.out" },
          onComplete: () => {
            if (!on) gsap.set(b, { opacity: 0, y: 0 });
            mark(on ? "word" : "logo");
          },
        })
        .to(b, { y: on ? 0 : d }, 0);
    };

    const st = ScrollTrigger.create({
      trigger: hero,
      start: () => `bottom top+=${140 * unit()}`, // the hero's bottom edge is 40 design px below the logo: the logo stays until just before the hero ends
      end: () => ScrollTrigger.maxScroll(window) + 1, // active from there to the end of the page
      refreshPriority: -1, // measured after the page's own pins (the Home moon lock), which make the page longer
      onToggle: (self) => release(self.isActive),
      // where the page keeps the logo: its fixed spot when the trigger starts
      onRefresh: (self) => place(self.start),
    });
    place(st.start);
    // a reload part-way down the page: start on the right state without a slide
    if (st.isActive) show(true);

    return () => {
      st.kill();
      tl?.kill();
      stay.remove();
    };
  }, [path]);

  return (
    <span ref={root} data-flip={heroPage ? "logo" : "word"} className="relative block overflow-hidden" style={{ width: u(WORD.w), height: u(LOGO.h) }}>
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
