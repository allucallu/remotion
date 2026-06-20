import { Easing, interpolate, spring } from "remotion";

// ─── CANVAS CONSTANTS ────────────────────────────────────────────────────────
export const W4K = 3840;
export const H4K = 2160;
export const CX = W4K / 2;
export const CY = H4K / 2;
export const FPS = 30;

// ─── COLOR PALETTE ───────────────────────────────────────────────────────────
export const C = {
  black: "#000000",
  white: "#FFFFFF",
  gray: "#A0A0A0",
  
  // Neon Cyberpunk / Idle Game HUD Palette
  neonCyan: "#00FFFF",
  neonCyanGlow: "rgba(0, 255, 255, 0.5)",
  neonPink: "#FF00FF",
  neonPinkGlow: "rgba(255, 0, 255, 0.5)",
  neonGold: "#FFD700",
  neonGoldGlow: "rgba(255, 215, 0, 0.5)",
  neonRed: "#FF3333",
  neonRedGlow: "rgba(255, 51, 51, 0.5)",
  neonGreen: "#39FF14",
  neonGreenGlow: "rgba(57, 255, 20, 0.5)",
};

// ─── EASING & INTERPOLATION HELPERS ──────────────────────────────────────────
export const EaseOutBack = Easing.out(Easing.back(1.5));
export const EaseOutExpo = Easing.out(Easing.exp);
export const EaseOut = Easing.out(Easing.ease);
export const EaseInOut = Easing.inOut(Easing.ease);

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

// ─── SPRING CONFIGS ─────────────────────────────────────────────────────────
export const SPRING = {
  bouncy: { damping: 12, stiffness: 150, mass: 1 },
  wobbly: { damping: 8, stiffness: 120, mass: 1.2 },
  snappy: { damping: 16, stiffness: 200, mass: 0.8 },
  stiff: { damping: 20, stiffness: 300, mass: 1 },
};

// ─── UTILS ──────────────────────────────────────────────────────────────────
/** Generate random number between min and max */
export const random = (min: number, max: number) => Math.random() * (max - min) + min;

/** Pseudo-random based on seed (useful for deterministic Remotion renders) */
export const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};
