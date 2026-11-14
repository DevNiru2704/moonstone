"use client";

import { useEffect, useState } from "react";
import { u } from "@/lib/lenis";

/** The blue "menu window" of the old RPGs: white double border, soft blue gradient, pixel font. */
export function RpgWindow({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        fontFamily: "var(--font-px), monospace",
        color: "#fff",
        textShadow: "2px 2px 0 #000",
        background: "linear-gradient(#2238b8, #0b1470)",
        border: `${u(6)} solid #f1f4ff`,
        borderRadius: u(14),
        boxShadow: `0 0 0 ${u(3)} #05082b, inset 0 0 0 ${u(3)} #4a5ee0`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Types `text` out one letter at a time (instantly with reduced motion). */
export function useTyped(text: string, run = true, speed = 28) {
  const [s, setS] = useState({ text: "", n: 0 });
  useEffect(() => {
    if (!run) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => setS({ text, n: text.length }), 0);
      return () => clearTimeout(id);
    }
    const id = setInterval(
      () =>
        setS((p) => {
          const n = p.text === text ? p.n : 0;
          return n >= text.length ? p : { text, n: n + 1 };
        }),
      speed,
    );
    return () => clearInterval(id);
  }, [text, run, speed]);
  return text.slice(0, s.text === text ? s.n : 0);
}
