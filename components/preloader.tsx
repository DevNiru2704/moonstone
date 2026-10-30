"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { getLenis, markReady, u, unit } from "@/lib/lenis";

const STEP = 147; // Figma digit line-height
const DIGITS = Array.from({ length: 101 }, (_, i) =>
  String(i).padStart(2, "0"),
);

// Positions are anchored to the viewport bottom (Figma "Loading" frame is 1440x1024),
// so the bar stays visible on shorter screens.
export function Preloader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const reel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.current!.id = ""; // releases the html scroll lock
      root.current!.style.display = "none";
      getLenis()?.start();
      markReady();
      return;
    }

    const n = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setDone(true);
        getLenis()?.start();
        markReady();
      },
    });
    tl.to(n, {
      v: 100,
      duration: 2.6,
      ease: "power2.inOut",
      onUpdate: () => {
        bar.current!.style.width = `${n.v}%`;
        reel.current!.style.transform = `translateY(${-Math.round(n.v) * STEP * unit()}px)`;
      },
    }).to(
      root.current,
      { yPercent: -100, duration: 0.9, ease: "power3.inOut" },
      "+=0.25",
    );

    return () => {
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div
      id="preloader"
      ref={root}
      className="fixed inset-0 z-[100] overflow-hidden bg-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/logo-loading.svg"
        alt="Moonstone"
        className="absolute mix-blend-difference"
        style={{ left: u(30), top: u(30), width: u(98.33), height: u(70) }}
      />
      <div
        className="absolute"
        style={{
          left: u(35.71),
          bottom: u(34),
          width: u(1369.29),
          height: u(113.92),
        }}
      >
        <div ref={bar} className="h-full w-0 bg-black" />
      </div>
      <div
        className="absolute overflow-hidden font-sans text-white"
        style={{ left: u(55), bottom: u(38), width: u(270), height: u(110) }}
        aria-hidden
      >
        <div
          ref={reel}
          className="will-change-transform"
          style={{
            marginTop: u(-18), // window is taller than the glyphs so they are never cut
            fontSize: u(100),
            lineHeight: u(STEP),
            letterSpacing: u(-2),
          }}
        >
          {DIGITS.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
