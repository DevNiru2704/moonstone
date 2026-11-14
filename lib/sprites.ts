// Original pixel-art RPG cats, built from drawing primitives (no copied art). Every sprite is a character grid
// ('.' = clear) that is drawn facing right; flip it on the canvas to face left.

export type Role = "warrior" | "witch" | "tank" | "healer" | "druid";
export type Anim = "idle" | "walk" | "act";
export const FRAMES: Record<Anim, number> = { idle: 2, walk: 4, act: 3 };
export const W = 32;
export const H = 28;
export const ROLES: Role[] = ["warrior", "witch", "tank", "healer", "druid"];

type Grid = string[][];
export const blank = (w: number, h: number): Grid => Array.from({ length: h }, () => Array<string>(w).fill("."));

/** A pen that draws onto a grid with an offset (the whole upper body bobs and leans together). */
export class Pen {
  g: Grid;
  ox: number;
  oy: number;
  constructor(g: Grid, ox = 0, oy = 0) {
    this.g = g;
    this.ox = ox;
    this.oy = oy;
  }
  px(x: number, y: number, c: string) {
    x += this.ox;
    y += this.oy;
    if (y >= 0 && y < this.g.length && x >= 0 && x < this.g[0].length) this.g[y][x] = c;
  }
  rect(x0: number, y0: number, x1: number, y1: number, c: string) {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) this.px(x, y, c);
  }
  ell(cx: number, cy: number, rx: number, ry: number, c: string) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++)
        if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) this.px(x, y, c);
  }
  line(x0: number, y0: number, x1: number, y1: number, c: string) {
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.px(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }
}

/** Dark outline around everything that has been drawn. */
export const outline = (g: Grid) => {
  const h = g.length;
  const w = g[0].length;
  const out = g.map((r) => [...r]);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (g[y][x] === "." && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => (g[y + dy]?.[x + dx] ?? ".") !== "."))
        out[y][x] = "o";
  return out;
};

// ---- palettes: o outline, f/d/b fur (base, shade, belly), e eye, n nose, i inner ear, then role colours
const BASE = {
  h: "#ffffff", m: "#4a2418", o: "#14101f", n: "#e07a8f", i: "#f4a6b5", s: "#9aa7b8", S: "#e2eaf4", k: "#4a5568", c: "#b31e32", g: "#f2c14e",
  v: "#6b3fa0", V: "#3d2466", O: "#6ee7ff", w: "#8a5a2b", W: "#fff8f5", Z: "#d9d0e3", l: "#5fae4e", L: "#2f7a3a", G: "#7be39a", r: "#fae4d5", B: "#9bc4ff", q: "#5d8fd6",
};
const FUR: Record<Role, Record<string, string>> = {
  warrior: { f: "#c8752f", d: "#8d4a1f", b: "#f0c690", e: "#e8b83a", o: "#3b1d12", p: "#2a140c" },
  witch: { f: "#3b3050", d: "#241c33", b: "#5c4e78", e: "#ffd23f", o: "#0e0a18", p: "#0e0a18" },
  tank: { f: "#7d8ea3", d: "#586679", b: "#c5d0de", e: "#ffd23f", o: "#232b38", p: "#1a2029" },
  healer: { f: "#fff8f5", d: "#d9c9c1", b: "#ffffff", e: "#4aa3ff", o: "#5a3f38", p: "#1c2a4a" },
  druid: { f: "#8ea58b", d: "#62795f", b: "#d3e0cf", e: "#f2c14e", o: "#223222", p: "#1a2a1a" },
};
export const palette = (role: Role): Record<string, string> => ({ ...BASE, ...FUR[role] });

// ---- the shared cat (facing right): tail, far legs, body, near legs, head. dx/dy move the upper body.
const LEG = (p: Pen, x: number, dx: number, c: string) => p.rect(x + dx, 19, x + dx + 1, 25, c); // starts inside the body, so it stays attached while the body bobs

