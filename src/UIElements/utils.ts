import { Easing, interpolate, spring as remotionSpring } from "remotion";

// ─── CANVAS CONSTANTS (4K UHD) ──────────────────────────────────────────────
export const W4K = 3840;
export const H4K = 2160;
export const CX = W4K / 2;
export const CY = H4K / 2;
export const FPS = 30;

// ─── COLOR PALETTE (Global Defaults, item can override) ────────────────────
export const C = {
  black: "#000000",       // pure black
  white: "#FFFFFF",
  textPrimary: "#E8E8E8", // off-white
  textDim: "#6B7280",     // abu gelap
  
  // Neon Palette (contoh, digunakan secara bebas per item)
  cyan: "#00F5FF",
  magenta: "#FF2D78",
  gold: "#FFD700",
  red: "#FF3B30",
  lime: "#39FF14",
  blue: "#0055FF",
};

// ─── GLOW FORMULAS ──────────────────────────────────────────────────────────
export const getGlow = (color: string) => {
  // 3-layer standard glow
  return `drop-shadow(0 0 4px ${color}) drop-shadow(0 0 14px ${color}) drop-shadow(0 0 30px ${color}80)`;
};

export const getGlowClimax = (color: string) => {
  // 4-layer intense glow
  return `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 20px ${color}) drop-shadow(0 0 50px ${color}) drop-shadow(0 0 80px ${color}4D)`;
};

export const getGlowDim = (color: string) => {
  // 2-layer dim glow
  return `drop-shadow(0 0 3px ${color}CC) drop-shadow(0 0 8px ${color}66)`;
};

// ─── EASING & SPRINGS STANDARD ──────────────────────────────────────────────
/** Clamped interpolate shorthand */
export const ci = (
  val: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = Easing.linear
) => {
  return interpolate(val, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
};

/** Spring Pop (kaku) */
export const springPop = (frame: number, delay: number = 0, from: number = 0, to: number = 1) => {
  return remotionSpring({ frame: frame - delay, fps: FPS, config: { stiffness: 150, damping: 18 }, from, to });
};

/** Spring Organic (mengalir) */
export const springOrganic = (frame: number, delay: number = 0, from: number = 0, to: number = 1) => {
  return remotionSpring({ frame: frame - delay, fps: FPS, config: { stiffness: 80, damping: 20 }, from, to });
};

/** Spring Bouncy (membal) */
export const springBouncy = (frame: number, delay: number = 0, from: number = 0, to: number = 1) => {
  return remotionSpring({ frame: frame - delay, fps: FPS, config: { stiffness: 200, damping: 14 }, from, to });
};

// ─── IDLE MICRO-ANIMATION GENERATORS ────────────────────────────────────────
export const idlePulse = (frame: number, startFrame: number, offset: number = 0) => {
  if (frame < startFrame) return 1;
  // cycle: 90 frame
  // opacity 0.75 -> 1.0 -> 0.75 via Math.sin
  const cycleFrame = (frame - startFrame + offset) % 90;
  // Math.sin(0..2PI) goes 0 -> 1 -> 0 -> -1 -> 0. We want 0.75 to 1.0
  return 0.875 + 0.125 * Math.sin((cycleFrame / 90) * Math.PI * 2);
};

export const textFlicker = (frame: number, startFrame: number, freq: number = 90) => {
  if (frame < startFrame) return 1;
  const t = (frame - startFrame) % freq;
  if (t === 0) return 0.1;
  return 1;
};

// ─── UTILS ──────────────────────────────────────────────────────────────────
export const random = (min: number, max: number) => Math.random() * (max - min) + min;

export const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};
