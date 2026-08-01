import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * TEMA 5: TEMPORAL & GLITCH DATA
 * Konsep 9: LowerThirdScanlineFracture (Bentuk Visual Dual Scanner Lines Matrix Cyber Block)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-2800px kiri), pemindai laser ganda meluncur cepat meninggalkan jejak matriks blok cyber solid yang mengendap presisi.
 * Menggunakan fisika spring Snap/Micro: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * GERAKAN SEKUNDER:
 * Garis laser scanline menyala berdenyut di sepanjang tepi atas kontainer (frame 25) dengan fisika Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * EXIT ANIMATION:
 * Garis pemindai menyapu balik menghancurkan blok geometris dan meluncur keluar melintasi batas frame kanan (+3840px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1560px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1675px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdScanlineFracture: React.FC<LowerThirdProps> = ({
  primaryColor = '#090D16',
  accentColor = '#22C55E',
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

  const springScanline = spring({
    frame: Math.max(0, localFrame - 25),
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  // Offscreen Interpolations (-2800px Left & +3840px Right)
  const translateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(springSnap, [0, 1], [-2800, 0]);

  const scanScaleX = interpolate(springScanline, [0, 1], [0, 1]);
  const scanExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
          transform: `translate3d(${translateX}px, 0, 0)`,
        }}
      >
        {/* Main Solid Cyber Scanline Block */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 145,
            backgroundColor: primaryColor,
            borderRadius: 12,
            boxShadow: `0 30px 70px rgba(0,0,0,0.95), inset 0 0 25px ${accentColor}30`,
            borderLeft: `8px solid ${accentColor}`,
            borderTop: `2px solid ${accentColor}80`,
          }}
        />

        {/* Subtier Cyber Block */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 85,
            backgroundColor: '#052E16',
            borderRadius: '0 0 12px 12px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
            borderBottom: `2px solid ${accentColor}80`,
          }}
        />

        {/* SECONDARY MOTION: Fast Scanline Laser Sweep */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: -5,
            width: 2150,
            height: 6,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${scanExitX}px, 0, 0) scaleX(${isExiting ? 1 : scanScaleX})`,
            borderRadius: 3,
            boxShadow: `0 0 25px ${accentColor}, 0 0 45px ${accentColor}`,
            zIndex: 20,
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
