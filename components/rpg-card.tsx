"use client";

import { useEffect, useRef, useState } from "react";
import { PixelCanvas } from "@/components/pixel-canvas";
import { chip, type Sfx } from "@/lib/chiptune";
import { RpgWindow, useTyped } from "@/components/rpg-window";
import { drawCat2D, FRAMES, type Role } from "@/lib/sprites";
import { castle, ground, hills, moon, rect, sky } from "@/lib/scene";
import { u } from "@/lib/lenis";

const W = 72;
const H = 56;
const GY = 44;
const CX = 8; // where the cat stands in the scene

type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; kind: string };

/** Each role's action: what it spawns when the animation reaches its key frame. */
const SPAWN: Record<string, (out: P[]) => void> = {
  witch: (o) => o.push({ x: CX + 28, y: GY - 21, vx: 70, vy: 0, life: 0.9, max: 0.9, kind: "bolt" }),
  tank: (o) => {
    for (let k = 0; k < 7; k++) o.push({ x: CX + 28 + k, y: GY - 2, vx: 8 + k * 4, vy: -10 - k * 3, life: 0.5, max: 0.5, kind: "dust" });
  },
  healer: (o) => {
    for (let k = 0; k < 6; k++) o.push({ x: CX + 6 + k * 4, y: GY - 6 - (k % 3) * 5, vx: 0, vy: -9 - (k % 2) * 4, life: 1.1, max: 1.1, kind: "plus" });
  },
  druid: (o) => {
    for (let k = 0; k < 9; k++) o.push({ x: CX + 12, y: GY - 12, vx: Math.cos(k) * 22, vy: Math.sin(k * 1.7) * 18 - 6, life: 1, max: 1, kind: "leaf" });
    o.push({ x: CX + 38, y: GY - 1, vx: 0, vy: 0, life: 1.8, max: 1.8, kind: "flower" });
  },
};

// staggers the demo action of the four cards
const ROLE_DELAY: Record<string, number> = { witch: 0, tank: 1.3, healer: 2.6, druid: 3.9 };

const ROLE_SFX: Record<string, Sfx> = { witch: "bolt", tank: "bash", healer: "heal", druid: "twinkle" };

const BACKDROP: Record<string, (ctx: CanvasRenderingContext2D, off: number) => void> = {
  witch: (ctx) => moon(ctx, 54, 12, 7),
  tank: (ctx, off) => castle(ctx, W, GY, off * 0.15, 90),
  healer: (ctx) => {
    for (let r = 12; r > 2; r -= 3) for (let a = 0; a < 16; a++) rect(ctx, r > 8 ? "#4a5ee0" : "#9bc4ff", 56 + Math.cos(a) * r, 14 + Math.sin(a) * r, 1, 1);
    rect(ctx, "#fff8f5", 55, 13, 3, 3);
  },
  druid: (ctx, off) => {
    for (const [x, h] of [[8, 22], [34, 28], [58, 20]]) {
      const px = ((((x - off * 0.2) % 90) + 90) % 90) - 6;
      rect(ctx, "#0d2a2a", px + 4, GY - h, 3, h);
      rect(ctx, "#0d3a2c", px - 2, GY - h - 6, 15, 8);
      rect(ctx, "#0d3a2c", px + 1, GY - h - 10, 9, 5);
    }
  },
};

