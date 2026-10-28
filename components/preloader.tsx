"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getLenis, u } from "@/lib/lenis";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.display = "none";
      return;
    }

    const n = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        el.style.display = "none";
        getLenis()?.start();
      },
    });
    tl.to(n, {
      v: 100,
      duration: 2.4,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.round(n.v);
        count.current!.textContent = String(v).padStart(2, "0");
        bar.current!.style.width = `${n.v}%`;
      },
    }).to(el, { yPercent: -100, duration: 0.9, ease: "power3.inOut" }, "+=0.25");

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden
      className="fixed inset-0 z-[100] overflow-hidden bg-white"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/logo-loading.svg"
        alt=""
        className="absolute mix-blend-difference"
        style={{ left: u(30), top: u(30), width: u(98.33), height: u(70) }}
      />
      <div
        className="absolute"
        style={{ left: u(35.71), top: u(876), width: u(1369.29), height: u(113.92) }}
      >
        <div ref={bar} className="h-full w-0 bg-black" />
      </div>
      <div
        className="absolute overflow-hidden"
        style={{ left: u(55), top: u(895.96), width: u(270), height: u(74) }}
      >
        <span
          ref={count}
          className="block text-white"
          style={{
            marginTop: u(-38),
            fontSize: u(100),
            lineHeight: u(147),
            letterSpacing: u(-2),
          }}
        >
          00
        </span>
      </div>
    </div>
  );
}
