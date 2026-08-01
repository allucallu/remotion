import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * REVISED BATCH - TEMA 2: KINETIC TYPOGRAPHIC ANCHOR & EDITORIAL DESIGN
 * Konsep 4: LowerThirdDiagonalSlateShear (SVG Trapesium Asimetris & Dynamic SkewX Shear Distortion)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-2800px top-left & +3840px bottom-right), dua bidang trapesium SVG asimetris meluncur dari sudut berlawanan dengan distorsi skewX tinggi (25 deg) saat bergerak kencang, lalu mengunci presisi di tengah.
 * Memiliki deformasi fisika skewX & scaleX (squash & stretch) yang dipetakan dengan kecepatan spring.
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * FINISHING & TEKSTUR:
 * Gradien kontras tinggi pada tepi trapesium miring, garis aksen magma menyala, dan drop-shadow tajam.
 *
 * EXIT ANIMATION:
 * Bergeser membelah dengan skewX tinggi ke sudut berlawanan (top-left & bottom-right).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 250px, Top = 1580px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 270px, Top = 1690px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdDiagonalSlateShear: React.FC<LowerThirdProps> = ({
  primaryColor = '#18181B',
  accentColor = '#EF4444',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Spring Configurations
  const springSnappy = spring({
    frame: localFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  const springMicroLine = spring({
    frame: Math.max(0, localFrame - 30),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  // Offscreen Interpolations (Diagonal Vector Slips)
  const plane1X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2800])
    : interpolate(springSnappy, [0, 1], [-2800, 0]);
  const plane1Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1800])
    : interpolate(springSnappy, [0, 1], [-1800, 0]);

  const plane2X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(springSnappy, [0, 1], [3840, 0]);
  const plane2Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 1800])
    : interpolate(springSnappy, [0, 1], [1800, 0]);

  // Dynamic SkewX Shear Distortion mapped to spring progress
  const skewX = isExiting
    ? interpolate(exitSpring, [0, 0.5, 1], [0, -25, 0])
    : interpolate(springSnappy, [0, 0.4, 0.8, 1], [30, -12, 3, 0]);

  const lineScaleX = interpolate(springMicroLine, [0, 1], [0, 1]);
  const lineExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

  const baseLeft = 200;
  const baseTop = 1540;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: baseLeft,
          top: baseTop,
          width: 2250,
          height: 250,
          filter: 'drop-shadow(0px 25px 40px rgba(0,0,0,0.8))',
        }}
      >
        <svg width="2250" height="250" viewBox="0 0 2250 250" fill="none">
          <defs>
            <linearGradient id="slateGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor="#27272A" />
            </linearGradient>
            <linearGradient id="slateGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#991B1B" />
              <stop offset="100%" stopColor="#7F1D1D" />
            </linearGradient>
          </defs>

          {/* Trapezoid Plane 1 (from Top-Left with dynamic skewX) */}
          <g transform={`translate(${plane1X}, ${plane1Y}) skewX(${skewX})`}>
            <path
              d="M 0,0 L 1350,0 L 1100,140 L 0,140 Z"
              fill="url(#slateGrad1)"
              stroke={accentColor}
              strokeWidth="4"
            />
            <path
              d="M 40,145 L 1200,145 L 1050,230 L 40,230 Z"
              fill="#27272A"
              opacity="0.9"
            />
          </g>

          {/* Trapezoid Plane 2 (from Bottom-Right with dynamic skewX) */}
          <g transform={`translate(${plane2X}, ${plane2Y}) skewX(${-skewX})`}>
            <path
              d="M 1250,0 L 2200,0 L 2050,140 L 1150,140 Z"
              fill="url(#slateGrad2)"
            />
          </g>
        </svg>

        {/* SECONDARY MOTION: Micro Snap Magma Shear Accent Line */}
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 138,
            width: 2000,
            height: 6,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${lineExitX}px, 0, 0) scaleX(${isExiting ? 1 : lineScaleX})`,
            borderRadius: 3,
            boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}`,
            zIndex: 15,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 250px, Top = 1580px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 270px, Top = 1690px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
