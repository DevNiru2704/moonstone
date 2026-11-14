// Original synthesized chiptune for /meow: music and sound effects are generated with the Web Audio API,
// so there are no audio files and no licences. Everything stays silent until the visitor switches sound on.

export type Track = "battle" | "boss";
export type Sfx = "slash" | "hit" | "lunge" | "defeat" | "warning" | "bolt" | "bash" | "heal" | "twinkle" | "blip" | "victory";

const mtof = (m: number) => 440 * 2 ** ((m - 69) / 12);

type Ctx = BaseAudioContext;
type Bus = AudioNode;

/** A single oscillator note with a quick envelope, optionally sweeping to `to` Hz. */
function tone(ctx: Ctx, bus: Bus, t: number, f: number, dur: number, type: OscillatorType, gain: number, to?: number, wave?: PeriodicWave) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  if (wave) o.setPeriodicWave(wave);
  else o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (to) o.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.004);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(bus);
  o.start(t);
  o.stop(t + dur + 0.02);
}

let noiseBuf: AudioBuffer | null = null;
function noise(ctx: Ctx, bus: Bus, t: number, dur: number, gain: number, hp = 2000) {
  if (!noiseBuf || noiseBuf.sampleRate !== ctx.sampleRate) {
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = "highpass";
  f.frequency.value = hp;
  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(g).connect(bus);
  s.start(t);
  s.stop(t + dur + 0.02);
}

const pulse = (ctx: Ctx, duty: number) => {
  // a pulse wave of the given duty cycle from its Fourier series
  const n = 32;
  const re = new Float32Array(n);
  const im = new Float32Array(n);
  for (let k = 1; k < n; k++) im[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * duty);
  return ctx.createPeriodicWave(re, im);
};

// ---- music: A minor battle loop (8 bars) and a faster, darker boss loop
const MINOR_PENT = [0, 3, 5, 7, 10];
const TRACKS: Record<Track, { bpm: number; roots: number[]; major: boolean[]; lead: number[]; leadOct: number; duty: number }> = {
  battle: {
    bpm: 150,
    roots: [45, 45, 41, 41, 36, 36, 43, 43], // A F C G, two bars each
    major: [false, false, true, true, true, true, true, true],
    // melody in minor-pentatonic degrees (-1 = rest), 16 steps a bar
    lead: [4, -1, 3, -1, 2, -1, 3, 4, -1, -1, 2, -1, 1, -1, 0, -1, 3, -1, 2, -1, 1, -1, 2, 3, -1, -1, 4, -1, 3, -1, -1, -1],
    leadOct: 36,
    duty: 0.25,
  },
  boss: {
    bpm: 172,
    roots: [45, 43, 41, 40, 45, 43, 41, 40], // A G F E, one bar each
    major: [false, true, true, true, false, true, true, true],
    lead: [4, 4, -1, 3, 4, -1, 2, -1, 4, 4, -1, 3, 4, -1, 1, -1, 3, 3, -1, 2, 3, -1, 1, -1, 2, 2, -1, 1, 2, -1, 0, -1],
    leadOct: 48,
    duty: 0.5,
  },
};

/** Schedules one 16th-note step of a track at time t. */
export function scheduleStep(ctx: Ctx, bus: Bus, track: Track, step: number, t: number) {
  const tr = TRACKS[track];
  const barLen = 16;
  const bar = Math.floor(step / barLen) % tr.roots.length;
  const s = step % barLen;
  const root = tr.roots[bar];
  const third = tr.major[bar] ? 4 : 3;
  const sd = 60 / tr.bpm / 4;
  // bass: triangle on the 8ths, octave jumps
  if (s % 2 === 0) tone(ctx, bus, t, mtof(root + (s % 8 === 6 ? 12 : 0)), sd * 1.8, "triangle", 0.5);
  // arpeggio
  const arp = [0, third, 7, 12][s % 4];
  tone(ctx, bus, t, mtof(root + 24 + arp), sd * 0.9, "square", 0.07, undefined, pulse(ctx, 0.125));
  // lead
  const deg = tr.lead[(Math.floor(step / barLen) % 2) * 16 + s];
  if (deg >= 0) tone(ctx, bus, t, mtof(tr.leadOct + 33 + MINOR_PENT[deg % 5] + 12 * Math.floor(deg / 5)), sd * 1.6, "square", 0.12, undefined, pulse(ctx, tr.duty));
  // drums
  const kick = track === "boss" ? [0, 3, 8, 10].includes(s) : s === 0 || s === 8;
  if (kick) tone(ctx, bus, t, 150, 0.12, "sine", 0.7, 45);
  if (s === 4 || s === 12) noise(ctx, bus, t, 0.14, 0.35, 1200);
  if (s % 2 === 0) noise(ctx, bus, t, 0.04, 0.12, 6000);
}

const SFX: Record<Sfx, (ctx: Ctx, bus: Bus, t: number) => number> = {
  slash: (c, b, t) => (noise(c, b, t, 0.14, 0.5, 2500), tone(c, b, t, 900, 0.14, "square", 0.25, 200), 0.2),
  hit: (c, b, t) => (tone(c, b, t, 180, 0.14, "square", 0.5, 50), noise(c, b, t, 0.08, 0.3, 800), 0.2),
  lunge: (c, b, t) => (tone(c, b, t, 140, 0.25, "sawtooth", 0.3, 60), 0.3),
  defeat: (c, b, t) => (tone(c, b, t, 700, 0.5, "square", 0.3, 60), noise(c, b, t, 0.3, 0.3, 1500), 0.6),
  warning: (c, b, t) => ([0, 1, 2, 3, 4, 5].forEach((i) => tone(c, b, t + i * 0.16, i % 2 ? 330 : 440, 0.14, "square", 0.3)), 1),
  bolt: (c, b, t) => (tone(c, b, t, 300, 0.35, "square", 0.25, 1400), 0.4),
  bash: (c, b, t) => (tone(c, b, t, 110, 0.2, "sine", 0.7, 40), noise(c, b, t, 0.1, 0.4, 900), 0.3),
  heal: (c, b, t) => ([523, 659, 784, 1047].forEach((f, i) => tone(c, b, t + i * 0.08, f, 0.16, "triangle", 0.3)), 0.5),
  twinkle: (c, b, t) => ([1319, 1568, 1976].forEach((f, i) => tone(c, b, t + i * 0.07, f, 0.14, "sine", 0.25)), 0.4),
  blip: (c, b, t) => (tone(c, b, t, 880, 0.05, "square", 0.2), 0.1),
  victory: (c, b, t) => {
    const n: [number, number][] = [[523, 0], [523, 0.12], [523, 0.24], [523, 0.36], [415, 0.52], [466, 0.68], [523, 0.84], [466, 0.98], [523, 1.12]];
    n.forEach(([f, d], i) => tone(c, b, t + d, f, i === 8 ? 0.6 : 0.12, "square", 0.3, undefined, pulse(c, 0.25)));
    return 1.8;
  },
};

/** Renders one sound effect or a stretch of a track offline (used to check the audio without speakers). */
export async function renderOffline(what: { sfx: Sfx } | { track: Track; seconds: number }) {
  const rate = 22050;
  const secs = "sfx" in what ? 2 : what.seconds;
  const ctx = new OfflineAudioContext(1, rate * secs, rate);
  const master = ctx.createGain();
  master.connect(ctx.destination);
  if ("sfx" in what) SFX[what.sfx](ctx, master, 0);
  else {
    const sd = 60 / TRACKS[what.track].bpm / 4;
    for (let s = 0, t = 0; t < secs; s++, t = s * sd) scheduleStep(ctx, master, what.track, s, t);
  }
  const buf = await ctx.startRendering();
  const d = buf.getChannelData(0);
  let peak = 0;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    peak = Math.max(peak, Math.abs(d[i]));
    sum += d[i] * d[i];
  }
  return { peak, rms: Math.sqrt(sum / d.length) };
}

