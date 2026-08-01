import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * BATCH 2 - TEMA 5: LUXURY GOLD & METALLIC
 * Konsep 10: LowerThirdMetallicInsetSlide
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-2800px top-left & +3840px bottom-right), dua plat metallic tipis saling mengunci seperti engsel presisi tinggi, membuka ruang mewah di tengahnya.
 * Menggunakan fisika spring Snap/Micro: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * GERAKAN SEKUNDER:
 * Pasak engsel logam presisi menancap mengunci (frame 32) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Engsel terlepas dan dua plat meluncur keluar berlawanan arah ke top-left (-2800px) & bottom-right (+3840px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 250px, Top = 1570px, Width = 2200px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 270px, Top = 1680px, Width = 1850px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdMetallicInsetSlide: React.FC<LowerThirdProps> = ({
  primaryColor = '#111827',
  accentColor = '#E5E7EB',
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

  const springMicroHinge = spring({
    frame: Math.max(0, localFrame - 32),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  // Offscreen Interpolations (-2800px Top-Left & +3840px Bottom-Right)
  const plate1X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2800])
    : interpolate(springSnap, [0, 1], [-2800, 0]);
  const plate1Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -1800])
    : interpolate(springSnap, [0, 1], [-1800, 0]);

  const plate2X = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(springSnap, [0, 1], [3840, 0]);
  const plate2Y = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 1800])
    : interpolate(springSnap, [0, 1], [1800, 0]);

  const hingeScale = interpolate(springMicroHinge, [0, 1], [0, 1]);
  const hingeExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

  const baseLeft = 200;
  const baseTop = 1530;

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
        {/* Main Precision Metallic Inset Plate 1 (from Top-Left) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 1250,
            height: 145,
            backgroundColor: primaryColor,
            borderRadius: '12px 0 0 12px',
            clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)',
            transform: `translate3d(${plate1X}px, ${plate1Y}px, 0)`,
            boxShadow: '0 30px 70px rgba(0,0,0,0.85)',
            borderLeft: `8px solid ${accentColor}`,
          }}
        />

        {/* Precision Metallic Inset Plate 2 (from Bottom-Right) */}
        <div
          style={{
            position: 'absolute',
            left: 1180,
            top: 0,
            width: 1020,
            height: 145,
            backgroundColor: '#374151',
            borderRadius: '0 12px 12px 0',
            clipPath: 'polygon(6% 0, 100% 0, 94% 100%, 0 100%)',
            transform: `translate3d(${plate2X}px, ${plate2Y}px, 0)`,
            boxShadow: '0 30px 70px rgba(0,0,0,0.85)',
            borderRight: `4px solid ${accentColor}`,
          }}
        />

        {/* Subtier Metallic Base */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 85,
            backgroundColor: primaryColor,
            borderRadius: '0 0 12px 12px',
            clipPath: 'polygon(0 0, 96% 0, 90% 100%, 0 100%)',
            transform: `translate3d(${plate1X}px, ${plate1Y}px, 0)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Precision Hinge Pin */}
        <div
          style={{
            position: 'absolute',
            left: 2160,
            top: -15,
            width: 45,
            height: 250,
            backgroundColor: accentColor,
            borderRadius: 6,
            transformOrigin: 'center center',
            transform: `translate3d(${hingeExitX}px, 0, 0) scale(${isExiting ? 1 : hingeScale})`,
            boxShadow: `0 0 30px ${accentColor}`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 250px, Top = 1570px, Width = 2200px, Height = 100px
        - Subtitle Line:     Left = 270px, Top = 1680px, Width = 1850px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