function drawCat(p: Pen, anim: Anim, i: number, legs: Pen, bulk: number) {
  // long fluffy tabby tail (three px thick, striped), curling up and swaying
  const tail = [
    [[5, 18], [4, 17], [3, 15], [2, 13], [2, 11], [3, 9], [4, 8]],
    [[5, 18], [4, 17], [3, 15], [2, 13], [1, 11], [1, 9], [2, 8]],
  ][(anim === "walk" ? i >> 1 : i) % 2];
  tail.forEach(([x, y], k) => {
    const c = k % 2 && k < 6 ? "d" : "f";
    p.px(x, y, c);
    p.px(x + 1, y, c);
    p.px(x - 1, y, "f");
  });
  p.px(tail[6][0], tail[6][1], "d");
  p.px(tail[6][0] + 1, tail[6][1], "d");
  // far legs (shaded), then body, then near legs
  const ph = anim === "walk" ? i : 1;
  const sw = [-2, 0, 2, 0][ph];
  LEG(legs, 8, -sw, "d");
  LEG(legs, 19, sw, "d");
  p.ell(10, 17, 7.5 + bulk, 3.8, "f");
  p.rect(13, 15, 21, 20, "f"); // chest joins the body, the head and the front legs
  p.rect(13, 19, 20, 20, "b");
  p.rect(5, 19, 15 + bulk, 20, "b");
  for (const x of [6, 9, 12]) {
    p.px(x, 13, "d");
    p.px(x, 14, "d"); // tabby stripes on the back
  }
  LEG(legs, 5, sw, "f");
  LEG(legs, 16, -sw, "f");
  for (const x of [5 + sw, 16 - sw]) legs.px(x, 23, "d");
  // big round head with fluffy cheeks, ears and a striped forehead
  p.ell(19, 11.5, 5.7, 5, "f");
  p.px(13, 14, "f");
  p.px(25, 14, "f");
  p.px(12, 15, "f");
  p.px(26, 15, "f");
  for (const [x, y] of [[14, 3], [14, 4], [15, 4], [14, 5], [15, 5], [16, 5], [14, 6], [15, 6], [16, 6], [17, 6]]) p.px(x, y, "f");
  for (const [x, y] of [[24, 3], [24, 4], [23, 4], [24, 5], [23, 5], [22, 5], [24, 6], [23, 6], [22, 6], [21, 6]]) p.px(x, y, "f");
  for (const [x, y] of [[15, 5], [15, 6], [23, 5], [23, 6]]) p.px(x, y, "i");
  p.px(19, 7, "d");
  p.px(19, 8, "d");
  p.px(17, 8, "d");
  p.px(21, 8, "d");
  // large eyes: dark pupil, bright iris, a glint
  for (const x of [16, 21]) {
    p.rect(x, 11, x + 1, 13, "e");
    p.rect(x, 12, x, 13, "p");
    p.px(x + 1, 11, "h");
  }
  p.rect(19, 14, 20, 14, "n");
  p.px(19, 15, "m");
  p.px(20, 15, "m");
  p.rect(16, 16, 22, 16, "b");
}

// ---- role gear
function warrior(p: Pen, anim: Anim, i: number) {
  p.rect(14, 8, 24, 10, "s"); // helm with the ears through
  p.rect(14, 8, 24, 8, "S");
  p.rect(16, 9, 16, 10, "k");
  const sway = anim === "walk" ? [0, -1, 0, 1][i] : anim === "idle" ? i : 0;
  p.rect(18 + sway, 4, 19 + sway, 7, "c"); // plume
  p.px(17 + sway, 5, "c");
  p.px(16 + sway, 6, "c");
  p.rect(8, 15, 14, 20, "s"); // breastplate
  p.rect(9, 15, 13, 16, "S");
  p.px(11, 18, "g");
  p.ell(15, 15, 1.6, 1.6, "S"); // pauldron
  // sword
  const sword = (x0: number, y0: number, x1: number, y1: number) => {
    p.line(x0, y0, x1, y1, "S");
    p.px(x0, y0 + 1, "g");
    p.px(x0 - 1, y0 + 1, "g");
    p.px(x0 + 1, y0 + 1, "g");
  };
  if (anim === "act") {
    const [a, b, c, d] = [[24, 16, 20, 5], [25, 16, 31, 15], [25, 17, 30, 25]][i];
    sword(a, b, c, d);
  }
  else sword(24, 15, 24, 5);
  p.rect(24, 17, 24, 18, "w");
}

