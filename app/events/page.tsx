import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { page, pageGraph, pageMetadata } from "@/lib/seo";
import { AboutCta } from "@/components/about-cta";
import { EventsHero } from "@/components/events-hero";
import { IpSection } from "@/components/ip-section";
import { UpcomingEvents } from "@/components/upcoming-events";
import { IPS } from "@/lib/ips";
import { ctaEnd } from "@/lib/cta";
import { u } from "@/lib/lenis";

export const metadata: Metadata = pageMetadata("/events");

// Figma "Events & IP": hero, Upcoming (one Olindo row, no VIEW ALL here), the four IPs, the CTA, then the footer from the layout.
export default function Page() {
  return (
    <main className="bg-white text-black">
      <JsonLd data={pageGraph(page("/events"))} />
      <EventsHero />
      <UpcomingEvents showAll={false} />
      {IPS.map((ip) => (
        <IpSection key={ip.key} ip={ip} />
      ))}
      <div className="relative" style={{ height: u(ctaEnd(59)) }}>
        <AboutCta top={59} />
      </div>
    </main>
  );
}
