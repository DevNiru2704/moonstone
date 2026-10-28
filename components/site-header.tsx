import Link from "next/link";
import { u } from "@/lib/lenis";

/* Fixed chrome from Figma "Frame 15" and "let's-work-together". */
export function SiteHeader() {
  return (
    <>
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
        <button
          type="button"
          aria-label="Menu"
          className="pointer-events-auto flex cursor-pointer flex-col items-center justify-center bg-white/10"
          style={{ width: u(40), height: u(40), borderRadius: u(20), gap: u(2) }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block bg-[#d9d9d9]"
              style={{ width: u(3), height: u(3), borderRadius: u(2) }}
            />
          ))}
        </button>
      </header>

      <a
        href="#contact"
        className="fixed z-50 flex items-center justify-center bg-white/10 text-white mix-blend-difference backdrop-blur-md border border-white/30"
        style={{
          left: u(50),
          bottom: u(50),
          width: u(225),
          height: u(59),
          borderRadius: u(30),
          padding: u(20),
          fontSize: u(16),
        }}
      >
        <span className="whitespace-nowrap">LET’S WORK TOGETHER</span>
      </a>
    </>
  );
}
