"use client";

import Image from "next/image";
import { u } from "@/lib/lenis";

type Card = {
  photo: string;
  color: string;
  title: string;
  text: string;
  logo: "moonstoned" | "multimedia";
  tag?: { label: string; spacing: number };
};

// Figma: card 426.7x789.2 (Moonstone*d / Multimedia / Artists, in recording order)
const CARDS: Card[] = [
  {
    photo: "/img/card-moonstoned.png",
    color: "/img/card-moonstoned-color.png",
    title: "Moonstone*d",
    text: "A creative agency building brands through strategy and design.",
    logo: "moonstoned",
  },
  {
    photo: "/img/card-multimedia.png",
    color: "/img/card-multimedia-color.png",
    title: "Moonstone Multimedia",
    text: "An independent record label and production house shaping stories.",
    logo: "multimedia",
    tag: { label: "MULTIMEDIA", spacing: 8.7964 },
  },
  {
    photo: "/img/card-artists.png",
    color: "/img/card-artists-color.png",
    title: "Moonstone Artists",
    text: "Representing and supporting independent artists across India.",
    logo: "multimedia",
    tag: { label: "ARTISTS", spacing: 1.4188 },
  },
];

export function Cards() {
  return (
    <div className="flex justify-center" style={{ gap: u(25) }}>
      {CARDS.map((c) => (
        <article
          key={c.title}
          className="studio-card glass-rim group relative shrink-0"
          style={{
            width: u(426.71),
            height: u(789.23),
            borderRadius: u(25),
            background: "rgba(217,217,217,0.2)",
            // plain blur only: the SVG lens filter on three big cards cost ~100ms per frame while scrolling
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
        </article>
      ))}
    </div>
  );
}
