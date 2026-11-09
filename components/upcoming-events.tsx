"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { OLINDO } from "@/lib/events";
import { u } from "@/lib/lenis";

// Figma "Upcoming Events": the 220-high row grows to 870 on hover (smart animate, ease-out, 0.5s) and shrinks back on leave.
const LETTERS: [string, number][] = [["U", 556.12], ["P", 599.58], ["C", 638.58], ["O", 681.46], ["M", 727.46], ["I", 779.57], ["N", 795.06], ["G", 838.31]];
const trim = { textBox: "trim-both cap alphabetic" } as React.CSSProperties;
// everything in the row is a function of --p (0 = collapsed, 1 = open), so one tween drives it all
const grow = (a: number, b: number) => `calc(var(--u) * (${a} + ${b - a} * var(--p)))`;

export function UpcomingEvents() {
  const row = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => () => void tween.current?.kill(), []);

  const to = (p: number) => {
    tween.current?.kill();
    tween.current = gsap.to(row.current, { "--p": p, duration: 0.5, ease: "power2.out" });
  };

  return (
    <section className="relative bg-white text-black">
      <div className="relative" style={{ height: u(350) }}>
        {LETTERS.map(([l, x]) => (
          <span key={x} className="absolute whitespace-nowrap" style={{ left: u(x), top: u(119.55), fontSize: u(60), ...trim }}>
            {l}
          </span>
        ))}
        <Link
          href="/events"
          className="absolute border border-black transition-colors duration-300 ease-out hover:border-crimson hover:bg-crimson hover:text-white"
          style={{ left: u(662), top: u(203.46), padding: u(20), fontSize: u(16) }}
        >
          <span className="block" style={trim}>
            VIEW ALL
          </span>
        </Link>
      </div>

      <div
        ref={row}
        className="relative overflow-hidden bg-white text-white"
        style={{ "--p": 0, height: grow(220, 870) } as React.CSSProperties}
        onPointerEnter={() => to(1)}
        onPointerLeave={() => to(0)}
        onFocus={() => to(1)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && to(0)}
      >
        <div className="absolute overflow-hidden" style={{ left: u(30), top: u(10), width: u(679.975), height: grow(200, 849.968) }}>
          <Image
            src={OLINDO.poster}
            alt={`${OLINDO.title} ${OLINDO.subtitle} poster`}
            width={1200}
            height={1500}
            className="absolute left-0 w-full max-w-none"
            style={{ height: "calc(424.98% - 324.98% * var(--p))", top: "calc(-104.39% * (1 - var(--p)))" }}
          />
        </div>
        <div
          className="absolute"
          style={{ left: u(730.03), top: u(10), width: u(679.975), height: grow(200, 849.968), backgroundColor: "color-mix(in srgb, #b31e32 calc(var(--p) * 100%), #000)" }}
        />
        <div className="absolute whitespace-nowrap" style={{ left: u(784), top: u(68) }}>
          <p style={{ fontSize: u(60), lineHeight: u(40) }}>{OLINDO.title}</p>
          <p style={{ fontSize: u(34), lineHeight: u(40) }}>{OLINDO.subtitle}</p>
        </div>
        <div className="absolute" style={{ left: u(784), top: u(248), width: u(457.384), fontSize: u(24), opacity: "calc(0.5 * var(--p))" }}>
          <p>
            {OLINDO.date}
            <br />
            {OLINDO.time}
          </p>
          <p>{OLINDO.venue}</p>
        </div>
        <Link
          href={`/events/${OLINDO.slug}`}
          className="absolute border border-white transition-colors duration-300 ease-out hover:bg-white hover:text-black"
          style={{ left: u(784), top: u(464), padding: u(20), fontSize: u(16), opacity: "var(--p)" }}
        >
          <span className="block" style={trim}>
            VIEW MORE
          </span>
        </Link>
      </div>
    </section>
  );
}
