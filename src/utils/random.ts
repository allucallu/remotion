/**
 * Seeded pseudo-random number generator (PRNG).
 * Ensures deterministic rendering across frame executions.
 * Returns a float between 0 (inclusive) and 1 (exclusive).
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999 + 1) * 10000;
  return x - Math.floor(x);
}

/**
 * Multi-frequency sinusoidal oscillation generator.
 * Combines 3 irrational sine waves to produce organic micro-flickers
 * and natural floating sways without linear repetition.
 */
export function multiSine(
  frame: number,
  baseFrequency: number = 0.05,
  seedOffset: number = 0,
  amplitude: number = 1
): number {
  const f = frame * baseFrequency + seedOffset;
  const sin1 = Math.sin(f);
  const sin2 = Math.sin(f * 1.618033) * 0.5; // Golden ratio frequency multiplier
  const sin3 = Math.sin(f * 2.414213) * 0.25; // Silver ratio frequency multiplier
  return ((sin1 + sin2 + sin3) / 1.75) * amplitude;
}
