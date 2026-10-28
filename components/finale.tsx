"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { u } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

/** "Let's build something." grey-box wipe over a white sky, then the black mountain ground. */
export function Finale() {
  const root = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.set(box.current, { clipPath: "inset(0 100% 0 0)" });
    const tween = gsap.to(box.current, {
      clipPath: "inset(0 0% 0 0)",
      duration: 1,
      ease: "power3.inOut",
      scrollTrigger: { trigger: root.current, start: "top 65%" },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-white"
      style={{ height: u(995) }}
    >
      {/* 1024x681 comp: white sky above a black ground with the mountain at y=361 */}
      <Image
        src="/img/hills-2.png"
        alt=""
        width={1024}
        height={681}
        className="absolute left-0 max-w-none"
        style={{ top: u(37), width: u(1440), height: u(957.6) }}
      />
      <div
        ref={box}
        className="absolute flex items-center justify-center bg-[#eee] text-black"
        style={{
          left: u(60),
          top: u(80),
          width: u(1320),
          height: u(342),
          fontSize: u(80),
        }}
      >
        <p className="whitespace-nowrap">
          Let’s <em className="font-medium text-crimson">build</em> something.
        </p>
      </div>
    </section>
  );
}
