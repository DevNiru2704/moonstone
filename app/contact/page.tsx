import type { Metadata } from "next";
import { AboutCta } from "@/components/about-cta";
import { ContactForm } from "@/components/contact-form";
import { u } from "@/lib/lenis";

export const metadata: Metadata = { title: "Contact | Moonstone" };

// Figma "Contact" (1440 x 1807): radial dusk behind the page, white below it; the footer comes from the root layout.
const dusk = `radial-gradient(ellipse ${u(2640)} ${u(1016)} at 50% ${u(1049)},
  #fff 23.52%, #c0cfd8 35.8%, #81a0b2 48.07%, #61889e 54.21%, #41708b 60.35%, #225877 66.48%,
  #124c6e 69.55%, #024064 72.62%, #0c3046 77.32%, #151f28 82.02%, #101519 91.01%, #0a0a0a 100%)`;

const link = "transition-colors duration-200 hover:text-crimson";

export default function Page() {
  return (
    <main className="relative overflow-hidden bg-white text-white" style={{ height: u(1251) }}>
      <div aria-hidden className="absolute inset-x-0 top-0" style={{ height: u(1018.4), backgroundImage: dusk }} />

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
        <a href="tel:+917980254641" className={link}>
          +91 7980254641
        </a>{" "}
        /{" "}
        <a href="mailto:moonstonemultimedia@gmail.com" className={link}>
          moonstonemultimedia@gmail.com
        </a>
      </p>

      <ContactForm />
      <AboutCta top={849} />
    </main>
  );
}
