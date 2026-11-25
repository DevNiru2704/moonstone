"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GLASS } from "@/components/glass-filters";
import { u } from "@/lib/lenis";

/** Figma "let's-work-together": the fixed pill. Not shown on /contact, where it would point at the page you are on. */
export function WorkPill() {
  if (usePathname() === "/contact") return null;
  return (
    <Link
      href="/contact"
      data-pill
      className={`${GLASS} transition-colors duration-300 ease-linear hover:bg-black/10`}
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
    </Link>
  );
}
