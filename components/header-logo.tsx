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

/** The header mark: the logo, which is pushed out through the top by the wordmark sliding up once the page's hero (`[data-hero]`) is about to end. */
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
    const show = (on: boolean) => {
      mark(on ? "word" : "logo");
      gsap.set(a, { opacity: on ? 0 : 1, y: 0 });
      gsap.set(b, { opacity: on ? 1 : 0, y: 0 });
    };
    const hero = document.querySelector("[data-hero]");
    show(!hero);
    if (!hero) return;

    let tl: gsap.core.Timeline | undefined;
    const flip = (on: boolean, animate: boolean) => {
      tl?.kill();
      const [from, to] = on ? [a, b] : [b, a];
      if (!animate || reduce) return void show(on);
      mark("busy");
      // a push: the new image comes up from below while the old one leaves through the top (reversed when going back up)
      const d = (LOGO.h + 10) * unit();
      const dir = on ? 1 : -1;
      gsap.set(to, { opacity: 1, y: dir * d });
      tl = gsap
        .timeline({
          defaults: { duration: 0.3, ease: "power2.out" },
          onComplete: () => {
            gsap.set(from, { opacity: 0, y: 0 });
            mark(on ? "word" : "logo");
          },
        })
        .to(from, { y: -dir * d }, 0)
        .to(to, { y: 0 }, 0);
    };

    const st = ScrollTrigger.create({
      trigger: hero,
      start: () => `bottom top+=${140 * unit()}`, // the hero's bottom edge is 40 design px below the logo: the logo stays until just before the hero ends
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
