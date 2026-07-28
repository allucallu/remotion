import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 5. LowerThirdKineticSlatRotator (REVISED: 100% Off-Screen Entrance & Exit)
 *
 * MEKANISME REVEAL UTAMA:
 * Wadah utama bergeser masuk DARI LUAR FRAME BOTTOM-LEFT (-2800px, +800px).
 * Lima bilah kisi-kisi vertikal berputar 180 derajat di sumbu-Y secara cascading domino wave membentangkan permukaan wadah.
 * Saat exit, seluruh struktur meluncur keluar melintasi frame bottom-right (+3840px, +800px).
 *
 * GERAKAN SEKUNDER:
 * Takik aksen sudut membal (frame 38) dan meluncur keluar melintasi frame atas (-1500px) saat exit.
 *
 * TEXT-SAFE ZONE (AREA KOSONG TANPA TEKS / TRANSPARAN):
 *   - Nama Utama (Baris 1): Left = 250px, Top = 1560px, Width = 2100px, Height = 100px
 *   - Subtitle / Jabatan (Baris 2): Left = 270px, Top = 1675px, Width = 1800px, Height = 65px
 *
 * DURASI: 180 frames (6.0s @ 30fps)
 */

interface LowerThirdKineticSlatRotatorProps {
  primaryColor?: string;
  accentColor?: string;
  delayFrame?: number;
}

export const LowerThirdKineticSlatRotator: React.FC<LowerThirdKineticSlatRotatorProps> = ({
  primaryColor = '#18181B',
  accentColor = '#EC4899',
  delayFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = frame - delayFrame;
  const exitStartFrame = 145;
  const exitLocalFrame = frame - exitStartFrame;
  const isExiting = frame >= exitStartFrame;

  // Entrance Translate Spring
  const containerSpring = spring({ frame: localFrame, fps, config: { damping: 12, stiffness: 140, mass: 0.8 } });

  // 5 Cascading Springs for 5 vertical slats
  const slat1Spring = spring({ frame: localFrame - 4, fps, config: { damping: 11, stiffness: 150, mass: 0.7 } });
  const slat2Spring = spring({ frame: localFrame - 8, fps, config: { damping: 11, stiffness: 150, mass: 0.7 } });
  const slat3Spring = spring({ frame: localFrame - 12, fps, config: { damping: 11, stiffness: 150, mass: 0.7 } });
  const slat4Spring = spring({ frame: localFrame - 16, fps, config: { damping: 11, stiffness: 150, mass: 0.7 } });
  const slat5Spring = spring({ frame: localFrame - 20, fps, config: { damping: 11, stiffness: 150, mass: 0.7 } });

  // Secondary Motion Spring: Corner Notch Bracket Pop (Delayed frame 38)
  const notchSpring = spring({ frame: localFrame - 38, fps, config: { damping: 9, stiffness: 170, mass: 0.5 } });

  // Exit Spring
  const exitSpring = spring({ frame: exitLocalFrame, fps, config: { damping: 14, stiffness: 180, mass: 0.7 } });

  // Container Offscreen Translate (Start: -2800px, End: +3840px)
  const containerX = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 3840])
    : interpolate(containerSpring, [0, 1], [-2800, 0]);

  const containerY = isExiting
    ? interpolate(exitSpring, [0, 1], [0, 800])
    : interpolate(containerSpring, [0, 1], [800, 0]);

  // Interpolations for 5 slats Y-rotation
  const getRotateY = (sSpring: number) => {
    return interpolate(sSpring, [0, 1], [-180, 0]);
  };

  const notchScale = interpolate(notchSpring, [0, 1], [0, 1]);
  const notchExitY = isExiting ? interpolate(exitSpring, [0, 1], [0, -1500]) : 0;

  const baseLeft = 200;
  const baseTop = 1530;
  const slatWidth = 440;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: baseLeft,
          top: baseTop,
          width: 2300,
          height: 250,
          perspective: 1400,
          transform: `translate3d(${containerX}px, ${containerY}px, 0)`,
        }}
      >
        {/* Main Base Card */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 10,
            width: 2200,
            height: 230,
            backgroundColor: primaryColor,
            borderRadius: 12,
            boxShadow: '0 30px 70px rgba(0,0,0,0.85)',
            borderLeft: `6px solid ${accentColor}`,
          }}
        />

        {/* 5 Cascading 3D Blind Slats */}
        {[slat1Spring, slat2Spring, slat3Spring, slat4Spring, slat5Spring].map((sSpring, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: idx * slatWidth,
              top: 10,
              width: slatWidth,
              height: 230,
              backgroundColor: idx % 2 === 0 ? '#27272A' : '#3F3F46',
              borderRadius: idx === 0 ? '12px 0 0 12px' : idx === 4 ? '0 12px 12px 0' : 0,
              transformOrigin: 'left center',
              transform: `rotateY(${getRotateY(sSpring)}deg)`,
              transformStyle: 'preserve-3d',
              boxShadow: '10px 0 20px rgba(0,0,0,0.4)',
              borderTop: idx === 0 || idx === 2 || idx === 4 ? `3px solid ${accentColor}` : 'none',
            }}
          />
        ))}

        {/* SECONDARY MOTION: Corner Notch Bracket Pop at Top-Right */}
        <div
          style={{
            position: 'absolute',
            left: 2150,
            top: -10,
            width: 70,
            height: 70,
            backgroundColor: accentColor,
            borderRadius: 8,
            transformOrigin: 'center center',
            transform: `translate3d(0, ${notchExitY}px, 0) scale(${isExiting ? 1 : notchScale})`,
            boxShadow: `0 0 30px ${accentColor}90`,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              border: '4px solid #18181B',
              borderRadius: 4,
            }}
          />
        </div>
      </div>

      {/*
        =======================================================================
        TEXT-SAFE ZONE SPECIFICATION (PURPOSELY KOSONG / UNRENDERED):
        Buyer text overlay must be rendered at:
        - Primary Name Line: Left = 250px, Top = 1560px, Width = 2100px, Height = 100px
        - Subtitle Line:     Left = 270px, Top = 1675px, Width = 1800px, Height = 65px
        =======================================================================
      */}
    </AbsoluteFill>
  );
};
