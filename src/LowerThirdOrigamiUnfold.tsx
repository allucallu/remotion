import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 2. LowerThirdOrigamiUnfold (REVISED: 100% Clean Off-Screen Exit)
 *
 * MEKANISME REVEAL UTAMA:
 * Berawal DARI LUAR FRAME BAWAH LAYAR 4K (+2200px), plat 3D naik sambil merekah berdiri 90 derajat di sumbu-X (`rotateX`) lalu melipat membentang ke samping di sumbu-Y (`rotateY`).
 * Saat exit, seluruh struktur melipat kembali, mengecil, dan meluncur jatuh jauh ke luar frame bawah 4K (+2200px) secara bersih tanpa sisa visual.
 *
 * GERAKAN SEKUNDER:
 * Bracket aksen pop-out di sudut kanan melompat keluar (frame 34) dan meluncur keluar frame kanan (+3500px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 260px, Top = 1580px, Width = 2000px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 280px, Top = 1690px, Width = 1750px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdOrigamiUnfoldProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdOrigamiUnfold: React.FC<LowerThirdOrigamiUnfoldProps> = ({
  primaryColor = '#111827',
  accentColor = '#F59E0B',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Phase 1 Spring: Vertical Translate + Flip Up X-axis
  const entranceSpring = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 150, mass: 0.8 } });
  // Phase 2 Spring: Unfold Y-axis (delayed frame 12)
  const unfoldYSpring = spring({ frame: localFrame - 12, fps, config: { damping: 11, stiffness: 140, mass: 0.8 } });
  // Secondary Motion Spring: Bracket Pop Out (delayed frame 34)
  const bracketSpring = spring({ frame: localFrame - 34, fps, config: { damping: 9, stiffness: 170, mass: 0.5 } });

  // Exit Spring (Crisp, fast drop)
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 15, stiffness: 200, mass: 0.6 } });

  // Offscreen Interpolations: +2200px guarantees complete offscreen clearance below 2160px canvas
  const translateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 2200])
    : interpolate(entranceSpring, [0, 1], [2200, 0]);

  const rotateX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 90])
    : interpolate(entranceSpring, [0, 1], [-90, 0]);

  const rotateY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, -90])
    : interpolate(unfoldYSpring, [0, 1], [90, 0]);

  const scale = isExiting
    ? interpolate(exitSpring, [0, 1], [1, 0])
    : 1;

  const opacity = isExiting
    ? interpolate(exitSpring, [0.6, 1], [1, 0], { extrapolateRight: 'clamp' })
    : 1;

  const bracketScale = interpolate(bracketSpring, [0, 1], [0, 1]);
  const bracketExitX = isExiting ? interpolate(exitSpring, [0, 1], [0, 3500]) : 0;

  const baseLeft = 210;
  const baseTop = 1550;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: baseLeft,
          top: baseTop,
          width: 2200,
          height: 240,
          perspective: 1400,
          transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
          opacity,
        }}
      >
        {/* Main Origami Base Board with X-axis flip */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 2200,
            height: 240,
            transformOrigin: 'center bottom',
            transform: `rotateX(${rotateX}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Main Slate Slab */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 1400,
              height: 150,
              backgroundColor: primaryColor,
              borderRadius: '8px 0 0 8px',
              boxShadow: '0 30px 60px rgba(0,0,0,0.7)',
              borderLeft: `6px solid ${accentColor}`,
            }}
          />

          {/* Secondary Unfolding Wing on Y-axis */}
          <div
            style={{
              position: 'absolute',
              left: 1395,
              top: 0,
              width: 785,
              height: 150,
              backgroundColor: '#1F2937',
              borderRadius: '0 8px 8px 0',
              transformOrigin: 'left center',
              transform: `rotateY(${rotateY}deg)`,
              boxShadow: '10px 20px 40px rgba(0,0,0,0.5)',
              borderTop: `3px solid ${accentColor}`,
            }}
          />

          {/* Subtitle Lower Tier Plate */}
          <div
            style={{
              position: 'absolute',
              left: 40,
              top: 145,
              width: 1700,
              height: 85,
              backgroundColor: '#374151',
              borderRadius: 6,
              transformOrigin: 'left center',
              transform: `rotateY(${rotateY}deg)`,
              boxShadow: '0 15px 35px rgba(0,0,0,0.4)',
            }}
          />

          {/* SECONDARY MOTION: Accent Pop-out Bracket */}
          <div
            style={{
              position: 'absolute',
              right: 10,
              top: -15,
              width: 120,
              height: 40,
              backgroundColor: accentColor,
              borderRadius: 4,
              transformOrigin: 'center center',
              transform: `translate3d(${bracketExitX}px, 0, 0) scale(${isExiting ? 0 : bracketScale})`,
              boxShadow: `0 0 25px ${accentColor}80`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 60,
                height: 4,
                backgroundColor: '#111827',
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 260px, Top = 1580px, Width = 2000px, Height = 100px
        - Subtitle Line:     Left = 280px, Top = 1690px, Width = 1750px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
