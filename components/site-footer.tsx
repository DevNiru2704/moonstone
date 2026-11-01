"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { SOCIAL } from "@/lib/links";
import { u } from "@/lib/lenis";

// [label, x, y, right-aligned?]; positions and labels from Figma "Footer" (1440x556) and the prototype.
const LINKS: [string, number, number, boolean][] = [
  ["Privacy Policy", 60, 303.5, false],
  ["Terms of Services", 60, 334.5, false],
  ["FAQ", 60, 365.5, false],
  ["Instagram", 319.9, 303.5, false],
  ["Youtube", 319.9, 334.5, false],
  ["Linkedin", 319.9, 365.5, false],
  ["ABOUT", 1410, 272.3, true],
  ["HOW WE WORK", 1410, 303.3, true],
  ["SERVICES", 1410, 334.3, true],
  ["CONTACT", 1410, 365.3, true],
];

// [sigma, opaque until %, transparent from %] of the wordmark image height; sigma s sits s/25 * 208px below the group top
const BLUR_LEVELS = [
  [25, 0, 0],
  [18, 77.6, 100],
  [13, 61.3, 77.6],
  [8, 45, 61.3],
  [3, 29.1, 45],
] as const;

const COLS = 14;
const ROWS = 6;

export function SiteFooter() {
  const [wink, setWink] = useState(false);
  const grid = useRef<HTMLDivElement>(null);
  const lit = useRef<Element | null>(null);

  // One handler on the footer, so squares light up even under the links and mascot.
  const light = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const size = r.width / COLS;
    const row = Math.floor((e.clientY - r.top) / size);
    const col = Math.floor((e.clientX - r.left) / size);
    const next =
      row >= 0 && row < ROWS && col >= 0 && col < COLS
        ? grid.current!.children[row * COLS + col]
        : null;
    if (next === lit.current) return;
    lit.current?.removeAttribute("data-lit");
    next?.setAttribute("data-lit", "");
    lit.current = next;
  };
  const unlight = () => {
    lit.current?.removeAttribute("data-lit");
    lit.current = null;
  };

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-ink text-white"
      style={{ height: u(556) }}
      onPointerMove={light}
      onPointerLeave={unlight}
    >
      {/* 14 x 6 squares; the square under the pointer lights up and fades out slowly */}
      <div
        ref={grid}
        className="absolute inset-x-0 top-0 grid grid-cols-14"
        aria-hidden
      >
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <div
            key={i}
            className="aspect-square border-[0.5px] border-[#161616] bg-ink transition-colors duration-[1200ms] data-[lit]:bg-white/20 data-[lit]:duration-75"
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute"
        style={{
          left: u(-27.81),
          top: 0,
          width: u(1495.62),
          height: u(157.77),
        }}
      >
        {/* Figma bleeds the blurred wordmark past its frame (-31.69% / -3.34%) */}
        <div className="absolute" style={{ inset: "-31.69% -3.34%", opacity: 0.35 }}>
          {/* Figma: progressive layer blur, radius 0 at the top growing to 50 (sigma 25) 208px down. Built from
              five blur levels stacked sharpest-on-top; each fades out between its own depth and the next. */}
          {/* lower half: an extra, much blurrier layer fades in over the stack so the letters turn soft and translucent */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/footer-wordmark-b40.svg?v=11"
            alt=""
            className="absolute inset-0 block size-full max-w-none"
            style={{
              zIndex: 1,
              maskImage: "linear-gradient(to bottom, transparent 30%, #000 62%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 30%, #000 62%)",
              opacity: 0.9,
            }}
          />
          {BLUR_LEVELS.map(([sigma, from, to]) => {
            const mask = to && `linear-gradient(to bottom, #000 ${from}%, transparent ${to}%)`;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={sigma}
                src={`/img/footer-wordmark-b${sigma}.svg?v=11`}
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
              />
            );
          })}
        </div>
      </div>

      <div
        className="absolute"
        onPointerEnter={() => setWink(true)}
        onPointerLeave={() => setWink(false)}
        style={{
          left: u(579.85),
          top: u(142.86),
          width: u(450.4),
          height: u(506.81),
        }}
      >
        <Image
          src="/img/mascot.svg"
          alt=""
          width={450}
          height={507}
          unoptimized
          className="absolute inset-0 size-full max-w-none"
        />
        <Image
          src="/img/mascot-wink.svg"
          alt=""
          width={450}
          height={507}
          unoptimized
          className="absolute inset-0 size-full max-w-none"
          style={{ opacity: wink ? 1 : 0 }}
        />
      </div>

      {LINKS.map(([label, x, y, right]) => (
        <a
          key={label}
          href={SOCIAL[label] ?? "#"}
          {...(SOCIAL[label] && { target: "_blank", rel: "noopener noreferrer" })}
          className="absolute whitespace-nowrap transition-colors duration-200 hover:text-crimson"
          style={
            {
              top: u(y),
              ...(right ? { right: u(1440 - x) } : { left: u(x) }),
              fontSize: u(16),
              textBox: "trim-both cap alphabetic",
            } as React.CSSProperties
          }
        >
          {label}
        </a>
      ))}

      <p
        className="pointer-events-none absolute whitespace-nowrap text-right mix-blend-difference"
        style={{ right: u(30), top: u(516), fontSize: u(8) }}
      >
        ©2026MoonstoneMultimediaLLP. All rights reserved
      </p>
    </footer>
  );
}
