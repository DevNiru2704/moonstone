"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { u, unit } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const TEXT = "culture in motion";
// Figma: the photo is masked to a 43x42 pill sitting on the "o" dot of the wordmark.
const DOT = { x: 962.99, y: 503.48, w: 43.2, h: 42.22 };
const FULL = { w: 3400, h: 3400 * (DOT.h / DOT.w) };

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = photo.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const apply = (p: number) => {
      const k = unit();
      const w = DOT.w + (FULL.w - DOT.w) * p;
      const h = DOT.h + (FULL.h - DOT.h) * p;
      const cx = DOT.x + DOT.w / 2 + (720 - (DOT.x + DOT.w / 2)) * p;
      const cy = DOT.y + DOT.h / 2 + (512 - (DOT.y + DOT.h / 2)) * p;
      el.style.maskSize = el.style.webkitMaskSize = `${w * k}px ${h * k}px`;
      el.style.maskPosition = el.style.webkitMaskPosition = `${(cx - w / 2) * k}px ${(cy - h / 2) * k}px`;
    };
    const type = (p: number) => {
      const n = Math.round(TEXT.length * p);
      label.current!.textContent = TEXT.slice(0, n);
      cursor.current!.style.opacity = p > 0 ? "1" : "0";
    };

    if (reduce) {
      apply(1);
      type(1);
      return;
    }

    apply(0);
    type(0);
    const st = ScrollTrigger.create({
      trigger: section.current,
      start: "top top",
      end: "+=120%",
      pin: true,
      scrub: 0.4,
      onUpdate: ({ progress }) => {
        apply(gsap.parseEase("power2.in")(Math.min(progress / 0.7, 1)));
        type(Math.max(0, (progress - 0.7) / 0.3));
      },
    });
    const onResize = () => apply(gsap.parseEase("power2.in")(Math.min(st.progress / 0.7, 1)));
    addEventListener("resize", onResize);
    return () => {
      removeEventListener("resize", onResize);
      st.kill();
    };
  }, []);

  return (
    <section
      ref={section}
      className="relative overflow-hidden bg-white"
      style={{ height: u(1024) }}
    >
      <Image
        src="/img/wordmark.svg"
        alt="moonstone"
        width={1201}
        height={126}
        priority
        unoptimized
        className="absolute max-w-none"
        style={{ left: u(119.31), top: u(449.2), width: u(1201.375), height: u(125.531) }}
      />

      <div
        ref={photo}
        className="absolute inset-0"
        style={{
          maskImage: "url(/img/hero-mask.svg)",
          WebkitMaskImage: "url(/img/hero-mask.svg)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      >
        <Image src="/img/hero.png" alt="" fill priority unoptimized sizes="100vw" className="object-cover" />
      </div>

      <p
        className="absolute flex items-center whitespace-nowrap text-white"
        style={{ left: u(421), top: u(452.5), height: u(119), fontSize: u(80) }}
      >
        <span ref={label} />
        <span
          ref={cursor}
          className="ml-[0.1em] block bg-white opacity-0"
          style={{ width: u(2), height: u(119) }}
        />
      </p>
    </section>
  );
}
