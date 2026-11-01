"use client";

import { useEffect, useState } from "react";
import { u } from "@/lib/lenis";

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

/** Figma "ideal" / "intent": outlined titles; clicking one fills it and shows its text, leaving it closes again. */
export function AboutIntent() {
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    // a tap elsewhere closes it on touch screens, where there is no pointer leave
    const away = (e: PointerEvent) => !(e.target as Element).closest("[data-intent]") && setOpen(null);
    addEventListener("pointerdown", away);
    return () => removeEventListener("pointerdown", away);
  }, []);

  return (
    <>
      {ITEMS.map((it) => {
        const on = open === it.key;
        return (
          <button
            key={it.key}
            type="button"
            data-intent
            aria-expanded={on}
            onClick={() => setOpen(on ? null : it.key)}
            onPointerLeave={(e) => e.pointerType !== "touch" && setOpen((o) => (o === it.key ? null : o))}
            className="absolute cursor-pointer whitespace-nowrap text-center"
            style={{
              left: u(it.left),
              top: u(1420.5),
              width: u(it.width),
              height: u(72),
              fontSize: u(60),
              lineHeight: "normal",
              color: on ? "#fff" : "transparent",
              WebkitTextStroke: "1px #fff",
              transition: "color 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }}
          >
            {it.title}
          </button>
        );
      })}
      {ITEMS.map((it) => (
        <p
          key={it.key}
          aria-live="polite"
          className="pointer-events-none absolute text-center text-white"
          style={{
            left: u(250),
            top: u(1579.7),
            width: u(940),
            fontSize: u(24),
            opacity: open === it.key ? 1 : 0,
            transition: "opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          {it.text}
        </p>
      ))}
    </>
  );
}
