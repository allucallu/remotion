import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 4. LowerThirdCubePerspectiveUnfold (Batch 2)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME BAWAH LAYAR 4K (+2200px), struktur kotak 3D isometris meluncur naik dan merekah membentangkan muka depannya (`rotateX`, `rotateY`) membentuk spanduk multi-layer.
 * Saat exit, seluruh kotak melipat kembali, mengecil, dan jatuh keluar melintasi bawah frame 4K (+2200px).
 *
 * GERAKAN SEKUNDER:
 * Cap aksen sudut atas membal membesar pada frame 38 dan meluncur keluar frame kiri (-2500px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1580px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1690px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdCubePerspectiveUnfoldProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdCubePerspectiveUnfold: React.FC<LowerThirdCubePerspectiveUnfoldProps> = ({
  primaryColor = '#18181B',
  accentColor = '#A855F7',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Entrance Springs
  const containerSpring = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 150, mass: 0.8 } });
  const unfoldSpring = spring({ frame: localFrame - 10, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  const capSpring = spring({ frame: localFrame - 38, fps, config: { damping: 9, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Interpolations (+2200px bottom drop)
  const translateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 2200])
    : interpolate(containerSpring, [0, 1], [2200, 0]);

  const rotateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 90])
    : interpolate(containerSpring, [0, 1], [-90, 0]);

  const rotateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -90])
    : interpolate(unfoldSpring, [0, 1], [90, 0]);

  const scale = isExiting ? interpolate(exitSpring, [0, 1], [1, 0]) : 1;
  const opacity = isExiting ? interpolate(exitSpring, [0.6, 1], [1, 0], { extrapolateRight: 'clamp' }) : 1;

  const capScale = interpolate(capSpring, [0, 1], [0, 1]);
  const capExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, -2500]) : 0;

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
          perspective: 1400,
          transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
          opacity,
        }}
      >
        {/* Main 3D Box Surface */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 240,
            transformOrigin: 'center bottom',
            transform: `rotateX(${rotateX}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Main Slate Slab */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1400,
              height: 150,
              backgroundColor: primaryColor,
              borderRadius: '8px 0 0 8px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.7)',
              borderLeft: `6px solid ${accentColor}`,
            }}
          />

          {/* Unfolding 3D Cube Wing */}
          <div
            style={{
              position: 'absolute',
              left: 1395,
              top: 0,
              width: 785,
              height: 150,
              backgroundColor: '#27272A',
              borderRadius: '0 8px 8px 0',
              transformOrigin: 'left center',
              transform: `rotateY(${rotateY}deg)`,
              boxShadow: '10px 20px 40px rgba(0,0,0,0.5)',
              borderTop: `3px solid ${accentColor}`,
            }}
          />

          {/* Subtitle Lower Tier Plate */}
          <div
            style={{
              position: 'absolute',
              left: 40,
              top: 145,
              width: 1750,
              height: 85,
              backgroundColor: '#3F3F46',
              borderRadius: 6,
              transformOrigin: 'left center',
              transform: `rotateY(${rotateY}deg)`,
              boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
            }}
          />

          {/* SECONDARY MOTION: Accent Corner Cap */}
          <div
            style={{
              position: 'absolute',
              left: -15,
              top: -15,
              width: 50,
              height: 50,
              backgroundColor: accentColor,
              borderRadius: 6,
              transformOrigin: 'center center',
              transform: `translate3d(${capExitX}px, 0, 0) scale(${isExiting ? 0 : capScale})`,
              boxShadow: `0 0 25px ${accentColor}90`,
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: '#18181B',
                borderRadius: 3,
              }}
            />
          </div>
        </div>
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 240px, Top = 1580px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1690px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
