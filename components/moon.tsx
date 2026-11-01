"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cards } from "@/components/cards";
import Image from "next/image";
import { getLenis, u, unit } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

// Figma radial dusk (white -> blue -> near black): ellipse 3533 x 1360 centred at (720, -30.76).
const sky = `radial-gradient(ellipse ${u(3533)} ${u(1359.6)} at 50% ${u(-30.76)},
  rgb(255,255,255) 23.5%, rgb(192,207,216) 32%, rgb(129,160,178) 40.5%,
  rgb(97,136,158) 44.8%, rgb(65,112,139) 49%, rgb(34,88,119) 53.3%, rgb(18,76,110) 55.4%,
  rgb(2,64,100) 57.5%, rgb(12,48,70) 61.5%, rgb(21,31,40) 65.5%, rgb(20,22,17) 77.9%)`;

// Scroll distances (px) of the pinned sequence, in order.
const CARDS = 1800; // three cards swipe up one by one
const MOVE = 700; // the scene moves down to the hill photo
const BALL = 1500; // the glass ball grows into the white dome
const CTA = 500; // "Let's build something." wipes in
const TOTAL = CARDS + MOVE + BALL + CTA;
const DOME = 996; // final dome radius (design px): dark sky stays visible in the top corners

/** Pinned, scroll-driven: cards swipe up, scene moves to the hill photo, the glass ball grows into a white dome, then the CTA. */
export function Moon() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const moon = useRef<HTMLDivElement>(null);
  const hills = useRef<HTMLImageElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const k = () => unit();
    const final = () => {
      gsap.set(stage.current, { y: () => -MOVE * k() });
      gsap.set(moon.current, { width: () => 2 * DOME * k(), height: () => 2 * DOME * k(), backgroundColor: "rgb(255,255,255)" });
      gsap.set(hills.current, { opacity: 1 });
      gsap.set(box.current, { clipPath: "inset(0 0% 0 0)" });
      gsap.set(el.querySelectorAll(".studio-card"), { yPercent: 0, opacity: 1 });
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      final();
      return;
    }
    const cards = gsap.utils.toArray<HTMLElement>(".studio-card", el);
    gsap.set(box.current, { clipPath: "inset(0 100% 0 0)" });

    const tl = gsap.timeline({ paused: true });
    cards.forEach((c, i) =>
      tl.fromTo(c, { yPercent: 45, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "none", duration: CARDS / 3.4 }, (i * CARDS) / 3.4),
    );
    tl.fromTo(stage.current, { y: 0 }, { y: () => -MOVE * k(), ease: "none", duration: MOVE }, CARDS)
      .fromTo(
        moon.current,
        { width: () => 230.675 * k(), height: () => 230.675 * k() },
        { width: () => 2 * DOME * k(), height: () => 2 * DOME * k(), ease: "none", duration: BALL },
        CARDS + MOVE,
      )
      .fromTo(moon.current, { backgroundColor: "rgba(255,255,255,0.2)" }, { backgroundColor: "rgb(255,255,255)", ease: "none", duration: BALL * 0.9 }, CARDS + MOVE)
      .fromTo(hills.current, { opacity: 0 }, { opacity: 1, ease: "none", duration: BALL * 0.25 }, CARDS + MOVE + BALL * 0.75)
      .fromTo(box.current, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "none", duration: CTA }, CARDS + MOVE + BALL);

    let done = false;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: `+=${TOTAL}`,
      pin: true,
      onUpdate: (self) => {
        if (done) return;
        tl.progress(self.progress);
        if (self.progress === 1) {
          done = true;
          final();
        }
      },
      // finished and scrolled past: keep the end state, drop the pin and the scroll room it added
      onLeave: () => {
        done = true;
        final();
        const y = window.scrollY;
        st.kill(true);
        getLenis()?.scrollTo(y - TOTAL, { immediate: true, force: true });
      },
    });
    const resize = () => {
      if (done) return final();
      tl.invalidate().progress(tl.progress());
    };
    addEventListener("resize", resize);
    return () => {
      removeEventListener("resize", resize);
      st.kill(true);
      tl.kill();
    };
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-white" style={{ height: u(1761) }}>
      <div ref={stage} className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/hills-1.jpg"
          alt=""
          className="absolute left-0 max-w-none object-cover"
          style={{ top: u(1018.4), width: u(1539.849), height: u(1024) }}
        />
        <div
          className="absolute inset-x-0"
          style={{ top: u(2), height: u(1018.413), backgroundImage: sky, backgroundRepeat: "no-repeat" }}
        />
        <div
          ref={moon}
          className="absolute rounded-full"
          style={{
            left: "50%",
            top: u(1702.77),
            width: u(230.675),
            height: u(230.675),
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(2px)",
            boxShadow:
              "0 0 0 1.5px rgba(255,255,255,0.85), 0 0 50px 8px rgba(160,205,255,0.5), inset 0 0 50px rgba(255,255,255,0.3)",
          }}
        />
        {/* only the mountain and ground of the 1024x681 comp: white sky above y=500 is cut off */}
        <Image
          ref={hills}
          src="/img/hills-2.png"
          alt=""
          width={1024}
          height={681}
          className="absolute left-0 max-w-none"
          style={{
            top: u(1018.4),
            width: u(1539.849),
            height: u(1024),
            opacity: 0,
            clipPath: `inset(${u(500)} 0 0 0)`,
          }}
        />
        <div
          ref={box}
          className="absolute flex items-center justify-center bg-[#eee] text-black"
          style={{ left: u(60), top: u(1061.4), width: u(1320), height: u(342), fontSize: u(80) }}
        >
          <p className="whitespace-nowrap">
            Let’s <em className="font-medium text-crimson">build</em> something.
          </p>
        </div>
        <div className="absolute inset-x-0 top-0" style={{ paddingTop: u(130) }}>
          <Cards />
        </div>
      </div>
    </section>
  );
}
