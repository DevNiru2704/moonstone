"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

const WINK_EVERY = 2400;
const WINK_FOR = 450;

export function SiteFooter() {
  const [wink, setWink] = useState(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let off: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setWink(true);
      off = setTimeout(() => setWink(false), WINK_FOR);
    }, WINK_EVERY);
    return () => {
      clearInterval(id);
      clearTimeout(off);
    };
  }, []);

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-ink text-white"
      style={{ height: u(556) }}
    >
      {/* 14 x 6 squares; a hovered square lights up and fades out slowly */}
      <div className="absolute inset-x-0 top-0 grid grid-cols-14" aria-hidden>
        {Array.from({ length: 14 * 6 }, (_, i) => (
          <div
            key={i}
            className="aspect-square border-[0.5px] border-grid bg-ink transition-colors duration-[1200ms] hover:bg-white/20 hover:duration-75"
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
        <div className="absolute" style={{ inset: "-31.69% -3.34%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/footer-wordmark.svg"
            alt=""
            className="block size-full max-w-none"
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute"
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
          href="#"
          className="absolute whitespace-nowrap"
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
