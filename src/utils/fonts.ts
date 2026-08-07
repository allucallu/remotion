import { loadFont } from '@remotion/google-fonts/PlayfairDisplay';

const { fontFamily } = loadFont('normal', {
  weights: ['700'],
  ignoreTooManyRequestsWarning: true,
});

export const playfairFontFamily = fontFamily;
