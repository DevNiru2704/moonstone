"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { PixelCanvas } from "@/components/pixel-canvas";
import { RpgWindow, useTyped } from "@/components/rpg-window";
import { SoundToggle } from "@/components/sound-toggle";
import { chip } from "@/lib/chiptune";
import { enemyFor, type Enemy } from "@/lib/enemies";
import { BUILDERS, ENEMY_PALETTE } from "@/lib/enemy-sprites";
import { castle, ground, hills, moon, rect, sky } from "@/lib/scene";
import { drawCat2D, FRAMES } from "@/lib/sprites";
import { u, unit } from "@/lib/lenis";

const W = 220;
const H = 72;
const GY = 56; // ground line
const TARGET = 150; // where a regular enemy stops
const HITS = ["999", "1337", "404", "9001", "42", "NaN", "0xFF", "∞"];
const HINT = "Click the scene (or press Enter) to attack.";

type Dmg = { id: number; x: number; y: number; text: string; color: string };

// every enemy frame is drawn to a small canvas once and then copied
const cache = new Map<string, HTMLCanvasElement>();
function enemyCanvas(e: Enemy, i: number, hit: boolean) {
  const key = `${e.id}-${i}-${hit}`;
  let c = cache.get(key);
  if (!c) {
    const sp = BUILDERS[e.id](i, hit);
    c = document.createElement("canvas");
    c.width = sp.w;
    c.height = sp.h;
    const ctx = c.getContext("2d")!;
    const pal = ENEMY_PALETTE[e.id];
    sp.rows.forEach((r, y) =>
      [...r].forEach((ch, x) => {
        if (ch === "." || !pal[ch]) return;
        ctx.fillStyle = pal[ch];
        ctx.fillRect(x, y, 1, 1);
      }),
    );
    cache.set(key, c);
  }
  return c;
}

/** A floating damage number: GSAP drives it and removes it, with a timer as a backstop. */
function DmgNumber({ d, onDone }: { d: Dmg; onDone: (id: number) => void }) {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = el.current!;
    gsap.set(node, { xPercent: -50 });
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => onDone(d.id), still ? 800 : 1400);
    const tween = still ? null : gsap.fromTo(node, { y: 0, opacity: 1 }, { y: -40 * unit(), opacity: 0, duration: 0.9, ease: "power1.out", onComplete: () => onDone(d.id) });
    return () => {
      clearTimeout(timer);
      tween?.kill();
    };
  }, [d.id, onDone]);
  return (
    <span
      ref={el}
      data-dmg
      aria-hidden
      className="pointer-events-none absolute"
      style={{ left: `${(d.x / W) * 100}%`, top: `${(d.y / H) * 100}%`, fontFamily: "var(--font-px), monospace", fontSize: u(44), color: d.color, textShadow: "3px 3px 0 #05082b" }}
    >
      {d.text}
    </span>
  );
}

