"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { u, unit } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const LOCK = 1000; // design px of scroll while the block is pinned
const BOX = { top: 1070, height: 610 }; // the pinned box (design px): the About copy, the titles and the text under them
const CLEAR = "rgba(255,255,255,0)"; // transparent that tweens to white without going grey

const ITEMS = [
  {
    key: "ideal",
    title: "The Ideal",
    left: 262,
    width: 246,
    text: "To shape a creative landscape where independent voices thrive, new ideas find their audience, and culture continues to move forward.",
  },
  {
    key: "intent",
    title: "The Intent",
    left: 890.5,
    width: 270,
    text: "To connect talent, ideas, and opportunities across disciplines, creating the conditions for artists, brands, and creative projects to grow with purpose and individuality.",
  },
] as const;

const query = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const m = matchMedia(query);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

/**
 * Figma "ideal" / "intent": outlined titles that fill, with their text, one after the other while the block is pinned
 * (scroll-locked, scrubbed). With reduced motion there is no pin: clicking a title fills it and shows its text instead.
 */
export function AboutIntent({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const fit = useRef<HTMLDivElement>(null);
  const reduce = useSyncExternalStore(subscribe, () => matchMedia(query).matches, () => false);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (reduce) return;
    // the page below moves down by the pin length (CSS var in design px, as the team deck does)
    const root = document.documentElement;
    root.style.setProperty("--intent-extra", String(LOCK));
    // on a short window the pinned box is scaled down to fit, as the team deck is
    const inner = fit.current;
    const shrink = () => gsap.set(inner, { scale: Math.min(1, (innerHeight * 0.94) / (BOX.height * unit())) });
    shrink();
    ScrollTrigger.addEventListener("refreshInit", shrink);
    const ctx = gsap.context(() => {
      const copy = box.current!.querySelector("[data-copy]");
      const [t1, t2] = gsap.utils.toArray<HTMLElement>("[data-title]");
      const [p1, p2] = gsap.utils.toArray<HTMLElement>("[data-text]");
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: box.current,
            start: "center center",
            end: () => `+=${LOCK * unit()}`,
            pin: true,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        // a beat of nothing, The Ideal and its text come in, hold, hand over to The Intent, hold
        .to({}, { duration: 0.3 })
        // the blue behind the copy gets darker as the lock goes on: black text turns white part way
        .to(copy, { color: "#fff", duration: 0.6 }, 0.9)
        .to(t1, { color: "#fff", duration: 0.5 }, 0.3)
        .to(p1, { opacity: 1, duration: 0.5 }, 0.3)
        .to(t1, { color: CLEAR, duration: 0.5 }, 1.8)
        .to(p1, { opacity: 0, duration: 0.5 }, 1.8)
        .to(t2, { color: "#fff", duration: 0.5 }, 2.1)
        .to(p2, { opacity: 1, duration: 0.5 }, 2.1)
        .to({}, { duration: 0.6 }, 2.6);
    }, box);
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.removeEventListener("refreshInit", shrink);
      ctx.revert();
      gsap.set(inner, { clearProps: "transform" });
      root.style.removeProperty("--intent-extra");
      ScrollTrigger.refresh();
    };
  }, [reduce]);

  useEffect(() => {
    if (!reduce) return;
    // a tap elsewhere closes it on touch screens, where there is no pointer leave
    const away = (e: PointerEvent) => !(e.target as Element).closest("[data-title]") && setOpen(null);
    addEventListener("pointerdown", away);
    return () => removeEventListener("pointerdown", away);
  }, [reduce]);

  return (
    <div ref={box} className="absolute left-0 w-full" style={{ top: u(BOX.top), height: u(BOX.height) }}>
      <div ref={fit} className="absolute inset-0">
      <div data-copy className="absolute space-y-[1em] text-center" style={{ left: u(162.19), top: 0, width: u(1115.63), fontSize: u(20) }}>
        {children}
      </div>
      {ITEMS.map((it) => {
        const on = reduce && open === it.key;
        return (
          <button
            key={it.key}
            type="button"
            data-title
            aria-expanded={reduce ? on : undefined}
            disabled={!reduce}
            onClick={reduce ? () => setOpen(on ? null : it.key) : undefined}
            onPointerLeave={reduce ? (e) => e.pointerType !== "touch" && setOpen((o) => (o === it.key ? null : o)) : undefined}
            className={`absolute whitespace-nowrap text-center ${reduce ? "cursor-pointer" : "cursor-default"}`}
            style={{
              left: u(it.left),
              top: u(1420.5 - BOX.top),
              width: u(it.width),
              height: u(72),
              fontSize: u(60),
              lineHeight: "normal",
              color: on ? "#fff" : CLEAR,
              WebkitTextStroke: "1px #fff",
              transition: reduce ? "color 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)" : undefined,
            }}
          >
            {it.title}
          </button>
        );
      })}
      {ITEMS.map((it) => (
        <p
          key={it.key}
          data-text
          aria-live="polite"
          className="pointer-events-none absolute text-center text-white"
          style={{
            left: u(250),
            top: u(1579.7 - BOX.top),
            width: u(940),
            fontSize: u(24),
            opacity: reduce && open === it.key ? 1 : 0,
            transition: reduce ? "opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)" : undefined,
          }}
        >
          {it.text}
        </p>
      ))}
      </div>
    </div>
  );
}
