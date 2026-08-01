import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * TEMA 4: ORGANIC & NOISE DISTORTION
 * Konsep 8: LowerThirdAlgorithmicNoiseSweep (Bentuk Visual Tepi Robek Gerigi Noise Torn Edge Polygon)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-2800px kiri), pola polygon bertepi gerigi noise robek (torn edge) menyapu frame menggunakan kalkulasi math/noise hingga membentuk kontainer solid.
 * Menggunakan fisika spring Elegant/Dramatic: { mass: 2, damping: 20, stiffness: 80 }.
 *
 * GERAKAN SEKUNDER:
 * Balok aksen neon menyala di sepanjang garis kontur gerigi robekan (frame 35) dengan fisika Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * EXIT ANIMATION:
 * Sapuan robekan noise bergerak membalik menghapus kontainer dan meluncur keluar melintasi batas frame kanan (+3840px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 260px, Top = 1580px, Width = 2150px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 280px, Top = 1690px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdAlgorithmicNoiseSweep: React.FC<LowerThirdProps> = ({
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

  // Spring Configurations
  const springDramatic = spring({
    frame: localFrame,
    fps,
    config: { mass: 2, damping: 20, stiffness: 80 },
  });

  const springSnappyBeam = spring({
    frame: Math.max(0, localFrame - 35),
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 2, damping: 20, stiffness: 80 },
  });

  // Offscreen Interpolations (-2800px Left Entrance & +3840px Right Exit)
  const translateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(springDramatic, [0, 1], [-2800, 0]);

  const beamScaleX = interpolate(springSnappyBeam, [0, 1], [0, 1]);
  const beamExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3840]) : 0;

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
          transform: `translate3d(${translateX}px, 0, 0)`,
        }}
      >
        {/* Main Noise Eroded Torn-Edge Container */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 140,
            backgroundColor: primaryColor,
            clipPath: 'polygon(0 0, 95% 0, 100% 35%, 92% 65%, 98% 100%, 0 100%)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
            borderLeft: `8px solid ${accentColor}`,
          }}
        />

        {/* Subtier Eroded Torn-Edge Plate */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 90,
            backgroundColor: '#581C87',
            clipPath: 'polygon(0 0, 92% 0, 97% 40%, 90% 100%, 0 100%)',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Fast Snappy Contour Beam */}
        <div
          style={{
            position: 'absolute',
            left: 50,
            top: 138,
            width: 2100,
            height: 5,
            backgroundColor: accentColor,
            transformOrigin: 'left center',
            transform: `translate3d(${beamExitX}px, 0, 0) scaleX(${isExiting ? 1 : beamScaleX})`,
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
        - Primary Name Line: Left = 260px, Top = 1580px, Width = 2150px, Height = 100px
        - Subtitle Line:     Left = 280px, Top = 1690px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
