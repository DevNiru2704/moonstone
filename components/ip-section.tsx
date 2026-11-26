"use client";

import { LoopVideo } from "@/components/loop-video";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Ip } from "@/lib/ips";
import { u } from "@/lib/lenis";

// Figma IP sections: hovering turns the circle photo into a square (Figma smart animate is 0.64s; slowed to 1.2s on request) and the logo grey -> crimson; leaving reverses.
const CIRCLE = 316.127;
const SQUARE = 650.877;
const GREY = "#878787";
// everything is a function of --p (0 = default, 1 = hovered), like the Upcoming row
const mix = (a: number, b: number) => `calc(var(--u) * (${a} + ${b - a} * var(--p)))`;

export function IpSection({ ip }: { ip: Ip }) {
  const root = useRef<HTMLElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  useEffect(() => () => void tween.current?.kill(), []);

  const to = (p: number) => {
    tween.current?.kill();
    tween.current = gsap.to(root.current, { "--p": p, duration: 1.2, ease: "power2.inOut" });
  };

  const right = ip.photo === "right";
  const x = right ? [895.96, 729.07] : [228.85, 61.96];
  const textLeft = right ? 720 - 91.14 - 471.949 : 720 + 91.29;
  const [lx, ly, lw, lh] = ip.logo;
  const eta = ip.logoFile === "eta";
  const text = { fontSize: u(16), color: "#4f4f4f" };

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-white"
      style={{ height: u(816), "--p": 0 } as React.CSSProperties}
      onPointerEnter={() => to(1)}
      onPointerLeave={() => to(0)}
      onFocus={() => to(1)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && to(0)}
      tabIndex={0}
      aria-label={ip.logoAlt}
    >
      <div
        className="absolute overflow-hidden"
        style={{
          left: mix(x[0], x[1]),
          top: mix(249.94, 81.93),
          width: mix(CIRCLE, SQUARE),
          height: mix(CIRCLE, SQUARE),
          borderRadius: "calc(50% * (1 - var(--p)))",
        }}
      >
        <LoopVideo name="ip-photo" className="absolute inset-0 size-full max-w-none object-cover" />
      </div>

      {eta ? (
        <div className="absolute" style={{ left: u(lx), top: u(ly), width: u(lw), height: u(lh) }} role="img" aria-label={ip.logoAlt}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/events/eta-dashed.png" alt="" className="absolute inset-0 size-full max-w-none" style={{ opacity: "calc(1 - var(--p))" }} />
          <div className="absolute inset-0 overflow-hidden" style={{ opacity: "var(--p)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/events/eta-solid.png" alt="" className="absolute left-0 w-full max-w-none" style={{ height: "315.96%", top: "-157.69%" }} />
          </div>
        </div>
      ) : (
        <div
          role="img"
          aria-label={ip.logoAlt}
          className="absolute"
          style={{
            left: u(lx),
            top: u(ly),
            width: u(lw),
            height: u(lh),
            backgroundColor: `color-mix(in srgb, #b31e32 calc(var(--p) * 100%), ${GREY})`,
            maskImage: `url(/img/events/${ip.logoFile}-grey.svg)`,
            WebkitMaskImage: `url(/img/events/${ip.logoFile}-grey.svg)`,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
          }}
        />
      )}

      {ip.heading && (
        <p className="absolute whitespace-nowrap text-right" style={{ right: u(1440 - (720 - 91.14)), top: u(447.64), fontSize: u(24), color: "#4f4f4f" }}>
          {ip.heading}
        </p>
      )}
      <div
        className={`absolute ${right ? "text-right" : ""}`}
        style={{ left: u(textLeft), top: u(ip.textTop), width: u(471.949), ...text, display: "grid", gap: "1lh" }}
      >
        {ip.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  );
}
