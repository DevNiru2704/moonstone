import type { Metadata } from "next";
import Image from "next/image";
import { AboutCaption } from "@/components/about-caption";
import { AboutCta } from "@/components/about-cta";
import { AboutIntent } from "@/components/about-intent";
import { TeamBios } from "@/components/team-bios";
import { TeamDeck } from "@/components/team-deck";
import { ctaEnd } from "@/lib/cta";
import { u } from "@/lib/lenis";

export const metadata: Metadata = { title: "About | Moonstone" };

// Figma "About" (1440 x 3756): everything is placed on the 1440 grid; the footer comes from the root layout.
// the team deck pins with a mouse and sets --team-extra (design px of scroll) so everything below moves down by that much
const EXTRA = "var(--team-extra, 0)";
// the Ideal / Intent block pins too (scroll-locked), which moves everything below it down by this much
const LOCK = "var(--intent-extra, 0)";

// the dusk runs as before down to the last bio (y 7000), then fades to white by 7260 so the CTA box sits on white, not on the blue
const CTA_TOP = 7300;

export default function Page() {
  return (
    <main className="relative overflow-hidden bg-white text-black" style={{ height: `calc(var(--u) * (${ctaEnd(CTA_TOP)} + ${EXTRA} + ${LOCK}))` }}>
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
          height: `calc(var(--u) * (1581.97 + ${LOCK}))`,
          // Figma's colours down to the titles (y 902 in this box); the lock distance is spent going from there to the deep blue, then the dark end follows as before
          background: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, #fff calc(var(--u) * 474.6), #5e869d calc(var(--u) * 902), #014064 calc(var(--u) * (1148.9 + ${LOCK})), #151f28 calc(var(--u) * (1297.5 + ${LOCK})), #0a0a0a 100%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0"
        style={{
          top: `calc(var(--u) * (2099.13 + ${LOCK}))`,
          height: `calc(var(--u) * (5602.91 + ${EXTRA}))`,
          // the first two stops keep Figma's 44% / 61.2% of the pin-stretched box; the last two are in design px from the bios (which move with EXTRA), so the white starts below the last bio
          background: `linear-gradient(to bottom, #0a0a0a 0%, #151f28 calc(var(--u) * (2450.4 + 0.44 * ${EXTRA})), #024064 calc(var(--u) * (3408.2 + 0.612 * ${EXTRA})), #517c95 calc(var(--u) * (4901 + ${EXTRA})), #fff calc(var(--u) * (5161 + ${EXTRA})), #fff 100%)`,
        }}
      />

      {/* longer copy than the Figma paragraph, so it is set a little smaller to stay above the Ideal / Intent titles; it stays on screen with them while they are scroll-locked */}
      <AboutIntent>
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
      </AboutIntent>

      <TeamDeck />

      {/* the team in more detail; below the deck, so it moves down with the pin length */}
      <div className="absolute inset-x-0" style={{ top: `calc(var(--u) * (3125 + ${EXTRA} + ${LOCK}))` }}>
        <TeamBios />
      </div>

      <div className="absolute left-0" style={{ top: `calc(var(--u) * (${EXTRA} + ${LOCK}))` }}>
        <AboutCta top={CTA_TOP} />
      </div>
    </main>
  );
}
