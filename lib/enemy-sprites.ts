// Original pixel-art monsters (bug-themed) built from the same primitives as the cats. Every builder returns a
// character grid for frame i (0 | 1); `hit` turns the body white for the damage flash.
import { Pen, SLIME, blank, outline, slimeFrame, slimePalette } from "@/lib/sprites";

export type EnemyId =
  | "conflict"
  | "null"
  | "bat"
  | "leak"
  | "debt"
  | "loop"
  | "hydra"
  | "scope"
  | "deploy";

const tri = (p: Pen, x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, c: string) => {
  const sign = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) => (ax - cx) * (by - cy) - (bx - cx) * (ay - cy);
  for (let y = Math.min(y0, y1, y2); y <= Math.max(y0, y1, y2); y++)
    for (let x = Math.min(x0, x1, x2); x <= Math.max(x0, x1, x2); x++) {
      const d1 = sign(x, y, x0, y0, x1, y1);
      const d2 = sign(x, y, x1, y1, x2, y2);
      const d3 = sign(x, y, x2, y2, x0, y0);
      if (!((d1 < 0 || d2 < 0 || d3 < 0) && (d1 > 0 || d2 > 0 || d3 > 0))) p.px(x, y, c);
    }
};
const done = (g: string[][]) => outline(g).map((r) => r.join(""));
const DIGITS: Record<string, string[]> = {
  "4": ["1.1", "1.1", "111", "..1", "..1"],
  "0": ["111", "1.1", "1.1", "1.1", "111"],
};
const glyph = (p: Pen, ch: string, x: number, y: number, c: string) =>
  DIGITS[ch].forEach((row, dy) => [...row].forEach((v, dx) => v === "1" && p.px(x + dx, y + dy, c)));

type Build = (i: number, hit: boolean) => { w: number; h: number; rows: string[] };

/** Null Pointer: a ghost with nothing behind its eyes. */
const nullPtr: Build = (i, hit) => {
  const w = 22;
  const h = 28;
  const g = blank(w, h);
  const p = new Pen(g, 0, i);
  const b = hit ? "W" : "a";
  p.ell(11, 11, 8, 9, b);
  for (let x = 3; x <= 19; x++) p.rect(x, 14, x, 21 + (((x + i * 2) % 4) < 2 ? 3 : 0), b); // wavy skirt
  p.rect(6, 6, 9, 9, "k");
  p.rect(13, 6, 16, 9, "k");
  p.px(7, 12, "k");
  p.rect(9, 13, 13, 15, "k");
  p.rect(10, 14, 12, 14, "e");
  if (!hit) {
    p.line(5, 4, 8, 3, "d");
    p.line(14, 3, 17, 4, "d");
  }
  return { w, h, rows: done(g) };
};

/** 404 Bat: flaps its wings, has the error code on its belly. */
const bat: Build = (i, hit) => {
  const w = 32;
  const h = 24;
  const g = blank(w, h);
  const p = new Pen(g);
  const b = hit ? "W" : "p";
  const wing = hit ? "W" : "v";
  if (i === 0) {
    tri(p, 10, 10, 1, 2, 4, 14, wing);
    tri(p, 21, 10, 30, 2, 27, 14, wing);
  } else {
    tri(p, 10, 12, 1, 18, 5, 8, wing);
    tri(p, 21, 12, 30, 18, 26, 8, wing);
  }
  p.ell(15.5, 12, 7, 6, b);
  tri(p, 10, 7, 9, 2, 13, 6, b);
  tri(p, 21, 7, 22, 2, 18, 6, b);
  p.rect(11, 9, 12, 10, "W");
  p.rect(19, 9, 20, 10, "W");
  p.px(12, 10, "c");
  p.px(20, 10, "c");
  p.px(14, 14, "W");
  p.px(17, 14, "W");
  if (!hit) {
    glyph(p, "4", 10, 11, "g");
    glyph(p, "0", 14, 11, "g");
    glyph(p, "4", 18, 11, "g");
  }
  return { w, h, rows: done(g) };
};

/** Memory Leak: green ooze with a RAM stick on its head, always dripping. */
const leak: Build = (i, hit) => {
  const w = 26;
  const h = 26;
  const g = blank(w, h);
  const p = new Pen(g);
  const b = hit ? "W" : "g";
  p.ell(13, 15, 10, 7 + i * 0.4, b);
  p.rect(5, 19, 21, 21, b);
  if (!hit) p.rect(6, 17, 20, 18, "L");
  // drips fall and restart
  for (const [x, y0] of [[5, 21], [12, 23], [19, 21]]) {
    const y = y0 + ((i * 2 + x) % 3);
    p.rect(x, 20, x, y, b);
    p.px(x, y + 1, b);
  }
  p.rect(8, 5, 18, 8, "k"); // the RAM stick
  p.rect(9, 6, 11, 7, "G");
  p.rect(13, 6, 15, 7, "G");
  for (let x = 9; x <= 17; x += 2) p.px(x, 9, "y");
  p.ell(9, 14, 2.5, 2.5, "W");
  p.ell(17, 14, 2.5, 2.5, "W");
  p.px(10, 15, "k");
  p.px(16, 14, "k");
  p.line(10, 19, 12, 18, "k");
  p.line(12, 18, 14, 19, "k");
  p.line(14, 19, 16, 18, "k");
  return { w, h, rows: done(g) };
};

