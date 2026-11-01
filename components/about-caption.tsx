"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { bounceErase, bounceReveal, ink } from "@/lib/reveal";
import { u } from "@/lib/lenis";

const PHRASES: [string, string?][] = [
  ["Built on music."],
  ["Driven by culture."],
  ["Open to ", "possibility."], // the last word is italic crimson
];

const Phrase = ({ p }: { p: [string, string?] }) => (
  <>
    {p[0]}
    {p[1] && <em className="font-medium text-crimson">{p[1]}</em>}
  </>
);

/** Figma "about-header-text": a white box wipes open over the photo with one phrase, wipes shut, and the next follows, forever. */
export function AboutCaption() {
  const boxes = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const els = boxes.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(els[0], { width: "100%" });
      return;
    }
    gsap.set(els, { width: 0 });
    const [one, two, three] = els;
    const tl = gsap.timeline({ repeat: -1, delay: 0.5 });
    // 1) "Built on music." wipes in and erases
    tl.add(bounceReveal(one)).add(bounceErase(one), "+=1.6").to({}, { duration: 0.2 });
    // 2) "Driven by culture." wipes in and fades out; after a 1s gap "Open to possibility." fades in (no wipe)
    tl.add(bounceReveal(two))
      .call(() => {
        ink(three, false);
        gsap.set(three, { width: "100%", opacity: 0 });
      }, [], "+=1.6")
      .addLabel("swap")
      .to(two, { opacity: 0, duration: 0.5, ease: "power1.inOut" }, "swap+=0.01")
      .set(two, { width: 0, opacity: 1 })
      // nothing on screen for a beat, then the next phrase fades in
      .to(three, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, "+=1")
      // 3) the normal erase follows
      .add(bounceErase(three), "+=1.6")
      .to({}, { duration: 0.2 });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    // centred on the first screen, each phrase box centred on its own width
    <div className="absolute inset-x-0 -translate-y-1/2" style={{ top: "50svh", height: u(80) }}>
      {PHRASES.map((text, i) => (
        <div key={text[0]} className="absolute left-1/2 top-0 inline-block -translate-x-1/2" style={{ height: u(79.5) }}>
          <span className="invisible block whitespace-nowrap" style={{ padding: `0 ${u(13.5)}`, fontSize: u(60) }}>
            <Phrase p={text} />
          </span>
          <div
            ref={(el) => {
              if (el) boxes.current[i] = el;
            }}
            className="absolute left-0 top-0 flex h-full items-center overflow-hidden whitespace-nowrap bg-white text-black"
            style={{ width: 0, fontSize: u(60) }}
          >
            <span
              style={{ marginLeft: u(13.5), textBox: "trim-both cap alphabetic" } as React.CSSProperties}
            >
              <Phrase p={text} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
