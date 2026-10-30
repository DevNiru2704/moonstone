import Link from "next/link";
import { GlassFilters } from "@/components/glass-filters";
import { u } from "@/lib/lenis";

// Liquid-glass look: the backdrop is magnified by the lens filter, no outline.
const glass =
  "fixed z-50 flex items-center justify-center text-white mix-blend-difference";

/* Fixed chrome from Figma "Frame 15" and "let's-work-together". */
export function SiteHeader() {
  return (
    <>
      <GlassFilters />
      <header
        className="fixed inset-x-0 top-0 z-50 flex items-start justify-between pointer-events-none mix-blend-difference"
        style={{ padding: u(30) }}
      >
        <Link href="/" aria-label="Moonstone home" className="pointer-events-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/logo.svg"
            alt=""
            className="block"
            style={{ width: u(98.33), height: u(70) }}
          />
        </Link>
      </header>

      <button
        type="button"
        aria-label="Menu"
        className={`${glass} cursor-pointer flex-col`}
        style={{
          top: u(30),
          right: u(30),
          width: u(40),
          height: u(40),
          borderRadius: u(20),
          gap: u(2),
          backdropFilter: "blur(2px) url(#lens-dot)",
          WebkitBackdropFilter: "blur(2px) url(#lens-dot)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block bg-[#d9d9d9]"
            style={{ width: u(3), height: u(3), borderRadius: u(2) }}
          />
        ))}
      </button>

      <a
        href="#contact"
        className={glass}
        style={{
          left: u(50),
          bottom: u(50),
          width: u(225),
          height: u(59),
          borderRadius: u(30),
          padding: u(20),
          fontSize: u(16),
          backdropFilter: "blur(2px) url(#lens-pill)",
          WebkitBackdropFilter: "blur(2px) url(#lens-pill)",
        }}
      >
        <span className="whitespace-nowrap">LET’S WORK TOGETHER</span>
      </a>
    </>
  );
}