/** Tech Debt: a stone golem plastered with sticky notes. */
const debt: Build = (i, hit) => {
  const w = 32;
  const h = 32;
  const g = blank(w, h);
  const p = new Pen(g);
  const b = hit ? "W" : "s";
  const sh = hit ? "W" : "d";
  p.rect(10, 12, 22, 27, b); // body
  p.rect(10, 12, 22, 13, sh);
  p.rect(11, 3, 21, 11, b); // head
  p.rect(11, 3, 21, 4, sh);
  p.rect(2, 12 - i, 8, 24 - i, b); // arms
  p.rect(24, 12 - i, 30, 24 - i, b);
  p.rect(2, 24 - i, 8, 26 - i, sh);
  p.rect(24, 24 - i, 30, 26 - i, sh);
  p.rect(11, 28, 15, 31, b); // legs
  p.rect(17, 28, 21, 31, b);
  p.rect(13, 6, 15, 7, hit ? "W" : "r");
  p.rect(17, 6, 19, 7, hit ? "W" : "r");
  p.line(12, 9, 20, 9, "k");
  if (!hit) {
    p.line(14, 14, 16, 18, "k");
    p.line(16, 18, 15, 22, "k");
    p.rect(11, 3, 13, 3, "l");
    p.rect(3, 12, 5, 13, "l");
    p.rect(18, 17, 21, 20, "y");
    p.rect(12, 22, 15, 25, "y");
    p.line(18, 18, 21, 18, "k");
    p.line(12, 23, 15, 23, "k");
  }
  return { w, h, rows: done(g) };
};

/** Infinite Loop: a snake that eats its own tail, forever turning. */
const loop: Build = (i, hit) => {
  const w = 28;
  const h = 28;
  const g = blank(w, h);
  const p = new Pen(g);
  const N = 44;
  for (let k = 0; k < N; k++) {
    const a = (k / N) * Math.PI * 2 + 0.5;
    const c = hit ? "W" : (k + i * 2) % 4 < 2 ? "g" : "L";
    p.rect(Math.round(14 + Math.cos(a) * 9.5) - 1, Math.round(14 + Math.sin(a) * 9.5) - 1, Math.round(14 + Math.cos(a) * 9.5) + 1, Math.round(14 + Math.sin(a) * 9.5) + 1, c);
  }
  p.ell(21, 5, 4.5, 3.5, hit ? "W" : "g"); // head
  p.px(21, 3, "y");
  p.px(23, 3, "y");
  p.px(22, 3, "k");
  p.px(24, 3, "k");
  p.rect(25, 6, 27, 6, "c");
  p.px(27, 5, "c");
  p.px(27, 7, "c");
  return { w, h, rows: done(g) };
};

/** Boss: Spaghetti Hydra, three noodle heads on one bowl of bad code. */
const hydra: Build = (i, hit) => {
  const w = 52;
  const h = 44;
  const g = blank(w, h);
  const p = new Pen(g);
  const n = hit ? "W" : "y";
  const sh = hit ? "W" : "d";
  p.ell(26, 34, 18, 9, n);
  p.rect(10, 38, 42, 42, sh);
  if (!hit) for (const [x, y] of [[14, 32], [22, 36], [30, 31], [36, 36], [26, 30]]) p.rect(x, y, x + 3, y + 2, "c");
  if (!hit) for (const [x, y] of [[18, 33], [32, 35], [24, 38]]) p.rect(x, y, x + 2, y + 1, "w");
  const heads = [
    { hx: 8, hy: 10 + i, fx: 14 },
    { hx: 26, hy: 5 - i, fx: 26 },
    { hx: 44, hy: 10 + i, fx: 38 },
  ];
  for (const { hx, hy, fx } of heads) {
    // a wavy noodle neck from the bowl up to the head
    for (let t = 0; t <= 1; t += 0.04) {
      const x = fx + (hx - fx) * t + Math.sin(t * 9 + i) * 2;
      const y = 28 + (hy - 28) * t;
      p.rect(Math.round(x) - 1, Math.round(y), Math.round(x) + 1, Math.round(y), n);
    }
    p.ell(hx, hy, 5.5, 4.5, n);
    p.rect(hx - 3, hy - 2, hx - 2, hy - 1, "W");
    p.rect(hx + 2, hy - 2, hx + 3, hy - 1, "W");
    p.px(hx - 2, hy - 1, "k");
    p.px(hx + 2, hy - 1, "k");
    p.line(hx - 2, hy + 2, hx + 2, hy + 2, "k");
    p.px(hx, hy + 3, "c");
    p.px(hx - 1, hy + 4, "c");
    p.px(hx + 1, hy + 4, "c");
  }
  return { w, h, rows: done(g) };
};

