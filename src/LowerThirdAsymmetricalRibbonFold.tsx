import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * REVISED BATCH - TEMA 2: KINETIC TYPOGRAPHIC ANCHOR & EDITORIAL DESIGN
 * Konsep 3: LowerThirdAsymmetricalRibbonFold (SVG Pita Meliuk 3D Perspective & Stretch Overshoot)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame atas (-2200px Y), pita SVG meliuk dengan gradien warna ganda terlipat dan terurai secara 3D (perspective 1600px + rotateX/rotateY) dengan perspektif tajam.
 * Memiliki fisika SQUASH & STRETCH dinamis (skewY + scaleX) yang dipetakan dengan kecepatan spring.
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * FINISHING & TEKSTUR:
 * Dual-color linear gradient dinamis, garis lipatan tajam 3D, dan bayangan kedalaman lunak.
 *
 * EXIT ANIMATION:
 * Terlipat 3D terurai kembali dan meluncur jatuh keluar melintasi batas frame bawah (+2200px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1550px, Width = 2200px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1665px, Width = 1850px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdAsymmetricalRibbonFold: React.FC<LowerThirdProps> = ({
  primaryColor = '#1E1B4B',
  accentColor = '#6366F1',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Spring Configurations as explicitly mandated
  const springSnappy = spring({
    frame: localFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  const springMicroPin = spring({
    frame: Math.max(0, localFrame - 30),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  // Offscreen Interpolations (-2200px Y Top Entrance & +2200px Bottom Exit)
  const translateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 2200])
    : interpolate(springSnappy, [0, 1], [-2200, 0]);

  const rotateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 75])
    : interpolate(springSnappy, [0, 1], [-75, 0]);

  const rotateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -35])
    : interpolate(springSnappy, [0, 1], [35, 0]);

  const skewY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -12])
    : interpolate(springSnappy, [0, 0.5, 0.8, 1], [15, -8, 2, 0]);

  const pinScale = interpolate(springMicroPin, [0, 1], [0, 1]);
  const pinExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

  const baseLeft = 200;
  const baseTop = 1520;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: baseLeft,
          top: baseTop,
          width: 2300,
          height: 250,
          perspective: 1600,
          transform: `translate3d(0, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) skewY(${skewY}deg)`,
          transformOrigin: 'left center',
          filter: 'drop-shadow(0px 25px 40px rgba(0,0,0,0.75))',
        }}
      >
        <svg width="2300" height="250" viewBox="0 0 2300 250" fill="none">
          <defs>
            <linearGradient id="ribbonMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="50%" stopColor="#312E81" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
            <linearGradient id="ribbonAccent" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>

          {/* Subtier Fold Ribbon Path */}
          <path
            d="M 40,140 L 2250,165 L 2150,240 L 40,225 Z"
            fill="url(#ribbonAccent)"
            opacity="0.9"
          />

          {/* Main 3D Asymmetrical Ribbon Fold Path */}
          <path
            d="M 0,0 L 2200,20 L 2100,150 L 50,130 Z"
            fill="url(#ribbonMain)"
            stroke={accentColor}
            strokeWidth="3"
          />
        </svg>

        {/* SECONDARY MOTION: Micro Snap Ribbon Corner Pin */}
        <div
          style={{
            position: 'absolute',
            left: 2160,
            top: -12,
            width: 50,
            height: 50,
            backgroundColor: accentColor,
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
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
        - Primary Name Line: Left = 240px, Top = 1550px, Width = 2200px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1665px, Width = 1850px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
