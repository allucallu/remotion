import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * TEMA 2: DESTRUCTIVE & FRACTURED
 * Konsep 4: LowerThirdTectonicBlockShift (Bentuk Visual Plat Tektonik Chevron Miring 45 Derajat)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-2800px, -1800px top-left & +3500px, +1800px bottom-right), dua plat tektonik chevron miring bergeser saling memotong dan mengunci di tengah sepanjang garis patahan 45 derajat.
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * GERAKAN SEKUNDER:
 * Garis aksen magma menembak menyusuri patahan miring 45 derajat (frame 30) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Dua plat bergeser membelah secara diagonal dan meluncur keluar ke arah asal (top-left & bottom-right).
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

export const LowerThirdTectonicBlockShift: React.FC<LowerThirdProps> = ({
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

  // Spring Configurations
  const springSnappy = spring({
    frame: localFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  const springMicroMagma = spring({
    frame: Math.max(0, localFrame - 30),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  // Diagonal 45-degree Vector Interpolations
  const block1X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2800])
    : interpolate(springSnappy, [0, 1], [-2800, 0]);
  const block1Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1800])
    : interpolate(springSnappy, [0, 1], [-1800, 0]);

  const block2X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3500])
    : interpolate(springSnappy, [0, 1], [3500, 0]);
  const block2Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 1800])
    : interpolate(springSnappy, [0, 1], [1800, 0]);

  const magmaScaleX = interpolate(springMicroMagma, [0, 1], [0, 1]);
  const magmaExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
        {/* Tectonic Chevron Plate 1 (from Top-Left) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1300,
            height: 140,
            backgroundColor: primaryColor,
            clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)',
            transform: `translate3d(${block1X}px, ${block1Y}px, 0)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
            borderLeft: `8px solid ${accentColor}`,
          }}
        />

        {/* Tectonic Chevron Plate 2 (from Bottom-Right) */}
        <div
          style={{
            position: 'absolute',
            left: 1240,
            top: 0,
            width: 960,
            height: 140,
            backgroundColor: '#991B1B',
            clipPath: 'polygon(12% 0, 100% 0, 92% 100%, 0 100%)',
            transform: `translate3d(${block2X}px, ${block2Y}px, 0)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          }}
        />

        {/* Tectonic Subtier Plate */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 90,
            backgroundColor: '#27272A',
            clipPath: 'polygon(0 0, 96% 0, 88% 100%, 0 100%)',
            transform: `translate3d(${block1X}px, ${block1Y}px, 0)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Magma Accent Line */}
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 138,
            width: 2000,
            height: 5,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${magmaExitX}px, 0, 0) scaleX(${isExiting ? 1 : magmaScaleX})`,
            borderRadius: 3,
            boxShadow: `0 0 20px ${accentColor}, 0 0 40px ${accentColor}`,
            zIndex: 15,
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
