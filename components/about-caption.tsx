"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { bounceReveal } from "@/lib/reveal";
import { u } from "@/lib/lenis";

const PHRASES = ["Built on music.", "Driven by culture.", "Open to possibility."];

/** Figma "about-header-text": a white box wipes open over the photo with one phrase, wipes shut, and the next follows, forever. */
export function AboutCaption() {
  const boxes = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const els = boxes.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(els[0], { width: "100%" });
      return;
    }
    gsap.set(els, { width: 0 });
    const tl = gsap.timeline({ repeat: -1, delay: 0.5 });
    els.forEach((el) => {
      tl.add(bounceReveal(el))
        .to(el, { width: 0, duration: 0.5, ease: "power2.in" }, "+=1.6")
        .to({}, { duration: 0.2 });
    });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    // the 541px container is centred; every phrase box starts at its left edge, as in Figma
    <div className="absolute" style={{ left: u(449.5), top: u(472), width: u(541), height: u(80) }}>
      {PHRASES.map((text, i) => (
        <div key={text} className="absolute left-0 top-0 inline-block" style={{ height: u(79.5) }}>
          <span className="invisible block whitespace-nowrap" style={{ padding: `0 ${u(13.5)}`, fontSize: u(60) }}>
            {text}
          </span>
          <div
            ref={(el) => {
              if (el) boxes.current[i] = el;
            }}
            className="absolute left-0 top-0 flex h-full items-center overflow-hidden whitespace-nowrap bg-white text-black"
            style={{ width: 0, fontSize: u(60) }}
          >
            <span
              style={{ marginLeft: u(13.5), textBox: "trim-both cap alphabetic" } as React.CSSProperties}
            >
              {text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
