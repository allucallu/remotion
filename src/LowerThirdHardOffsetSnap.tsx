import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * BATCH 2 - TEMA 2: RAW BRUTALISM & NEO-GRAPHIC
 * Konsep 3: LowerThirdHardOffsetSnap
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari luar frame (-3000px kiri), blok monokrom hitam-putih tebal tanpa rounded border melompat secara kasar (heavy snap overshoot) dengan border 6px hitam tegas dan bayangan offset keras (hard shadow 12px 12px #000).
 * Menggunakan fisika spring Snap/Micro: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * GERAKAN SEKUNDER:
 * Tag chevron aksen neo-brutalist menancap mekar di sudut kanan (frame 28) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Melompat membal kasar keluar melintasi batas frame kiri (-3000px).
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 240px, Top = 1550px, Width = 2200px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 260px, Top = 1665px, Width = 1850px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps) | Settle/Hold: Frame 35 s/d 145 (3.67 detik)
 */

interface LowerThirdProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdHardOffsetSnap: React.FC<LowerThirdProps> = ({
  primaryColor = '#18181B',
  accentColor = '#FACC15',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Spring Configurations as explicitly mandated
  const springMicroSnap = spring({
    frame: localFrame,
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const springMicroTag = spring({
    frame: Math.max(0, localFrame - 28),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  // Offscreen Interpolations (-3000px X Left)
  const translateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -3000])
    : interpolate(springMicroSnap, [0, 1], [-3000, 0]);

  const tagScale = interpolate(springMicroTag, [0, 1], [0, 1]);
  const tagExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, -3000]) : 0;

  const baseLeft = 200;
  const baseTop = 1520;

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
        {/* Main Raw Brutalist Heavy Block (Thick 6px border & Hard 12px 12px shadow) */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 145,
            backgroundColor: primaryColor,
            borderRadius: 0,
            border: '6px solid #000000',
            boxShadow: '12px 12px 0px #000000',
            borderLeft: `12px solid ${accentColor}`,
          }}
        />

        {/* Subtier Brutalist Block */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 85,
            backgroundColor: '#FFFFFF',
            borderRadius: 0,
            border: '6px solid #000000',
            boxShadow: '10px 10px 0px #000000',
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Neo-Brutalist Accent Tag */}
        <div
          style={{
            position: 'absolute',
            left: 2160,
            top: -15,
            width: 60,
            height: 60,
            backgroundColor: accentColor,
            borderRadius: 0,
            border: '6px solid #000000',
            boxShadow: '6px 6px 0px #000000',
            transformOrigin: 'center center',
            transform: `translate3d(${tagExitX}px, 0, 0) scale(${isExiting ? 1 : tagScale})`,
            zIndex: 20,
          }}
        />
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 240px, Top = 1550px, Width = 2200px, Height = 100px
        - Subtitle Line:     Left = 260px, Top = 1665px, Width = 1850px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
