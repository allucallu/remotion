import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * BATCH 2 - TEMA 5: LUXURY GOLD & METALLIC
 * Konsep 9: LowerThirdBeveledGoldShimmer
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame top-right (+3500px, -1800px), plat bernuansa logam emas/champagne tebal memutar dari sudut 45 derajat dengan efek kemilau sudut (specular sweep) saat settle.
 * Menggunakan fisika spring Elegant/Dramatic: { mass: 2, damping: 20, stiffness: 80 }.
 *
 * GERAKAN SEKUNDER:
 * Kemilau emas specular menyala menyusuri bevel tepi (frame 35) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Memutar 45 derajat mundur dan meluncur keluar melintasi batas frame top-right (+3500px, -1800px).
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

export const LowerThirdBeveledGoldShimmer: React.FC<LowerThirdProps> = ({
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

  const springMicroShimmer = spring({
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

  const rotateZ = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 45])
    : interpolate(springDramatic, [0, 1], [-45, 0]);

  const shimmerProgress = interpolate(springMicroShimmer, [0, 1], [0, 1]);
  const shimmerX = isExiting
    ? interpolate(exitSpring, [0, 1], [shimmerProgress * 2100, 3840])
    : shimmerProgress * 2100;

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
          transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotateZ}deg)`,
        }}
      >
        {/* Main Luxury Beveled Gold Plate */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 145,
            backgroundColor: primaryColor,
            borderRadius: 12,
            clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)',
            boxShadow: `0 30px 70px rgba(0,0,0,0.9), inset 0 0 35px ${accentColor}60`,
            borderLeft: `8px solid ${accentColor}`,
            borderTop: `2px solid ${accentColor}`,
          }}
        />

        {/* Subtier Metallic Gold Base */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 85,
            backgroundColor: '#78350F',
            borderRadius: '0 0 12px 12px',
            clipPath: 'polygon(0 0, 95% 0, 88% 100%, 0 100%)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
            borderBottom: `2px solid ${accentColor}80`,
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Gold Specular Sweep */}
        <div
          style={{
            position: 'absolute',
            left: 50 + shimmerX,
            top: -10,
            width: 60,
            height: 160,
            backgroundColor: '#FEF08A',
            clipPath: 'polygon(30% 0, 100% 0, 70% 100%, 0 100%)',
            transformOrigin: 'center center',
            boxShadow: `0 0 35px ${accentColor}, 0 0 70px #FEF08A`,
            opacity: shimmerProgress > 0.05 ? 0.9 : 0,
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
