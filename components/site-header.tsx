import Link from "next/link";
import { ChromeBehavior } from "@/components/chrome-behavior";
import { GLASS, GlassFilters } from "@/components/glass-filters";
import { HeaderLogo } from "@/components/header-logo";
import { SiteMenu } from "@/components/site-menu";
import { u } from "@/lib/lenis";

/* Fixed chrome from Figma "Frame 15" and "let's-work-together". */
export function SiteHeader() {
  return (
    <>
      <GlassFilters />
      <ChromeBehavior />
      <header
        data-nav
        className="fixed inset-x-0 top-0 z-50 flex items-start justify-between pointer-events-none mix-blend-difference"
        style={{ padding: u(30) }}
      >
        <Link href="/" aria-label="Moonstone home" className="pointer-events-auto">
          <HeaderLogo />
        </Link>
      </header>

      <SiteMenu />

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
    </>
  );
}
