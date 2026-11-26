"use client";

import { LoopVideo } from "@/components/loop-video";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { u, unit } from "@/lib/lenis";

// Figma "Frame 19" (1024 high in the design, here the height of the screen, with the text kept at the bottom): the photo, the caption and EVENTS. The letters drop into a clipped box from above (smart animate, 1.02s), all landing together.
const LETTERS: [string, number, number][] = [["E", 0, 223], ["V", 222.68, 217], ["E", 439.68, 223], ["N", 661.68, 270], ["T", 931.68, 195], ["S", 1126.68, 253]];
const TOP = 12.5; // resting top inside the box

export function EventsHero() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const letters = gsap.utils.toArray<HTMLElement>("[data-letter]", box.current);
    // Helvetica Bold is narrower than the extended face in Figma: stretch each letter to the width it has there
    letters.forEach((l, i) => gsap.set(l, { scaleX: LETTERS[i][2] / (l.offsetWidth / unit()), transformOrigin: "0 0" }));
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      letters,
      { y: (i) => (-212 * (i + 1) - TOP) * unit() },
      { y: 0, duration: 1.022, delay: 0.001, ease: "power2.inOut", immediateRender: true },
    );
    return () => void tween.kill();
  }, []);

  return (
    <section data-hero className="relative overflow-hidden bg-ink text-white" style={{ height: "100svh" }}>
      <LoopVideo name="hero" priority className="absolute inset-0 size-full max-w-none object-cover" />
      <h1 className="sr-only">Events & IP</h1>
      <p className="absolute whitespace-nowrap" style={{ left: u(53.57), bottom: u(288.33), fontSize: u(24), lineHeight: u(40) }}>
        Where creative concepts turn into cultural experiences.
      </p>
      <div
        ref={box}
        aria-hidden
        className="absolute overflow-hidden whitespace-nowrap font-bold"
        style={{ left: u(30.5), bottom: u(37.57), width: u(1379), height: u(237), fontSize: u(293.557) }}
      >
        {LETTERS.map(([l, x], i) => (
          <span
            key={i}
            data-letter
            className="absolute mix-blend-difference"
            style={{ left: u(x), top: u(TOP), textBox: "trim-both cap alphabetic" } as React.CSSProperties}
          >
            {l}
          </span>
        ))}
      </div>
    </section>
  );
}