function witch(p: Pen, anim: Anim, i: number) {
  p.rect(10, 15, 15, 21, "V"); // cape over the back
  p.line(9, 14, 5, 22, "V");
  p.rect(13, 6, 25, 7, "v"); // hat brim and cone
  p.rect(15, 3, 22, 5, "v");
  p.rect(17, 1, 20, 2, "v");
  p.rect(15, 5, 22, 5, "g");
  const flop = anim === "walk" ? [0, 1, 0, 1][i] : anim === "idle" ? i : 0;
  p.rect(20 + flop, 0, 22 + flop, 0, "v");
  p.px(23 + flop, 1, "V");
  // staff with a glowing orb
  const lift = anim === "act" ? [0, -1, 0][i] : 0;
  p.rect(25, 9 + lift, 25, 25, "w");
  const orb = anim === "act" && i === 1 ? "W" : "O";
  p.rect(24, 6 + lift, 26, 8 + lift, orb);
  p.px(25, 4 + lift, "O");
  if (anim === "act" && i === 1) {
    p.px(23, 5 + lift, "O");
    p.px(27, 5 + lift, "O");
    p.px(23, 9 + lift, "O");
    p.px(27, 9 + lift, "O");
  }
}

function tank(p: Pen, anim: Anim, i: number) {
  p.rect(14, 8, 24, 11, "s"); // bucket helm, ears through the top
  p.rect(14, 8, 24, 8, "S");
  p.rect(14, 10, 24, 10, "k"); // visor slit
  p.rect(14, 12, 15, 14, "s"); // cheek guards
  p.rect(23, 12, 24, 14, "s");
  p.rect(7, 14, 15, 19, "s"); // chest and back plate with rivets
  p.rect(8, 14, 14, 15, "S");
  for (const x of [9, 12, 14]) p.px(x, 17, "k");
  p.ell(15, 14, 2.2, 1.8, "S");
  // round shield, bashes forward on act
  const bash = anim === "act" ? [0, 4, 1][i] : 0;
  p.ell(26 + bash, 17, 4, 6.5, "s");
  p.ell(26 + bash, 17, 3, 5.5, "q");
  p.ell(26 + bash, 17, 1.4, 1.4, "g");
  p.rect(26 + bash, 12, 26 + bash, 22, "S");
}

function healer(p: Pen, anim: Anim, i: number) {
  p.ell(19, 8.5, 5.5, 3, "B"); // hood: the face stays visible
  p.rect(13, 9, 14, 14, "B");
  p.rect(13, 6, 14, 6, "B");
  p.rect(14, 8, 24, 8, "W");
  p.ell(10, 18, 7, 4.2, "B"); // robe with a gold hem
  p.rect(5, 21, 16, 21, "g");
  p.rect(6, 17, 14, 17, "q");
  p.rect(9, 16, 11, 16, "g");
  const lift = anim === "act" ? [0, -2, -1][i] : 0;
  p.rect(25, 10 + lift, 25, 25, "w");
  p.rect(24, 5 + lift, 26, 5 + lift, "g"); // cross
  p.rect(25, 3 + lift, 25, 8 + lift, "g");
  if (anim === "act" && i > 0) {
    p.px(23, 3 + lift, "G");
    p.px(27, 3 + lift, "G");
    p.px(23, 8 + lift, "G");
    p.px(27, 8 + lift, "G");
  }
}

function druid(p: Pen, anim: Anim, i: number) {
  p.line(14, 7, 12, 3, "w"); // antlers
  p.line(13, 5, 11, 5, "w");
  p.line(23, 7, 25, 3, "w");
  p.line(24, 5, 26, 5, "w");
  for (const [x, y] of [[15, 8], [17, 7], [19, 7], [21, 7], [23, 8]]) p.rect(x, y, x + 1, y + 1, "l"); // leaf crown
  p.px(19, 7, "G");
  p.line(7, 14, 15, 20, "l"); // vine wrap with leaves
  p.line(7, 15, 15, 21, "L");
  for (const [x, y] of [[9, 14], [12, 16], [14, 18]]) p.px(x, y, "G");
  const sway = anim === "act" ? [0, 1, 2][i] : 0;
  p.line(25, 9, 24, 25, "w"); // gnarled staff with a bud
  p.rect(23, 7, 26, 9, "w");
  p.ell(25, 5, 2, 2, anim === "act" ? "G" : "l");
  p.px(26 + sway, 3, "G");
}

