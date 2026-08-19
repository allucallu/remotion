import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

// Memuat Google Font Inter
const { fontFamily: interFont } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type LowerThirdBg = 'black' | 'greenscreen' | string;

export interface LowerThirdProps {
  title?: string;
  subtitle?: string;
  accentColor?: string;
  backgroundColor?: LowerThirdBg;
}

/**
 * Premium 4K Lower Third Stock Asset Component
 * Dynamic props, spring physics entrance/exit, staggered choreography, idle breathing micro-motion.
 */
export const LowerThird: React.FC<LowerThirdProps> = ({
  title = 'NAMA LENGKAP',
  subtitle = 'Jabatan / Deskripsi Utama',
  accentColor = '#38BDF8',
  backgroundColor = 'black',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Evaluasi warna background (black solid / greenscreen solid / custom hex)
  const resolveBg = (bg: LowerThirdBg) => {
    if (bg === 'black') return '#000000';
    if (bg === 'greenscreen') return '#00FF00';
    return bg;
  };
  const bgColor = resolveBg(backgroundColor);

  // ==========================================
  // TIMELINE ANIMASI (180 Frame @ 30fps = 6.0 Detik)
  // Frame 0-45: Staggered Spring Entrance dengan Overshoot Organik
  // Frame 45-145: Hold Phase + Idle Breathing Sinusoidal Micro-Motion
  // Frame 145-175: Staggered Exit (Gaya Berbeda - Vertical Wipe & Slide Down)
  // Frame 175-180: Hold Quiet End
  // ==========================================

  // --- ENTRANCE SPRINGS (Staggered 3 Elemen) ---
  // 1. Accent Bar Entrance (Frame 5)
  const barEntranceSpring = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 11, mass: 0.7, stiffness: 110 }, // Overshoot halus
  });

  // 2. Main Title Entrance (Frame 14)
  const titleEntranceSpring = spring({
    frame: Math.max(0, frame - 14),
    fps,
    config: { damping: 13, mass: 0.8, stiffness: 100 },
  });

  // 3. Subtitle Entrance (Frame 23)
  const subtitleEntranceSpring = spring({
    frame: Math.max(0, frame - 23),
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 90 },
  });

  // --- EXIT SPRINGS (Frame 145+, Staggered Terbalik & Gaya Beda: Collapse Vertikal) ---
  // Subtitle Exit First (Frame 145)
  const subtitleExitProgress = interpolate(frame, [145, 160], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // Title Exit Second (Frame 152)
  const titleExitProgress = interpolate(frame, [152, 168], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // Accent Bar Exit Last (Frame 160)
  const barExitProgress = interpolate(frame, [160, 175], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.7, 0, 0.84, 0),
  });

  // --- IDLE BREATHING MICRO-MOTION (Frame 45 - 145) ---
  // Micro sine-wave pulse pada skala & glow aksen agar tidak beku saat hold
  const idlePhase = Math.max(0, frame - 45) / 30;
  const idleBarScaleY = frame >= 45 && frame < 145 ? 1.0 + Math.sin(idlePhase * 2.5) * 0.03 : 1.0;
  const idleGlowOpacity = frame >= 45 && frame < 145 ? 0.35 + Math.sin(idlePhase * 3.0) * 0.15 : 0.35;

  // --- KALKULASI PROPERTI TERANIMASI ---
  // 1. Accent Bar Transformation (Entrance: ScaleX 0->1 dengan Spring Overshoot, Exit: ScaleY 1->0 Collapse)
  const barScaleX = barEntranceSpring;
  const barOpacity = interpolate(barExitProgress, [0, 1], [1, 0]);
  const barScaleYExit = interpolate(barExitProgress, [0, 1], [1, 0]);
  const finalBarScaleY = idleBarScaleY * barScaleYExit;

  // 2. Title Card Transformation (Entrance: TranslateX -80px->0px + Opacity 0->1, Exit: TranslateY 0px->40px + Opacity 1->0)
  const titleTranslateX = interpolate(titleEntranceSpring, [0, 1], [-90, 0]);
  const titleOpacityEntrance = interpolate(titleEntranceSpring, [0, 1], [0, 1]);
  const titleOpacityExit = interpolate(titleExitProgress, [0, 1], [1, 0]);
  const titleTranslateYExit = interpolate(titleExitProgress, [0, 1], [0, 45]);
  const finalTitleOpacity = titleOpacityEntrance * titleOpacityExit;

  // 3. Subtitle Card Transformation (Entrance: Clip Path / ScaleY 0->1, Exit: Fade + Slide Right)
  const subtitleScaleY = interpolate(subtitleEntranceSpring, [0, 1], [0, 1]);
  const subtitleOpacityEntrance = interpolate(subtitleEntranceSpring, [0, 1], [0, 1]);
  const subtitleOpacityExit = interpolate(subtitleExitProgress, [0, 1], [1, 0]);
  const subtitleTranslateXExit = interpolate(subtitleExitProgress, [0, 1], [0, 60]);
  const finalSubtitleOpacity = subtitleOpacityEntrance * subtitleOpacityExit;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
      }}
    >
      {/* LOWER THIRD CONTAINER (Positioned in Lower-Left 4K Safe Margin) */}
      <div
        style={{
          position: 'absolute',
          bottom: '240px',
          left: '200px',
          display: 'flex',
          alignItems: 'stretch',
          gap: '24px',
        }}
      >
        {/* ELEMEN 1: ACCENT VERTICAL BAR */}
        <div
          style={{
            width: '16px',
            backgroundColor: accentColor,
            borderRadius: '8px',
            boxShadow: `0 0 30px ${accentColor}`,
            opacity: barOpacity,
            transform: `scaleX(${barScaleX}) scaleY(${finalBarScaleY})`,
            transformOrigin: 'left center',
          }}
        />

        {/* CONTENT CONTAINER (Title & Subtitle Stack) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          {/* ELEMEN 2: MAIN TITLE BOX */}
          <div
            style={{
              opacity: finalTitleOpacity,
              transform: `translateX(${titleTranslateX}px) translateY(${titleTranslateYExit}px)`,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(18, 18, 22, 0.88)',
              borderLeft: `3px solid ${accentColor}`,
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '16px 36px',
              borderRadius: '0px 16px 16px 0px',
              backdropFilter: 'blur(20px)',
              boxShadow: `0 20px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.03)`,
            }}
          >
            <span
              style={{
                fontSize: '56px',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '4px',
                textTransform: 'uppercase',
                lineHeight: 1.1,
              }}
            >
              {title}
            </span>
          </div>

          {/* ELEMEN 3: SUBTITLE BOX */}
          <div
            style={{
              opacity: finalSubtitleOpacity,
              transform: `scaleY(${subtitleScaleY}) translateX(${subtitleTranslateXExit}px)`,
              transformOrigin: 'top left',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              backgroundColor: 'rgba(28, 28, 35, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '12px 28px',
              borderRadius: '12px',
              backdropFilter: 'blur(16px)',
              width: 'fit-content',
            }}
          >
            {/* Small Glowing Indicator Dot */}
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: accentColor,
                opacity: idleGlowOpacity + 0.3,
                boxShadow: `0 0 10px ${accentColor}`,
              }}
            />
            <span
              style={{
                fontSize: '32px',
                fontWeight: 600,
                color: '#D4D4D8',
                letterSpacing: '2px',
                lineHeight: 1.1,
              }}
            >
              {subtitle}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
