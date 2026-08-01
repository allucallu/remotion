import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * REVISED BATCH - TEMA 5: LUXURY SILK & METALLIC CURVES
 * Konsep 10: LowerThirdChiseledPrismUnravel (SVG Sisi Prisma Bergradien Cut Diagonal & Soft Ambient Shadow)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-2800px top-left & +3840px bottom-right), sisi-sisi prisma bergradien SVG dipotong secara diagonal, berputar pelan dengan lereng bayangan lunak (soft ambient shadow).
 * Menggunakan fisika spring Snap/Micro: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * FINISHING & TEKSTUR:
 * Metalik perak/platinum bergradien kontras tinggi, garis potongan chiseled prism, dan drop-shadow lunak berlapis.
 *
 * EXIT ANIMATION:
 * Sisi prisma terurai diagonal meluncur keluar berlawanan arah ke top-left (-2800px) & bottom-right (+3840px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 250px, Top = 1570px, Width = 2200px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 270px, Top = 1680px, Width = 1850px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdChiseledPrismUnravel: React.FC<LowerThirdProps> = ({
  primaryColor = '#111827',
  accentColor = '#E5E7EB',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Spring Configurations
  const springSnap = spring({
    frame: localFrame,
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const springMicroPin = spring({
    frame: Math.max(0, localFrame - 32),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  // Offscreen & Diagonal Vector Interpolations
  const prism1X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2800])
    : interpolate(springSnap, [0, 1], [-2800, 0]);
  const prism1Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1800])
    : interpolate(springSnap, [0, 1], [-1800, 0]);

  const prism2X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(springSnap, [0, 1], [3840, 0]);
  const prism2Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 1800])
    : interpolate(springSnap, [0, 1], [1800, 0]);

  const pinScale = interpolate(springMicroPin, [0, 1], [0, 1]);
  const pinExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

  const baseLeft = 200;
  const baseTop = 1530;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: baseLeft,
          top: baseTop,
          width: 2300,
          height: 250,
          filter: 'drop-shadow(0px 25px 40px rgba(0,0,0,0.85))',
        }}
      >
        <svg width="2300" height="250" viewBox="0 0 2300 250" fill="none">
          <defs>
            <linearGradient id="prismGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F3F4F6" />
              <stop offset="50%" stopColor={primaryColor} />
              <stop offset="100%" stopColor="#1F2937" />
            </linearGradient>
            <linearGradient id="prismGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4B5563" />
              <stop offset="100%" stopColor="#1F2937" />
            </linearGradient>
          </defs>

          {/* Chiseled Prism Face 1 (from Top-Left) */}
          <g transform={`translate(${prism1X}, ${prism1Y})`}>
            <path
              d="M 0,0 L 1300,0 L 1150,145 L 0,145 Z"
              fill="url(#prismGrad1)"
              stroke={accentColor}
              strokeWidth="4"
            />
            <path
              d="M 40,145 L 1200,145 L 1100,230 L 40,230 Z"
              fill="#374151"
              opacity="0.9"
            />
          </g>

          {/* Chiseled Prism Face 2 (from Bottom-Right) */}
          <g transform={`translate(${prism2X}, ${prism2Y})`}>
            <path
              d="M 1200,0 L 2250,0 L 2100,145 L 1050,145 Z"
              fill="url(#prismGrad2)"
            />
          </g>
        </svg>

        {/* SECONDARY MOTION: Micro Snap Precision Prism Pin */}
        <div
          style={{
            position: 'absolute',
            left: 2160,
            top: -15,
            width: 45,
            height: 250,
            backgroundColor: accentColor,
            borderRadius: 6,
            transformOrigin: 'center center',
            transform: `translate3d(${pinExitX}px, 0, 0) scale(${isExiting ? 1 : pinScale})`,
            boxShadow: `0 0 30px ${accentColor}`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 250px, Top = 1570px, Width = 2200px, Height = 100px
        - Subtitle Line:     Left = 270px, Top = 1680px, Width = 1850px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