/** Hero: a 16-bit battle strip. The warrior cat walks on through the night and fights a rotation of bug monsters and bosses. */
export function BattleScene() {
  const [msg, setMsg] = useState(HINT);
  const [dmg, setDmg] = useState<Dmg[]>([]);
  const [hud, setHud] = useState<{ name: string; hp: number; max: number; boss: boolean } | null>(null);
  const [warn, setWarn] = useState(false);
  const typed = useTyped(msg);
  const seq = useRef(0);
  const rm = useCallback((id: number) => setDmg((l) => l.filter((x) => x.id !== id)), []);
  // the state machine lives outside React state so the 60 fps loop never re-renders
  const st = useRef({
    phase: "walk" as "walk" | "fight" | "poof",
    n: 0,
    enemy: enemyFor(0),
    scroll: 0,
    ex: 235,
    hits: 0,
    act: -1,
    hit: 0,
    wait: 0.9,
    lunge: -1,
    lungeWait: 2.6,
    hurt: false,
    poof: 0,
    shake: 0,
    inited: false,
  });

  const say = (m: string) => setMsg(m);
  const addDmg = (x: number, y: number, text: string, color: string) => setDmg((l) => [...l.slice(-3), { id: ++seq.current, x, y, text, color }]);

  const spawn = (s: typeof st.current) => {
    s.enemy = enemyFor(s.n);
    s.ex = 235;
    s.hits = 0;
    s.hurt = false;
    s.lunge = -1;
    s.lungeWait = s.enemy.boss ? 1.9 : 2.6;
    setHud({ name: s.enemy.name, hp: s.enemy.hp, max: s.enemy.hp, boss: !!s.enemy.boss });
    chip.setTrack(s.enemy.boss ? "boss" : "battle");
    if (s.enemy.boss) {
      setWarn(true);
      chip.sfx("warning");
      setTimeout(() => setWarn(false), 2600);
    }
  };

  const attack = () => {
    const s = st.current;
    if (s.phase !== "fight" || s.act >= 0) return;
    s.act = 0;
  };

  const draw = (ctx: CanvasRenderingContext2D, t: number, dt: number, still: boolean) => {
    const s = st.current;
    const e = s.enemy;
    const target = TARGET - (e.boss ? 18 : 0);
    if (!s.inited) {
      s.inited = true;
      spawn(s);
    }
    if (still) {
      s.scroll = 0;
      s.ex = target;
      s.phase = "fight";
    } else if (s.phase === "walk") {
      s.scroll += 38 * dt;
      s.ex = Math.max(target, s.ex - 38 * dt);
      if (s.ex <= target) {
        s.phase = "fight";
        s.wait = 0.9;
        say(e.appear);
      }
    } else if (s.phase === "fight") {
      if (s.act >= 0) {
        s.act += dt;
        if (s.act >= 0.3 && s.hit === 0) {
          s.hit = 0.18;
          s.hits++;
          const text = HITS[(seq.current + s.hits) % HITS.length];
          addDmg(s.ex + e.w / 2, GY - e.h - 4, text, "#ffd23f");
          setHud({ name: e.name, hp: Math.max(e.hp - s.hits, 0), max: e.hp, boss: !!e.boss });
          chip.sfx("slash");
          chip.sfx("hit");
          say(`Warrior Cat slashes! ${text} damage.`);
        }
        if (s.act >= 0.6) {
          s.act = -1;
          s.hit = 0;
          s.wait = 1.1;
          if (s.hits >= e.hp) {
            s.phase = "poof";
            s.poof = 0;
            say(e.defeat);
            chip.sfx(e.boss ? "victory" : "defeat");
          }
        }
      } else {
        s.wait -= dt;
        if (s.wait <= 0) s.act = 0;
        // the monster fights back now and then (the warrior has nine lives)
        if (s.lunge >= 0) {
          s.lunge += dt;
          if (s.lunge >= 0.25 && !s.hurt) {
            s.hurt = true;
            s.shake = e.boss ? 0.45 : 0.25;
            addDmg(52, GY - 30, "-12", "#ff6b6b");
            chip.sfx("hit");
            say(`${e.lunge} Warrior Cat has nine lives.`);
          }
          if (s.lunge >= 0.5) {
            s.lunge = -1;
            s.lungeWait = e.boss ? 1.9 : 2.6;
          }
        } else {
          s.lungeWait -= dt;
          if (s.lungeWait <= 0) {
            s.lunge = 0;
            s.hurt = false;
            chip.sfx("lunge");
          }
        }
      }
      if (s.hit > 0) s.hit = Math.max(0.0001, s.hit - dt);
    } else {
      s.poof += dt;
      if (s.poof > (e.boss ? 2.1 : 1.1)) {
        s.n++;
        s.phase = "walk";
        spawn(s);
      }
    }
    if (!still) s.shake = Math.max(0, s.shake - dt);

    ctx.save();
    if (s.shake > 0) ctx.translate(Math.floor(t * 70) % 2 ? 1 : -1, 0);
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
    const lunge = s.lunge >= 0 ? -16 * Math.sin(Math.PI * Math.min(s.lunge / 0.5, 1)) : 0;
    const gone = s.phase === "poof" && s.poof > (e.boss ? 0.6 : 0.5);
    if (!gone) {
      const hit = s.hit > 0 || (s.phase === "poof" && Math.floor(s.poof * 20) % 2 === 0);
      const shake = s.hit > 0 ? (Math.floor(t * 60) % 2 ? 2 : -2) : 0;
      const bob = e.float ? -e.float + Math.sin(t * 3) * 2 : 0;
      ctx.drawImage(enemyCanvas(e, Math.floor(t * (e.id === "bat" ? 6 : 3)) % 2, hit), Math.floor(s.ex + lunge + shake), Math.floor(GY - e.h + 1 + bob));
    } else {
      const n = e.boss ? 28 : 8;
      const life = s.poof - (e.boss ? 0.6 : 0.5);
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2;
        const r = life * (e.boss ? 46 : 30) * (0.5 + (k % 3) * 0.3);
        rect(ctx, k % 3 === 0 ? "#ffd23f" : k % 3 === 1 ? "#ffffff" : "#ff6b6b", s.ex + e.w / 2 + Math.cos(a) * r, GY - e.h / 2 + Math.sin(a) * r, 2, 2);
      }
      if (e.boss && life < 0.25) {
        ctx.fillStyle = `rgba(255,255,255,${0.7 * (1 - life / 0.25)})`;
        ctx.fillRect(0, 0, W, H);
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
    ctx.restore();
  };

  return (
    <div style={{ marginTop: u(90) }}>
      <div className="relative" style={{ width: u(1320), height: u(432) }}>
        <div
          role="button"
          tabIndex={0}
          aria-label="Warrior cat battle scene. Press to attack."
          onClick={attack}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), attack())}
          className="relative cursor-pointer select-none outline-none focus-visible:ring-4 focus-visible:ring-[#ffd23f]"
          style={{ width: "100%", height: "100%", borderRadius: u(14), overflow: "hidden", boxShadow: `0 0 0 ${u(6)} #f1f4ff, 0 0 0 ${u(9)} #05082b` }}
        >
          <PixelCanvas
            w={W}
            h={H}
            draw={draw}
            label="Pixel-art battle: a warrior cat in armour fights bug monsters and bosses under a full moon."
            style={{ width: "100%", height: "100%" }}
          />
          {dmg.map((d) => (
            <DmgNumber key={d.id} d={d} onDone={rm} />
          ))}
        </div>

        {hud && (
          <RpgWindow className="pointer-events-none absolute" style={{ left: u(24), top: u(24), padding: `${u(10)} ${u(18)} ${u(14)}`, fontSize: u(20), minWidth: u(330), borderWidth: u(4) }}>
            <div className="flex justify-between" style={{ color: hud.boss ? "#ff9aa8" : "#fff" }}>
              <span>{hud.name}</span>
              <span aria-hidden>{hud.hp}/{hud.max}</span>
            </div>
            <div
              role="progressbar"
              aria-label={`${hud.name} health`}
              aria-valuemin={0}
              aria-valuemax={hud.max}
              aria-valuenow={hud.hp}
              style={{ marginTop: u(8), height: u(14), background: "#05082b", border: `${u(2)} solid #f1f4ff` }}
            >
              <div style={{ width: `${(hud.hp / hud.max) * 100}%`, height: "100%", background: hud.boss ? "#e0364d" : "#ffd23f", transition: "width 0.3s steps(4)" }} />
            </div>
          </RpgWindow>
        )}

        {warn && (
          <div
            role="alert"
            className="motion-safe:animate-pulse pointer-events-none absolute left-1/2 -translate-x-1/2 text-center"
            style={{ top: u(150), padding: `${u(14)} ${u(60)}`, background: "#b31e32", border: `${u(5)} solid #fff`, fontFamily: "var(--font-px), monospace", fontSize: u(46), color: "#fff", textShadow: "3px 3px 0 #05082b" }}
          >
            WARNING! BOSS
          </div>
        )}

        <div className="absolute" style={{ right: u(24), top: u(24) }}>
          <SoundToggle />
        </div>
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
