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
  
  // Terminal UI
  termGreen: "#00FF41",
  termGreenGlow: "rgba(0,255,65,0.4)",
  termRed: "#FF003C",
  termRedGlow: "rgba(255,0,60,0.5)",
  termCyan: "#00F0FF",
  termCyanGlow: "rgba(0,240,255,0.5)",
  termBg: "#0A0A0A",
  
  // News Tickers
  newsRed: "#E60000",
  alertYellow: "#FFCC00",
  
  // Retro VHS
  vhsWhite: "#E2E2E2",
  vhsStatic: "rgba(255,255,255,0.15)",
  
  // Sports Overlays
  sportBlue: "#001D4A",
  sportBlueGlow: "rgba(0,29,74,0.6)",
  sportNeonGreen: "#CCFF00",
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
