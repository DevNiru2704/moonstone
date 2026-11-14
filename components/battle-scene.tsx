"use client";

import { useRef, useState } from "react";
import { PixelCanvas } from "@/components/pixel-canvas";
import { RpgWindow, useTyped } from "@/components/rpg-window";
import { drawCat2D, drawSlime, FRAMES } from "@/lib/sprites";
import { castle, ground, hills, moon, rect, sky } from "@/lib/scene";
import { u } from "@/lib/lenis";

const W = 220;
const H = 72;
const GY = 56; // ground line
const HITS = ["999", "1337", "404", "9001", "42", "NaN"];
const LINES = {
  appear: "A wild Merge Conflict appeared!",
  hit: (n: string) => `Warrior Cat slashes! ${n} damage.`,
  dead: "Merge Conflict was resolved. (By deleting it.)",
  hint: "Click the scene to attack.",
};

type Dmg = { id: number; x: number; text: string };

/** Hero: a 16-bit battle strip. The warrior cat walks through the night, meets a bug slime and fights it. */
export function BattleScene() {
  const [msg, setMsg] = useState<string>(LINES.hint);
  const [dmg, setDmg] = useState<Dmg[]>([]);
  const typed = useTyped(msg);
  const id = useRef(0);
  // the little state machine lives outside React state so the 60 fps loop never re-renders
  const st = useRef({ phase: "walk" as "walk" | "fight" | "poof", t: 0, scroll: 0, ex: 235, hits: 0, act: -1, hit: 0, wait: 0.8, poof: 0 });

  const say = (m: string) => setMsg(m);
  const attack = () => {
    const s = st.current;
    if (s.phase !== "fight" || s.act >= 0) return;
    s.act = 0;
  };

  const draw = (ctx: CanvasRenderingContext2D, t: number, dt: number, still: boolean) => {
    const s = st.current;
    if (still) {
      s.scroll = 0;
      s.ex = 150;
      s.phase = "fight";
    } else {
      s.t += dt;
      if (s.phase === "walk") {
        s.scroll += 38 * dt;
        s.ex = Math.max(150, s.ex - 38 * dt);
        if (s.ex <= 150) {
          s.phase = "fight";
          s.wait = 0.9;
          s.hits = 0;
          say(LINES.appear);
        }
      } else if (s.phase === "fight") {
        if (s.act >= 0) {
          s.act += dt;
          if (s.act >= 0.3 && s.hit === 0) {
            s.hit = 0.18;
            s.hits++;
            const text = HITS[(id.current + s.hits) % HITS.length];
            setDmg((d) => [...d.slice(-4), { id: ++id.current, x: s.ex + 10, text }]);
            say(LINES.hit(text));
          }
          if (s.act >= 0.6) {
            s.act = -1;
            s.hit = 0;
            s.wait = 1.1;
            if (s.hits >= 3) {
              s.phase = "poof";
              s.poof = 0;
              say(LINES.dead);
            }
          }
        } else {
          s.wait -= dt;
          if (s.wait <= 0) s.act = 0;
        }
      } else {
        s.poof += dt;
        if (s.poof > 1.1) {
          s.phase = "walk";
          s.ex = 235;
          s.hits = 0;
        }
      }
      if (s.hit > 0) s.hit = Math.max(0.0001, s.hit - dt);
    }

    sky(ctx, W, GY, t);
    moon(ctx, 176, 17, 11);
    hills(ctx, W, GY, s.scroll * 0.1, "#0d1330", 14, 16, 22);
    castle(ctx, W, GY, s.scroll * 0.15, 150);
    hills(ctx, W, GY, s.scroll * 0.3 + 40, "#16254f", 4, 9, 14);
    ground(ctx, W, H, GY, s.scroll);

    // warrior
    const acting = s.act >= 0;
    const walking = s.phase === "walk";
    const frame = acting ? Math.min(Math.floor(s.act / 0.2), 2) : walking ? Math.floor(t * 8) % FRAMES.walk : Math.floor(t * 2) % FRAMES.idle;
    drawCat2D(ctx, "warrior", acting ? "act" : walking ? "walk" : "idle", frame, 36, GY - 26 + 1);

    // enemy
    if (s.phase !== "poof" || s.poof < 0.5) {
      const hit = s.hit > 0;
      const shake = hit ? (Math.floor(t * 60) % 2 ? 2 : -2) : 0;
      drawSlime(ctx, Math.floor(t * 3), s.ex + shake, GY - 19 + 1, hit || (s.phase === "poof" && s.poof > 0.25 && Math.floor(s.poof * 20) % 2 === 0));
    } else if (s.poof < 0.9) {
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        const r = (s.poof - 0.5) * 30;
        rect(ctx, k % 2 ? "#ffd23f" : "#ffffff", s.ex + 12 + Math.cos(a) * r, GY - 10 + Math.sin(a) * r, 2, 2);
      }
    }
    // slash arc
    if (acting && s.act > 0.2 && s.act < 0.5) {
      const p = (s.act - 0.2) / 0.3;
      for (let k = 0; k < 7; k++) {
        const a = -1.1 + (k / 6) * 2.2 * p;
        rect(ctx, k % 2 ? "#ffffff" : "#bfe3ff", 64 + Math.cos(a) * 26, GY - 12 + Math.sin(a) * 26, 2, 2);
      }
    }
  };

  return (
    <div style={{ marginTop: u(90) }}>
      <div className="relative cursor-pointer select-none" onClick={attack} style={{ width: u(1320), height: u(432), borderRadius: u(14), overflow: "hidden", boxShadow: `0 0 0 ${u(6)} #f1f4ff, 0 0 0 ${u(9)} #05082b` }}>
        <PixelCanvas
          w={W}
          h={H}
          draw={draw}
          label="Pixel-art battle: a warrior cat in armour fights a bug slime named Merge Conflict under a full moon."
          style={{ width: "100%", height: "100%" }}
        />
        {dmg.map((d) => (
          <span
            key={d.id}
            aria-hidden
            className="dmg pointer-events-none absolute"
            style={{ left: `${(d.x / W) * 100}%`, top: "42%", fontFamily: "var(--font-px), monospace", fontSize: u(44), color: "#ffd23f", textShadow: "3px 3px 0 #7d1220" }}
            onAnimationEnd={() => setDmg((l) => l.filter((x) => x.id !== d.id))}
          >
            {d.text}
          </span>
        ))}
      </div>
      <RpgWindow style={{ marginTop: u(24), padding: `${u(20)} ${u(32)}`, fontSize: u(26), minHeight: u(84) }}>
        <span aria-live="polite" className="sr-only">
          {msg}
        </span>
        <span aria-hidden>
          {typed}
          <span className="blink">▼</span>
        </span>
      </RpgWindow>
    </div>
  );
}
