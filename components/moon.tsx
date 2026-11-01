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
const MOVE = 900; // the scene moves down to the sunset photo (nothing on it yet)
const UP = 500; // the glass ball comes up from behind the horizon
const BALL = 1500; // the ball grows into the white dome
const HOLD = 400; // scroll left to watch the CTA reveal, which plays by itself
const TOTAL = CARDS + MOVE + UP + BALL + HOLD;
const DOME = 780; // final dome radius (design px): dark sky stays visible in the top corners

// Where the scene sits in the viewport (stage translate, px). The viewport is often shorter than the design,
// so the card text and the horizon are placed from the viewport height, not from fixed numbers.
const cardsY = () => Math.min(0, innerHeight - 919.23 * unit() - 24);
const hillY = () => Math.max(0.74 * innerHeight - 1561 * unit(), innerHeight - 1761 * unit());

/** Pinned, scroll-driven: cards swipe up, the scene moves to the sunset, the glass ball rises and grows into a white dome; then the CTA reveals by itself. */
export function Moon() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const moon = useRef<HTMLDivElement>(null);
  const hills = useRef<HTMLImageElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current!;
    const k = () => unit();
    let released = false;
    // end state; while still pinned the scene stays at the sunset view, once released it is the plain full section
    const final = () => {
      gsap.set(stage.current, { y: () => (released ? 0 : hillY()) });
      gsap.set(moon.current, { y: () => -200 * k(), width: () => 2 * DOME * k(), height: () => 2 * DOME * k(), backgroundColor: "rgb(255,255,255)", backdropFilter: "none" });
      gsap.set(hills.current, { opacity: 1 });
      gsap.set(el.querySelectorAll(".studio-card"), { yPercent: 0 });
    };
    // same bouncy left-to-right reveal as the hero captions
    const reveal = () =>
      gsap
        .timeline()
        .to(box.current, { width: "105%", duration: 0.6, ease: "power2.out" })
        .to(box.current, { width: "97%", duration: 0.3, ease: "sine.inOut" })
        .to(box.current, { width: "100%", duration: 0.3, ease: "sine.out" });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      released = true;
      gsap.set(moon.current, { xPercent: -50, yPercent: -50 });
      final();
      gsap.set(box.current, { width: "100%" });
      return;
    }
    const cards = gsap.utils.toArray<HTMLElement>(".studio-card", el);
    gsap.set(box.current, { width: 0 });
    // centre the ball on its own point (percent offsets keep working while it grows)
    gsap.set(moon.current, { xPercent: -50, yPercent: -50 });

    const tl = gsap.timeline({ paused: true });
    cards.forEach((c, i) =>
      tl.fromTo(c, { yPercent: 110 }, { yPercent: 0, ease: "none", duration: CARDS / 3.4 }, (i * CARDS) / 3.4),
    );
    const up = CARDS + MOVE;
    const grow = up + UP;
    tl.fromTo(stage.current, { y: () => cardsY() }, { y: () => hillY(), ease: "none", duration: MOVE }, CARDS)
      .fromTo(moon.current, { y: 0 }, { y: () => -200 * k(), ease: "none", duration: UP }, up)
      .fromTo(
        moon.current,
        { width: () => 230.675 * k(), height: () => 230.675 * k() },
        { width: () => 2 * DOME * k(), height: () => 2 * DOME * k(), ease: "none", duration: BALL },
        grow,
      )
      .fromTo(moon.current, { backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(2px)" }, { backgroundColor: "rgb(255,255,255)", backdropFilter: "blur(0px)", ease: "none", duration: BALL * 0.9 }, grow)
      .fromTo(hills.current, { opacity: 0 }, { opacity: 1, ease: "none", duration: BALL * 0.25 }, grow + BALL * 0.75);

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      final();
      reveal();
    };
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: `+=${TOTAL}`,
      pin: true,
      onUpdate: (self) => {
        if (done) return;
        const px = self.progress * TOTAL;
        tl.time(Math.min(px, tl.duration())); // the timeline is in scroll px
        if (px >= tl.duration()) finish();
      },
      // finished and scrolled past: keep the end state, drop the pin and the scroll room it added,
      // and show the same picture in the normal flow
      onLeave: () => {
        finish();
        released = true;
        const y = window.scrollY;
        const over = y - (st.start + TOTAL);
        st.kill(true);
        final();
        const top = el.getBoundingClientRect().top + window.scrollY;
        getLenis()?.scrollTo(top - hillY() + over, { immediate: true, force: true });
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
      <div ref={stage} className="absolute inset-0" style={{ transform: "translateY(0)" }}>
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
            backgroundColor: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(2px)",
            boxShadow:
              "0 0 0 1.5px rgba(255,255,255,0.85), 0 0 50px 8px rgba(160,205,255,0.5), inset 0 0 50px rgba(255,255,255,0.3)",
          }}
        />
        {/* black mountain + ground silhouette above the ball: the ball rises from behind the mountain */}
        <Image
          src="/img/hills-2.png"
          alt=""
          width={1024}
          height={681}
          className="absolute left-0 max-w-none"
          style={{ top: u(1018.4), width: u(1539.849), height: u(1024) }}
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
        <div className="absolute" style={{ left: u(60), top: u(1061.4), width: u(1320), height: u(342) }}>
          <div ref={box} className="absolute left-0 top-0 h-full overflow-hidden bg-[#eee] text-black" style={{ width: 0 }}>
            <div className="flex h-full items-center justify-center" style={{ width: u(1320), fontSize: u(80) }}>
              <p className="whitespace-nowrap">
                Let’s <em className="font-medium text-crimson">build</em> something.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 top-0" style={{ paddingTop: u(130) }}>
          <Cards />
        </div>
      </div>
    </section>
  );
}