/** One FF-style window: a role's cat walks over scrolling ground; hover, focus or tap makes it use its ability. */
export function RpgCard({ role, caption, action }: { role: Exclude<Role, "warrior">; caption: string; action: string }) {
  const [shown, setShown] = useState(false);
  const typed = useTyped(caption, shown);
  const st = useRef({ act: -1, fired: false, scroll: 0, auto: 3 + ROLE_DELAY[role], parts: [] as P[] });
  const [pop, setPop] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  // the caption starts typing when the card scrolls into view
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.6 });
    io.observe(box.current!);
    return () => io.disconnect();
  }, []);

  const act = () => {
    const s = st.current;
    if (s.act >= 0) return;
    s.act = 0;
    s.fired = false;
    setPop((n) => n + 1);
    setShown(true);
  };

  const draw = (ctx: CanvasRenderingContext2D, t: number, dt: number, still: boolean) => {
    const s = st.current;
    if (!still) {
      s.auto -= dt;
      if (s.auto <= 0) {
        s.auto = 7;
        act();
      }
      s.scroll += (s.act >= 0 ? 6 : role === "tank" ? 22 : 34) * dt;
      if (s.act >= 0) {
        s.act += dt;
        if (!s.fired && s.act >= 0.3) {
          s.fired = true;
          SPAWN[role](s.parts);
          chip.sfx(ROLE_SFX[role]);
        }
        if (s.act >= 0.9) s.act = -1;
      }
    }
    sky(ctx, W, GY, t);
    hills(ctx, W, GY, s.scroll * 0.1, "#0d1330", 6, 8, 14);
    BACKDROP[role](ctx, s.scroll);
    hills(ctx, W, GY, s.scroll * 0.3 + 30, "#16254f", 2, 6, 10);
    ground(ctx, W, H, GY, s.scroll);

    const acting = s.act >= 0;
    const anim = acting ? "act" : "walk";
    const rate = role === "tank" ? 6 : 8;
    const frame = acting ? Math.min(Math.floor(s.act / 0.3), 2) : Math.floor(t * rate) % FRAMES.walk;
    drawCat2D(ctx, role, still ? "idle" : anim, frame, CX - 2, GY - 25);

    // particles
    const next: P[] = [];
    for (const p of s.parts) {
      p.life -= dt;
      if (p.life <= 0) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.kind === "leaf") {
        p.vy += 14 * dt;
        p.vx *= 0.98;
      }
      if (p.kind === "bolt") {
        next.push({ x: p.x - 2, y: p.y + 1, vx: 0, vy: 0, life: 0.25, max: 0.25, kind: "spark" });
        if (p.x > W) continue;
      }
      next.push(p);
      const a = p.life / p.max;
      const x = Math.floor(p.x);
      const y = Math.floor(p.y);
      if (p.kind === "bolt") {
        rect(ctx, "#ffffff", x, y, 3, 2);
        rect(ctx, "#6ee7ff", x - 2, y, 2, 2);
      } else if (p.kind === "spark") rect(ctx, a > 0.5 ? "#6ee7ff" : "#4a5ee0", x, y, 1, 1);
      else if (p.kind === "dust") rect(ctx, a > 0.5 ? "#d9d0e3" : "#8a7fa8", x, y, 2, 2);
      else if (p.kind === "plus") {
        const c = a > 0.4 ? "#7be39a" : "#3f8a5a";
        rect(ctx, c, x, y - 1, 1, 3);
        rect(ctx, c, x - 1, y, 3, 1);
      } else if (p.kind === "leaf") rect(ctx, a > 0.4 ? "#7be39a" : "#5fae4e", x, y, 2, 1);
      else if (p.kind === "flower") {
        rect(ctx, "#3f8a5a", x, y - 4, 1, 4);
        rect(ctx, "#ff8fb3", x - 1, y - 6, 3, 2);
        rect(ctx, "#ffd23f", x, y - 5, 1, 1);
      }
    }
    s.parts = next;
  };

  return (
    <RpgWindow className="cat-card" style={{ borderRadius: u(14) }}>
      <div
        ref={box}
        tabIndex={0}
        role="group"
        aria-label={`${role} cat. ${action}`}
        onPointerEnter={act}
        onFocus={() => setShown(true)}
        onClick={act}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), act())}
        className="cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-[#ffd23f]"
        style={{ borderRadius: u(8) }}
      >
        <div style={{ overflow: "hidden", borderBottom: `${u(4)} solid #05082b` }}>
          <PixelCanvas w={W} h={H} draw={draw} label={`A pixel-art ${role} cat walking`} style={{ width: "100%" }} />
        </div>
        <div style={{ padding: `${u(14)} ${u(16)} ${u(18)}`, minHeight: u(124), fontSize: u(20), lineHeight: 1.35 }}>
          <p className="sr-only">{caption}</p>
          <p aria-hidden>
            <span style={{ color: "#ffd23f" }}>▶ </span>
            {shown ? typed : ""}
          </p>
          <p aria-hidden key={pop} className="dmg-text" style={{ marginTop: u(8), fontSize: u(15), color: "#9bc4ff", opacity: pop ? 1 : 0 }}>
            {action}
          </p>
        </div>
      </div>
    </RpgWindow>
  );
}
