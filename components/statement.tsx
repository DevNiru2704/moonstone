"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { u } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  ["25+ Artists Collaborated With", 0],
  ["50+ Projects Delivered", 416],
  ["15+ Brands Worked With", 759],
  ["10+ Live Experiences Produced", 1128],
] as const;
const PERIOD = 1569; // Figma: second set starts at x=1569

export function Statement() {
  const root = useRef<HTMLElement>(null);
  const text = useRef<HTMLDivElement>(null);
  const waves = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      // Statement: black wipe with a crimson leading edge, left -> right.
      gsap.fromTo(
        text.current,
        { "--p": 0 },
        {
          "--p": 110,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 60%", end: "top 5%", scrub: 0.5 },
        },
      );
      // Waves draw in from the left.
      gsap.fromTo(
        waves.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top 40%", end: "top -30%", scrub: 0.5 },
        },
      );
      gsap.to(track.current, {
        x: () => -PERIOD * (innerWidth / 1440),
        duration: 24,
        ease: "none",
        repeat: -1,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-white"
      style={{ height: u(1024), fontSize: u(24) }}
    >
      <p
        className="absolute"
        style={{ left: u(53.11), top: u(107.97), width: u(340.45) }}
      >
        An independent creative company shaping music, culture and ideas into work that moves
        people.
      </p>

      <div
        ref={text}
        className="absolute"
        style={
          {
            left: u(603.98),
            top: u(97.97),
            width: u(806.02),
            fontSize: u(60),
            "--p": 0,
            color: "transparent",
            backgroundImage:
              "linear-gradient(90deg, #000 calc(var(--p) * 1%), #b31e32 calc(var(--p) * 1% + 4%), #fff calc(var(--p) * 1% + 4.3%))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          } as React.CSSProperties
        }
      >
        <p>We don’t follow a formula.</p>
        <p>We build music, shape identities, and create work that moves culture forward.</p>
      </div>

      <div
        ref={waves}
        className="absolute"
        style={{ left: u(-14.5), top: u(469.71), width: u(1469), height: u(258.96) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/waves.svg" alt="" className="block size-full max-w-none" />
      </div>

      <div
        className="absolute overflow-hidden"
        style={{ left: u(-14.5), top: u(946.03), width: "100vw", height: u(29) }}
      >
        <div ref={track} className="relative h-full will-change-transform" style={{ width: u(PERIOD * 3) }}>
          {[0, 1, 2].flatMap((rep) =>
            STATS.map(([label, x]) => (
              <span
                key={`${rep}-${x}`}
                className="absolute top-0 whitespace-nowrap"
                style={{ left: u(x + rep * PERIOD) }}
              >
                {label}
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
