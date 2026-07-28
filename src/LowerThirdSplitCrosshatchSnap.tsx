import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 9. LowerThirdSplitCrosshatchSnap (Batch 2)
 *
 * MEKANISME REVEAL UTAMA:
 * Kisi-kisi 4 garis diagonal meluncur dari 4 sudut luar frame 4K (top-left, top-right, bottom-left, bottom-right), mengunci rapat membentuk struktur diamond grid yang membuka area kontainer utama.
 * Saat exit, seluruh 4 bilah grid terpental mundur keluar melintasi batas frame 4K.
 *
 * GERAKAN SEKUNDER:
 * Bar aksen underline menembak keluar dari simpul bawah (frame 32) dan menembak keluar frame kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1560px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1675px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdSplitCrosshatchSnapProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdSplitCrosshatchSnap: React.FC<LowerThirdSplitCrosshatchSnapProps> = ({
  primaryColor = '#18181B',
  accentColor = '#EC4899',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // 4 Diagonal Grid Line Springs
  const g1Spring = spring({ frame: localFrame, fps, config: { damping: 10, stiffness: 160, mass: 0.7 } });
  const g2Spring = spring({ frame: localFrame - 3, fps, config: { damping: 10, stiffness: 160, mass: 0.7 } });
  const g3Spring = spring({ frame: localFrame - 6, fps, config: { damping: 10, stiffness: 160, mass: 0.7 } });
  const g4Spring = spring({ frame: localFrame - 9, fps, config: { damping: 10, stiffness: 160, mass: 0.7 } });

  // Secondary Motion Spring: Underline Bar (Delayed frame 32)
  const lineSpring = spring({ frame: localFrame - 32, fps, config: { damping: 14, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Interpolations (4 corners)
  const g1X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2600])
    : interpolate(g1Spring, [0, 1], [-2600, 0]);
  const g1Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1800])
    : interpolate(g1Spring, [0, 1], [-1800, 0]);

  const g2X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3500])
    : interpolate(g2Spring, [0, 1], [3500, 0]);
  const g2Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1800])
    : interpolate(g2Spring, [0, 1], [-1800, 0]);

  const g3X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2600])
    : interpolate(g3Spring, [0, 1], [-2600, 0]);
  const g3Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 1800])
    : interpolate(g3Spring, [0, 1], [1800, 0]);

  const g4X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3500])
    : interpolate(g4Spring, [0, 1], [3500, 0]);
  const g4Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 1800])
    : interpolate(g4Spring, [0, 1], [1800, 0]);

  const lineScaleX = interpolate(lineSpring, [0, 1], [0, 1]);
  const lineExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
        }}
      >
        {/* Grid 1 (Top-Left Diagonal Plate) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 10,
            width: 1100,
            height: 140,
            backgroundColor: primaryColor,
            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
            transform: `translate3d(${g1X}px, ${g1Y}px, 0)`,
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
            borderLeft: `6px solid ${accentColor}`,
          }}
        />

        {/* Grid 2 (Top-Right Diagonal Plate) */}
        <div
          style={{
            position: 'absolute',
            left: 1050,
            top: 10,
            width: 1150,
            height: 140,
            backgroundColor: '#27272A',
            clipPath: 'polygon(15% 0, 100% 0, 92% 100%, 0 100%)',
            transform: `translate3d(${g2X}px, ${g2Y}px, 0)`,
            boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
          }}
        />

        {/* Grid 3 (Bottom-Left Subtier Plate) */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 155,
            width: 950,
            height: 85,
            backgroundColor: '#BE185D',
            clipPath: 'polygon(0 0, 90% 0, 80% 100%, 0 100%)',
            transform: `translate3d(${g3X}px, ${g3Y}px, 0)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* Grid 4 (Bottom-Right Subtier Plate) */}
        <div
          style={{
            position: 'absolute',
            left: 920,
            top: 155,
            width: 1250,
            height: 85,
            backgroundColor: primaryColor,
            clipPath: 'polygon(10% 0, 100% 0, 92% 100%, 0 100%)',
            transform: `translate3d(${g4X}px, ${g4Y}px, 0)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Accent Underline Bar Shooting from Bottom Node */}
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 238,
            width: 2050,
            height: 5,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${lineExitX}px, 0, 0) scaleX(${isExiting ? 1 : lineScaleX})`,
            borderRadius: 3,
            boxShadow: `0 0 20px ${accentColor}, 0 0 35px ${accentColor}`,
            zIndex: 15,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 240px, Top = 1560px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1675px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
