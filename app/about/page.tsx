import type { Metadata } from "next";
import Image from "next/image";
import { AboutCaption } from "@/components/about-caption";
import { AboutCta } from "@/components/about-cta";
import { AboutIntent } from "@/components/about-intent";
import { TeamDeck } from "@/components/team-deck";
import { u } from "@/lib/lenis";

export const metadata: Metadata = { title: "About | Moonstone" };

// Figma "About" (1440 x 3756): everything is placed on the 1440 grid; the footer comes from the root layout.
// the team deck pins with a mouse and sets --team-extra (design px of scroll) so everything below moves down by that much
const EXTRA = "var(--team-extra, 0)";

export default function Page() {
  return (
    <main className="relative overflow-hidden bg-white text-black" style={{ height: `calc(var(--u) * (3200 + ${EXTRA}))` }}>
      {/* animated photo header */}
      <Image
        data-hero
        src="/img/about-header.gif"
        alt=""
        width={1440}
        height={1024}
        priority
        unoptimized
        className="absolute left-0 top-0 max-w-none object-cover"
        style={{ width: u(1440), height: u(1024) }}
      />
      <h1 className="sr-only">About Moonstone</h1>
      <AboutCaption />

      {/* white fade over the photo, then down through blue to near black; and back up through blue to white */}
      <div
        aria-hidden
        className="absolute inset-x-0"
        style={{
          top: u(518.16),
          height: u(1581.97),
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff 30%, #014064 72.62%, #151f28 82.02%, #0a0a0a 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0"
        style={{
          top: u(2099.13),
          height: `calc(var(--u) * (1100.9 + ${EXTRA}))`,
          background:
            "linear-gradient(to bottom, #0a0a0a 0%, #151f28 25.9%, #014064 39.3%, #fff 100%)",
        }}
      />

      {/* longer copy than the Figma paragraph, so it is set a little smaller to stay above the Ideal / Intent titles */}
      <div
        className="absolute space-y-[1em] text-center"
        style={{ left: u(162.19), top: u(1070), width: u(1115.63), fontSize: u(20) }}
      >
        <p>
          Every new sound deserves a space to grow. Every story deserves a visual language of its own. But for independent
          creativity to truly thrive, it needs more than talent, it needs an ecosystem that nurtures, produces, and sustains
          it.
        </p>
        <p>
          Moonstone Multimedia was born out of this very realisation. What began as a vision to bridge the worlds of music and
          visual storytelling has evolved into a multidisciplinary production house and record label. Along the way, we
          recognised that creating art was only one part of the equation; bringing artists and audiences together was just as
          essential.
        </p>
        <p>
          That understanding led us into curating live experiences, building platforms for independent voices, and creating
          spaces where artistic expression could find its community.
        </p>
        <p>
          Today, Moonstone exists at the intersection of sound, cinema, and culture, driven by a simple belief: the magic lies
          in creation, but its true power lies in everything it sets in motion.
        </p>
      </div>

      <AboutIntent />

      <TeamDeck />

      <div className="absolute left-0" style={{ top: `calc(var(--u) * ${EXTRA})` }}>
        <AboutCta />
      </div>
    </main>
  );
}
