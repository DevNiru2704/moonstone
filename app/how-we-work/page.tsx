import type { Metadata } from "next";
import { AboutCta } from "@/components/about-cta";
import { OrbitStage } from "@/components/orbit-stage";
import { dusk } from "@/lib/dusk";
import { u } from "@/lib/lenis";
import { ORBIT_SCROLL } from "@/lib/orbit";

export const metadata: Metadata = { title: "How we work | Moonstone" };

// Figma "How We Work" (1440 x 2784): the moon constellation, a closing line, the hover CTA and the dusk glow above the footer.
export default function Page() {
  return (
    <main className="relative overflow-clip bg-ink text-white" style={{ height: `calc(${u(2228)} + ${ORBIT_SCROLL}px)` }}>
      <OrbitStage />
      <h1 className="sr-only">How we work</h1>

      {/* everything below the constellation, pushed down by the lock distance */}
      <div className="absolute inset-x-0" style={{ top: ORBIT_SCROLL, height: u(2228) }}>

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
