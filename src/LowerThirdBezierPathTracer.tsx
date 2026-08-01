import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * REVISED BATCH - TEMA 4: HIGH-TECH VECTOR CIRCUITS
 * Konsep 7: LowerThirdBezierPathTracer (SVG Smooth Curved Bézier Path Write-On Effect & Gradient Glow)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-2800px kiri), garis SVG melengkung halus menyapu layar secara kilat (write-on effect via strokeDashoffset), meninggalkan jejak pendaran gradien lembut.
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * FINISHING & TEKSTUR:
 * Stroke pendaran neon gradien aktif dengan drop-shadow glow kedalaman tinggi.
 *
 * EXIT ANIMATION:
 * Garis sirkuit tersapu balik menyusut dan meluncur keluar melintasi batas frame kanan (+3840px).
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

export const LowerThirdBezierPathTracer: React.FC<LowerThirdProps> = ({
  primaryColor = '#0F172A',
  accentColor = '#10B981',
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

  const springMicroTracer = spring({
    frame: Math.max(0, localFrame - 5),
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

  const strokeDashoffset = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 5000])
    : interpolate(springMicroTracer, [0, 1], [5000, 0]);

  const scaleX = isExiting
    ? interpolate(exitSpring, [0, 1], [1, 0.05])
    : interpolate(springSnappy, [0, 0.5, 1], [0.1, 1.25, 1]);

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
          transform: `translate3d(${translateX}px, 0, 0) scaleX(${scaleX})`,
          transformOrigin: 'left center',
          filter: 'drop-shadow(0px 25px 40px rgba(0,0,0,0.85))',
        }}
      >
        <svg width="2300" height="250" viewBox="0 0 2300 250" fill="none">
          <defs>
            <linearGradient id="tracerGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.95" />
              <stop offset="100%" stopColor="#064E3B" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="tracerGradStroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={accentColor} />
              <stop offset="50%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          {/* Subtier Path Tracer Base */}
          <path
            d="M 40,140 C 450,170 950,120 1450,160 C 1800,190 2050,140 2250,145 L 2250,230 L 40,230 Z"
            fill="#064E3B"
            opacity="0.8"
          />

          {/* Main Curved Bézier Path Container */}
          <path
            d="M 0,20 C 500,-20 1000,40 1500,0 C 1850,-30 2100,20 2250,10 L 2250,150 L 0,150 Z"
            fill="url(#tracerGradMain)"
          />

          {/* Smooth Write-On Path Tracer Stroke */}
          <path
            d="M 0,20 C 500,-20 1000,40 1500,0 C 1850,-30 2100,20 2250,10"
            stroke="url(#tracerGradStroke)"
            strokeWidth="6"
            strokeDasharray="5000"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* SECONDARY MOTION: Micro Snap Tracer Node Drop */}
        <div
          style={{
            position: 'absolute',
            left: 2160,
            top: -12,
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
        - Primary Name Line: Left = 250px, Top = 1560px, Width = 2200px, Height = 100px
        - Subtitle Line:     Left = 270px, Top = 1675px, Width = 1850px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
