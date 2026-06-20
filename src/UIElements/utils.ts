import { interpolate, Easing } from "remotion";

// ─── Spring Configs ──────────────────────────────────────────────────────────
export const SPRING = {
  bouncy:  { damping: 8,  stiffness: 100, mass: 1 },
  gentle:  { damping: 15, stiffness: 80,  mass: 1 },
  snappy:  { damping: 20, stiffness: 200, mass: 1 },
  wobbly:  { damping: 5,  stiffness: 120, mass: 1 },
  stiff:   { damping: 30, stiffness: 300, mass: 1 },
  medium:  { damping: 12, stiffness: 150, mass: 1 },
};

// ─── Color Palette ───────────────────────────────────────────────────────────
export const C = {
  // Social Engagement
  heart:        "#FF4D6D",
  heartLight:   "#FF9AB2",
  heartGlow:    "rgba(255,77,109,0.4)",
  comment:      "#4DCCBD",
  commentGlow:  "rgba(77,204,189,0.35)",
  follow:       "#4CC9F0",
  followGlow:   "rgba(76,201,240,0.35)",
  share:        "#F8961E",
  shareGlow:    "rgba(248,150,30,0.35)",
  // Subscribe Button
  subRed:       "#FF3B30",
  subGreen:     "#34C759",
  subRedGlow:   "rgba(255,59,48,0.4)",
  subGreenGlow: "rgba(52,199,89,0.4)",
  // Story Frame
  storyPurple:  "#9B5DE5",
  storyPink:    "#F15BB5",
  storyBlue:    "#00BBF9",
  storyGrad1:   "#9B5DE5",
  storyGrad2:   "#F15BB5",
  storyGrad3:   "#00BBF9",
  // Phone Mockup
  phoneBlue:    "#4361EE",
  phoneBlue2:   "#4CC9F0",
  phoneBg:      "#111827",
  // Loading/Badge
  progressCyan: "#4CC9F0",
  badgeGold:    "#FFB703",
  badgeShadow:  "rgba(255,183,3,0.4)",
  successGreen: "#06D6A0",
  successGlow:  "rgba(6,214,160,0.4)",
  // Neutral
  white:        "#FFFFFF",
  offWhite:     "#F0F0F0",
  gray:         "#888888",
  midGray:      "#555555",
  darkGray:     "#222222",
  black:        "#000000",
};

// ─── Clamped Interpolate Helper ───────────────────────────────────────────────
export const ci = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
  easing?: (t: number) => number,
) =>
  interpolate(frame, inputRange, outputRange, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

// ─── Easing Presets ───────────────────────────────────────────────────────────
export const EaseOutBack  = Easing.bezier(0.34, 1.56, 0.64, 1);
export const EaseOutExpo  = Easing.bezier(0.16, 1,    0.3,  1);
export const EaseInOut    = Easing.bezier(0.45, 0,    0.55, 1);
export const EaseOut      = Easing.bezier(0.0,  0,    0.2,  1);
export const EaseInBack   = Easing.bezier(0.36, 0,    0.66, -0.56);

// ─── Canvas Constants (4K) ────────────────────────────────────────────────────
export const W = 3840;
export const H = 2160;
export const CX = W / 2; // 1920
export const CY = H / 2; // 1080

// ─── Particle Definitions (deterministic, no Math.random) ────────────────────
export const HEART_PARTICLES = [
  { angle: 0,    delay: 5, size: 60, dist: 520 },
  { angle: 36,   delay: 3, size: 46, dist: 460 },
  { angle: 72,   delay: 7, size: 70, dist: 540 },
  { angle: 108,  delay: 4, size: 54, dist: 490 },
  { angle: 144,  delay: 6, size: 64, dist: 510 },
  { angle: 180,  delay: 5, size: 50, dist: 500 },
  { angle: 216,  delay: 3, size: 42, dist: 470 },
  { angle: 252,  delay: 8, size: 68, dist: 535 },
  { angle: 288,  delay: 4, size: 48, dist: 480 },
  { angle: 324,  delay: 6, size: 58, dist: 505 },
];

export const CONFETTI_PARTICLES = [
  { angle: 0,    delay: 5,  size: 18, dist: 380, color: "#FFB703" },
  { angle: 30,   delay: 2,  size: 14, dist: 420, color: "#FF4D6D" },
  { angle: 60,   delay: 7,  size: 20, dist: 350, color: "#4CC9F0" },
  { angle: 90,   delay: 4,  size: 16, dist: 400, color: "#06D6A0" },
  { angle: 120,  delay: 1,  size: 22, dist: 440, color: "#9B5DE5" },
  { angle: 150,  delay: 6,  size: 12, dist: 370, color: "#FFB703" },
  { angle: 180,  delay: 3,  size: 18, dist: 410, color: "#FF4D6D" },
  { angle: 210,  delay: 8,  size: 24, dist: 360, color: "#4CC9F0" },
  { angle: 240,  delay: 5,  size: 14, dist: 430, color: "#06D6A0" },
  { angle: 270,  delay: 2,  size: 20, dist: 390, color: "#9B5DE5" },
  { angle: 300,  delay: 7,  size: 16, dist: 450, color: "#FFB703" },
  { angle: 330,  delay: 4,  size: 22, dist: 380, color: "#FF4D6D" },
];
