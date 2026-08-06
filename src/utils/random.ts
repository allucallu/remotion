/**
 * Deterministic pseudo-random number generator (0 to 1) based on integer seed.
 * Ensures 100% reproducible frame rendering without raw Math.random().
 */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9999 + 12345) * 43758.5453123;
  return x - Math.floor(x);
}

const HEX_CHARS = '0123456789ABCDEF';
const TECH_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&*<>[]{}';

/**
 * Generates a deterministic scrambled text string based on frame index and seed.
 */
export function scrambleText(length: number, frame: number, seed: number = 42, charset: string = TECH_CHARS): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const charIndex = Math.floor(seededRandom(frame * 100 + i * 17 + seed) * charset.length);
    result += charset[charIndex];
  }
  return result;
}

export function scrambleHex(length: number, frame: number, seed: number = 99): string {
  return scrambleText(length, frame, seed, HEX_CHARS);
}
