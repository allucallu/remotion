export const premiumEase = (t: number) => {
  // custom cubic — signature curve, bukan easeInOut generik
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const cardBg = 'radial-gradient(circle at 30% 20%, #16161a, #09090b 80%)';
export const cardShadow = '0 25px 60px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.05)';

export const lightenColor = (hex: string, percent: number): string => {
  try {
    const cleanHex = hex.replace('#', '');
    const num = parseInt(cleanHex, 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    const newR = Math.min(255, Math.max(0, R));
    const newG = Math.min(255, Math.max(0, G));
    const newB = Math.min(255, Math.max(0, B));
    return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
  } catch {
    return hex;
  }
};

export const gradientCss = (color: string) => {
  return `linear-gradient(90deg, ${color} 0%, ${lightenColor(color, 25)} 100%)`;
};

export const glowShadow = (color: string) => {
  return `0 0 20px ${color}66, 0 0 40px ${color}22`;
};
