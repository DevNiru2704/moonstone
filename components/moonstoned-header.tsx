"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { u, unit } from "@/lib/lenis";

// Figma "moonstoned-header" + "moonstoned-header-text" (1440 x 1024 stage, centred on the screen).
// 1s after load the red asterisk grows (smart animate "Gentle", 2.555s) until it fills the screen; at 2s "Built by multi hatters." wipes in (1.24s).
const SMALL = { cx: 1032 + 26.04, cy: 451.8 + 24.8, w: 52.0813 }; // the asterisk as it sits in the wordmark
const BIG = { w: 3610.75, h: 3437.92, left: -1085.3, top: -1207 }; // the same vector, big enough to cover the screen (centre at 720, 512)

export function MoonstonedHeader() {
  const star = useRef<HTMLImageElement>(null);
  const wipe = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const k = unit();
    gsap.set(wipe.current, { width: 0 });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(star.current, { scale: 1, x: 0, y: 0 });
      gsap.set(wipe.current, { width: "100%" });
      return;
    }
    const tl = gsap
      .timeline()
      .fromTo(
        star.current,
        { scale: SMALL.w / BIG.w, x: (SMALL.cx - 720) * k, y: (SMALL.cy - 512) * k },
        { scale: 1, x: 0, y: 0, duration: 2.555, ease: "power2.inOut", immediateRender: true },
        1,
      )
      .to(wipe.current, { width: "100%", duration: 1.24, ease: "power2.out" }, 2);
    return () => void tl.kill();
  }, []);

  return (
    <section className="relative h-svh overflow-hidden bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/events/hero.gif" alt="" className="absolute inset-0 size-full max-w-none object-cover" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2" style={{ width: u(1440), height: u(1024) }}>
        <h1 className="sr-only">Moonstone*d</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/moonstoned/wordmark.svg" alt="" className="absolute mix-blend-difference" style={{ left: u(299.95), top: u(494.3), width: u(745.702), height: u(77.9179) }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/moonstoned/d.svg" alt="" className="absolute mix-blend-difference" style={{ left: u(1068.8), top: u(481.3), width: u(71.2892), height: u(87.7777) }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={star}
          src="/img/moonstoned/asterisk-big.svg"
          alt=""
          className="absolute max-w-none will-change-transform"
          style={{ left: u(BIG.left), top: u(BIG.top), width: u(BIG.w), height: u(BIG.h) }}
        />
        <div className="absolute overflow-hidden" style={{ left: u(410), top: u(472), width: u(621), height: u(80) }}>
          <div ref={wipe} className="absolute left-0 overflow-hidden bg-white text-black" style={{ top: u(0.5), height: u(79.487) }}>
            <p className="absolute whitespace-nowrap" style={{ left: u(16.08), top: "50%", transform: "translateY(-50%)", fontSize: u(60), lineHeight: 1 }}>
              Built by <em className="text-crimson">multi hatters.</em>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
