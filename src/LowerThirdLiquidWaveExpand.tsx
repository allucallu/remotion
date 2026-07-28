import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 7. LowerThirdLiquidWaveExpand (REVISED: 100% Off-Screen Entrance & Exit)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME KIRI (-3000px), wadah dan lapisan gelombang sinusoidal menyapu masuk melintasi layar 4K.
 * Saat exit, seluruh struktur meluncur keluar melintasi batas frame kanan (+3840px).
 *
 * GERAKAN SEKUNDER:
 * Titik cahaya melayang (floating glow bead) meluncur dari luar frame atas (-1000px) ke puncak gelombang (frame 30) dan meluncur keluar ke kanan (+3840px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1580px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1690px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdLiquidWaveExpandProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdLiquidWaveExpand: React.FC<LowerThirdLiquidWaveExpandProps> = ({
  primaryColor = '#0F766E',
  accentColor = '#2DD4BF',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Wave Sweep & Translate Springs
  const waveSpring = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 130, mass: 0.8 } });
  const beadSpring = spring({ frame: localFrame - 30, fps, config: { damping: 10, stiffness: 160, mass: 0.6 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Offscreen Translate (Entrance from -3000px, Exit to +3840px)
  const containerX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(waveSpring, [0, 1], [-3000, 0]);

  const waveProgress = interpolate(waveSpring, [0, 1], [0, 1]);
  const beadProgress = interpolate(beadSpring, [0, 1], [0, 1]);

  // Compute wave clip-path
  const clipWidth = waveProgress * 100;
  const clipString = `polygon(0 0, ${clipWidth}% 0, ${Math.max(0, clipWidth - 5)}% 50%, ${clipWidth}% 100%, 0 100%)`;

  const beadInY = interpolate(beadSpring, [0, 1], [-1000, 0]);
  const beadX = isExiting
    ? interpolate(exitSpring, [0, 1], [beadProgress * 2100, 3840])
    : beadProgress * 2100;

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
        {/* Main Base Card with Dynamic Liquid Wave Clip-Path */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 10,
            width: 2200,
            height: 230,
            backgroundColor: primaryColor,
            borderRadius: '16px 0 0 16px',
            clipPath: clipString,
            transform: `translateX(${containerX}px)`,
            boxShadow: '0 30px 70px rgba(0,0,0,0.8)',
            borderLeft: `6px solid ${accentColor}`,
          }}
        />

        {/* Secondary Layer Wave Trim */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 145,
            width: 1800,
            height: 85,
            backgroundColor: '#115E59',
            borderRadius: '0 0 0 16px',
            clipPath: clipString,
            transform: `translateX(${containerX}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Floating Glow Bead Traveling Along Wave Edge */}
        <div
          style={{
            position: 'absolute',
            left: beadX,
            top: isExiting ? 0 : beadInY,
            width: 30,
            height: 30,
            backgroundColor: accentColor,
            borderRadius: '50%',
            transformOrigin: 'center center',
            boxShadow: `0 0 25px ${accentColor}, 0 0 45px ${accentColor}`,
            opacity: beadProgress > 0.05 ? 1 : 0,
            zIndex: 20,
          }}
        />
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
