import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { page, pageGraph, pageMetadata } from "@/lib/seo";
import { AboutCta } from "@/components/about-cta";
import { HowProgress } from "@/components/how-progress";
import { OrbitStage } from "@/components/orbit-stage";
import { ctaEnd } from "@/lib/cta";
import { dusk } from "@/lib/dusk";
import { u } from "@/lib/lenis";
import { ORBIT_OFF, ORBIT_SCROLL, PROGRESS_H } from "@/lib/orbit";

export const metadata: Metadata = pageMetadata("/how-we-work");

const END = ctaEnd(1824.43); // page end in design px: the CTA box plus the shared footer gap

// Figma "How We Work" (1440 x 2784): the moon constellation, a closing line, the hover CTA and the dusk glow above the footer.
export default function Page() {
  return (
    <main className="relative overflow-clip bg-ink text-white" style={{ height: `calc(${u(END - 1209.4 + 1024 + PROGRESS_H)} + ${ORBIT_SCROLL}px + ${ORBIT_OFF})` }}>
      <JsonLd data={pageGraph(page("/how-we-work"))} />
      <OrbitStage />
      <div className="absolute inset-x-0" style={{ top: `calc(${ORBIT_SCROLL}px + ${ORBIT_OFF} + ${u(1024)})` }}>
        <HowProgress />
      </div>
      <h1 className="sr-only">How we work</h1>

      {/* everything below the constellation, pushed down by the lock distance */}
      <div className="absolute inset-x-0" style={{ top: `calc(${ORBIT_SCROLL}px + ${ORBIT_OFF} + ${u(PROGRESS_H - (1209.4 - 1024))})`, height: u(END) }}>

      <div aria-hidden className="absolute inset-x-0" style={{ top: u(1209.4), height: u(1018.4), backgroundImage: dusk }} />

      <p className="absolute text-center" style={{ left: u(303.5), top: u(1461.43), width: u(833), fontSize: u(40), lineHeight: u(56) }}>
        Different minds, disciplines, and perspectives.
        <br />
        <em>One shared drive to make things that matter.</em>
      </p>

      <AboutCta top={1824.43} />
      </div>
    </main>
  );
}
