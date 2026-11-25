"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AboutCta } from "@/components/about-cta";
import { ctaEnd } from "@/lib/cta";
import { dusk } from "@/lib/dusk";
import { CONTACT, type LegalDoc } from "@/lib/legal";
import { getLenis, u, unit } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const READ_LINE = "40%"; // a section counts as "being read" while it crosses this line of the window
const SCROLL_OFFSET = 120; // design px kept above a section the sidebar scrolls to
const STICKY_TOP = 18; // design px: the first pill sits at the top of the window (the navbar may overlap it)

const link = "transition-colors duration-200 hover:text-crimson";

/**
 * Figma "Privacy Policy" / "Terms of Service" (1440 wide): dusk glow behind a centred title, a sticky column of outlined pills on the
 * left and the sections on the right. The pill of the section being read is filled (not in the prototype: our design).
 */
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(doc.sections[0].id);
  const n = doc.sections.length;
  const activeIdx = doc.sections.findIndex((x) => x.id === active);
  const locked = useRef(false); // while a pill-click scroll runs, the clicked pill stays lit (short sections never reach the read line)

  useEffect(() => {
    const triggers = doc.sections.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: `top ${READ_LINE}`,
        end: `bottom ${READ_LINE}`,
        // only entering sets the id, so the last section stays lit while the CTA scrolls past
        onToggle: (self) => self.isActive && !locked.current && setActive(id),
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, [doc]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-in]", { autoAlpha: 0, y: 24 * unit(), duration: 0.8, ease: "power2.out", stagger: 0.12 });
      gsap.from("[data-pill-in]", { autoAlpha: 0, x: -24 * unit(), duration: 0.6, ease: "power2.out", stagger: 0.05, delay: 0.3 });
    }, root);
    return () => ctx.revert();
  }, []);

  const go = (id: string, push = true) => {
    const el = document.getElementById(id);
    if (!el) return;
    setActive(id);
    locked.current = true;
    setTimeout(() => (locked.current = false), 1800); // Lenis scroll is 1.4 s
    const offset = -SCROLL_OFFSET * unit();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
    else scrollTo({ top: el.getBoundingClientRect().top + scrollY + offset });
    if (push) history.replaceState(null, "", `#${id}`);
  };

  // /privacy-policy#cookies: wait for the layout (and Lenis) to settle, then go there
  useEffect(() => {
    const id = location.hash.slice(1);
    if (!id) return;
    const t = setTimeout(() => go(id, false), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <main ref={root} className="relative bg-white text-black" style={{ overflowX: "clip" }}>
      <div aria-hidden className="absolute inset-x-0 top-0" style={{ height: u(1018.4), backgroundImage: dusk }} />

      <header className="relative text-center text-white" style={{ paddingTop: u(267) }}>
        <h1 data-in style={{ fontSize: u(60), lineHeight: u(43), height: u(43) }}>
          {doc.title}
        </h1>
        <p data-in className="mx-auto" style={{ marginTop: u(51), width: u(doc.introWidth), fontSize: u(16), lineHeight: u(27) }}>
          {doc.intro}
        </p>
        <p data-in style={{ marginTop: u(30), fontSize: u(16), lineHeight: u(27) }}>
          {doc.effective}
        </p>
      </header>

      <div className="relative flex" style={{ marginTop: u(119), paddingLeft: u(90) }}>
        <nav aria-label={`${doc.title} sections`} className="shrink-0 self-start" style={{ width: u(353), position: "sticky", top: u(STICKY_TOP) }}>
          <ul
            className="flex flex-col"
            // 20 design px gap; it squeezes (never the 54px pill height) on short windows so more of the list stays on screen
            style={{ gap: `clamp(6px, calc((100svh - ${u(STICKY_TOP)} - 24px - ${n} * ${u(54)}) / ${n - 1}), ${u(20)})` }}
          >
            {doc.sections.map(({ id, title }, i) => (
              <li key={id} data-pill-in>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    go(id);
                  }}
                  // Figma "category-button": Default = black outline, Hover = white fill, Click = crimson fill, no outline, white text.
                  // Click stays on, so every section already passed keeps it (as in the flow).
                  className={`flex items-center border border-solid ${
                    i <= activeIdx ? "border-transparent bg-crimson text-white" : "border-black hover:bg-white"
                  }`}
                  style={{ height: u(54), padding: `0 ${u(20)}`, borderRadius: u(10), fontSize: u(20), lineHeight: 1.25 }}
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ marginLeft: u(100), width: u(807) }}>
          {doc.sections.map(({ id, title, body }) => (
            <section key={id} id={id} style={{ marginBottom: u(27) }}>
              <h2 style={{ fontSize: u(30), lineHeight: 1.5 }}>{title}</h2>
              {body.map((p) => (
                <p key={p} style={{ fontSize: u(16), lineHeight: 1.5 }}>
                  {p}
                </p>
              ))}
              {id === "contact-us" && (
                <p style={{ fontSize: u(16), lineHeight: 1.5 }}>
                  Email:{" "}
                  <a href={`mailto:${CONTACT.email}`} className={link}>
                    {CONTACT.email}
                  </a>
                  <br />
                  Phone:{" "}
                  <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className={link}>
                    {CONTACT.phone}
                  </a>
                </p>
              )}
            </section>
          ))}
        </div>
      </div>

      <div className="relative" style={{ marginTop: u(82), height: u(ctaEnd(0)) }}>
        <AboutCta top={0} />
      </div>
    </main>
  );
}
