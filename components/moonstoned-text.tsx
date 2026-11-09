"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { u } from "@/lib/lenis";

// Figma "moostoned-2nd-text": the paragraph is white on white until the pointer enters; then black sweeps through it left to right
// with a crimson edge (smart animate "Slow", 1.25s). `--t` is where the sweep is, in % of the width.
export function MoonstonedText() {
  const el = useRef<HTMLParagraphElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  useEffect(() => () => void tween.current?.kill(), []);

  const to = (t: number) => {
    tween.current?.kill();
    tween.current = gsap.to(el.current, { "--t": t, duration: 1.25, ease: "power2.inOut" });
  };

  return (
    <p
      ref={el}
      tabIndex={0}
      className="absolute bg-clip-text text-transparent"
      style={
        {
          "--t": -6,
          left: u(573),
          top: u(78),
          width: u(726.168),
          fontSize: u(40),
          lineHeight: 1.14,
          backgroundImage:
            "linear-gradient(90deg, #000 calc(var(--t) * 1%), #b31e32 calc(var(--t) * 1% + 2.5%), #fff calc(var(--t) * 1% + 5%))",
        } as React.CSSProperties
      }
      onPointerEnter={() => to(100)}
      onPointerLeave={() => to(-6)}
      onFocus={() => to(100)}
      onBlur={() => to(-6)}
    >
      We believe that when a brand connects with sincerity, growth doesn’t need a push - it unfolds with quiet certainty.
    </p>
  );
}
