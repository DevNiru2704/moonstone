"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { CTA_HOVER } from "@/lib/cta";
import { bounceReveal } from "@/lib/reveal";
import { u } from "@/lib/lenis";

/** Figma "cta": the grey box opens with "Let's build something." when the pointer enters it. */
export function AboutCta({ top = 2796 }: { top?: number }) {
  const box = useRef<HTMLAnchorElement>(null);
  const shown = useRef(false);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(box.current, { width: "100%" });
      shown.current = true;
    }
  }, []);

  const show = () => {
    if (shown.current) return;
    shown.current = true;
    bounceReveal(box.current!, 105);
  };

  return (
    <div
      className="absolute"
      style={{ left: u(60), top: u(top), width: u(1320), height: u(342.04) }}
      onPointerEnter={show}
      onPointerDown={show}
    >
      <Link ref={box} href="/contact" className={`absolute left-0 top-0 block h-full overflow-hidden bg-[#eee] text-black ${CTA_HOVER}`} style={{ width: 0 }}>
        <div className="flex h-full items-center justify-center" style={{ width: u(1320), fontSize: u(80) }}>
          <p className="whitespace-nowrap">
            Let’s <em className="font-medium text-crimson">build</em> something.
          </p>
        </div>
      </Link>
    </div>
  );
}
