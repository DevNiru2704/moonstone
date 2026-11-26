import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { SOCIAL } from "@/lib/links";
import { page, pageGraph, pageMetadata, siteGraph } from "@/lib/seo";
import { Hero } from "@/components/hero";
import { Moon } from "@/components/moon";
import { Preloader } from "@/components/preloader";
import { Statement } from "@/components/statement";
import { UpcomingEvents } from "@/components/upcoming-events";

export const metadata: Metadata = pageMetadata("/");

export default function Home() {
  return (
    <>
      <Preloader />
      <main>
        <JsonLd data={siteGraph(Object.values(SOCIAL))} />
        <JsonLd data={pageGraph(page("/"))} />
        <h1 className="sr-only">Moonstone Multimedia: an independent creative company in Kolkata and Mumbai</h1>
        <Hero />
        <UpcomingEvents />
        <Statement />
        <Moon />
      </main>
    </>
  );
}
