import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * REVISED BATCH - TEMA 3: NEO-BRUTALISM & EDITORIAL MESH
 * Konsep 6: LowerThirdFluidMaskReveal (SVG Ellipse Mask Organic Morphing & Stroke Write-On Effect)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari titik pusat kecil (-2800px kiri), masking SVG ellipse organik membesar meliuk-liuk dengan efek garis stroke write-on (strokeDashoffset) membocorkan ruang transparan di bawahnya.
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * FINISHING & TEKSTUR:
 * Kombinasi strokeDashoffset write-on effect dinamis, pendaran neon cyan, dan radial drop-shadow.
 *
 * EXIT ANIMATION:
 * Masking menyusut meliuk kembali ke titik pusat dan menghilang melintasi batas frame kanan (+3840px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1570px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1680px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdFluidMaskReveal: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#06B6D4',
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

  const springMicroWriteOn = spring({
    frame: Math.max(0, localFrame - 10),
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  // Offscreen & Write-on Interpolations
  const translateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(springSnappy, [0, 1], [-2800, 0]);

  const rx = isExiting
    ? interpolate(exitSpring, [0, 1], [1100, 10])
    : interpolate(springSnappy, [0, 0.6, 1], [10, 1250, 1100]);

  const ry = isExiting
    ? interpolate(exitSpring, [0, 1], [70, 5])
    : interpolate(springSnappy, [0, 0.6, 1], [5, 85, 70]);

  const strokeDashoffset = interpolate(springMicroWriteOn, [0, 1], [4000, 0]);

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
          filter: 'drop-shadow(0px 25px 40px rgba(0,0,0,0.85))',
        }}
      >
        <svg width="2250" height="250" viewBox="0 0 2250 250" fill="none">
          <defs>
            <linearGradient id="fluidMaskGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.95" />
              <stop offset="60%" stopColor="#1E293B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#083344" stopOpacity="0.98" />
            </linearGradient>
          </defs>

          {/* Subtier Fluid Ellipse Mask Base */}
          <ellipse
            cx="1100"
            cy="180"
            rx={rx * 0.85}
            ry={ry * 0.9}
            fill="#083344"
            opacity="0.8"
          />

          {/* Main Fluid Ellipse Mask Reveal Path */}
          <ellipse
            cx="1100"
            cy="75"
            rx={rx}
            ry={ry}
            fill="url(#fluidMaskGrad)"
            stroke={accentColor}
            strokeWidth="4"
            strokeDasharray="4000"
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        {/* SECONDARY MOTION: Micro Snap Write-On Bead */}
        <div
          style={{
            position: 'absolute',
            left: 2150,
            top: 20,
            width: 36,
            height: 36,
            backgroundColor: accentColor,
            borderRadius: '50%',
            transformOrigin: 'center center',
            boxShadow: `0 0 30px ${accentColor}, 0 0 60px ${accentColor}`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 240px, Top = 1570px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1680px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
