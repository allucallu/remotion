import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * TEMA 1: ARCHITECTURAL & SPATIAL 3D
 * Konsep 1: LowerThirdSpatialOrigamiFold
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari garis tipis 1px di pusat area (-2200px dari luar frame atas), bidang terlipat mekar secara 3D (perspective 1400px + rotateX/rotateY) hingga membentang menjadi plat datar solid.
 * Menggunakan fisika spring Elegant/Dramatic: { mass: 2, damping: 20, stiffness: 80 }.
 *
 * GERAKAN SEKUNDER:
 * Line aksen neon sudut meluncur snap mekar di sepanjang garis batas lipatan (frame 30) dengan fisika Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * EXIT ANIMATION:
 * Terlipat kembali di ruang 3D menyusut ke garis 1px dan terpental naik keluar melintasi batas frame atas (-2200px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1560px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1670px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdSpatialOrigamiFold: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#38BDF8',
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

  const springSnappySecondary = spring({
    frame: Math.max(0, localFrame - 30),
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 2, damping: 20, stiffness: 80 },
  });

  // Offscreen Interpolations (-2200px Y Top)
  const translateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2200])
    : interpolate(springDramatic, [0, 1], [-2200, 0]);

  const rotateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 90])
    : interpolate(springDramatic, [0, 1], [90, 0]);

  const rotateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -45])
    : interpolate(springDramatic, [0, 1], [-45, 0]);

  const scaleX = isExiting
    ? interpolate(exitSpring, [0, 1], [1, 0.005])
    : interpolate(springDramatic, [0, 1], [0.005, 1]);

  const borderScaleX = interpolate(springSnappySecondary, [0, 1], [0, 1]);
  const borderExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
          perspective: 1400,
          transform: `translate3d(0, ${translateY}px, 0)`,
        }}
      >
        {/* Main 3D Origami Unfolding Plane */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 145,
            backgroundColor: primaryColor,
            borderRadius: 12,
            transformOrigin: 'left center',
            transform: `scaleX(${scaleX}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            transformStyle: 'preserve-3d',
            boxShadow: '0 30px 70px rgba(0,0,0,0.85)',
            borderLeft: `8px solid ${accentColor}`,
          }}
        />

        {/* Subtier Origami Face */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 85,
            backgroundColor: '#1E293B',
            borderRadius: '0 0 12px 12px',
            transformOrigin: 'left center',
            transform: `scaleX(${scaleX}) rotateX(${-rotateX}deg)`,
            transformStyle: 'preserve-3d',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Snappy Accent Border Edge Ignition */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 140,
            width: 2100,
            height: 5,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${borderExitX}px, 0, 0) scaleX(${isExiting ? 1 : borderScaleX})`,
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
        - Primary Name Line: Left = 240px, Top = 1560px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1670px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
