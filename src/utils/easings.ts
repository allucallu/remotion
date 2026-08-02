import { Easing } from 'remotion';

export const easeOutExpo = Easing.out(Easing.exp);
export const easeOutCubic = Easing.out(Easing.cubic);
export const easeInOutCubic = Easing.inOut(Easing.cubic);
export const easeOutBack = Easing.out(Easing.back(1.5));
export const easeElastic = Easing.out(Easing.elastic(1));

export const premiumEase = Easing.bezier(0.16, 1, 0.3, 1);
