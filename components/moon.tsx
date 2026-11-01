"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cards } from "@/components/cards";
import Image from "next/image";
import { u } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

// Figma radial dusk (white -> blue -> near black): ellipse 3533 x 1360 centred at (720, -30.76).
const sky = `radial-gradient(ellipse ${u(3533)} ${u(1359.6)} at 50% ${u(-30.76)},
  rgb(255,255,255) 23.5%, rgb(192,207,216) 32%, rgb(129,160,178) 40.5%,
  rgb(97,136,158) 44.8%, rgb(65,112,139) 49%, rgb(34,88,119) 53.3%, rgb(18,76,110) 55.4%,
  rgb(2,64,100) 57.5%, rgb(12,48,70) 61.5%, rgb(21,31,40) 65.5%, rgb(20,22,17) 77.9%)`;

/** Cards on the dusk sky over the sunset; a small moon at the horizon grows and floods the section white. */
export function Moon() {
  const root = useRef<HTMLElement>(null);
  const moon = useRef<HTMLDivElement>(null);
  const hills = useRef<HTMLImageElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // the solid white moon grows from the horizon and floods the sky, then the black mountain fades in
    const tl = gsap
      .timeline({
        scrollTrigger: { trigger: root.current, start: "top 100%", end: "top+=700 top", scrub: 0.6 },
      })
      .fromTo(moon.current, { scale: 1 }, { scale: 17, ease: "none", duration: 1 })
      .fromTo(hills.current, { opacity: 0 }, { opacity: 1, ease: "none", duration: 0.25 }, 0.75);
    gsap.set(box.current, { clipPath: "inset(0 100% 0 0)" });
    const wipe = gsap.to(box.current, {
      clipPath: "inset(0 0% 0 0)",
      duration: 1,
      ease: "power3.inOut",
      scrollTrigger: { trigger: box.current, start: "top 85%" },
    });
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      wipe.scrollTrigger?.kill();
      wipe.kill();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative overflow-hidden bg-white"
      style={{ height: u(1761) }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/hills-1.jpg"
        alt=""
        className="absolute left-0 max-w-none object-cover"
        style={{ top: u(1018.4), width: u(1539.849), height: u(1024) }}
      />
      <div
        className="absolute inset-x-0"
        style={{
          top: u(2),
          height: u(1018.413),
          backgroundImage: sky,
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        ref={moon}
        className="absolute left-1/2 rounded-full bg-white"
        style={{
          top: u(1587.43),
          width: u(230.675),
          height: u(230.675),
          marginLeft: u(-115.338),
        }}
      />
      {/* 1024x681 comp: white sky above black ground, mountain at y=361 */}
      <Image
        ref={hills}
        src="/img/hills-2.png"
        alt=""
        width={1024}
        height={681}
        className="absolute left-0 max-w-none"
        style={{ top: u(1018.4), width: u(1539.849), height: u(1024), opacity: 0 }}
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
      <div className="relative" style={{ paddingTop: u(130) }}>
        <Cards />
      </div>
    </section>
  );
}
