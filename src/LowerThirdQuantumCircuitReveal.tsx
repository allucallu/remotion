import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * BATCH 2 - TEMA 3: HUD CYBERNETICS & SCI-FI
 * Konsep 6: LowerThirdQuantumCircuitReveal
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-2800px kiri & +3840px kanan), garis-garis sirkuit tipis mengekspansi cepat melacak area, lalu diisi oleh bidang gelap semi-transparan dari arah berlawanan.
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * GERAKAN SEKUNDER:
 * Titik node sirkuit kuantum menyala berdenyut (frame 32) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Garis sirkuit melacak mundur dan menyusut keluar melintasi batas frame kanan (+3840px).
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

export const LowerThirdQuantumCircuitReveal: React.FC<LowerThirdProps> = ({
  primaryColor = '#030712',
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

  const springMicroNode = spring({
    frame: Math.max(0, localFrame - 32),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  // Offscreen Interpolations (-2800px Left & +3840px Right)
  const circuitLeftX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(springSnappy, [0, 1], [-2800, 0]);

  const panelRightX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(springSnappy, [0, 1], [3840, 0]);

  const nodeScale = interpolate(springMicroNode, [0, 1], [0, 1]);

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
        {/* Main Dark Quantum Panel (Filling from RIGHT +3840px) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 140,
            backgroundColor: primaryColor,
            borderRadius: 12,
            transform: `translateX(${panelRightX}px)`,
            boxShadow: `0 30px 70px rgba(0,0,0,0.9), inset 0 0 30px ${accentColor}30`,
            borderLeft: `8px solid ${accentColor}`,
          }}
        />

        {/* Outer Tracing Quantum Circuit Line (Tracing from LEFT -2800px) */}
        <div
          style={{
            position: 'absolute',
            left: -10,
            top: -10,
            width: 2220,
            height: 160,
            borderRadius: 16,
            border: `3px dashed ${accentColor}`,
            transform: `translateX(${circuitLeftX}px)`,
            boxShadow: `0 0 25px ${accentColor}80`,
            pointerEvents: 'none',
          }}
        />

        {/* Subtier Quantum Base */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 90,
            backgroundColor: '#064E3B',
            borderRadius: '0 0 12px 12px',
            transform: `translateX(${panelRightX}px)`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Quantum Node Dots */}
        <div
          style={{
            position: 'absolute',
            left: 2150,
            top: 20,
            width: 40,
            height: 40,
            backgroundColor: accentColor,
            borderRadius: '50%',
            transformOrigin: 'center center',
            transform: `translate3d(${panelRightX}px, 0, 0) scale(${isExiting ? 1 : nodeScale})`,
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
