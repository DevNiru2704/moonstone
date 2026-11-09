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
  const track = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      text.current!.style.setProperty("--p", "100%");
      return;
    }
    // text starts white and is filled black left to right once it scrolls into view
    const fill = gsap.fromTo(
      text.current,
      { "--p": "0%" },
      {
        "--p": "100%",
        duration: 1.6,
        ease: "power2.inOut",
        scrollTrigger: { trigger: text.current, start: "top 70%", once: true },
      },
    );
    const tween = gsap.to(track.current, {
      x: () => -PERIOD * (innerWidth / 1440),
      duration: 24,
      ease: "none",
      repeat: -1,
    });
    return () => {
      fill.scrollTrigger?.kill();
      fill.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-white"
      style={{ height: u(1024), fontSize: u(24) }}
    >
      <p
        className="absolute"
        style={{ left: u(53.11), top: u(107.97), width: u(340.45) }}
      >
        Our ambition is to build a creative institution where music and cinema
        grow together, each informing and enriching the other.
      </p>

      <div
        ref={text}
        className="absolute bg-clip-text text-transparent"
        style={{
          left: u(603.98),
          top: u(97.97),
          width: u(806.02),
          fontSize: u(44), // the longer text needs a smaller size to stay above the waves
          backgroundImage: "linear-gradient(90deg, #000 var(--p), #fff var(--p))",
          filter: "drop-shadow(1px 1px 0 rgba(0,0,0,.5)) drop-shadow(-1px -1px 0 rgba(0,0,0,.12))",
        }}
      >
        <p>
          Through original music, independent live experiences, audiovisual
          storytelling, and interdisciplinary collaborations, we’re building a
          platform where these sounds can meet, evolve, and travel beyond their
          geographical origins.
        </p>
      </div>

      <div
        className="absolute"
        style={{
          left: u(-14.5),
          top: u(469.71),
          width: u(1469),
          height: u(258.96),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/waves.svg"
          alt=""
          className="block size-full max-w-none"
        />
      </div>

      <div
        className="absolute overflow-hidden"
        style={{
          left: u(-14.5),
          top: u(946.03),
          width: "100vw",
          height: u(29),
        }}
      >
        <div
          ref={track}
          className="relative h-full will-change-transform"
          style={{ width: u(PERIOD * 3) }}
        >
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
