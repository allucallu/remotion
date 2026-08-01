import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * REVISED BATCH - TEMA 1: LIQUID & ORGANIC MORPH
 * Konsep 1: LowerThirdViscousVectorWave (SVG Path Gelombang Bézier & Squash/Stretch Deformation)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame top-left (-2800px, -1800px), SVG `<path>` gelombang organik Bézier memekar secara elastis.
 * Memiliki fisika SQUASH & STRETCH dinamis (transform: skewX + scaleY) yang dipetakan dengan kecepatan spring. saat bergerak kencang bentuknya memanjang (stretch) dan saat mendarat mengempis (squash) sebelum settle stabil.
 * Menggunakan fisika spring Elegant/Dramatic: { mass: 2, damping: 20, stiffness: 80 }.
 *
 * FINISHING & TEKSTUR:
 * SVG Linear Gradient dinamis shifting, stroke pendaran neon, dan filter drop-shadow berkedalaman tinggi.
 *
 * EXIT ANIMATION:
 * Menyusut membal kembali ke garis gelombang dan meluncur keluar melintasi batas frame top-left (-2800px, -1800px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1560px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1670px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdViscousVectorWave: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#38BDF8',
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

  const springMicroBead = spring({
    frame: Math.max(0, localFrame - 30),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 2, damping: 20, stiffness: 80 },
  });

  // Offscreen Interpolations (-2800px X & -1800px Y Top-Left)
  const translateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2800])
    : interpolate(springDramatic, [0, 1], [-2800, 0]);

  const translateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1800])
    : interpolate(springDramatic, [0, 1], [-1800, 0]);

  // Squash & Stretch Deformation Physics mapped to spring progress
  const skewX = isExiting
    ? interpolate(exitSpring, [0, 0.5, 1], [0, -18, 0])
    : interpolate(springDramatic, [0, 0.4, 0.8, 1], [-25, 12, -4, 0]);

  const scaleY = isExiting
    ? interpolate(exitSpring, [0, 1], [1, 0.05])
    : interpolate(springDramatic, [0, 0.5, 0.8, 1], [0.1, 1.25, 0.9, 1]);

  const beadScale = interpolate(springMicroBead, [0, 1], [0, 1]);
  const beadExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, -2800]) : 0;

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
          transform: `translate3d(${translateX}px, ${translateY}px, 0) skewX(${skewX}deg) scaleY(${scaleY})`,
          transformOrigin: 'left center',
          filter: 'drop-shadow(0px 25px 40px rgba(0,0,0,0.6))',
        }}
      >
        <svg width="2250" height="250" viewBox="0 0 2250 250" fill="none">
          <defs>
            <linearGradient id="waveGradientMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.95" />
              <stop offset="60%" stopColor="#1E293B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="waveGradientSub" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Subtier Organic Bézier Path */}
          <path
            d="M 40,140 Q 600,120 1150,165 T 1900,140 L 1900,230 L 40,230 Z"
            fill="url(#waveGradientSub)"
          />

          {/* Main Organic Bézier Wave Vector Path */}
          <path
            d="M 0,20 Q 550,-20 1100,35 T 2200,10 L 2200,150 L 0,150 Z"
            fill="url(#waveGradientMain)"
            stroke={accentColor}
            strokeWidth="4"
          />
        </svg>

        {/* SECONDARY MOTION: Micro Snap Organic Bead Node */}
        <div
          style={{
            position: 'absolute',
            left: 2170,
            top: 5,
            width: 36,
            height: 36,
            backgroundColor: accentColor,
            borderRadius: '50%',
            transformOrigin: 'center center',
            transform: `translate3d(${beadExitX}px, 0, 0) scale(${isExiting ? 1 : beadScale})`,
            boxShadow: `0 0 25px ${accentColor}, 0 0 50px ${accentColor}`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 240px, Top = 1560px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1670px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
