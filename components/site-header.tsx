import Link from "next/link";
import { ChromeBehavior } from "@/components/chrome-behavior";
import { GlassFilters } from "@/components/glass-filters";
import { HeaderLogo } from "@/components/header-logo";
import { SiteMenu } from "@/components/site-menu";
import { WorkPill } from "@/components/work-pill";
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

      <WorkPill />
    </>
  );
}
