import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * TEMA 3: KINETIC GRID & SWISS DESIGN
 * Konsep 6: LowerThirdModularStackingRatio
 *
 * MEKANISME REVEAL UTAMA:
 * Urutan balok-balok ukuran rasio presisi yang muncul secara staggered (bertahap cepat) membentuk ruang komposisi modular Swiss.
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * GERAKAN SEKUNDER:
 * Pin indikator aksen Swiss menancap keluar di samping kanan (frame 34) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Balok-balok komposisi runtuh terlepas satu per satu secara staggered meluncur jatuh keluar frame bawah (+2200px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1570px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1680px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdModularStackingRatio: React.FC<LowerThirdProps> = ({
  primaryColor = '#18181B',
  accentColor = '#F59E0B',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Staggered Springs for 3 Modular Blocks
  const b1Spring = spring({
    frame: localFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });
  const b2Spring = spring({
    frame: Math.max(0, localFrame - 4),
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });
  const b3Spring = spring({
    frame: Math.max(0, localFrame - 8),
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  const pinSpring = spring({
    frame: Math.max(0, localFrame - 34),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  // Offscreen Interpolations (+2200px Y Bottom Drop)
  const getBlockY = (bSpring: number) => {
    return isExiting
      ? interpolate(exitSpring, [0, 1], [0, 2200])
      : interpolate(bSpring, [0, 1], [2200, 0]);
  };

  const pinScale = interpolate(pinSpring, [0, 1], [0, 1]);
  const pinExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
        {/* Modular Block 1 (Ratio 60% Left Primary) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1350,
            height: 140,
            backgroundColor: primaryColor,
            borderRadius: '12px 0 0 0',
            transform: `translate3d(0, ${getBlockY(b1Spring)}px, 0)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
            borderLeft: `8px solid ${accentColor}`,
          }}
        />

        {/* Modular Block 2 (Ratio 40% Right Complementary) */}
        <div
          style={{
            position: 'absolute',
            left: 1355,
            top: 0,
            width: 845,
            height: 140,
            backgroundColor: '#27272A',
            borderRadius: '0 12px 0 0',
            transform: `translate3d(0, ${getBlockY(b2Spring)}px, 0)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          }}
        />

        {/* Modular Block 3 (Subtier Ratio Base) */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 90,
            backgroundColor: '#78350F',
            borderRadius: '0 0 12px 12px',
            transform: `translate3d(0, ${getBlockY(b3Spring)}px, 0)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Swiss Indicator Pin */}
        <div
          style={{
            position: 'absolute',
            left: 2180,
            top: 40,
            width: 35,
            height: 160,
            backgroundColor: accentColor,
            borderRadius: 6,
            transformOrigin: 'center center',
            transform: `translate3d(${pinExitX}px, 0, 0) scale(${isExiting ? 1 : pinScale})`,
            boxShadow: `0 0 25px ${accentColor}`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 240px, Top = 1570px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1680px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
