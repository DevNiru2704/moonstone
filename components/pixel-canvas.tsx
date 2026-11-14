"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * A tiny crisp canvas (w x h game pixels, scaled up with CSS) drawn from the shared GSAP ticker.
 * It only runs while on screen and while the tab is visible; with reduced motion it draws one still frame.
 */
export function PixelCanvas({
  w,
  h,
  draw,
  label,
  className,
  style,
}: {
  w: number;
  h: number;
  draw: (ctx: CanvasRenderingContext2D, t: number, dt: number, still: boolean) => void;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const cv = useRef<HTMLCanvasElement>(null);
  const fn = useRef(draw);
  useEffect(() => {
    fn.current = draw;
  });

  useEffect(() => {
    const el = cv.current!;
    const ctx = el.getContext("2d")!;
    ctx.imageSmoothingEnabled = false;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      fn.current(ctx, 0, 0, true);
      return;
    }
    let on = false;
    const io = new IntersectionObserver(([e]) => (on = e.isIntersecting));
    io.observe(el);
    let last = gsap.ticker.time;
    const tick = () => {
      const t = gsap.ticker.time;
      const dt = Math.min(t - last, 0.1);
      last = t;
      if (on && !document.hidden) fn.current(ctx, t, dt, false);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={cv}
      width={w}
      height={h}
      role="img"
      aria-label={label}
      className={className}
      style={{ imageRendering: "pixelated", display: "block", ...style }}
    />
  );
}
