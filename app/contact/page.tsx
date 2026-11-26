import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/contact-form";
import { FaqList } from "@/components/faq-list";
import { HashScroll } from "@/components/hash-scroll";
import { duskOnWhite } from "@/lib/dusk";
import { u } from "@/lib/lenis";

export const metadata: Metadata = pageMetadata("/contact");

// Figma "Contact" (1440 x 1807): radial dusk behind the page, white below it. The FAQ sits under the form (no CTA box here); the footer comes from the root layout.
const link = "transition-colors duration-200 hover:text-crimson";

export default function Page() {
  return (
    <main className="relative overflow-hidden bg-white text-white" style={{ paddingTop: u(800) }}>
      <HashScroll />
      <div aria-hidden className="absolute inset-x-0 top-0" style={{ height: u(1018.4), backgroundImage: duskOnWhite }} />

      <h1 className="absolute" style={{ left: u(91), top: u(202.2), fontSize: u(100), lineHeight: u(108) }}>
        Let’s Work
        <br />
        Together
      </h1>

      <address className="absolute not-italic" style={{ left: u(91), top: u(454.7), fontSize: u(16), lineHeight: u(20) }}>
        Moonstone Multimedia LLP
        <br />
        <br />
        Office No. HD-116, Building 4, Nesco IT Park,
        <br />
        Western Express Highway, Goregaon East,
        <br />
        Mumbai, Maharashtra – 400063
      </address>

      <p className="absolute whitespace-nowrap" style={{ left: u(91), top: u(579.7), fontSize: u(16), lineHeight: u(20) }}>
        <a href="tel:+919073822783" className={link}>
          +91 9073822783
        </a>{" "}
        /{" "}
        <a href="mailto:contact@moonstonemultimedia.com" className={link}>
          contact@moonstonemultimedia.com
        </a>
      </p>

      <ContactForm />
      <FaqList />
    </main>
  );
}
