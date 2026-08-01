import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * BATCH 2 - TEMA 4: MINIMALIST KINETIC LINE
 * Konsep 8: LowerThirdStaggeredRuleCascade
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-2800px kiri), 4 garis sejajar dengan panjang berbeda meluncur berurutan, lalu memekar mengisi ruang kosong di antaranya secara simultan.
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * GERAKAN SEKUNDER:
 * Cap aksen penutup ujung menancap di sudut kanan (frame 34) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * 4 garis menyusut dan meluncur keluar berurutan melintasi batas frame kanan (+3840px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 260px, Top = 1580px, Width = 2150px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 280px, Top = 1690px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdStaggeredRuleCascade: React.FC<LowerThirdProps> = ({
  primaryColor = '#18181B',
  accentColor = '#EAB308',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Staggered Springs for 4 Parallel Rules
  const ruleSprings = [0, 1, 2, 3].map((idx) =>
    spring({
      frame: Math.max(0, localFrame - idx * 3),
      fps,
      config: { mass: 0.5, damping: 12, stiffness: 200 },
    })
  );

  const springMicroCap = spring({
    frame: Math.max(0, localFrame - 34),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSprings = [0, 1, 2, 3].map((idx) =>
    spring({
      frame: Math.max(0, exitLocalFrame - idx * 3),
      fps,
      config: { mass: 0.5, damping: 12, stiffness: 200 },
    })
  );

  const getRuleX = (idx: number) => {
    return isExiting
      ? interpolate(exitSprings[idx], [0, 1], [0, 3840])
      : interpolate(ruleSprings[idx], [0, 1], [-2800, 0]);
  };

  const capScale = interpolate(springMicroCap, [0, 1], [0, 1]);
  const capExitX = isExiting ? interpolate(exitSprings[3], [0, 1], [0, 3840]) : 0;

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
        }}
      >
        {/* 4 Staggered Parallel Rule Bars (Filling Space Interstitially) */}
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: 0,
              top: idx * 34,
              width: 2200 - idx * 100,
              height: 32,
              backgroundColor: idx % 2 === 0 ? primaryColor : '#27272A',
              borderRadius: 6,
              transform: `translateX(${getRuleX(idx)}px)`,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              borderLeft: idx === 0 ? `8px solid ${accentColor}` : 'none',
            }}
          />
        ))}

        {/* Subtier Rule Base */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 85,
            backgroundColor: '#854D0E',
            borderRadius: '0 0 12px 12px',
            transform: `translateX(${getRuleX(2)}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Staggered Accent Cap */}
        <div
          style={{
            position: 'absolute',
            left: 2160,
            top: -10,
            width: 55,
            height: 55,
            backgroundColor: accentColor,
            borderRadius: 8,
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
        - Primary Name Line: Left = 260px, Top = 1580px, Width = 2150px, Height = 100px
        - Subtitle Line:     Left = 280px, Top = 1690px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
