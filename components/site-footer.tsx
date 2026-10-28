import Image from "next/image";
import { u } from "@/lib/lenis";

// [label, x, y, right-aligned?]; positions from Figma "Footer" (1440x556).
// Labels marked TODO could not be read from Figma (MCP rate limit) and are guesses from text widths.
const LINKS: [string, number, number, boolean][] = [
  ["Privacy Policy", 60, 303.5, false],
  ["Terms & Conditions", 60, 334.5, false], // TODO confirm
  ["FAQ", 60, 365.5, false], // TODO confirm
  ["Instagram", 319.9, 303.5, false],
  ["Youtube", 319.9, 334.5, false],
  ["LinkedIn", 319.9, 365.5, false], // TODO confirm
  ["WORK", 1410, 272.3, true], // TODO confirm
  ["HOW WE WORK", 1410, 303.3, true],
  ["SERVICES", 1410, 334.3, true], // TODO confirm
  ["CONTACT", 1410, 365.3, true], // TODO confirm
];

export function SiteFooter() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-ink text-white"
      style={{ height: u(556) }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-grid) 1px, transparent 1px), linear-gradient(90deg, var(--color-grid) 1px, transparent 1px)",
          backgroundSize: `${u(102.857)} ${u(102.857)}`,
        }}
      />

      <div className="absolute" style={{ left: u(-27.81), top: 0, width: u(1495.62), height: u(157.77) }}>
        {/* Figma bleeds the blurred wordmark past its frame (-31.69% / -3.34%) */}
        <div className="absolute" style={{ inset: "-31.69% -3.34%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/footer-wordmark.svg" alt="" className="block size-full max-w-none" />
        </div>
      </div>

      <Image
        src="/img/mascot.svg"
        alt=""
        width={450}
        height={507}
        unoptimized
        className="absolute max-w-none"
        style={{ left: u(579.85), top: u(142.86), width: u(450.4), height: u(506.81) }}
      />

      {LINKS.map(([label, x, y, right]) => (
        <a
          key={label}
          href="#"
          className="absolute whitespace-nowrap"
          style={{
            top: u(y),
            ...(right ? { right: u(1440 - x) } : { left: u(x) }),
            fontSize: u(16),
            textBox: "trim-both cap alphabetic",
          } as React.CSSProperties}
        >
          {label}
        </a>
      ))}

      <p
        className="absolute text-right whitespace-nowrap mix-blend-difference"
        style={{ right: u(30), top: u(516), fontSize: u(8) }}
      >
        ©2026MoonstoneMultimediaLLP. All rights reserved
      </p>
    </footer>
  );
}
