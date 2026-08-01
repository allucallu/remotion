import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * REVISED BATCH - TEMA 4: HIGH-TECH VECTOR CIRCUITS
 * Konsep 8: LowerThirdPolygonalMeshUnfold (SVG Polygon Origami Mesh Unfold 3D & Dynamic Stroke Thickness)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-2800px kiri), jaringan poligon SVG interaktif membuka sudut demi sudut seperti origami futuristik dengan ketebalan stroke dinamis dan deformasi 3D.
 * Menggunakan fisika spring Snap/Micro: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * FINISHING & TEKSTUR:
 * Stroke neon cyberpunk dinamis, garis grid mesh poligonal, dan drop-shadow berlapis.
 *
 * EXIT ANIMATION:
 * Polygon terlipat menyusut sudut demi sudut ke titik asal dan meluncur keluar melintasi batas frame kiri (-2800px).
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

export const LowerThirdPolygonalMeshUnfold: React.FC<LowerThirdProps> = ({
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
  const springSnap = spring({
    frame: localFrame,
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const springMicroMesh = spring({
    frame: Math.max(0, localFrame - 25),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  // Offscreen & 3D Unfold Interpolations
  const translateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -2800])
    : interpolate(springSnap, [0, 1], [-2800, 0]);

  const rotateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -60])
    : interpolate(springSnap, [0, 1], [60, 0]);

  const strokeWidth = interpolate(springMicroMesh, [0, 1], [1, 5]);
  const pinScale = interpolate(springMicroMesh, [0, 1], [0, 1]);

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
          perspective: 1600,
          transform: `translate3d(${translateX}px, 0, 0) rotateY(${rotateY}deg)`,
          transformOrigin: 'left center',
          filter: 'drop-shadow(0px 25px 40px rgba(0,0,0,0.8))',
        }}
      >
        <svg width="2250" height="250" viewBox="0 0 2250 250" fill="none">
          <defs>
            <linearGradient id="meshGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor="#3B0764" />
            </linearGradient>
            <linearGradient id="meshGradSub" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>

          {/* Subtier Polygon Mesh Base */}
          <path
            d="M 40,145 L 1900,145 L 1820,230 L 40,230 Z"
            fill="url(#meshGradSub)"
            opacity="0.85"
          />

          {/* Main Origami Polygon Mesh Vector Container */}
          <path
            d="M 0,0 L 700,0 L 1400,20 L 2200,0 L 2050,140 L 1300,145 L 600,135 L 0,140 Z"
            fill="url(#meshGradMain)"
            stroke={accentColor}
            strokeWidth={strokeWidth}
          />

          {/* Inner Polygonal Triangulation Mesh Lines */}
          <path
            d="M 700,0 L 600,135 M 1400,20 L 1300,145 M 700,0 L 1300,145"
            stroke={accentColor}
            strokeWidth="2"
            strokeDasharray="6 6"
            opacity="0.7"
          />
        </svg>

        {/* SECONDARY MOTION: Micro Snap Origami Node Tag */}
        <div
          style={{
            position: 'absolute',
            left: 2160,
            top: -10,
            width: 50,
            height: 50,
            backgroundColor: accentColor,
            borderRadius: 8,
            transformOrigin: 'center center',
            transform: `scale(${isExiting ? 1 : pinScale})`,
            boxShadow: `0 0 30px ${accentColor}`,
            zIndex: 20,
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