/** The live engine: one AudioContext, created on the first user gesture. */
class Chip {
  private ctx: AudioContext | null = null;
  private music: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private want: Track | null = null;
  private playing: Track | null = null;
  private step = 0;
  private next = 0;
  private holdUntil = 0;
  on = false;

  /** Switch sound on (call from a click) or off. */
  enable(on: boolean) {
    this.on = on;
    if (!on) {
      this.stopLoop();
      this.ctx?.suspend();
      return;
    }
    if (!this.ctx) {
      this.ctx = new AudioContext();
      const comp = this.ctx.createDynamicsCompressor();
      const master = this.ctx.createGain();
      master.gain.value = 0.2;
      this.music = this.ctx.createGain();
      this.music.gain.value = 0.55;
      this.sfxBus = this.ctx.createGain();
      this.music.connect(comp);
      this.sfxBus.connect(comp);
      comp.connect(master).connect(this.ctx.destination);
    }
    this.ctx.resume();
    this.sync();
    this.sfx("blip");
  }

  /** Which track should be playing (remembered even while muted). */
  setTrack(t: Track | null) {
    this.want = t;
    this.sync();
  }

  sfx(name: Sfx) {
    if (!this.on || !this.ctx || !this.sfxBus) return;
    const len = SFX[name](this.ctx, this.sfxBus, this.ctx.currentTime + 0.01);
    if (name === "victory") this.holdUntil = this.ctx.currentTime + len;
  }

  suspend(hidden: boolean) {
    if (!this.ctx || !this.on) return;
    if (hidden) this.ctx.suspend();
    else this.ctx.resume();
  }

  dispose() {
    this.stopLoop();
    this.on = false;
    this.want = null;
    this.ctx?.close();
    this.ctx = this.music = this.sfxBus = null;
  }

  private sync() {
    if (!this.on || !this.ctx) return;
    if (this.want !== this.playing) {
      this.stopLoop();
      if (this.want) this.startLoop(this.want);
    }
  }

  private startLoop(t: Track) {
    const ctx = this.ctx!;
    this.playing = t;
    this.step = 0;
    this.next = ctx.currentTime + 0.1;
    this.timer = setInterval(() => {
      const sd = 60 / TRACKS[t].bpm / 4;
      // look ahead 120 ms; stay quiet while the victory jingle plays
      while (this.next < ctx.currentTime + 0.12) {
        if (this.next >= this.holdUntil) scheduleStep(ctx, this.music!, t, this.step, this.next);
        this.step++;
        this.next += sd;
      }
    }, 25);
  }

  private stopLoop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.playing = null;
  }
}

export const chip = new Chip();
