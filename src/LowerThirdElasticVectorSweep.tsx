import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * BATCH 2 - TEMA 4: MINIMALIST KINETIC LINE
 * Konsep 7: LowerThirdElasticVectorSweep
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-2800px kiri), garis tipis 2px ditarik kencang seperti ketapel (elastic spring extreme), lalu menebal dan memekar menjadi bidang ruang Lower Third solid.
 * Menggunakan fisika spring Elegant/Dramatic: { mass: 2, damping: 20, stiffness: 80 }.
 *
 * GERAKAN SEKUNDER:
 * Pin node vektor aksen menancap mekar di ujung garis (frame 32) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Membal tertarik kencang kembali ke garis 2px dan terlepas meluncur keluar melintasi batas frame kiri (-2800px).
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

export const LowerThirdElasticVectorSweep: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#F43F5E',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Spring Configurations as explicitly mandated
  const springDramatic = spring({
    frame: localFrame,
    fps,
    config: { mass: 2, damping: 20, stiffness: 80 },
  });

  const springMicroNode = spring({
    frame: Math.max(0, localFrame - 32),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 2, damping: 20, stiffness: 80 },
  });

  // Offscreen Interpolations (-2800px Left Entrance & Exit)
  const translateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2800])
    : interpolate(springDramatic, [0, 1], [-2800, 0]);

  const scaleY = isExiting
    ? interpolate(exitSpring, [0, 1], [1, 0.02])
    : interpolate(springDramatic, [0, 1], [0.02, 1]);

  const nodeScale = interpolate(springMicroNode, [0, 1], [0, 1]);
  const nodeExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, -2800]) : 0;

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
          transform: `translate3d(${translateX}px, 0, 0)`,
        }}
      >
        {/* Main Kinetic Elastic Thickening Slate */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 145,
            backgroundColor: primaryColor,
            borderRadius: 12,
            transformOrigin: 'center center',
            transform: `scaleY(${scaleY})`,
            boxShadow: '0 30px 70px rgba(0,0,0,0.85)',
            borderLeft: `8px solid ${accentColor}`,
          }}
        />

        {/* Subtier Elastic Slate Base */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 140,
            width: 1850,
            height: 90,
            backgroundColor: '#881337',
            borderRadius: '0 0 12px 12px',
            transformOrigin: 'center center',
            transform: `scaleY(${scaleY})`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Kinetic Vector Pin */}
        <div
          style={{
            position: 'absolute',
            left: 2160,
            top: -12,
            width: 55,
            height: 55,
            backgroundColor: accentColor,
            borderRadius: '50%',
            transformOrigin: 'center center',
            transform: `translate3d(${nodeExitX}px, 0, 0) scale(${isExiting ? 1 : nodeScale})`,
            boxShadow: `0 0 30px ${accentColor}`,
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
