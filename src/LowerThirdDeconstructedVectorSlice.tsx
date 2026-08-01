import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * REVISED BATCH - TEMA 3: NEO-BRUTALISM & EDITORIAL MESH
 * Konsep 5: LowerThirdDeconstructedVectorSlice (SVG Polygon Sliced 3 Layers & Staggered Micro Bounce)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-3000px kiri), bentuk polygonal SVG tajam terbelah 3 lapis bertingkat mendarat dengan delay staggered (0.05s / 1.5 frame per lapis) dan micro-bounce yang presisi.
 * Menggunakan fisika spring Snap/Micro: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * FINISHING & TEKSTUR:
 * Masing-masing lapis memiliki opacity dan gradien warna berbeda dengan drop-shadow berlapis.
 *
 * EXIT ANIMATION:
 * Pecah 3 lapis meluncur berurutan secara staggered keluar melintasi batas frame kiri (-3000px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 260px, Top = 1560px, Width = 2150px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 280px, Top = 1670px, Width = 1850px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdDeconstructedVectorSlice: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#EC4899',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Staggered Micro Snap Springs for 3 Polygon Slices
  const layer1Spring = spring({
    frame: localFrame,
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });
  const layer2Spring = spring({
    frame: Math.max(0, localFrame - 2),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });
  const layer3Spring = spring({
    frame: Math.max(0, localFrame - 4),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSprings = [0, 1, 2].map((idx) =>
    spring({
      frame: Math.max(0, exitLocalFrame - idx * 2),
      fps,
      config: { mass: 0.1, damping: 8, stiffness: 300 },
    })
  );

  const getLayerX = (lSpring: number, idx: number) => {
    return isExiting
      ? interpolate(exitSprings[idx], [0, 1], [0, -3000])
      : interpolate(lSpring, [0, 1], [-3000, 0]);
  };

  const getLayerScaleX = (lSpring: number) => {
    return isExiting
      ? 1
      : interpolate(lSpring, [0, 0.5, 0.8, 1], [0.1, 1.2, 0.95, 1]);
  };

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
          filter: 'drop-shadow(0px 25px 40px rgba(0,0,0,0.8))',
        }}
      >
        <svg width="2300" height="250" viewBox="0 0 2300 250" fill="none">
          <defs>
            <linearGradient id="sliceGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="sliceGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#831843" />
              <stop offset="100%" stopColor="#9D174D" />
            </linearGradient>
            <linearGradient id="sliceGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="100%" stopColor="#F43F5E" />
            </linearGradient>
          </defs>

          {/* Layer 3 (Back Staggered Polygon Slice) */}
          <g transform={`translate(${getLayerX(layer3Spring, 2)}, 0) scale(${getLayerScaleX(layer3Spring)}, 1)`}>
            <path
              d="M 50,140 L 1900,140 L 1800,230 L 50,230 Z"
              fill="url(#sliceGrad2)"
              opacity="0.85"
            />
          </g>

          {/* Layer 2 (Mid Staggered Polygon Slice) */}
          <g transform={`translate(${getLayerX(layer2Spring, 1)}, 0) scale(${getLayerScaleX(layer2Spring)}, 1)`}>
            <path
              d="M 20,70 L 2100,70 L 1980,180 L 20,180 Z"
              fill="url(#sliceGrad1)"
              opacity="0.9"
            />
          </g>

          {/* Layer 1 (Front Main Polygon Slice) */}
          <g transform={`translate(${getLayerX(layer1Spring, 0)}, 0) scale(${getLayerScaleX(layer1Spring)}, 1)`}>
            <path
              d="M 0,0 L 2200,0 L 2050,145 L 0,145 Z"
              fill="url(#sliceGrad1)"
              stroke={accentColor}
              strokeWidth="4"
            />
          </g>
        </svg>

        {/* SECONDARY MOTION: Micro Snap Polygon Tag Pin */}
        <div
          style={{
            position: 'absolute',
            left: 2160,
            top: -12,
            width: 50,
            height: 50,
            backgroundColor: accentColor,
            borderRadius: 8,
            transformOrigin: 'center center',
            transform: `translate3d(${getLayerX(layer1Spring, 0)}px, 0, 0)`,
            boxShadow: `0 0 30px ${accentColor}`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 260px, Top = 1560px, Width = 2150px, Height = 100px
        - Subtitle Line:     Left = 280px, Top = 1670px, Width = 1850px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
