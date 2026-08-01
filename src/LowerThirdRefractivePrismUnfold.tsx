import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * BATCH 2 - TEMA 1: GLASSMORPHISM & FROSTED LAYER
 * Konsep 1: LowerThirdRefractivePrismUnfold
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame top-left (-2800px, -1800px), bidang kaca buram (backdropFilter: blur(16px)) terpecah diagonal, membias saat memutar secara 3D (perspective 1600px + rotateX/rotateY) lalu menyatu membentuk panel transparan dengan kilauan border.
 * Menggunakan fisika spring Elegant/Dramatic: { mass: 2, damping: 20, stiffness: 80 }.
 *
 * GERAKAN SEKUNDER:
 * Kilauan border prisma neon menancap mekar di sepanjang tepi kaca (frame 30) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Terlipat kembali di ruang 3D memudar dan meluncur keluar melintasi batas frame top-left (-2800px, -1800px).
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

export const LowerThirdRefractivePrismUnfold: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F172A80',
  accentColor = '#38BDF8',
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

  const rotateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 60])
    : interpolate(springDramatic, [0, 1], [60, 0]);

  const rotateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -45])
    : interpolate(springDramatic, [0, 1], [-45, 0]);

  const blurAmount = interpolate(springDramatic, [0, 1], [0, 16]);
  const shimmerScale = interpolate(springMicroShimmer, [0, 1], [0, 1]);
  const shimmerExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
          transform: `translate3d(${translateX}px, ${translateY}px, 0)`,
        }}
      >
        {/* Main Frosted Refractive Glass Plane */}
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
            borderRadius: 16,
            clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)',
            transformOrigin: 'center center',
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: 'preserve-3d',
            boxShadow: `0 30px 70px rgba(0,0,0,0.6), inset 0 0 30px ${accentColor}40`,
            borderLeft: `8px solid ${accentColor}`,
            borderTop: `2px solid ${accentColor}80`,
          }}
        />

        {/* Subtier Frosted Glass Layer */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 85,
            backgroundColor: '#1E293B99',
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
            borderRadius: '0 0 16px 16px',
            clipPath: 'polygon(0 0, 95% 0, 88% 100%, 0 100%)',
            transformOrigin: 'center center',
            transform: `rotateX(${-rotateX}deg)`,
            transformStyle: 'preserve-3d',
            boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
            borderBottom: `2px solid ${accentColor}60`,
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Border Shimmer Line */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 140,
            width: 2100,
            height: 5,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${shimmerExitX}px, 0, 0) scaleX(${isExiting ? 1 : shimmerScale})`,
            borderRadius: 3,
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
