import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * TEMA 2: DESTRUCTIVE & FRACTURED
 * Konsep 3: LowerThirdShardPolygonFusion (Bentuk Visual Mahkota Kristal 6 Pecahan Tajam)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari 6 vektor luar frame (-2800px top-left, +3500px top-right, -2800px bottom-left, +3500px bottom-right), 6 pecahan polygon kristal tajam (razor-edged shards) meluncur dan mengunci (snap) menjadi mahkota kristal bersudut tajam.
 * Menggunakan fisika spring Snap/Micro: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * GERAKAN SEKUNDER:
 * Garis laser neon menyala di sepanjang retakan garis sambungan polygon (frame 28) dengan fisika Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * EXIT ANIMATION:
 * Seluruh 6 pecahan polygon retak kembali dan terpental berhamburan ke 6 sudut luar frame.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1550px, Width = 2200px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1665px, Width = 1850px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdShardPolygonFusion: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#EC4899',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Spring Configurations
  const springSnap = spring({
    frame: localFrame,
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const springSeam = spring({
    frame: Math.max(0, localFrame - 28),
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  // Offscreen Interpolations (6 Razor Shards coming from outer vectors)
  const getShardX = (startPos: number) => {
    return isExiting
      ? interpolate(exitSpring, [0, 1], [0, startPos])
      : interpolate(springSnap, [0, 1], [startPos, 0]);
  };

  const getShardY = (startPos: number) => {
    return isExiting
      ? interpolate(exitSpring, [0, 1], [0, startPos])
      : interpolate(springSnap, [0, 1], [startPos, 0]);
  };

  const seamScaleX = interpolate(springSeam, [0, 1], [0, 1]);
  const seamExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

  const baseLeft = 200;
  const baseTop = 1520;

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
        {/* Razor Shard 1 (Top Left Peak) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 550,
            height: 145,
            backgroundColor: primaryColor,
            clipPath: 'polygon(0 0, 100% 25%, 75% 100%, 0 100%)',
            transform: `translate3d(${getShardX(-2800)}px, ${getShardY(-1800)}px, 0)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
            borderLeft: `8px solid ${accentColor}`,
          }}
        />

        {/* Razor Shard 2 (Top Mid Slope) */}
        <div
          style={{
            position: 'absolute',
            left: 545,
            top: 0,
            width: 600,
            height: 145,
            backgroundColor: '#831843',
            clipPath: 'polygon(0 25%, 100% 0, 85% 100%, 0 100%)',
            transform: `translate3d(${getShardX(0)}px, ${getShardY(-2200)}px, 0)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}
        />

        {/* Razor Shard 3 (Top Right Ridge) */}
        <div
          style={{
            position: 'absolute',
            left: 1140,
            top: 0,
            width: 1060,
            height: 145,
            backgroundColor: primaryColor,
            clipPath: 'polygon(15% 0, 100% 0, 94% 100%, 0 100%)',
            transform: `translate3d(${getShardX(3500)}px, ${getShardY(-1800)}px, 0)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          }}
        />

        {/* Razor Shard 4 (Subtier Left Base) */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 750,
            height: 90,
            backgroundColor: '#BE185D',
            clipPath: 'polygon(0 0, 95% 0, 88% 100%, 0 100%)',
            transform: `translate3d(${getShardX(-2800)}px, ${getShardY(1800)}px, 0)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* Razor Shard 5 (Subtier Mid Base) */}
        <div
          style={{
            position: 'absolute',
            left: 785,
            top: 145,
            width: 700,
            height: 90,
            backgroundColor: primaryColor,
            clipPath: 'polygon(5% 0, 95% 0, 90% 100%, 0 100%)',
            transform: `translate3d(${getShardX(0)}px, ${getShardY(2200)}px, 0)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* Razor Shard 6 (Subtier Right Base) */}
        <div
          style={{
            position: 'absolute',
            left: 1480,
            top: 145,
            width: 680,
            height: 90,
            backgroundColor: '#831843',
            clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)',
            transform: `translate3d(${getShardX(3500)}px, ${getShardY(1800)}px, 0)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Fast Snappy Seam Laser Line */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 140,
            width: 2100,
            height: 5,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${seamExitX}px, 0, 0) scaleX(${isExiting ? 1 : seamScaleX})`,
            borderRadius: 3,
            boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 240px, Top = 1550px, Width = 2200px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1665px, Width = 1850px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
