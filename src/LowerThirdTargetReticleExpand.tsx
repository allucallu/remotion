import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * BATCH 2 - TEMA 3: HUD CYBERNETICS & SCI-FI
 * Konsep 5: LowerThirdTargetReticleExpand
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal dari titik lingkaran HUD reticle kecil di pusat (-2800px kiri), reticle meledak mekar menjadi panel heksagonal teknis dengan data-bar sekunder.
 * Menggunakan fisika spring Fast/Snappy: { mass: 0.5, damping: 12, stiffness: 200 }.
 *
 * GERAKAN SEKUNDER:
 * Bracket HUD aksen L-corner mekar menancap di sudut heksagonal (frame 30) dengan fisika Micro/Snap: { mass: 0.1, damping: 8, stiffness: 300 }.
 *
 * EXIT ANIMATION:
 * Panel heksagonal menyusut kembali ke titik target reticle dan meledak menghilang ke luar kanan (+3840px).
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

export const LowerThirdTargetReticleExpand: React.FC<LowerThirdProps> = ({
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

  const springMicroBracket = spring({
    frame: Math.max(0, localFrame - 30),
    fps,
    config: { mass: 0.1, damping: 8, stiffness: 300 },
  });

  const exitSpring = spring({
    frame: exitLocalFrame,
    fps,
    config: { mass: 0.5, damping: 12, stiffness: 200 },
  });

  // Scale & Expand Interpolations
  const scaleX = isExiting
    ? interpolate(exitSpring, [0, 1], [1, 0])
    : interpolate(springSnappy, [0, 1], [0.01, 1]);

  const scaleY = isExiting
    ? interpolate(exitSpring, [0, 1], [1, 0])
    : interpolate(springSnappy, [0, 1], [0.01, 1]);

  const bracketScale = interpolate(springMicroBracket, [0, 1], [0, 1]);
  const bracketExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3500]) : 0;

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
        {/* Main Technical Hexagonal HUD Slate */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 145,
            backgroundColor: primaryColor,
            borderRadius: 12,
            clipPath: 'polygon(0 0, 95% 0, 100% 35%, 95% 100%, 0 100%)',
            transformOrigin: 'left center',
            transform: `scale(${scaleX}, ${scaleY})`,
            boxShadow: `0 30px 70px rgba(0,0,0,0.85), inset 0 0 25px ${accentColor}30`,
            borderLeft: `8px solid ${accentColor}`,
            borderTop: `2px solid ${accentColor}60`,
          }}
        />

        {/* Subtier Hexagonal HUD Slate */}
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 145,
            width: 1850,
            height: 85,
            backgroundColor: '#083344',
            borderRadius: '0 0 12px 12px',
            clipPath: 'polygon(0 0, 95% 0, 98% 100%, 0 100%)',
            transformOrigin: 'left center',
            transform: `scale(${scaleX}, ${scaleY})`,
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          }}
        />

        {/* SECONDARY MOTION: Micro Snap Corner HUD L-Bracket */}
        <div
          style={{
            position: 'absolute',
            left: 2160,
            top: -12,
            width: 60,
            height: 60,
            backgroundColor: accentColor,
            borderRadius: 8,
            transformOrigin: 'center center',
            transform: `translate3d(${bracketExitX}px, 0, 0) scale(${isExiting ? 1 : bracketScale})`,
            boxShadow: `0 0 30px ${accentColor}`,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              border: '4px solid #0F172A',
              borderRadius: 4,
            }}
          />
        </div>
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
