import type { Metadata } from "next";
import Image from "next/image";
import { AboutCta } from "@/components/about-cta";
import { dusk } from "@/lib/dusk";
import { OLINDO } from "@/lib/events";
import { u } from "@/lib/lenis";

export const metadata: Metadata = { title: "Indieমেট V ft. Olindo | Moonstone" };

// Figma "Events & IP Detail" (1440 x 2125): the poster, the event text, the ticket button, the CTA, then the footer from the layout.
export default function Page() {
  return (
    <main className="relative overflow-hidden bg-white text-black" style={{ height: u(1569.46) }}>
      <div aria-hidden className="absolute inset-x-0 top-0" style={{ height: u(1018.4), backgroundImage: dusk }} />

      <Image
        src={OLINDO.poster}
        alt={`${OLINDO.title} ${OLINDO.subtitle} poster`}
        width={1200}
        height={1500}
        priority
        className="absolute"
        style={{ left: u(60), top: u(217.44), width: u(679.975), height: u(849.968) }}
      />

      <div className="absolute whitespace-nowrap text-white" style={{ left: u(822.82), top: u(217.44) }}>
        <h1 style={{ fontSize: u(60), lineHeight: u(40) }}>{OLINDO.title}</h1>
        <p style={{ fontSize: u(34), lineHeight: u(40) }}>{OLINDO.subtitle}</p>
      </div>

      <div
        className="absolute text-[#4f4f4f] mix-blend-difference"
        style={{ left: u(822.82), top: u(397.44), width: u(432.742), fontSize: u(16) }}
      >
        <p>
          Based out of Kolkata, O LINDO is the brainchild of Tilang Sengupta and Neil. After a successful run together in college
          competitions the duo continued with a shared obsession; a desire to make music that hit home.
        </p>
        <p style={{ marginTop: "1lh" }}>
          The band will be actively filming a live music video during the concert. The opening set will be performed by fellow
          campus-circuit act, <em className="font-medium">Solstice</em>.
        </p>
        <p style={{ marginTop: "1lh" }}>
          {OLINDO.date}
          <br />
          {OLINDO.time}
          <br />
          {OLINDO.venue}
        </p>
      </div>

      <a
        href={OLINDO.ticketUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute border border-black transition-colors duration-300 ease-out hover:border-crimson hover:bg-crimson hover:text-white"
        style={{ left: u(822.82), top: u(726.44), padding: u(20), fontSize: u(16) }}
      >
        <span className="block" style={{ textBox: "trim-both cap alphabetic" } as React.CSSProperties}>
          CLICK HERE FOR TICKETS
        </span>
      </a>

      <AboutCta top={1167.42} />
    </main>
  );
}
