"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { preload } from "react-dom";

/**
 * A decorative looping photo slideshow (public/video/<name>.webm / .mp4, poster <name>-poster.webp). These replace the GIF / APNG
 * slideshows: the same frames at 25 fps, about a tenth of the bytes. With reduced motion it stays on the poster.
 */
export function LoopVideo({ name, priority, className, style, ...rest }: { name: string; priority?: boolean; className?: string; style?: CSSProperties } & Record<`data-${string}`, unknown>) {
  const ref = useRef<HTMLVideoElement>(null);
  const poster = `/video/${name}-poster.webp`;
  if (priority) preload(poster, { as: "image", fetchPriority: "high" });

  useEffect(() => {
    const v = ref.current!;
    const m = matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => (m.matches ? v.pause() : v.play().catch(() => {}));
    apply();
    m.addEventListener("change", apply);
    return () => m.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      aria-hidden
      autoPlay
      muted
      loop
      playsInline
      preload={priority ? "auto" : "metadata"}
      poster={poster}
      className={className}
      style={style}
      {...rest}
    >
      <source src={`/video/${name}.webm`} type="video/webm" />
      <source src={`/video/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
