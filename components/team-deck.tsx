"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis, u, unit } from "@/lib/lenis";
import { TEAM } from "@/lib/team";

gsap.registerPlugin(ScrollTrigger);

const STEP = 450; // design px of scroll per card with a mouse
const EXTRA = STEP * (TEAM.length - 1);
const EXIT = { x: 1112.4, y: 0, scale: 1, rot: 20 }; // Figma (Bidisha exit frame): the leaving card ends turned 20 degrees clockwise, 1112 right, same size and height, off the frame
const CARD = { left: 505.5, top: 181, w: 426, h: 592 };
const GHOSTS = [
  { left: 471, top: 209 },
  { left: 582, top: 211 },
]; // two faded cards behind the stack; they go when the 4th and 5th card have left

type Mode = "mouse" | "touch" | "still";
const FINE = "(hover: hover) and (pointer: fine)";
const REDUCED = "(prefers-reduced-motion: reduce)";
const getMode = (): Mode => (matchMedia(REDUCED).matches ? "still" : matchMedia(FINE).matches ? "mouse" : "touch");
const subscribe = (cb: () => void) => {
  const qs = [matchMedia(FINE), matchMedia(REDUCED)];
  qs.forEach((q) => q.addEventListener("change", cb));
  return () => qs.forEach((q) => q.removeEventListener("change", cb));
};

const Face = ({ s, name, role, photo, size, dim }: { s: number; name: string; role: string; photo?: string; size: number; dim?: boolean }) => (
  <>
    {photo ? (
      <Image
        src={photo}
        alt=""
        width={748}
        height={938}
        className="absolute bg-[#c4c4c4] object-cover"
        style={{ left: u(26.5 * s), top: u(26 * s), width: u(374 * s), height: u(469 * s), borderRadius: u(11 * s) }}
      />
    ) : (
      // the faded cards behind the stack stay plain (no photo), like Figma
      <div className="absolute bg-[#c4c4c4]" style={{ left: u(26.5 * s), top: u(26 * s), width: u(374 * s), height: u(469 * s), borderRadius: u(11 * s) }} />
    )}
    <p
      data-text
      className="absolute"
      style={{
        left: u(26.5 * s),
        top: u(518 * s),
        width: u(374 * s),
        fontSize: u(size),
        lineHeight: 1.15,
        opacity: dim ? 0 : 1,
      }}
    >
      <span className="font-medium">{name}</span>
      <br />
      <span style={{ fontWeight: 300 }}>{role}</span>
    </p>
  </>
);

/**
 * Figma "About" team deck. Mouse: the section pins and the cards fly off to the right as you scroll (scrubbed).
 * Touch: the top card follows the finger and leaves in the direction of the swipe. The last card stays.
 */
