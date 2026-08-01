import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * BATCH 2 - TEMA 2: RAW BRUTALISM & NEO-GRAPHIC
 * Konsep 4: LowerThirdAsymmetricalStaggerGrid
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame atas (-2200px), komposisi balok brutalist yang saling bertumpuk acak jatuh tegak lurus secara staggered (bertahap cepat) dengan micro-bounce dramatis.
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * GERAKAN SEKUNDER:
 * Balok penanda aksen neo-brutalist mendarat menancap di sudut kanan (frame 34) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Balok-balok runtuh terlepas satu per satu secara staggered meluncur jatuh keluar melintasi batas frame bawah (+2200px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 250px, Top = 1580px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 270px, Top = 1690px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdAsymmetricalStaggerGrid: React.FC<LowerThirdProps> = ({
  primaryColor = '#18181B',
  accentColor = '#EF4444',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Staggered Springs for 3 Brutalist Blocks
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

  // Offscreen Interpolations (-2200px Top Entrance & +2200px Bottom Exit)
  const getBlockY = (bSpring: number) => {
    return isExiting
      ? interpolate(exitSpring, [0, 1], [0, 2200])
      : interpolate(bSpring, [0, 1], [-2200, 0]);
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
        {/* Brutalist Block 1 (Main Left 65%) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1400,
            height: 140,
            backgroundColor: primaryColor,
            borderRadius: 0,
            border: '6px solid #000000',
            boxShadow: '10px 10px 0px #000000',
            transform: `translate3d(0, ${getBlockY(b1Spring)}px, 0)`,
            borderLeft: `12px solid ${accentColor}`,
          }}
        />

        {/* Brutalist Block 2 (Right Complementary 35%) */}
        <div
          style={{
            position: 'absolute',
            left: 1405,
            top: 0,
            width: 795,
            height: 140,
            backgroundColor: '#FFFFFF',
            borderRadius: 0,
            border: '6px solid #000000',
            boxShadow: '10px 10px 0px #000000',
            transform: `translate3d(0, ${getBlockY(b2Spring)}px, 0)`,
          }}
        />

        {/* Brutalist Block 3 (Subtier Base) */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 90,
            backgroundColor: accentColor,
            borderRadius: 0,
            border: '6px solid #000000',
            boxShadow: '8px 8px 0px #000000',
            transform: `translate3d(0, ${getBlockY(b3Spring)}px, 0)`,
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Neo-Brutalist Indicator Pin */}
        <div
          style={{
            position: 'absolute',
            left: 2180,
            top: 40,
            width: 35,
            height: 160,
            backgroundColor: '#000000',
            borderRadius: 0,
            border: '4px solid #FFFFFF',
            boxShadow: '6px 6px 0px #000000',
            transformOrigin: 'center center',
            transform: `translate3d(${pinExitX}px, 0, 0) scale(${isExiting ? 1 : pinScale})`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 250px, Top = 1580px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 270px, Top = 1690px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