const GEAR: Record<Role, (p: Pen, anim: Anim, i: number) => void> = { warrior, witch, tank, healer, druid };

/** One finished frame of a role's cat. */
export function catFrame(role: Role, anim: Anim, i: number): string[] {
  const g = blank(W, H);
  const bob = anim === "walk" ? [0, -1, 0, -1][i] : anim === "idle" ? [0, 1][i] : 0;
  const lean = anim === "act" ? [-1, 1, 0][i] : 0;
  const upper = new Pen(g, lean, bob);
  const legs = new Pen(g, 0, 0);
  drawCat(upper, anim, i, legs, role === "tank" ? 1 : 0);
  GEAR[role](upper, anim, i);
  return outline(g).map((r) => r.join(""));
}

/** The "Merge Conflict" bug slime (24 x 20). */
export const SLIME = { w: 24, h: 20 };
export const slimePalette: Record<string, string> = { o: "#14101f", c: "#b31e32", d: "#7d1220", h: "#e8566b", W: "#ffffff", y: "#ffd23f", k: "#14101f" };
export function slimeFrame(i: number, hit = false): string[] {
  const g = blank(SLIME.w, SLIME.h);
  const p = new Pen(g);
  const sq = i % 2; // squash
  p.ell(12, 13 - sq * 0.5, 10, 6 + sq * 0.5 + 0, hit ? "W" : "c");
  if (!hit) {
    p.rect(4, 16, 20, 17, "d");
    p.line(6, 9, 9, 8, "h");
    p.line(15, 7, 18, 8, "h");
  }
  // antennae and bug eyes
  p.line(8, 8, 5, 3, hit ? "W" : "d");
  p.line(16, 8, 19, 3, hit ? "W" : "d");
  p.px(5, 2, "y");
  p.px(19, 2, "y");
  p.rect(8, 11, 10, 13, "W");
  p.rect(14, 11, 16, 13, "W");
  p.px(10, 12, "k");
  p.px(14, 12, "k");
  p.line(8, 16, 10, 15, "k"); // angry mouth
  p.line(10, 15, 13, 16, "k");
  p.line(13, 16, 16, 15, "k");
  return outline(g).map((r) => r.join(""));
}

// ---- drawing: every frame is rendered once to a small canvas and then copied
const cache = new Map<string, HTMLCanvasElement>();
function render(key: string, rows: string[], pal: Record<string, string>) {
  let c = cache.get(key);
  if (c) return c;
  c = document.createElement("canvas");
  c.width = rows[0].length;
  c.height = rows.length;
  const ctx = c.getContext("2d")!;
  rows.forEach((r, y) =>
    [...r].forEach((ch, x) => {
      if (ch === "." || !pal[ch]) return;
      ctx.fillStyle = pal[ch];
      ctx.fillRect(x, y, 1, 1);
    }),
  );
  cache.set(key, c);
  return c;
}

/** Draw a cat frame at integer pixel position (x, y) of the scene; flip = face left. */
export function drawCat2D(ctx: CanvasRenderingContext2D, role: Role, anim: Anim, i: number, x: number, y: number, flip = false) {
  const c = render(`${role}-${anim}-${i % FRAMES[anim]}`, catFrame(role, anim, i % FRAMES[anim]), palette(role));
  ctx.save();
  if (flip) {
    ctx.translate(x + W, y);
    ctx.scale(-1, 1);
    ctx.drawImage(c, 0, 0);
  } else ctx.drawImage(c, x, y);
  ctx.restore();
}

export function drawSlime(ctx: CanvasRenderingContext2D, i: number, x: number, y: number, hit = false) {
  ctx.drawImage(render(`slime-${i % 2}-${hit}`, slimeFrame(i, hit), slimePalette), x, y);
}
