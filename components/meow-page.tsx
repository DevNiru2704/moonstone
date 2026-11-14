"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Cat } from "@/components/cats";
import { CTA_HOVER } from "@/lib/cta";
import { u } from "@/lib/lenis";

// All the copy lives here so it is easy to edit.
const GITHUB = "https://github.com/DevNiru2704";
const PORTFOLIO = "https://devniru.in";
const MEOWS = ["meow", "MEOW.", "mrrp?", "…I said meow", "pet me again, I dare you", "purr (this is a bug)"];
const MEMES = [
  { caption: "me after deploying on a Friday", fur: "#fae4d5", accessory: "glare" },
  { caption: "it works on my machine", fur: "#8ea58b", accessory: "laptop" },
  { caption: "git push --force", fur: "#fff8f5", accessory: "cup" },
  { caption: "merge conflict at 2 a.m.", fur: "#fae4d5", accessory: "none" },
] as const;
const LINKS = [
  {
    href: GITHUB,
    title: "Fork me on GitHub",
    text: "Liked the site? Open an issue, send a PR, or just say hi. Let’s build something together. I code for cat treats.",
    tone: "bg-peach text-ink",
  },
  {
    href: PORTFOLIO,
    title: "See the portfolio",
    text: "devniru.in has everything else I’ve built, and you can contact me from there. The cats approve.",
    tone: "bg-crimson text-cream",
  },
] as const;

export function MeowPage() {
  const root = useRef<HTMLElement>(null);
  const [meow, setMeow] = useState(-1);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current!;
    const ctx = gsap.context(() => {
      gsap.from("[data-meme]", { y: 60, opacity: 0, duration: 0.8, ease: "back.out(1.7)", stagger: 0.12, delay: 0.2 });
      gsap.from("[data-hero]", { y: 30, opacity: 0, duration: 0.8, ease: "power2.out", stagger: 0.1 });
    }, el);
    // the pupils follow the pointer (mouse only)
    let off: (() => void) | undefined;
    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const pupils = gsap.utils.toArray<SVGElement>("[data-pupil]", el);
      const move = (e: PointerEvent) => {
        for (const p of pupils) {
          const r = p.getBoundingClientRect();
          const dx = e.clientX - (r.x + r.width / 2);
          const dy = e.clientY - (r.y + r.height / 2);
          const d = Math.hypot(dx, dy) || 1;
          gsap.to(p, { x: (dx / d) * 3, y: (dy / d) * 3, duration: 0.25, overwrite: true });
        }
      };
      addEventListener("pointermove", move);
      off = () => removeEventListener("pointermove", move);
    }
    return () => {
      off?.();
      ctx.revert();
    };
  }, []);

  return (
    <main
      ref={root}
      className="relative overflow-hidden bg-ink text-cream"
      style={{ minHeight: "100svh", padding: `${u(180)} ${u(60)} ${u(120)}` }}
    >
      <div className="flex items-end justify-between">
        <div data-hero style={{ width: u(780) }}>
          <h1 style={{ fontSize: u(100), lineHeight: 1.05 }}>
            You found the <em className="font-medium text-crimson">secret</em> page.
          </h1>
          <p style={{ fontSize: u(24), marginTop: u(28), width: u(620) }}>
            The cats are unionised. They demand snacks, a code review and absolutely no standups.
          </p>
        </div>
        <button
          data-hero
          type="button"
          aria-label="Pet the cat"
          onClick={() => setMeow((m) => (m + 1) % MEOWS.length)}
          className="cat-card relative cursor-pointer"
          style={{ width: u(360) }}
        >
          <span
            className="absolute right-0 whitespace-nowrap rounded-full bg-cream text-ink"
            style={{ top: u(-48), padding: `${u(8)} ${u(20)}`, fontSize: u(20), opacity: meow < 0 ? 0 : 1 }}
            aria-live="polite"
          >
            {meow < 0 ? "meow" : MEOWS[meow]}
          </span>
          <Cat fur="#fff8f5" className="block w-full" />
        </button>
      </div>

      <ul className="grid grid-cols-4" style={{ gap: u(40), marginTop: u(120) }}>
        {MEMES.map((m, i) => (
          <li
            key={m.caption}
            data-meme
            className="cat-card glass-rim relative"
            style={{
              borderRadius: u(25),
              background: "rgba(217,217,217,0.1)",
              padding: u(24),
              rotate: `${i % 2 ? 1.5 : -1.5}deg`,
            }}
          >
            <div className="bg-ink/60" style={{ borderRadius: u(16), padding: u(16) }}>
              <Cat fur={m.fur} accessory={m.accessory} className="block w-full" />
            </div>
            <p className="font-medium" style={{ fontSize: u(22), marginTop: u(20), lineHeight: 1.2 }}>
              {m.caption}
            </p>
          </li>
        ))}
      </ul>

      <h2 style={{ fontSize: u(60), marginTop: u(140), lineHeight: 1.1, width: u(900) }}>
        Liked the site? The human behind it would love to <em className="font-medium text-crimson">hear</em> from you.
      </h2>
      <div className="grid grid-cols-2" style={{ gap: u(40), marginTop: u(60) }}>
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`block ${l.tone} ${CTA_HOVER}`}
            style={{ borderRadius: u(25), padding: u(40), minHeight: u(240) }}
          >
            <span className="block" style={{ fontSize: u(48), lineHeight: 1.1 }}>
              {l.title} <span aria-hidden>↗</span>
            </span>
            <span className="block" style={{ fontSize: u(20), marginTop: u(24), lineHeight: 1.35, width: u(520) }}>
              {l.text}
            </span>
          </a>
        ))}
      </div>

      <p className="flex items-center justify-between" style={{ fontSize: u(18), marginTop: u(100) }}>
        <span>No cats were harmed. Several bugs were.</span>
        <Link href="/" className="transition-colors duration-200 hover:text-crimson">
          Take me home →
        </Link>
      </p>
    </main>
  );
}
