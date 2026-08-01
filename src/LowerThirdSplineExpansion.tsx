import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * REVISED BATCH - TEMA 1: LIQUID & ORGANIC MORPH
 * Konsep 2: LowerThirdSplineExpansion (SVG Spline Fluid Stretch & Radial Gradient Shifting)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame bawah (+2200px Y & +3840px X), tetesan/vektor fluid SVG melengkung (spline path) meregang (stretch) menyilang frame lalu mengendap menjadi backdrop transparan yang anggun.
 * Memiliki deformasi fisika scaleX/scaleY yang elastis saat mendarat.
 * Menggunakan fisika spring Elegant/Dramatic: { mass: 2, damping: 20, stiffness: 80 }.
 *
 * FINISHING & TEKSTUR:
 * Radial Gradient pendaran cair shifting aktif menyusui jalur spline dengan drop-shadow lunak.
 *
 * EXIT ANIMATION:
 * Menguncup membal ke titik spline dan meluncur keluar melintasi batas frame bottom-right (+3840px, +1800px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 250px, Top = 1570px, Width = 2150px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 270px, Top = 1680px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdSplineExpansion: React.FC<LowerThirdProps> = ({
  primaryColor = '#065F46',
  accentColor = '#10B981',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Spring Configurations
  const springDramatic = spring({
    frame: localFrame,
    fps,
    config: { mass: 2, damping: 20, stiffness: 80 },
  });

  const springMicroGlow = spring({
    frame: Math.max(0, localFrame - 32),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 2, damping: 20, stiffness: 80 },
  });

  // Offscreen Interpolations (+2200px Y & +3840px X Bottom-Right)
  const translateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(springDramatic, [0, 1], [3840, 0]);

  const translateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 1800])
    : interpolate(springDramatic, [0, 1], [1800, 0]);

  const scaleX = isExiting
    ? interpolate(exitSpring, [0, 1], [1, 0.05])
    : interpolate(springDramatic, [0, 0.5, 0.8, 1], [0.1, 1.3, 0.95, 1]);

  const glowProgress = interpolate(springMicroGlow, [0, 1], [0, 1]);
  const glowExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

  const baseLeft = 200;
  const baseTop = 1530;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: baseLeft,
          top: baseTop,
          width: 2250,
          height: 250,
          transform: `translate3d(${translateX}px, ${translateY}px, 0) scaleX(${scaleX})`,
          transformOrigin: 'right center',
          filter: 'drop-shadow(0px 25px 40px rgba(0,0,0,0.65))',
        }}
      >
        <svg width="2250" height="250" viewBox="0 0 2250 250" fill="none">
          <defs>
            <radialGradient id="splineRadial" cx="30%" cy="50%" r="70%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.9" />
              <stop offset="50%" stopColor={primaryColor} stopOpacity="0.95" />
              <stop offset="100%" stopColor="#022C22" stopOpacity="0.98" />
            </radialGradient>
            <linearGradient id="splineSub" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#047857" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#064E3B" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Subtier Fluid Spline Path */}
          <path
            d="M 50,135 C 400,165 900,115 1400,155 C 1750,185 2000,135 2200,140 L 2200,230 L 50,230 Z"
            fill="url(#splineSub)"
          />

          {/* Main Curved Spline Expansion Path */}
          <path
            d="M 0,25 C 500,-15 1000,45 1500,5 C 1850,-25 2100,25 2250,15 L 2250,150 L 0,150 Z"
            fill="url(#splineRadial)"
            stroke={accentColor}
            strokeWidth="3"
          />
        </svg>

        {/* SECONDARY MOTION: Micro Snap Fluid Glow Drop */}
        <div
          style={{
            position: 'absolute',
            left: 2180,
            top: 10,
            width: 32,
            height: 32,
            backgroundColor: accentColor,
            borderRadius: '50%',
            transformOrigin: 'center center',
            transform: `translate3d(${glowExitX}px, 0, 0) scale(${isExiting ? 1 : glowProgress})`,
            boxShadow: `0 0 30px ${accentColor}, 0 0 60px ${accentColor}`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 250px, Top = 1570px, Width = 2150px, Height = 100px
        - Subtitle Line:     Left = 270px, Top = 1680px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
