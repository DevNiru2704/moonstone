"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { FOLDERS } from "@/lib/moonstoned";
import { u } from "@/lib/lenis";

// Figma "projects": four folders; the arrow slides them 813.65 left (smart animate "Slow", 2.08s) and flips; hovering a folder turns it crimson and lifts the photo (1.25s).
const SLIDE = 813.65;
const mix = (a: number, b: number) => `calc(var(--u) * (${a} + ${b - a} * var(--p)))`;

function Folder({ x }: { x: number }) {
  const el = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  useEffect(() => () => void tween.current?.kill(), []);
  const to = (p: number) => {
    tween.current?.kill();
    tween.current = gsap.to(el.current, { "--p": p, duration: 1.25, ease: "power2.inOut" });
  };
  return (
    <div
      ref={el}
      className="absolute top-0 overflow-hidden"
      style={{ "--p": 0, left: u(x), width: u(560), height: u(491) } as React.CSSProperties}
      onPointerEnter={() => to(1)}
      onPointerLeave={() => to(0)}
    >
      <div className="absolute" style={{ left: u(45.21), top: u(48.82), width: u(469.573), height: u(393.367) }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/moonstoned/folder-grey.svg" alt="" className="absolute inset-0 size-full max-w-none" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/moonstoned/folder-red.svg" alt="" className="absolute inset-0 size-full max-w-none" style={{ opacity: "var(--p)" }} />
      </div>
      <div className="absolute overflow-hidden" style={{ left: u(52.3), top: mix(98.36, 17.95), width: u(454.173), height: mix(318.5, 398.9), borderRadius: u(30) }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/moonstoned/folder-photo.jpg"
          alt=""
          className="absolute max-w-none"
          style={{ left: mix(-12.26, -174.44), top: mix(0, -126.6), width: mix(478.74, 803.1), height: mix(318.5, 534.3) }}
        />
      </div>
      <div
        className="glass-rim absolute overflow-hidden"
        style={{ left: u(45.21), top: mix(115.2, 154.67), width: u(468.338), height: mix(327, 287.5), borderRadius: u(35), backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(90,90,90,0.2)", opacity: "calc(1 - var(--p))" }} />
        <div className="absolute inset-0" style={{ background: "rgba(179,30,50,0.2)", opacity: "var(--p)" }} />
      </div>
    </div>
  );
}

export function FolderCarousel() {
  const track = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLElement>(null);
  const open = useRef(false);
  const tween = useRef<gsap.core.Tween | null>(null);
  useEffect(() => () => void tween.current?.kill(), []);

  const toggle = () => {
    open.current = !open.current;
    const s = open.current ? 1 : 0;
    tween.current?.kill();
    tween.current = gsap.to(root.current, { "--s": s, duration: 2.083, ease: "power2.inOut" });
  };

  return (
    <section ref={root} className="relative overflow-hidden bg-white" style={{ height: u(491), "--s": 0 } as React.CSSProperties} aria-label="Projects">
      <div ref={track} className="absolute inset-0" style={{ transform: `translateX(calc(var(--u) * ${-SLIDE} * var(--s)))` }}>
        {FOLDERS.map((x) => (
          <Folder key={x} x={x} />
        ))}
      </div>
      <button
        type="button"
        onClick={toggle}
        aria-label="Show more projects"
        className="absolute cursor-pointer"
        style={{ left: u(1335.66), top: u(245.5), width: u(60.316), height: u(60.316) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/moonstoned/arrow-right.svg" alt="" className="absolute inset-0 size-full" style={{ opacity: "calc(1 - var(--s))" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/moonstoned/arrow-left.svg" alt="" className="absolute inset-0 size-full" style={{ opacity: "var(--s)" }} />
      </button>
    </section>
  );
}
