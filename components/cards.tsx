"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { u, unit } from "@/lib/lenis";

type Card = {
  photo: string;
  color: string;
  title: string;
  text: string;
  logo: "moonstoned" | "multimedia";
  tag?: { label: string; spacing: number };
  href?: string;
};

// Figma: card 426.7x789.2 (Moonstone*d / Multimedia / Artists, in recording order)
const CARDS: Card[] = [
  {
    photo: "/img/card-moonstoned.png",
    color: "/img/card-moonstoned-color.png",
    title: "Moonstone*d",
    href: "/moonstoned",
    text: "A creative agency building brands through strategy and design.",
    logo: "moonstoned",
  },
  {
    photo: "/img/card-multimedia.png",
    color: "/img/card-multimedia-color.png",
    title: "Moonstone Multimedia",
    href: "/about",
    text: "An independent record label and production house shaping stories.",
    logo: "multimedia",
    tag: { label: "MULTIMEDIA", spacing: 8.7964 },
  },
  {
    photo: "/img/card-artists.png",
    color: "/img/card-artists-color.png",
    title: "Moonstone Events & IP",
    href: "/events",
    text: "Representing and supporting independent artists across India.",
    logo: "multimedia",
    tag: { label: "EVENTS & IP", spacing: 1.4188 },
  },
];

// [filter, x, y, w, h, radius] of the bands around the photo where the sky shows through the card
const BANDS = [
  // top/bottom bands are ~3.6x the visible rim: the mirrored sky is sampled from the hidden part behind the photo
  ["edge-t", 0, 0, 426.71, 95, `${u(25)} ${u(25)} 0 0`],
  ["edge-l", 0, 26.31, 26.31, 630.63, "0"],
  ["edge-r", 400.4, 26.31, 26.31, 630.63, "0"],
  ["edge-b", 0, 684.23, 426.71, 105, `0 0 ${u(25)} ${u(25)}`],
] as const;

export function Cards() {
  const row = useRef<HTMLDivElement>(null);
  // on a short window the three cards are scaled down (from their top edge) so each one fits the screen height;
  // the gap grows as they shrink (25 design px at full size) so they do not crowd each other
  useEffect(() => {
    const fit = () => {
      const s = Math.min(1, (innerHeight - 80) / (789.23 * unit()));
      const gap = (25 + 120 * (1 - s)) / s; // design px in the row's own (scaled) coordinates
      gsap.set(row.current, { scale: s, transformOrigin: "50% 0", columnGap: gap * unit() });
    };
    fit();
    addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);
  return (
    <div ref={row} className="flex justify-center" style={{ gap: u(25) }}>
      {CARDS.map((c) => (
        // the wrapper only slides (no opacity), so the glass layers inside still see the sky behind the card
        <div key={c.title} className="studio-card relative shrink-0" style={{ width: u(426.71), height: u(789.23) }}>
        {/* under the article, so the lens bends the sky but not the card's own text */}
        {BANDS.map(([id, x, y, w, h, r]) => (
          <div
            key={id}
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              left: u(x),
              top: u(y),
              width: u(w),
              height: u(h),
              borderRadius: r,
              backdropFilter: `url(#${id})`,
              WebkitBackdropFilter: `url(#${id})`,
            }}
          />
        ))}
        <article
          className="glass-rim group absolute inset-0"
          style={{
            borderRadius: u(25),
            background: "rgba(217,217,217,0.2)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        >
          {[c.photo, c.color].map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              width={753}
              height={1266}
              className={`absolute ${i ? "opacity-0 transition-opacity duration-500 group-hover:opacity-100" : ""}`}
              style={{
                left: u(26.31),
                top: u(26.31),
                width: u(374.09),
                height: u(630.63),
              }}
            />
          ))}

          {c.logo === "moonstoned" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/img/moonstoned-logo.svg"
              alt=""
              className="absolute mix-blend-difference"
              style={{
                left: u(81.8),
                top: u(585.95),
                width: u(263.08),
                height: u(37.71),
              }}
            />
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/multimedia-logo.svg"
                alt=""
                className="absolute mix-blend-difference"
                style={{
                  left: u(70.65),
                  top: u(571.49),
                  width: u(285.41),
                  height: u(34.29),
                }}
              />
              <span
                className="absolute -translate-x-1/2 whitespace-nowrap text-white mix-blend-difference"
                style={{
                  left: u(213.26),
                  top: u(609.33),
                  fontSize: u(14.19),
                  letterSpacing: u(c.tag!.spacing),
                  fontWeight: 500,
                }}
              >
                {c.tag!.label}
              </span>
            </>
          )}

          <p
            className="absolute text-black"
            style={{
              left: u(34.14),
              top: u(681.45),
              width: u(342.55),
              fontSize: u(21.6),
            }}
          >
            <strong>{c.title}</strong>
            <br />
            <span style={{ fontWeight: 300 }}>{c.text}</span>
          </p>
          {c.href && <Link href={c.href} aria-label={c.title} className="absolute inset-0 z-10" />}
        </article>
        </div>
      ))}
    </div>
  );
}
