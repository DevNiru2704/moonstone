"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { u, unit } from "@/lib/lenis";
import { ORBIT_SCROLL } from "@/lib/orbit";

gsap.registerPlugin(ScrollTrigger);

// Figma "how-we-work" (1440 x 1024). The stage stays locked while scrolling: dim moon -> awake moon, then the captions step round
// (scrolling back rewinds). One unit of the timeline is a second of Figma smart animate; the scroll drives it, not the clock.
const DIM = { left: 424, top: 216, size: 592 };
const AWAKE = { left: 554, top: 346, size: 332 };
const TEX_RATIO = 1024 / 313; // both moon textures
const STEP = 4; // seconds each change takes (Figma smart animate)
const HOLD = 2; // units a caption rests before the next step (not in Figma)
// Dot angle on the 718 ring (CSS degrees). Three steps add up to one full turn, so the loop is seamless.
const ANGLES = [-177.02, -62.8, 68.7, 182.98];
const PAN = 100 / 9; // % of the 3-copy texture strip per step (one third of one texture width)

const CAPTIONS = [
  { word: "Intent", rest: " over convention", body: ["We start with the why, finding the meaning", "behind every idea before bringing it to life."], left: 86.82, top: 117.78, width: 345, align: "left" },
  { word: "Collaboration", rest: " over silos", body: ["We bring music, design, strategy, and talent", "together to create work that moves beyond disciplines."], left: 915.35, top: 843.8, width: 442, align: "right" },
  { word: "Substance", rest: " over noise", body: ["We value work with purpose, building lasting", "connections between ideas, people, and culture."], left: 86.47, top: 843.8, width: 391, align: "left" },
] as const;

const RINGS = [
  { d: 717.6, o: 1 },
  { d: 1138.27, o: 0.5 },
  { d: 1543.9, o: 0.25 },
];

const SHADOW_OFF = "inset 0 0 0px 0px rgba(24,24,24,0)";
const shadowOn = () => `inset 0 0 ${50 * unit()}px ${3 * unit()}px rgba(24,24,24,1)`;

