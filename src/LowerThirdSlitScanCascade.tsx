import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * TEMA 5: TEMPORAL & GLITCH DATA
 * Konsep 10: LowerThirdSlitScanCascade (Bentuk Visual 5 Tirai Jajaran Genjang Miring Slanted Parallelogram)
 *
 * MEKANISME REVEAL UTAMA:
 * Bidang utama terbagi menjadi 5 tirai jajaran genjang miring (slanted parallelograms) yang masuk berurutan dari luar frame (-2800px kiri) dengan delay milidetik (staggered cascade).
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * GERAKAN SEKUNDER:
 * Cap aksen penutup sudut miring menancap di sudut kanan (frame 32) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * 5 tirai jajaran genjang miring meluncur keluar berurutan ke kanan (+3840px) secara staggered cascade.
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

export const LowerThirdSlitScanCascade: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#F43F5E',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Staggered Springs for 5 Slanted Parallelogram Blinds
  const blindSprings = [0, 1, 2, 3, 4].map((idx) =>
    spring({
      frame: Math.max(0, localFrame - idx * 3),
      fps,
      config: { mass: 0.5, damping: 12, stiffness: 200 },
    })
  );

  const springMicroCap = spring({
    frame: Math.max(0, localFrame - 32),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSprings = [0, 1, 2, 3, 4].map((idx) =>
    spring({
      frame: Math.max(0, exitLocalFrame - idx * 3),
      fps,
      config: { mass: 0.5, damping: 12, stiffness: 200 },
    })
  );

  const getBlindX = (idx: number) => {
    return isExiting
      ? interpolate(exitSprings[idx], [0, 1], [0, 3840])
      : interpolate(blindSprings[idx], [0, 1], [-2800, 0]);
  };

  const capScale = interpolate(springMicroCap, [0, 1], [0, 1]);
  const capExitX = isExiting ? interpolate(exitSprings[4], [0, 1], [0, 3840]) : 0;

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
        }}
      >
        {/* 5 Slanted Parallelogram Cascade Blinds (Main Slate) */}
        {[0, 1, 2, 3, 4].map((idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: 0,
              top: idx * 28,
              width: 2200,
              height: 29,
              backgroundColor: idx % 2 === 0 ? primaryColor : '#1E293B',
              clipPath: 'polygon(2% 0, 100% 0, 98% 100%, 0 100%)',
              transform: `translateX(${getBlindX(idx)}px)`,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              borderLeft: idx === 0 ? `8px solid ${accentColor}` : 'none',
            }}
          />
        ))}

        {/* Subtier Slanted Parallelogram Plate */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 85,
            backgroundColor: '#881337',
            clipPath: 'polygon(3% 0, 97% 0, 94% 100%, 0 100%)',
            transform: `translateX(${getBlindX(2)}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Slanted Accent Cap */}
        <div
          style={{
            position: 'absolute',
            left: 2160,
            top: -10,
            width: 55,
            height: 55,
            backgroundColor: accentColor,
            clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0 100%)',
            transformOrigin: 'center center',
            transform: `translate3d(${capExitX}px, 0, 0) scale(${isExiting ? 1 : capScale})`,
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
