import { Easing } from 'remotion';

export const easeOutExpo = Easing.out(Easing.exp);
export const easeOutCubic = Easing.out(Easing.cubic);
export const easeInOutCubic = Easing.inOut(Easing.cubic);

export const hudSnapSpringConfig = { damping: 12, stiffness: 140 };
export const gentleRotationSpringConfig = { damping: 20, stiffness: 60 };
