import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * TEMA 1: ARCHITECTURAL & SPATIAL 3D
 * Konsep 2: LowerThirdDepthSlateDrop (Bentuk Visual Trapezoidal Pedestal 3D)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame bawah (+2200px), plat trapesium alas 3D dua tingkat berdiri tegak lurus dari posisi rebah 90 derajat dengan efek ketebalan & shadow 3D dinamis saat mendarat.
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * GERAKAN SEKUNDER:
 * Pilar aksen vertikal ganda mendarat menancap di sudut kanan (frame 32) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Rebah memutar 90 derajat mundur ke posisi datar dan meluncur jatuh keluar melintasi batas frame bawah (+2200px).
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

export const LowerThirdDepthSlateDrop: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F172A',
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
  const springSnappy = spring({
    frame: localFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  const springMicroPillar = spring({
    frame: Math.max(0, localFrame - 32),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  // Offscreen Interpolations (+2200px Y Bottom)
  const translateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 2200])
    : interpolate(springSnappy, [0, 1], [2200, 0]);

  const rotateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 90])
    : interpolate(springSnappy, [0, 1], [-90, 0]);

  const shadowBlur = interpolate(springSnappy, [0, 1], [0, 60]);
  const pillarScale = interpolate(springMicroPillar, [0, 1], [0, 1]);
  const pillarExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3500]) : 0;

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
          perspective: 1500,
          transform: `translate3d(0, ${translateY}px, 0)`,
        }}
      >
        {/* Main 3D Trapezoidal Pedestal Slate */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 145,
            backgroundColor: primaryColor,
            clipPath: 'polygon(0 0, 94% 0, 100% 100%, 6% 100%)',
            transformOrigin: 'bottom center',
            transform: `rotateX(${rotateX}deg)`,
            transformStyle: 'preserve-3d',
            boxShadow: `0 35px ${shadowBlur}px rgba(0,0,0,0.9)`,
            borderLeft: `8px solid ${accentColor}`,
          }}
        />

        {/* Subtier Trapezoidal Pedestal Slate */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 85,
            backgroundColor: '#065F46',
            clipPath: 'polygon(4% 0, 96% 0, 100% 100%, 0% 100%)',
            transformOrigin: 'top center',
            transform: `rotateX(${-rotateX}deg)`,
            transformStyle: 'preserve-3d',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Dual Accent Pillars */}
        <div
          style={{
            position: 'absolute',
            left: 2150,
            top: -15,
            width: 28,
            height: 240,
            backgroundColor: accentColor,
            borderRadius: 6,
            transformOrigin: 'center center',
            transform: `translate3d(${pillarExitX}px, 0, 0) scale(${isExiting ? 1 : pillarScale})`,
            boxShadow: `0 0 30px ${accentColor}`,
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
