"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cards } from "@/components/cards";
import Image from "next/image";
import Link from "next/link";
import { CTA_H, CTA_HOVER } from "@/lib/cta";
import { getLenis, u, unit } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

// Figma radial dusk (white -> blue -> near black): ellipse 3533 x 1360 centred at (720, -30.76).
const sky = `radial-gradient(ellipse ${u(3533)} ${u(1359.6)} at 50% ${u(-30.76)},
  rgb(255,255,255) 23.5%, rgb(192,207,216) 32%, rgb(129,160,178) 40.5%,
  rgb(97,136,158) 44.8%, rgb(65,112,139) 49%, rgb(34,88,119) 53.3%, rgb(18,76,110) 55.4%,
  rgb(2,64,100) 57.5%, rgb(12,48,70) 61.5%, rgb(21,31,40) 65.5%, rgb(20,22,17) 77.9%)`;

const DOME = 860; // final dome radius (design px): must cover the CTA box corners (794 away from the centre)
const CARD_GAP = 0.1; // seconds between one card starting to swipe up and the next
const CARD_TIME = 1.6; // seconds one card takes to swipe up
const MAX_SPEED = 1300; // design px per second: the fastest wheel / touch scrolling goes while the section is locked
const LOCK = 3200; // design px of scroll the hill view stays locked while the ball rises, grows and the box opens

/** The cards swipe up one by one as the section comes in; then the page locks on the hill and scrolling makes the glass ball rise and grow into a white dome, then the CTA reveals. */
export function Moon() {
  const root = useRef<HTMLElement>(null);
  const moon = useRef<HTMLDivElement>(null);
  const hills = useRef<HTMLImageElement>(null);
  const box = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = root.current!;
    const k = () => unit();
    // end state of the ball and the front mountain
    const final = () => {
      gsap.set(moon.current, { y: () => -200 * k(), width: () => 2 * DOME * k(), height: () => 2 * DOME * k(), backgroundColor: "rgb(255,255,255)", backdropFilter: "none" });
      gsap.set(hills.current, { opacity: 1 });
    };
    // same bouncy left-to-right reveal as the hero captions
    const reveal = () =>
      gsap
        .timeline()
        .to(box.current, { width: "105%", duration: 0.6, ease: "power2.out" })
        .to(box.current, { width: "97%", duration: 0.3, ease: "sine.inOut" })
        .to(box.current, { width: "100%", duration: 0.3, ease: "sine.out" });
    // centre the ball on its own point (percent offsets keep working while it grows)
    gsap.set(moon.current, { xPercent: -50, yPercent: -50 });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      final();
      gsap.set(box.current, { width: "100%" });
      return;
    }
    const cards = gsap.utils.toArray<HTMLElement>(".studio-card", el);
    gsap.set(box.current, { width: 0 });

    // the cards' 2px blur is re-computed every frame while they move: off during the swipe, back at rest (the lens bands, i.e. the distortion, stay on)
    const glass = cards.flatMap((c) => [...c.children] as HTMLElement[]).filter((g) => g.tagName === "ARTICLE" && g.style.backdropFilter);
    const saved = glass.map((g) => g.style.backdropFilter);
    glass.forEach((g) => (g.style.backdropFilter = "none"));
    const cardsTl = gsap.timeline({ paused: true, onComplete: () => glass.forEach((g, i) => (g.style.backdropFilter = saved[i])) });
    cards.forEach((c, i) =>
      cardsTl.fromTo(c, { yPercent: 110 }, { yPercent: 0, ease: "power3.out", duration: CARD_TIME }, i * CARD_GAP),
    );

    // while locked, wheel and touch scrolling are capped so a fast flick cannot rush the animation
    // shortcut: the scrollbar and keyboard are not capped (they do not go through Lenis' virtual scroll)
    let last = 0;
    const cap = (d: { deltaY: number }) => {
      const now = performance.now();
      const max = MAX_SPEED * unit() * Math.min((now - last) / 1000, 0.1);
      last = now;
      d.deltaY = Math.max(-max, Math.min(max, d.deltaY));
      return true;
    };
    const capSpeed = (on: boolean) => {
      const lenis = getLenis();
      if (lenis) lenis.options.virtualScroll = on ? cap : undefined;
    };

    // scroll-locked: the page stops on the hill (section bottom 10% of the window below its bottom, so the box clears the top) and scrolling plays the ball, the dome and the box
    const ballTl = gsap
      .timeline({
        scrollTrigger: { trigger: el, start: "bottom 110%",
          end: () => `+=${LOCK * k()}`,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          // on Home the "Let's work together" pill is hidden only while this section is locked (this box has no data-cta)
          onToggle: (self) => {
            gsap.to("[data-pill]", { autoAlpha: self.isActive ? 0 : 1, duration: 0.3, overwrite: "auto" });
            capSpeed(self.isActive);
          },
        },
      })
      .fromTo(moon.current, { y: 0 }, { y: () => -200 * k(), ease: "power2.out", duration: 1.8 })
      .fromTo(
        moon.current,
        { width: () => 230.675 * k(), height: () => 230.675 * k() },
        { width: () => 2 * DOME * k(), height: () => 2 * DOME * k(), ease: "power2.inOut", duration: 3 },
        ">+0.2",
      )
      .fromTo(moon.current, { backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(2px)" }, { backgroundColor: "rgb(255,255,255)", backdropFilter: "blur(0px)", ease: "none", duration: 2.7 }, "<")
      .fromTo(hills.current, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.8 }, "-=0.8")
      .add(reveal())
      .to({}, { duration: 0.3 }); // the finished box stays a moment before the lock ends

    // cards: as soon as the section's top is near the top of the screen
    const t1 = ScrollTrigger.create({ trigger: el, start: "top 15%", once: true, onEnter: () => cardsTl.play() });
    // the other triggers on the page (pill fade, logo, navbar) must measure with the pin spacer
    ScrollTrigger.refresh();
    return () => {
      glass.forEach((g, i) => (g.style.backdropFilter = saved[i])); // React strict mode (dev) runs this effect twice: leave the blur as found
      t1.kill();
      capSpeed(false);
      ballTl.scrollTrigger?.kill();
      cardsTl.kill();
      ballTl.kill();
    };
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-white" style={{ height: u(1761) }}>
      <div className="absolute inset-0">
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
        <div className="absolute" style={{ left: u(60), top: u(1061.4), width: u(1320), height: u(CTA_H) }}>
          <Link
            ref={box}
            href="/contact"
            className={`absolute left-0 top-0 block h-full overflow-hidden bg-[#eee] text-black ${CTA_HOVER}`}
            style={{ width: 0 }}
          >
            <div className="flex h-full items-center justify-center" style={{ width: u(1320), fontSize: u(80) }}>
              <p className="whitespace-nowrap">
                Let’s <em className="font-medium text-crimson">build</em> something.
              </p>
            </div>
          </Link>
        </div>
        {/* clips the cards while they wait below their slot */}
        <div className="absolute inset-x-0 top-0 overflow-hidden" style={{ paddingTop: u(130), height: u(930) }}>
          <Cards />
        </div>
      </div>
    </section>
  );
}
