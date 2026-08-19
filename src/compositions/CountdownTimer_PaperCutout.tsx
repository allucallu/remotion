import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Easing,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

// Load Inter Google Font
const { fontFamily: interFont } = loadFont('normal', {
  weights: ['700', '800', '900'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export type LowerThirdBg = 'black' | 'greenscreen' | 'bluescreen' | string;

export interface CountdownTimerPaperCutoutProps {
  accentColor?: string; // Coral #FF6F61
  layerDark1?: string; // Deep Coral Dark #E85A4F
  layerDark2?: string; // Crimson Shadow #C94A3F
  paperBg?: string; // Soft Warm Cream #FFF8ED
  backgroundColor?: LowerThirdBg;
}

/**
 * Composition: CountdownTimer_PaperCutout (Overhauled Tactile Paper-Craft & Organic Paper Physics)
 * Niche: Paper Art, Scrapbook Editorial, Hand-Cut Craft, Creative Promo, Warm Lifestyle.
 * Features:
 * - 4K UHD 3840x2160 @ 30fps.
 * - Total Duration: 5.5 seconds (165 frames @ 30fps):
 *   Number 5 (0 - 30f)
 *   Number 4 (30 - 60f)
 *   Number 3 (60 - 90f)
 *   Number 2 (90 - 120f)
 *   Number 1 (120 - 150f)
 *   Paper Layer Scatter Burst & Blackout Exit (150 - 165f)
 * - SUPPORTING ELEMENTS ADDED:
 *   1. 14 Hand-Cut Paper Confetti Scraps floating gently in ambient background space.
 *   2. 2 Metallic Brass Eyelet Grommet Pins at upper paper corners.
 *   3. Pencil Cutting Guide Marks & Multi-Ply Cardstock Bevel Thickness Edge.
 *   4. Enhanced Organic Paper Curl Wobble & Dynamic Skew Shadow Lift.
 * - Soft Warm Cream Paper Background (#FFF8ED) with subtle paper fiber texture.
 * - 3 Multi-Layer Stacked Paper Cutout Shadows (Coral #FF6F61 -> Dark Coral #E85A4F -> Crimson #C94A3F).
 * - Multi-layer Paper Scatter Burst exit to solid blackout.
 */
export const CountdownTimer_PaperCutout: React.FC<CountdownTimerPaperCutoutProps> = ({
  accentColor = '#FF6F61', // Coral
  layerDark1 = '#E85A4F', // Deep Coral Dark
  layerDark2 = '#C94A3F', // Crimson Shadow
  paperBg = '#FFF8ED', // Soft Warm Cream
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // ==========================================
  // TIMELINE CALCULATIONS (165 Frames Total @ 30fps)
  // Number Step = 30 frames (1.0s) per number
  // Hold & Wave Float: 0 -> 18f (~0.6s) | Paper Peel & Swap: 18f -> 30f (~0.4s)
  // ==========================================
  const framesPerNumber = 30;
  const currentStepIndex = Math.min(4, Math.floor(frame / framesPerNumber));
  const numberSequence = [5, 4, 3, 2, 1];

  const currentNumber = numberSequence[currentStepIndex];
  const nextNumber = numberSequence[Math.min(4, currentStepIndex + 1)];

  // Local frame within current number step (0 to 29)
  const localFrame = frame % framesPerNumber;
  const peelStartFrame = 18;
  const peelDuration = 12; // 18 to 30 frames

  // Paper Peel Progress (0 to 1)
  const rawPeelProgress = interpolate(
    localFrame,
    [peelStartFrame, peelStartFrame + peelDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    }
  );

  const isPeeling = rawPeelProgress > 0;

  // --- ENHANCED ORGANIC PAPER CURL & TENSION WOBBLE MATH ---
  // Top-left corner lifts up first with spring tension wobble
  const paperTensionWobble = Math.sin(rawPeelProgress * Math.PI * 3.5) * Math.exp(-rawPeelProgress * 3) * 12;

  const peelRotateX = interpolate(rawPeelProgress, [0, 0.6, 1], [0, 42, 68]) + paperTensionWobble;
  const peelRotateY = interpolate(rawPeelProgress, [0, 0.6, 1], [0, -36, -55]);
  const peelRotateZ = interpolate(rawPeelProgress, [0, 1], [0, 18]);

  // Gravity Drop after lifting off stack (localFrame 24 to 30)
  const gravityDropY = interpolate(rawPeelProgress, [0.5, 1], [0, 1600], {
    extrapolateLeft: 'clamp',
    easing: Easing.bezier(0.55, 0, 1, 0.45),
  });

  // Dynamic Skewed Cast Shadow Expansion when paper lifts up
  const shadowOffsetY = interpolate(rawPeelProgress, [0, 0.6, 1], [22, 105, 150]);
  const shadowSkewX = interpolate(rawPeelProgress, [0, 0.6, 1], [0, -14, -22]);
  const shadowBlur = interpolate(rawPeelProgress, [0, 0.6, 1], [18, 60, 85]);
  const shadowOpacity = interpolate(rawPeelProgress, [0, 0.6, 1], [0.28, 0.48, 0]);

  // New Number Push-Up Spring with Elastic Cushioning
  const newNumberSpring = spring({
    frame: Math.max(0, localFrame - peelStartFrame),
    fps,
    config: { damping: 11, mass: 0.35, stiffness: 190 },
  });
  const newNumberOffsetY = isPeeling
    ? interpolate(newNumberSpring, [0, 1], [340, 0])
    : 0;
  const newNumberScale = isPeeling
    ? interpolate(newNumberSpring, [0, 0.7, 1], [0.88, 1.03, 1])
    : 1;

  // Gentle Floating Paper Wave on Hold
  const floatWaveY = Math.sin(frame * 0.08) * 8;
  const floatWaveRot = Math.cos(frame * 0.06) * 1.5;

  // SUPPORTING ELEMENT: 14 Ambient Floating Paper Confetti Motes
  const confettiList = Array.from({ length: 14 }).map((_, i) => {
    const seed = i * 137.5;
    const initialX = (Math.sin(seed) * 0.4 + 0.5) * width;
    const initialY = (Math.cos(seed * 1.3) * 0.4 + 0.5) * height;

    const floatY = Math.sin(frame * 0.04 + i) * 28;
    const floatX = Math.cos(frame * 0.03 + i * 0.7) * 22;
    const rot = frame * (0.5 + (i % 3) * 0.4) + seed;
    const size = 16 + (i % 4) * 8;

    const colors = [accentColor, layerDark1, '#FCD34D', '#34D399', '#60A5FA'];
    const color = colors[i % colors.length];

    return {
      x: initialX + floatX,
      y: initialY + floatY,
      rot,
      size,
      color,
      key: i,
    };
  });

  // --- EXIT PHASE: MULTI-LAYER PAPER SCATTER BURST (Frame 150 - 165) ---
  const isEndPhase = frame >= 150;
  const scatterProgress = isEndPhase
    ? interpolate(frame, [150, 162], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.25, 0.8, 0.25, 1),
      })
    : 0;

  // Scatter Trajectories for 3 Paper Layers
  const heroScatterX = isEndPhase ? interpolate(scatterProgress, [0, 1], [0, 1800]) : 0;
  const heroScatterY = isEndPhase ? interpolate(scatterProgress, [0, 1], [0, -1200]) : 0;
  const heroScatterRot = isEndPhase ? interpolate(scatterProgress, [0, 1], [0, 48]) : 0;

  const layer1ScatterX = isEndPhase ? interpolate(scatterProgress, [0, 1], [0, -1800]) : 0;
  const layer1ScatterY = isEndPhase ? interpolate(scatterProgress, [0, 1], [0, -900]) : 0;
  const layer1ScatterRot = isEndPhase ? interpolate(scatterProgress, [0, 1], [0, -42]) : 0;

  const layer2ScatterX = isEndPhase ? interpolate(scatterProgress, [0, 1], [0, 1200]) : 0;
  const layer2ScatterY = isEndPhase ? interpolate(scatterProgress, [0, 1], [0, 1800]) : 0;
  const layer2ScatterRot = isEndPhase ? interpolate(scatterProgress, [0, 1], [0, 65]) : 0;

  const exitOpacity = isEndPhase ? interpolate(scatterProgress, [0.75, 1], [1, 0]) : 1;
  const isTotalBlackout = frame >= 162;

  // Render a Single Paper Number Silhouette Layer
  const renderPaperNumberLayer = (
    num: number,
    color: string,
    offsetX: number,
    offsetY: number,
    extraTransform: string = ''
  ) => {
    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) ${extraTransform}`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: color,
          fontFamily: interFont,
          fontSize: '760px',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-12px',
          WebkitTextStroke: '7px rgba(0,0,0,0.06)', // Multi-ply cardstock cut edge feel
          pointerEvents: 'none',
        }}
      >
        {num}
      </div>
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isTotalBlackout ? '#000000' : paperBg,
        fontFamily: interFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
        opacity: isTotalBlackout ? 0 : exitOpacity,
      }}
    >
      {/* 1. PAPER FIBER GRAIN TEXTURE OVERLAY */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(rgba(180, 140, 100, 0.14) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          opacity: 0.75,
          pointerEvents: 'none',
        }}
      />

      {/* 2. SUPPORTING ELEMENT A: 14 AMBIENT FLOATING CONFETTI SCRAPS */}
      {!isEndPhase && confettiList.map((cf) => (
        <div
          key={cf.key}
          style={{
            position: 'absolute',
            top: cf.y,
            left: cf.x,
            width: `${cf.size}px`,
            height: `${cf.size * 0.85}px`,
            backgroundColor: cf.color,
            borderRadius: cf.key % 2 === 0 ? '4px' : '50%',
            transform: `rotate(${cf.rot}deg)`,
            boxShadow: '0 4px 10px rgba(0,0,0,0.12)',
            opacity: 0.7,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* 3. MAIN CENTERED PAPER CUTOUT STACK CONTAINER */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          perspective: '1600px',
        }}
      >
        {/* --- A. NEW NUMBER STACK (Waiting Underneath / Sliding Up) --- */}
        {isPeeling && !isEndPhase && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transform: `translateY(${newNumberOffsetY}px) scale(${newNumberScale})`,
              transformOrigin: 'center center',
            }}
          >
            {/* Soft Cast Shadow */}
            {renderPaperNumberLayer(
              nextNumber,
              'transparent',
              36,
              44,
              `filter: blur(20px); text-shadow: 0 0 25px rgba(40,20,10,0.28);`
            )}
            {/* Layer 2 Shadow (Crimson) */}
            {renderPaperNumberLayer(nextNumber, layerDark2, 36, 44)}
            {/* Layer 1 Shadow (Deep Coral) */}
            {renderPaperNumberLayer(nextNumber, layerDark1, 18, 22)}
            {/* Hero Main Paper (Coral) */}
            {renderPaperNumberLayer(nextNumber, accentColor, 0, 0)}
          </div>
        )}

        {/* --- B. CURRENT NUMBER STACK (Peeling Off / Scattering) --- */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transform: isPeeling
              ? `translateY(${gravityDropY}px)`
              : `translateY(${floatWaveY}px) rotate(${floatWaveRot}deg)`,
            transformOrigin: 'bottom right',
          }}
        >
          {/* LAYER 3: DYNAMIC SKAKE/SKEWED SOFT CAST SHADOW */}
          {!isEndPhase && renderPaperNumberLayer(
            currentNumber,
            'transparent',
            isPeeling ? 36 + shadowOffsetY * 0.35 : 36,
            isPeeling ? 44 + shadowOffsetY : 44,
            `filter: blur(${shadowBlur}px); transform: skewX(${shadowSkewX}deg); text-shadow: 0 0 35px rgba(40,20,10,${shadowOpacity});`
          )}

          {/* LAYER 2 SHADOW PAPER UNDERLAY (Crimson Shadow) */}
          <div style={{ transform: isEndPhase ? `translate(${layer2ScatterX}px, ${layer2ScatterY}px) rotate(${layer2ScatterRot}deg)` : 'none' }}>
            {renderPaperNumberLayer(currentNumber, layerDark2, 36, 44)}
          </div>

          {/* LAYER 1 SHADOW PAPER UNDERLAY (Deep Coral) */}
          <div style={{ transform: isEndPhase ? `translate(${layer1ScatterX}px, ${layer1ScatterY}px) rotate(${layer1ScatterRot}deg)` : 'none' }}>
            {renderPaperNumberLayer(currentNumber, layerDark1, 18, 22)}
          </div>

          {/* HERO MAIN PAPER CUTOUT (Coral with 3D Asymmetric Corner Peel & Tension Wobble) */}
          <div
            style={{
              transform: isEndPhase
                ? `translate(${heroScatterX}px, ${heroScatterY}px) rotate(${heroScatterRot}deg)`
                : isPeeling
                ? `rotateX(${peelRotateX}deg) rotateY(${peelRotateY}deg) rotateZ(${peelRotateZ}deg)`
                : 'none',
              transformOrigin: 'bottom right',
            }}
          >
            {renderPaperNumberLayer(currentNumber, accentColor, 0, 0)}

            {/* SUPPORTING ELEMENT B: 2 METALLIC BRASS EYELET GROMMET PINS (Upper Corners) */}
            {!isEndPhase && !isPeeling && (
              <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                {/* Left Brass Eyelet Grommet */}
                <circle cx="1450" cy="740" r="14" fill="#D4AF37" stroke="#8B6E1B" strokeWidth="2.5" />
                <circle cx="1450" cy="740" r="6" fill="#FFF8ED" />

                {/* Right Brass Eyelet Grommet */}
                <circle cx="2390" cy="740" r="14" fill="#D4AF37" stroke="#8B6E1B" strokeWidth="2.5" />
                <circle cx="2390" cy="740" r="6" fill="#FFF8ED" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