/** Boss: Scope Creep, one huge eye that only ever gets bigger. */
const scope: Build = (i, hit) => {
  const w = 52;
  const h = 46;
  const g = blank(w, h);
  const p = new Pen(g);
  const b = hit ? "W" : "v";
  const r = 15 + i;
  p.ell(26, 24, r + 3, r, b);
  for (const [x, y] of [[8, 8], [18, 3], [34, 3], [44, 8]]) {
    p.line(Math.round(26 + (x - 26) * 0.6), 14, x, y, b); // eye stalks
    p.ell(x, y, 2.4, 2.4, "W");
    p.px(x, y, "k");
  }
  p.ell(26, 22, 12, 9 + i * 0.5, "W");
  p.ell(26, 22, 6, 6, hit ? "W" : "c");
  p.rect(25, 21, 27, 23, "k");
  p.px(23, 19, "W");
  // teeth
  for (let x = 14; x <= 38; x += 4) tri(p, x, 36 + i, x + 4, 36 + i, x + 2, 41 + i, "W");
  return { w, h, rows: done(g) };
};

/** Boss: Friday Deploy, a wyvern that ruins weekends. */
const deploy: Build = (i, hit) => {
  const w = 54;
  const h = 44;
  const g = blank(w, h);
  const p = new Pen(g);
  const b = hit ? "W" : "c";
  const sh = hit ? "W" : "d";
  const wing = hit ? "W" : "h";
  const up = i === 0;
  tri(p, 18, 20, up ? 4 : 2, up ? 2 : 22, up ? 24 : 12, up ? 6 : 14, sh); // far wing
  p.ell(24, 28, 13, 8, b); // body
  p.rect(14, 33, 32, 35, hit ? "W" : "o");
  p.ell(24, 30, 9, 5, hit ? "W" : "r");
  p.line(12, 30, 2, 38, b); // tail
  p.line(12, 31, 2, 39, b);
  p.line(2, 38, 5, 41, b);
  p.rect(30, 14, 34, 26, b); // neck
  p.ell(38, 12, 7, 5, b); // head
  p.rect(41, 14, 47, 16, b); // snout
  p.line(34, 7, 31, 2, "y"); // horns
  p.line(40, 7, 41, 2, "y");
  p.rect(37, 10, 38, 11, "y");
  p.px(38, 11, "k");
  if (i === 1 && !hit) for (const [x, y] of [[49, 14], [51, 13], [50, 16], [52, 15], [51, 18]]) p.rect(x, y, x + 1, y + 1, k(x));
  p.rect(16, 36, 20, 41, b); // legs
  p.rect(28, 36, 32, 41, b);
  tri(p, 22, 20, up ? 12 : 8, up ? 0 : 24, up ? 34 : 26, up ? 8 : 14, wing); // near wing
  return { w, h, rows: done(g) };
};
const k = (x: number) => (x % 2 ? "y" : "O");

const slime: Build = (i, hit) => ({ w: SLIME.w, h: SLIME.h, rows: slimeFrame(i, hit) });

export const BUILDERS: Record<EnemyId, Build> = { conflict: slime, null: nullPtr, bat, leak, debt, loop, hydra, scope, deploy };

const BASE = { o: "#14101f", k: "#14101f", W: "#ffffff", y: "#ffd23f", c: "#b31e32" };
export const ENEMY_PALETTE: Record<EnemyId, Record<string, string>> = {
  conflict: slimePalette,
  null: { ...BASE, a: "#b9a7e8", d: "#7d6bc0", e: "#ff8fb3" },
  bat: { ...BASE, p: "#2d3a8c", v: "#6b3fa0", g: "#ffd23f" },
  leak: { ...BASE, g: "#5fae4e", L: "#2f7a3a", G: "#7be39a" },
  debt: { ...BASE, s: "#8a8f9c", d: "#5d6270", r: "#ff7a3d", l: "#5fae4e" },
  loop: { ...BASE, g: "#5fae4e", L: "#2f7a3a" },
  hydra: { ...BASE, y: "#f2c14e", d: "#b8891f", w: "#8a5a2b" },
  scope: { ...BASE, v: "#6b3fa0" },
  deploy: { ...BASE, d: "#7d1220", h: "#e8566b", r: "#f4a6a0", O: "#ff7a3d" },
};
