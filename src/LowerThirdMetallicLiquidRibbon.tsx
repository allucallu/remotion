import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * REVISED BATCH - TEMA 5: LUXURY SILK & METALLIC CURVES
 * Konsep 9: LowerThirdMetallicLiquidRibbon (SVG Curved Liquid Ribbon Champagne Gold 3D & Active Moving Gradient)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame top-right (+3500px X & -1800px Y), pita emas/champagne melengkung halus (SVG curved path) meliuk dalam ruang 3D (perspective 1600px + rotateX/rotateY) dengan efek pencahayaan gradien yang bergerak aktif.
 * Menggunakan fisika spring Elegant/Dramatic: { mass: 2, damping: 20, stiffness: 80 }.
 *
 * FINISHING & TEKSTUR:
 * Champagne gold metallic linear gradient shifting aktif, kilau specular neon, dan drop-shadow kedalaman tinggi.
 *
 * EXIT ANIMATION:
 * Meliuk memudar memutar 3D dan meluncur keluar melintasi batas frame top-right (+3500px, -1800px).
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

export const LowerThirdMetallicLiquidRibbon: React.FC<LowerThirdProps> = ({
  primaryColor = '#1F1905',
  accentColor = '#F59E0B',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Spring Configurations as explicitly mandated
  const springDramatic = spring({
    frame: localFrame,
    fps,
    config: { mass: 2, damping: 20, stiffness: 80 },
  });

  const springMicroGlint = spring({
    frame: Math.max(0, localFrame - 35),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 2, damping: 20, stiffness: 80 },
  });

  // Offscreen Interpolations (+3500px X & -1800px Y Top-Right)
  const translateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3500])
    : interpolate(springDramatic, [0, 1], [3500, 0]);

  const translateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1800])
    : interpolate(springDramatic, [0, 1], [-1800, 0]);

  const rotateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 45])
    : interpolate(springDramatic, [0, 1], [-45, 0]);

  const rotateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -30])
    : interpolate(springDramatic, [0, 1], [30, 0]);

  const glintProgress = interpolate(springMicroGlint, [0, 1], [0, 1]);
  const glintExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
          perspective: 1600,
          transform: `translate3d(${translateX}px, ${translateY}px, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformOrigin: 'right center',
          filter: 'drop-shadow(0px 25px 40px rgba(0,0,0,0.85))',
        }}
      >
        <svg width="2250" height="250" viewBox="0 0 2250 250" fill="none">
          <defs>
            <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor={accentColor} />
              <stop offset="80%" stopColor={primaryColor} />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>
            <linearGradient id="goldRibbonSub" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B45309" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#78350F" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Subtier Metallic Ribbon Path */}
          <path
            d="M 40,140 C 500,170 1000,120 1500,160 C 1850,190 2100,140 2200,145 L 2200,230 L 40,230 Z"
            fill="url(#goldRibbonSub)"
          />

          {/* Main Curved Champagne Gold Liquid Ribbon Path */}
          <path
            d="M 0,20 C 500,-20 1000,40 1500,0 C 1850,-30 2100,20 2250,10 L 2250,150 L 0,150 Z"
            fill="url(#goldRibbonGrad)"
            stroke="#FEF08A"
            strokeWidth="3"
          />
        </svg>

        {/* SECONDARY MOTION: Micro Snap Gold Glint Node */}
        <div
          style={{
            position: 'absolute',
            left: 2170,
            top: 5,
            width: 36,
            height: 36,
            backgroundColor: '#FEF08A',
            borderRadius: '50%',
            transformOrigin: 'center center',
            transform: `translate3d(${glintExitX}px, 0, 0) scale(${isExiting ? 1 : glintProgress})`,
            boxShadow: `0 0 35px ${accentColor}, 0 0 70px #FEF08A`,
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
