import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * BATCH 2 - TEMA 1: GLASSMORPHISM & FROSTED LAYER
 * Konsep 2: LowerThirdFrostedLiquidSlide
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame bawah (+2200px), lapisan kaca bergelombang (frosted glass) mengembang lembut dari garis aksen cair dengan efek pencahayaan tepi (edge-glow highlight).
 * Menggunakan fisika spring Elegant/Dramatic: { mass: 2, damping: 20, stiffness: 80 }.
 *
 * GERAKAN SEKUNDER:
 * Manjakani pencahayaan tepi (edge-glow bead) meluncur di sepanjang lengkungan kaca (frame 32) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Menguncup membal dan meluncur jatuh keluar melintasi batas frame bawah (+2200px).
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

export const LowerThirdFrostedLiquidSlide: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F172A90',
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

  // Offscreen Interpolations (+2200px Y Bottom)
  const translateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 2200])
    : interpolate(springDramatic, [0, 1], [2200, 0]);

  const scaleY = isExiting
    ? interpolate(exitSpring, [0, 1], [1, 0.05])
    : interpolate(springDramatic, [0, 1], [0.05, 1]);

  const blurAmount = interpolate(springDramatic, [0, 1], [0, 18]);

  const glowProgress = interpolate(springMicroGlow, [0, 1], [0, 1]);
  const glowX = isExiting
    ? interpolate(exitSpring, [0, 1], [glowProgress * 2100, 3840])
    : glowProgress * 2100;

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
          transform: `translate3d(0, ${translateY}px, 0)`,
        }}
      >
        {/* Main Wavy Frosted Liquid Glass Pod */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 145,
            backgroundColor: primaryColor,
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
            borderRadius: '40px 70px 30px 60px / 60% 30% 70% 40%',
            transformOrigin: 'bottom center',
            transform: `scaleY(${scaleY})`,
            boxShadow: `0 35px 70px rgba(0,0,0,0.7), inset 0 0 35px ${accentColor}50`,
            borderLeft: `8px solid ${accentColor}`,
            borderTop: `2px solid ${accentColor}90`,
          }}
        />

        {/* Subtier Liquid Glass Layer */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 140,
            width: 1850,
            height: 85,
            backgroundColor: '#065F4680',
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
            borderRadius: '30px 60px 40px 50% / 50% 40% 60% 30%',
            transformOrigin: 'top center',
            transform: `scaleY(${scaleY})`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
            borderBottom: `2px solid ${accentColor}70`,
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Edge-Glow Highlight Bead */}
        <div
          style={{
            position: 'absolute',
            left: 80 + glowX,
            top: -12,
            width: 32,
            height: 32,
            backgroundColor: accentColor,
            borderRadius: '50%',
            transformOrigin: 'center center',
            boxShadow: `0 0 30px ${accentColor}, 0 0 60px ${accentColor}`,
            opacity: glowProgress > 0.05 ? 1 : 0,
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