export function TeamDeck() {
  const wrap = useRef<HTMLDivElement>(null);
  const fit = useRef<HTMLDivElement>(null);
  const dragged = useRef(false); // a swipe on touch must not count as a click

  // clicking a card scrolls to that person's section in the bios below
  const goTo = (i: number) => {
    if (dragged.current) return void (dragged.current = false);
    const row = document.getElementById(`team-${i}`);
    if (!row) return;
    const offset = -120 * unit();
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(row, { offset, duration: 1.6 });
    else scrollTo({ top: row.getBoundingClientRect().top + scrollY + offset, behavior: "auto" });
  };
  const mode = useSyncExternalStore(subscribe, getMode, () => "still" as Mode);

  useEffect(() => {
    if (mode === "still") return;
    const el = wrap.current!;
    const inner = fit.current!;
    const cards = gsap.utils.toArray<HTMLElement>("[data-card]", el);
    const ghosts = gsap.utils.toArray<HTMLElement>("[data-ghost]", el);
    // the cards are translucent: a card shows its caption only once it is the top one
    const texts = cards.map((c) => c.querySelector<HTMLElement>("[data-text]")!);
    const out = (dir: number) => ({
      x: () => dir * EXIT.x * unit(),
      y: () => EXIT.y * unit(),
      scale: EXIT.scale,
      rotation: dir * EXIT.rot,
    });

    if (mode === "mouse") {
      // the page below the deck moves down by the pin length (CSS var in design px, so it follows the width)
      const root = document.documentElement;
      root.style.setProperty("--team-extra", String(EXTRA));
      // on a short window (wide and not tall) the whole deck, title included, is scaled down to fit while it is pinned
      const shrink = () =>
        gsap.set(inner, {
          scale: Math.min(1, (innerHeight * 0.94) / (773 * unit())),
        });
      shrink();
      ScrollTrigger.addEventListener("refreshInit", shrink);
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: el,
            start: "center center",
            end: () => `+=${EXTRA * unit()}`,
            pin: true,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        cards
          .slice(0, -1)
          .forEach((c, i) => tl.to(c, { ...out(1), duration: 1 }, i).to(texts[i + 1], { opacity: 1, duration: 1 }, i));
        tl.to(ghosts[0], { opacity: 0, duration: 1 }, 3).to(ghosts[1], { opacity: 0, duration: 1 }, 4);
      }, el);
      ScrollTrigger.refresh();
      return () => {
        ScrollTrigger.removeEventListener("refreshInit", shrink);
        ctx.revert();
        gsap.set(inner, { clearProps: "transform" });
        root.style.removeProperty("--team-extra");
        ScrollTrigger.refresh();
      };
    }

    // touch: drag the top card; release past a quarter of its width (or a flick) to send it off that way
    let top = 0;
    let drag: { id: number; x0: number; t0: number; dx: number } | null = null;
    const reach = () => 600 * unit();
    const place = (c: HTMLElement, dx: number) => {
      const p = Math.min(Math.abs(dx) / reach(), 1);
      gsap.set(c, {
        x: dx,
        y: EXIT.y * unit() * p,
        scale: 1 + (EXIT.scale - 1) * p,
        rotation: Math.sign(dx) * EXIT.rot * p,
      });
    };
    const down = (e: PointerEvent) => {
      const c = cards[top];
      if (top >= cards.length - 1 || !c.contains(e.target as Node)) return;
      gsap.killTweensOf(c);
      dragged.current = false;
      drag = { id: e.pointerId, x0: e.clientX, t0: performance.now(), dx: 0 };
      c.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag.dx = e.clientX - drag.x0;
      if (Math.abs(drag.dx) > 8 * unit()) dragged.current = true;
      place(cards[top], drag.dx);
    };
    const up = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const c = cards[top];
      const { dx, t0 } = drag;
      drag = null;
      const fast = Math.abs(dx) / (performance.now() - t0) > 0.5 && Math.abs(dx) > 20 * unit();
      if (e.type === "pointerup" && (Math.abs(dx) > CARD.w * 0.25 * unit() || fast)) {
        gsap.to(c, {
          ...out(Math.sign(dx)),
          duration: 0.5,
          ease: "power2.out",
        });
        top++;
        gsap.to(texts[top], { opacity: 1, duration: 0.5 });
        if (top >= 4) gsap.to(ghosts[top - 4], { opacity: 0, duration: 0.5 });
      } else {
        gsap.to(c, { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.3, ease: "power2.out" });
      }
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      gsap.killTweensOf([...cards, ...ghosts, ...texts]);
      gsap.set([...cards, ...ghosts], { clearProps: "transform,opacity" });
      gsap.set(texts, { opacity: (i) => (i ? 0 : 1) });
    };
  }, [mode]);

  return (
    <div ref={wrap} className="absolute left-0 w-full text-black" style={{ top: u(1932), height: u(773) }}>
      <div ref={fit} className="absolute inset-0">
        <h2
          className="absolute w-full text-center text-white"
          style={{ top: u(0.29), fontSize: u(60), fontWeight: 300 }}
        >
          Team
        </h2>

        {GHOSTS.map((g, i) => (
          <div
            key={i}
            data-ghost
            aria-hidden
            className="absolute"
            style={{
              left: u(g.left),
              top: u(g.top),
              width: u(385.1),
              height: u(535.16),
              borderRadius: u(22.6),
              background: "rgba(217,217,217,0.2)",
              opacity: 0.18,
            }}
          >
            <Face s={0.904} name={TEAM[1].name} role={TEAM[1].role} size={19.526} />
          </div>
        ))}

        {TEAM.map((m, i) => (
          <article
            key={m.name}
            data-card
            role="link"
            tabIndex={0}
            aria-label={`${m.name}: read more below`}
            onClick={() => goTo(i)}
            onKeyDown={(e) => e.key === "Enter" && goTo(i)}
            className="glass-rim absolute cursor-pointer select-none"
            style={{
              left: u(CARD.left),
              top: u(CARD.top),
              width: u(CARD.w),
              height: u(CARD.h),
              borderRadius: u(25),
              background: "rgba(217,217,217,0.2)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
              zIndex: TEAM.length - i,
              touchAction: mode === "touch" ? "pan-y" : undefined,
            }}
          >
            <Face s={1} name={m.name} role={m.role} photo={m.photo} size={21.6} dim={i > 0} />
          </article>
        ))}
      </div>
    </div>
  );
}
