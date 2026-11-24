"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { u, unit } from "@/lib/lenis";
import { PROGRESS_H } from "@/lib/orbit";

gsap.registerPlugin(ScrollTrigger);

const FIRST = 190; // design y of the first node
const GAP = 450; // between nodes
const LINE_TOP = 100;
const LINE_H = FIRST + GAP * 3 + 100 - LINE_TOP;

const POINTS = [
  {
    title: "Cooking Up Live Experiences",
    tag: "We don’t just put artists on a stage. We create reasons for them to share one.",
    body: ["Our events are built around unexpected collaborations, contrasting sounds, and shared creative instincts. From conceptualising original IPs to curating lineups and producing live experiences, we bring together artists, audiences, and ideas that might otherwise never cross paths."],
  },
  {
    title: "Marketing the Future",
    tag: "Culture first. Strategy always.",
    body: ["We approach every campaign through the intersection of creative storytelling, audience behaviour, and strategic execution. From building distinctive brand identities to producing content and driving digital campaigns, we make sure every idea has both character and direction."],
  },
  {
    title: "Keeping Everyone in the Loop",
    tag: "No guessing games. Just good communication.",
    body: ["Great work is rarely created in isolation. We believe in open conversations, shared creative ownership, clear timelines, and collaborative feedback, keeping our clients, artists, and partners involved throughout the process."],
  },
  {
    title: "Local Frequencies. Global Ears.",
    tag: "A sound of our own. A world waiting to hear it.",
    body: [
      "We’re building a platform for independent sounds and artistic collaborations that challenge conventional boundaries of genre, language, and geography. Our ambition is to curate a distinctive musical identity that becomes Kolkata’s export to India, and India’s export to the world.",
      "Not by following the sound of the industry, but by creating one worth following.",
    ],
  },
];

/** After the moon: a crimson progress bar down the centre fills as you scroll; the four points sit left and right of it, zig-zag. */
export function HowProgress() {
  const root = useRef<HTMLElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const nodes = gsap.utils.toArray<HTMLElement>("[data-node]", el);
    const rows = gsap.utils.toArray<HTMLElement>("[data-row]", el);
    const light = (i: number, on: boolean) => gsap.to(nodes[i], { backgroundColor: on ? "#b31e32" : "#0a0a0a", duration: 0.3 });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(fill.current, { scaleY: 1 });
      nodes.forEach((_, i) => light(i, true));
      return;
    }
    const lit = nodes.map(() => false);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: () => `top+=${LINE_TOP * unit()} 60%`,
            end: () => `top+=${(LINE_TOP + LINE_H) * unit()} 60%`,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              nodes.forEach((_, i) => {
                const on = self.progress >= (FIRST + GAP * i - LINE_TOP) / LINE_H - 0.001;
                if (on !== lit[i]) light(i, (lit[i] = on));
              });
            },
          },
        },
      );
      rows.forEach((r, i) =>
        gsap.from(r, {
          opacity: 0,
          x: (i % 2 ? 1 : -1) * 60 * unit(),
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: r, start: "top 80%", once: true },
        }),
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} aria-label="How we work, in detail" className="relative bg-ink text-white" style={{ height: u(PROGRESS_H) }}>
      <div aria-hidden className="absolute bg-grid" style={{ left: u(719), top: u(LINE_TOP), width: u(2), height: u(LINE_H) }} />
      <div ref={fill} aria-hidden className="absolute origin-top bg-crimson" style={{ left: u(719), top: u(LINE_TOP), width: u(2), height: u(LINE_H), transform: "scaleY(0)" }} />

      <ol>
        {POINTS.map((p, i) => {
          const left = i % 2 === 0;
          const y = FIRST + GAP * i;
          return (
            <li key={p.title}>
              <span
                data-node
                aria-hidden
                className="absolute flex items-center justify-center rounded-full border-2 border-crimson bg-ink"
                style={{ left: u(720 - 24), top: u(y - 24), width: u(48), height: u(48), fontSize: u(16) }}
              >
                0{i + 1}
              </span>
              <div
                data-row
                className="absolute"
                style={{ top: u(y - 24), width: u(540), [left ? "right" : "left"]: u(left ? 1440 - 660 : 780), textAlign: left ? "right" : "left" }}
              >
                <h2 style={{ fontSize: u(36), lineHeight: u(44), fontWeight: 300 }}>{p.title}</h2>
                <p className="font-medium" style={{ marginTop: u(16), fontSize: u(20), lineHeight: u(28) }}>
                  {p.tag}
                </p>
                {p.body.map((t) => (
                  <p key={t} className="text-white/75" style={{ marginTop: u(16), fontSize: u(17), lineHeight: u(26) }}>
                    {t}
                  </p>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
