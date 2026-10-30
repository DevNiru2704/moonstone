"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { onReady, u, unit } from "@/lib/lenis";

// Figma: the photo is masked to a 43x42 pill sitting on the "o" dot of the wordmark.
const DOT = { x: 962.99, y: 503.48, w: 43.2, h: 42.22 };
const FULL = { w: 3400, h: 3400 * (DOT.h / DOT.w) };

// Left-to-right reveal that overshoots to the right, springs back, then settles.
const reveal = (el: HTMLElement) =>
  gsap
    .timeline()
    .to(el, { width: "112%", duration: 0.6, ease: "power2.out" })
    .to(el, { width: "97%", duration: 0.3, ease: "sine.inOut" })
    .to(el, { width: "100%", duration: 0.3, ease: "sine.out" });

export function Hero() {
  const photo = useRef<HTMLDivElement>(null);
  const box1 = useRef<HTMLDivElement>(null);
  const box2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = photo.current!;
    const first = box1.current!;
    const label = box2.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const state = { p: 0 };

    const apply = () => {
      const k = unit();
      const p = state.p;
      const w = DOT.w + (FULL.w - DOT.w) * p;
      const h = DOT.h + (FULL.h - DOT.h) * p;
      // design coords are relative to a 1024-high stage centred in the viewport
      const dy = (el.clientHeight - 1024 * k) / 2 / k;
      const cx = DOT.x + DOT.w / 2 + (720 - (DOT.x + DOT.w / 2)) * p;
      const cy = DOT.y + DOT.h / 2 + (512 - (DOT.y + DOT.h / 2)) * p + dy;
      el.style.maskSize = el.style.webkitMaskSize = `${w * k}px ${h * k}px`;
      el.style.maskPosition = el.style.webkitMaskPosition = `${(cx - w / 2) * k}px ${(cy - h / 2) * k}px`;
    };

    apply();
    gsap.set([first, label], { width: 0 });
    addEventListener("resize", apply);

    let tl: gsap.core.Timeline | undefined;
    const off = onReady(() => {
      if (reduce) {
        state.p = 1;
        apply();
        gsap.set(label, { width: "100%" });
        return;
      }
      tl = gsap
        .timeline({ delay: 0.4 })
        .to(state, { p: 1, duration: 1.4, ease: "power2.in", onUpdate: apply })
        .add(reveal(first), "+=0.1")
        .to(first, { clipPath: "inset(0 0 0 100%)", duration: 0.25, ease: "power2.in" }, "+=1.6")
        .add(reveal(label), "+=0.25");
    });

    return () => {
      off();
      tl?.kill();
      removeEventListener("resize", apply);
    };
  }, []);

  return (
    <section className="relative h-svh overflow-hidden bg-white">
      <div className="absolute left-0 top-1/2 -translate-y-1/2" style={{ width: u(1440), height: u(1024) }}>
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
      </div>

      {/* hero.png is an animated PNG: the photo slideshow */}
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

      <div className="absolute left-0 top-1/2 -translate-y-1/2" style={{ width: u(1440), height: u(1024) }}>
        {(
          [
            [box1, "culture in motion"],
            [box2, "ideas in action"],
          ] as const
        ).map(([ref, text]) => (
          <div
            key={text}
            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
            style={{ top: u(452.5), height: u(119), padding: `0 ${u(20)}`, fontSize: u(80) }}
          >
            <span className="invisible flex h-full items-center">{text}</span>
            <div
              ref={ref}
              className="absolute left-0 top-0 flex h-full items-center overflow-hidden bg-white text-black"
            >
              <span style={{ marginLeft: u(20) }}>{text}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
