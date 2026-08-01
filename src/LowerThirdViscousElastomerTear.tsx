import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * TEMA 4: ORGANIC & NOISE DISTORTION
 * Konsep 7: LowerThirdViscousElastomerTear (Bentuk Visual Kapsul Cair Organic Liquid Pod)
 *
 * MEKANISME REVEAL UTAMA:
 * Membran kapsul cair organis (borderRadius 40% 70% 30% 60%) robek/tertarik dari tengah secara elastis dengan wobble overshoot sebelum settle stabil menjadi kontainer cair.
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * GERAKAN SEKUNDER:
 * Manjakani cairan neon meluncur menyusuri lengkungan atas (frame 32) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Membran tertarik kencang dan menyusut membal kembali ke pusat lalu menghilang.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 250px, Top = 1560px, Width = 2200px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 270px, Top = 1675px, Width = 1850px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdViscousElastomerTear: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F766E',
  accentColor = '#14B8A6',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Spring Configurations
  const springTear = spring({
    frame: localFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  const springMicroBead = spring({
    frame: Math.max(0, localFrame - 32),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  const scaleX = isExiting
    ? interpolate(exitSpring, [0, 1], [1, 0])
    : interpolate(springTear, [0, 1], [0, 1]);

  const beadProgress = interpolate(springMicroBead, [0, 1], [0, 1]);
  const beadX = isExiting
    ? interpolate(exitSpring, [0, 1], [beadProgress * 2100, 3840])
    : beadProgress * 2100;

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
        {/* Main Viscous Organic Liquid Pod Container */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 145,
            backgroundColor: primaryColor,
            borderRadius: '40% 70% 30% 60% / 60% 30% 70% 40%',
            transformOrigin: 'center center',
            transform: `scaleX(${scaleX})`,
            boxShadow: '0 30px 70px rgba(0,0,0,0.8)',
            borderLeft: `8px solid ${accentColor}`,
          }}
        />

        {/* Subtier Liquid Membrane Pod */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 140,
            width: 1800,
            height: 90,
            backgroundColor: '#115E59',
            borderRadius: '30% 60% 40% 50% / 50% 40% 60% 30%',
            transformOrigin: 'center center',
            transform: `scaleX(${scaleX})`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Floating Bead */}
        <div
          style={{
            position: 'absolute',
            left: 80 + beadX,
            top: -10,
            width: 28,
            height: 28,
            backgroundColor: accentColor,
            borderRadius: '50%',
            transformOrigin: 'center center',
            boxShadow: `0 0 25px ${accentColor}, 0 0 50px ${accentColor}`,
            opacity: beadProgress > 0.05 ? 1 : 0,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 250px, Top = 1560px, Width = 2200px, Height = 100px
        - Subtitle Line:     Left = 270px, Top = 1675px, Width = 1850px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
