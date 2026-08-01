import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * TEMA 2: DESTRUCTIVE & FRACTURED
 * Konsep 4: LowerThirdTectonicBlockShift
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-3000px kiri & +3840px kanan), dua blok warna berlawanan bergeser saling memotong dan mengunci di tengah dengan dampak gesekan tektonik.
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * GERAKAN SEKUNDER:
 * Garis aksen kejutan menembak menyusuri patahan sambungan (frame 30) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Dua blok bergeser membelah dan meluncur cepat keluar melintasi frame kiri (-3000px) & kanan (+3840px).
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

  const springMicroShock = spring({
    frame: Math.max(0, localFrame - 30),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  // Offscreen Interpolations (-3000px Left & +3840px Right)
  const blockLeftX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -3000])
    : interpolate(springSnappy, [0, 1], [-3000, 0]);

  const blockRightX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(springSnappy, [0, 1], [3840, 0]);

  const shockScaleX = interpolate(springMicroShock, [0, 1], [0, 1]);
  const shockExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
        {/* Tectonic Block 1 (Sliding from LEFT -3000px) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1300,
            height: 140,
            backgroundColor: primaryColor,
            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
            transform: `translateX(${blockLeftX}px)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
            borderLeft: `8px solid ${accentColor}`,
          }}
        />

        {/* Tectonic Block 2 (Sliding from RIGHT +3840px) */}
        <div
          style={{
            position: 'absolute',
            left: 1240,
            top: 0,
            width: 960,
            height: 140,
            backgroundColor: '#991B1B',
            clipPath: 'polygon(8% 0, 100% 0, 94% 100%, 0 100%)',
            transform: `translateX(${blockRightX}px)`,
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
          }}
        />

        {/* Tectonic Subtier Block (Sliding from LEFT -3000px) */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 90,
            backgroundColor: '#27272A',
            clipPath: 'polygon(0 0, 95% 0, 90% 100%, 0 100%)',
            transform: `translateX(${blockLeftX}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Shockwave Accent Bar */}
        <div
          style={{
            position: 'absolute',
            left: 80,
            top: 138,
            width: 2000,
            height: 5,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${shockExitX}px, 0, 0) scaleX(${isExiting ? 1 : shockScaleX})`,
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