export function OrbitStage() {
  const track = useRef<HTMLDivElement>(null);
  const moon = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const dim = useRef<HTMLDivElement>(null);
  const bright = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const rings = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const caps = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const k = () => unit();
    const px = (v: number) => () => v * k();
    const awakeNow = () => {
      gsap.set(moon.current, { left: AWAKE.left * k(), top: AWAKE.top * k(), width: AWAKE.size * k(), height: AWAKE.size * k(), boxShadow: shadowOn() });
      gsap.set(dim.current, { opacity: 0 });
      gsap.set(glow.current, { opacity: 1 });
      gsap.set(bright.current, { opacity: 1 });
      gsap.set(rings.current, { opacity: 1 });
      gsap.set(dot.current, { opacity: 1, rotation: ANGLES[0] });
      gsap.set(caps.current[0], { opacity: 1 });
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      awakeNow();
      return;
    }

    // 1) wake: the dim big moon shrinks into place, brightens, the rings and the dot appear
    const wake = gsap
      .timeline({ defaults: { duration: STEP, ease: "power2.inOut" } })
      .fromTo(moon.current, { left: px(DIM.left), top: px(DIM.top), width: px(DIM.size), height: px(DIM.size), boxShadow: SHADOW_OFF }, { left: px(AWAKE.left), top: px(AWAKE.top), width: px(AWAKE.size), height: px(AWAKE.size), boxShadow: shadowOn }, 0)
      .fromTo(dim.current, { opacity: 1 }, { opacity: 0 }, 0)
      .fromTo(glow.current, { opacity: 0 }, { opacity: 1 }, 0)
      .fromTo(bright.current, { opacity: 0 }, { opacity: 1 }, 0)
      .fromTo(rings.current, { opacity: 0 }, { opacity: 1 }, 0)
      .fromTo(dot.current, { opacity: 0, rotation: ANGLES[0] - 120 }, { opacity: 1, rotation: ANGLES[0] }, 0)
      .fromTo(caps.current[0], { opacity: 0 }, { opacity: 1, duration: 1, ease: "power1.inOut" }, STEP - 1);

    // 2) then 1 -> 2 -> 3 -> 1 forever; every step turns the moon, moves the dot and swaps the caption
    const steps = gsap.timeline({ defaults: { immediateRender: false } });
    for (let i = 0; i < 2; i++) {
      const at = i * (HOLD + STEP);
      steps
        .fromTo(strip.current, { xPercent: -PAN * i }, { xPercent: -PAN * (i + 1), duration: STEP, ease: "power2.inOut" }, at)
        .fromTo(dot.current, { rotation: ANGLES[i] }, { rotation: ANGLES[i + 1], duration: STEP, ease: "power2.inOut" }, at)
        .fromTo(caps.current[i], { opacity: 1 }, { opacity: 0, duration: 1, ease: "power1.in" }, at)
        .fromTo(caps.current[i + 1], { opacity: 0 }, { opacity: 1, duration: 1, ease: "power1.out" }, at + STEP - 1);
    }
    steps.to({}, { duration: HOLD }); // the last caption rests before the lock ends

    // the stage sticks (CSS) once its top reaches the centred position; the timeline then follows the scroll both ways
    const off = () => (innerHeight - 1024 * k()) / 2;
    const master = gsap.timeline({
      scrollTrigger: {
        trigger: track.current,
        start: () => `top+=${186.43 * k() - off()} top`,
        end: () => `+=${ORBIT_SCROLL}`,
        scrub: 0.6,
        invalidateOnRefresh: true,
      },
    });
    master.add(wake).add(steps, `>+${HOLD}`);
    return () => {
      master.scrollTrigger?.kill();
      master.kill();
    };
  }, []);

  return (
    // the track is as tall as the page above the dusk plus the lock distance; the stage sticks inside it
    <div ref={track} className="absolute inset-x-0 top-0" style={{ height: `calc(${u(1210.43)} + ${ORBIT_SCROLL}px)`, paddingTop: u(186.43) }}>
      {/* the outer rings fade out under the header: stays at the top of the screen while locked */}
      <div className="pointer-events-none sticky top-0 z-20 h-0" aria-hidden>
        <div className="absolute inset-x-0 top-0" style={{ height: u(130), background: "linear-gradient(to bottom, #0a0a0a 65%, rgba(10,10,10,0) 100%)" }} />
      </div>
      <div className="sticky z-10" style={{ top: `calc((100svh - ${u(1024)}) / 2)` }}>
    <div className="relative overflow-hidden bg-ink text-white" style={{ height: u(1024) }} aria-label="How we work">
      {/* orbit rings: 0.5px white outlines around the stage centre */}
      <div ref={rings} className="pointer-events-none absolute inset-0" style={{ opacity: 0 }} aria-hidden>
        {RINGS.map((r) => (
          <svg
            key={r.d}
            className="absolute"
            style={{ left: u(720 - r.d / 2), top: u(512 - r.d / 2), width: u(r.d), height: u(r.d) }}
            viewBox={`0 0 ${r.d} ${r.d}`}
          >
            <circle cx={r.d / 2} cy={r.d / 2} r={r.d / 2 - 0.25} fill="none" stroke="#fff" strokeWidth="0.5" strokeOpacity={r.o} />
          </svg>
        ))}
      </div>

      {/* the soft glow behind the moon (Figma: shadow 0 0 200px #5d5d5d), a radial layer so it is round and never clipped */}
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none absolute rounded-full"
        style={{
          left: u(720 - 366),
          top: u(512 - 366),
          width: u(732),
          height: u(732),
          opacity: 0,
          background: "radial-gradient(circle closest-side, rgba(93,93,93,0.6) 45%, rgba(93,93,93,0.25) 70%, rgba(93,93,93,0) 100%)",
        }}
      />

      {/* the moon: a circle with a texture strip that pans sideways as it "rotates" */}
      <div
        ref={moon}
        className="absolute overflow-hidden rounded-full"
        style={{ left: u(DIM.left), top: u(DIM.top), width: u(DIM.size), height: u(DIM.size), boxShadow: SHADOW_OFF }}
        aria-hidden
      >
        <div ref={dim} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/moon-dim.png" alt="" className="absolute left-0 top-0 h-full max-w-none rotate-180" style={{ aspectRatio: TEX_RATIO }} />
        </div>
        <div ref={bright} className="absolute inset-0" style={{ opacity: 0 }}>
          <div ref={strip} className="absolute left-0 top-0 flex h-full" style={{ aspectRatio: TEX_RATIO * 3 }}>
            {[0, 1, 2].map((i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src="/img/moon-bright.png" alt="" className="block h-full w-1/3 max-w-none rotate-180" />
            ))}
          </div>
          <div className="absolute inset-0" style={{ background: "rgba(10,10,10,0.2)" }} />
        </div>
      </div>

      {/* the dot circling on the first ring (a square wrapper turned around the centre) */}
      <div
        ref={dot}
        className="pointer-events-none absolute"
        style={{ left: u(720 - 368.285), top: u(512 - 368.285), width: u(736.57), height: u(736.57), opacity: 0 }}
        aria-hidden
      >
        <span className="absolute rounded-full bg-white" style={{ left: "51.22%", top: "97.17%", width: "2.84%", height: "2.83%" }} />
      </div>

      {CAPTIONS.map((c, i) => (
        <div
          key={c.word}
          ref={(el) => {
            if (el) caps.current[i] = el;
          }}
          className="absolute whitespace-nowrap"
          style={{ left: u(c.left), top: u(c.top), width: u(c.width), textAlign: c.align, opacity: 0 }}
        >
          <p style={{ fontSize: u(26.975) }}>
            <b className="font-bold italic">{c.word}</b>
            {c.rest}
          </p>
          <p style={{ fontSize: u(17.983), marginTop: u(20.7) }}>
            {c.body[0]}
            <br />
            {c.body[1]}
          </p>
        </div>
      ))}
    </div>
      </div>
    </div>
  );
}
