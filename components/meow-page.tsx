"use client";

import Link from "next/link";
import { Silkscreen } from "next/font/google";
import { BattleScene } from "@/components/battle-scene";
import { RpgCard } from "@/components/rpg-card";
import { CTA_HOVER } from "@/lib/cta";
import { u } from "@/lib/lenis";

// All the copy lives here so it is easy to edit.
// pixel font, only for the RPG windows
const silkscreen = Silkscreen({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-px" });

const GITHUB = "https://github.com/DevNiru2704";
const PORTFOLIO = "https://devniru.in";
const MEMES = [
  { role: "witch", caption: "it works on my machine", action: "Witch Cat casts Works-On-My-Machine! It missed." },
  { role: "tank", caption: "git push --force", action: "Tank Cat bashes main. Everyone's work took 9999 damage." },
  { role: "healer", caption: "merge conflict at 2 a.m.", action: "Healer Cat casts Cure. Coffee restored 1 HP." },
  { role: "druid", caption: "me after deploying on a Friday", action: "Druid Cat grows a flower. Go touch grass." },
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
  return (
    <main
      className={`${silkscreen.variable} relative overflow-hidden bg-ink text-cream`}
      style={{ minHeight: "100svh", padding: `${u(180)} ${u(60)} ${u(120)}` }}
    >
      <div style={{ width: u(900) }}>
        <h1 style={{ fontSize: u(100), lineHeight: 1.05 }}>
          You found the <em className="font-medium text-crimson">secret</em> page.
        </h1>
        <p style={{ fontSize: u(24), marginTop: u(28), width: u(620) }}>
          The party is unionised. They demand snacks, a code review and absolutely no standups.
        </p>
      </div>

      <BattleScene />

      <ul className="grid grid-cols-4" style={{ gap: u(40), marginTop: u(70) }}>
        {MEMES.map((m) => (
          <li key={m.role} className="flex [&>*]:w-full">
            <RpgCard role={m.role} caption={m.caption} action={m.action} />
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
