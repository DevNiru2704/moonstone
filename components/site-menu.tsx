"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { GLASS } from "@/components/glass-filters";
import { unit, u } from "@/lib/lenis";
import { LEGAL, PAGES, SOCIAL } from "@/lib/links";

type Phase = "closed" | "bar" | "open";

// Figma "menu" variants: circle -> bar (click) -> open panel (hover) -> bar -> circle (leave)
const SIZE: Record<Phase, [number, number]> = { closed: [40, 40], bar: [200, 40], open: [200, 271] };
const LENS: Record<Phase, string> = { closed: "lens-dot", bar: "lens-bar", open: "lens-panel" };
const BAR_W = 161.949;

const textBox = { textBox: "trim-both cap alphabetic" } as React.CSSProperties;

const Group = ({ rows, size, pitch, top, height }: { rows: [string, string][]; size: number; pitch: number; top: number; height: number }) => (
  <div className="absolute" style={{ left: u(20), top: u(top), height: u(height), width: u(160) }}>
    {rows.map(([label, href], i) => {
      const external = href.startsWith("http");
      const cls = "absolute left-0 whitespace-nowrap font-medium transition-colors duration-300 hover:text-crimson";
      const style = { top: u(i * pitch), fontSize: u(size), ...textBox };
      return external ? (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>
          {label}
        </a>
      ) : (
        <Link key={label} href={href} className={cls} style={style}>
          {label}
        </Link>
      );
    })}
  </div>
);

export function SiteMenu() {
  const [phase, setPhase] = useState<Phase>("closed");
  const box = useRef<HTMLDivElement>(null);
  const bars = useRef<HTMLSpanElement[]>([]);
  const panel = useRef<HTMLElement>(null);
  const cur = useRef<Phase>("closed");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const still = useRef(false);

  const go = (next: Phase, dur: number, ease = "power1.out") => {
    cur.current = next;
    setPhase(next);
    const k = unit();
    const [w, h] = SIZE[next];
    const d = still.current ? 0 : dur;
    gsap.to(box.current, { width: w * k, height: h * k, duration: d, ease, overwrite: "auto" });
    gsap.to(bars.current, { width: (next === "closed" ? 3 : BAR_W) * k, opacity: next === "open" ? 0 : 1, duration: d, ease, overwrite: "auto" });
    const open = next === "open";
    gsap.to(panel.current, { autoAlpha: open ? 1 : 0, y: open ? 0 : -6 * k, duration: open ? d * 0.6 : d * 0.5, delay: open ? d * 0.3 : 0, ease: "power1.out", overwrite: "auto" });
  };
  const later = (ms: number, fn: () => void) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(fn, ms);
  };
  const open = () => go("open", 1.022, "power2.out");
  const close = (wait = 0) =>
    later(wait, () => {
      go("bar", 0.3);
      later(400, () => go("closed", 0.3));
    });

  useEffect(() => {
    still.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && cur.current !== "closed" && close();
    const away = (e: PointerEvent) => cur.current !== "closed" && !box.current!.contains(e.target as Node) && close();
    const resize = () => {
      const [w, h] = SIZE[cur.current];
      gsap.set(box.current, { width: w * unit(), height: h * unit() });
      gsap.set(bars.current, { width: (cur.current === "closed" ? 3 : BAR_W) * unit() });
    };
    addEventListener("keydown", esc);
    addEventListener("pointerdown", away);
    addEventListener("resize", resize);
    const b = box.current, p = panel.current, bs = bars.current;
    return () => {
      removeEventListener("keydown", esc);
      removeEventListener("pointerdown", away);
      removeEventListener("resize", resize);
      clearTimeout(timer.current);
      gsap.killTweensOf([b, p, ...bs]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    if (cur.current === "closed") {
      go("bar", 0.3);
      later(300, open);
    } else close();
  };

  return (
    <div
      ref={box}
      className={`${GLASS} !block overflow-hidden`}
      style={{
        top: u(30),
        right: u(30),
        width: u(40),
        height: u(40),
        borderRadius: u(20),
        backdropFilter: `blur(2px) url(#${LENS[phase]})`,
        WebkitBackdropFilter: `blur(2px) url(#${LENS[phase]})`,
      }}
      onPointerEnter={() => {
        if (cur.current === "bar") {
          clearTimeout(timer.current);
          open();
        } else if (cur.current === "open") clearTimeout(timer.current);
      }}
      onPointerLeave={(e) => e.pointerType !== "touch" && cur.current !== "closed" && close(300)}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          ref={(el) => {
            if (el) bars.current[i] = el;
          }}
          className="absolute block bg-[#d9d9d9]"
          style={{ right: u(18.5), top: u(13.5 + 5 * i), width: u(3), height: u(3), borderRadius: u(2) }}
        />
      ))}
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={phase === "open"}
        aria-controls="site-menu-panel"
        onClick={toggle}
        className="absolute right-0 top-0 cursor-pointer"
        style={{ width: u(40), height: u(40) }}
      />
      <nav
        id="site-menu-panel"
        ref={panel}
        aria-label="Main menu"
        className="absolute left-0 top-0"
        style={{ width: u(200), height: u(271), visibility: "hidden", opacity: 0 }}
      >
        <Group rows={PAGES} size={16} pitch={31} top={20} height={104.5} />
        <Group rows={LEGAL} size={10} pitch={16} top={148.5} height={39.2} />
        <Group rows={Object.entries(SOCIAL)} size={10} pitch={16} top={211.7} height={39.2} />
      </nav>
    </div>
  );
}
