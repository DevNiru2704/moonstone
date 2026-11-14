// Backdrop helpers for the pixel scenes: everything is drawn with integer 1px rects on a small canvas.
export const rect = (ctx: CanvasRenderingContext2D, c: string, x: number, y: number, w: number, h: number) => {
  ctx.fillStyle = c;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
};

const STARS = Array.from({ length: 34 }, (_, i) => ({ x: ((i * 73 + 11) % 1000) / 1000, y: (((i * 37 + 5) % 1000) / 1000) * 0.6, p: i * 0.7 }));

export function sky(ctx: CanvasRenderingContext2D, w: number, gy: number, t: number) {
  const bands = ["#070a22", "#0b1233", "#101a45", "#162456", "#1d2f68"];
  bands.forEach((c, i) => rect(ctx, c, 0, Math.floor((i * gy) / bands.length), w, Math.ceil(gy / bands.length) + 1));
  for (const s of STARS) if (Math.sin(t * 2 + s.p) > -0.4) rect(ctx, s.p % 3 < 1 ? "#ffffff" : "#b9c6ff", s.x * w, s.y * gy, 1, 1);
}

export function moon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  for (let y = -r - 3; y <= r + 3; y++)
    for (let x = -r - 3; x <= r + 3; x++) {
      const d = Math.hypot(x, y);
      if (d <= r) rect(ctx, d > r - 1.5 && x < 0 ? "#d9d4b8" : "#f4f1de", cx + x, cy + y, 1, 1);
      else if (d <= r + 2.5 && (x + y) % 2 === 0) rect(ctx, "#2a3a7c", cx + x, cy + y, 1, 1);
    }
  rect(ctx, "#d9d4b8", cx + 2, cy - 3, 3, 2);
  rect(ctx, "#d9d4b8", cx - 4, cy + 2, 2, 2);
}

export function hills(ctx: CanvasRenderingContext2D, w: number, gy: number, off: number, color: string, base: number, amp: number, period: number) {
  for (let x = 0; x < w; x++) {
    const y = gy - base - amp * (0.5 + 0.5 * Math.sin((x + off) / period));
    rect(ctx, color, x, y, 1, gy - y);
  }
}

/** A castle silhouette repeating every `tile` px, scrolling by `off`. */
export function castle(ctx: CanvasRenderingContext2D, w: number, gy: number, off: number, tile = 150) {
  const c = "#101535";
  const x0 = -(((off % tile) + tile) % tile);
  for (let x = x0; x < w; x += tile) {
    rect(ctx, c, x + 10, gy - 22, 56, 22, ); // wall
    for (let k = 0; k < 6; k++) rect(ctx, c, x + 10 + k * 10, gy - 25, 5, 3); // crenels
    rect(ctx, c, x + 4, gy - 40, 14, 40);
    rect(ctx, c, x + 2, gy - 44, 18, 5);
    rect(ctx, c, x + 54, gy - 36, 14, 36);
    rect(ctx, c, x + 52, gy - 40, 18, 5);
    rect(ctx, c, x + 28, gy - 33, 12, 33);
    for (let k = 0; k < 3; k++) rect(ctx, c, x + 28 + k * 5, gy - 36, 3, 3);
    for (const [wx, wy] of [[9, 32], [59, 28], [33, 26]]) rect(ctx, "#f2c14e", x + wx, gy - wy, 2, 3);
  }
}

export function ground(ctx: CanvasRenderingContext2D, w: number, h: number, gy: number, off: number) {
  rect(ctx, "#3f8a5a", 0, gy, w, 2);
  rect(ctx, "#2f6b46", 0, gy + 2, w, 1);
  rect(ctx, "#2b2250", 0, gy + 3, w, h - gy - 3);
  const o = ((Math.floor(off) % 12) + 12) % 12;
  for (let x = -12; x < w + 12; x += 12) {
    rect(ctx, "#3a2f66", x - o, gy + 6, 5, 1);
    rect(ctx, "#1f183d", x - o + 6, gy + 10, 4, 1);
  }
}
