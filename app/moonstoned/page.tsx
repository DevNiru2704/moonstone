import type { Metadata } from "next";
import { AboutCta } from "@/components/about-cta";
import { FolderCarousel } from "@/components/folder-carousel";
import { MoonstonedHeader } from "@/components/moonstoned-header";
import { ServicesList } from "@/components/services-list";
import { u } from "@/lib/lenis";

export const metadata: Metadata = { title: "Moonstone*d | Moonstone" };

// Figma "Moonstoned" (1440 x 4721): header, intro, projects, services, CTA, then the footer from the layout.
export default function Page() {
  return (
    <main className="bg-white text-black">
      <MoonstonedHeader />
      <section className="relative" style={{ height: u(371) }}>
        <p className="absolute" style={{ left: u(53.11), top: u(65.67), width: u(340.449), fontSize: u(24) }}>
          Moonstone*d is the marketing arm of Moonstone Multimedia.
        </p>
        <p className="absolute" style={{ left: u(573), top: u(78), width: u(726.168), fontSize: u(40), lineHeight: 1.14 }}>
          We believe that when a brand connects with sincerity, growth doesn’t need a push - it unfolds with quiet certainty.
        </p>
      </section>
      <FolderCarousel />
      <ServicesList />
      <div className="relative" style={{ height: u(460) }}>
        <AboutCta top={59} />
      </div>
    </main>
  );
}
