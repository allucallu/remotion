import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {premiumEase, cardShadow} from './premium';

export type OverlayStyle =
  | 'variant-news' | 'variant-corporate' | 'variant-cyberpunk' | 'variant-fluid'
  | 'variant-ticker' | 'variant-sports' | 'variant-weather' | 'variant-election'
  | 'variant-emergency' | 'variant-split';

export const OVERLAY_STYLES: OverlayStyle[] = [
  'variant-news', 'variant-corporate', 'variant-cyberpunk', 'variant-fluid',
  'variant-ticker', 'variant-sports', 'variant-weather', 'variant-election',
  'variant-emergency', 'variant-split',
];

type Props = {style: OverlayStyle};

export const TextlessBroadcastOverlay: React.FC<Props> = ({style}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const cx = width / 2;

  // Common transition controls (Slow transitions: 1 second = 30 frames)
  const introSpring = (delay: number) => {
    return spring({
      frame: Math.max(0, frame - delay),
      fps,
      config: {damping: 15, stiffness: 80},
    });
  };

  const outroProgress = interpolate(frame, [150, 180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const easedOutro = premiumEase(outroProgress);

  switch (style) {
    case 'variant-news': {
      // Staggered springs for entrance
      const bgSpring = introSpring(0);       // Dark blue backing
      const accentSpring = introSpring(8);   // Crimson red ribbon
      const whiteSpring = introSpring(15);   // White card highlight
      const bugSpring = introSpring(22);     // Logo bug container
      
      const outroScale = 1 - easedOutro;

      // Lower Third panel dimensions scaled for 4K
      const mainW = 2800 * bgSpring * outroScale;
      const accentW = 2700 * accentSpring * outroScale;
      const whiteW = 2400 * whiteSpring * outroScale;

      return (
        <AbsoluteFill style={{background: '#000000', overflow: 'hidden'}}>
          {/* Main Lower Third Group */}
          <div style={{position: 'absolute', bottom: 180, left: 160, display: 'flex', flexDirection: 'column', gap: 16}}>
            {/* White top tier */}
            <div style={{
              width: whiteW, height: 75, background: '#ffffff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              transform: 'skewX(-15deg)', transformOrigin: 'left center',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 6,
                background: '#e11d48'
              }} />
            </div>

            {/* Crimson red middle tier */}
            <div style={{
              width: accentW, height: 110, background: '#e11d48',
              boxShadow: '0 15px 40px rgba(0,0,0,0.2)',
              transform: 'skewX(-15deg)', transformOrigin: 'left center',
              display: 'flex', alignItems: 'center'
            }}>
              <div style={{
                width: 250, height: '100%', background: '#ffffff',
                opacity: 0.15, transform: 'skewX(15deg)'
              }} />
            </div>

            {/* Navy blue bottom tier */}
            <div style={{
              width: mainW, height: 90, background: '#0f172a',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              transform: 'skewX(-15deg)', transformOrigin: 'left center'
            }} />
          </div>

          {/* Logo Bug Area (Top Left) */}
          <div style={{
            position: 'absolute', top: 120, left: 160,
            width: 220 * bugSpring * outroScale, height: 130 * bugSpring * outroScale,
            background: 'linear-gradient(135deg, #e11d48 0%, #9f1239 100%)',
            boxShadow: '0 15px 35px rgba(225,29,72,0.3)',
            transform: 'skewX(-10deg)', transformOrigin: 'left top'
          }} />
        </AbsoluteFill>
      );
    }

    case 'variant-corporate': {
      const cardSpring = introSpring(0);
      const accentSpring = introSpring(10);
      const shadowOffset = 25 * cardSpring;
      
      const outroScale = 1 - easedOutro;

      return (
        <AbsoluteFill style={{background: '#000000', overflow: 'hidden'}}>
          {/* Rounded Corporate lower-third box with drop shadow */}
          <div style={{
            position: 'absolute', bottom: 180, left: 160,
            width: 2600 * cardSpring * outroScale, height: 260,
            borderRadius: 32, background: 'rgba(18, 18, 22, 0.95)',
            boxShadow: `0 ${shadowOffset}px 80px rgba(0,0,0,0.65), inset 0 2px 0 rgba(255,255,255,0.06)`,
            border: '2px solid rgba(255,255,255,0.04)',
            overflow: 'hidden', transformOrigin: 'left center'
          }}>
            {/* Elegant metallic gold bottom accent strip */}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: 20 * accentSpring,
              background: 'linear-gradient(90deg, #D4AF37 0%, #FFDF00 50%, #AA771C 100%)'
            }} />

            {/* Specular highlight overlay on the card */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
              background: 'linear-gradient(rgba(255,255,255,0.04), transparent)'
            }} />
          </div>

          {/* Gold Accent Bracket Bug */}
          <div style={{
            position: 'absolute', bottom: 180, left: 120,
            width: 20, height: 260 * cardSpring * outroScale,
            borderRadius: '10px 0 0 10px',
            background: 'linear-gradient(#D4AF37, #AA771C)',
            opacity: accentSpring
          }} />
        </AbsoluteFill>
      );
    }

    case 'variant-cyberpunk': {
      const panelSpring = introSpring(0);
      const lineSpring = introSpring(12);
      const overlayScale = 1 - easedOutro;

      return (
        <AbsoluteFill style={{background: '#000000', overflow: 'hidden'}}>
          {/* Cyberpunk Glassmorphic Lower Panel */}
          <div style={{
            position: 'absolute', bottom: 160, left: 160,
            width: 2800 * panelSpring * overlayScale, height: 220,
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(24px)',
            border: '2.5px solid #00e5ff',
            boxShadow: '0 0 40px rgba(0,229,255,0.15), inset 0 0 20px rgba(0,229,255,0.05)',
            transformOrigin: 'left center'
          }}>
            {/* Neon Magenta crosshair decor on left */}
            <div style={{
              position: 'absolute', left: 40, top: '50%', transform: 'translateY(-50%)',
              width: 14, height: 80 * lineSpring, background: '#ff007f',
              boxShadow: '0 0 15px #ff007f'
            }} />

            {/* Tech grid dots decoy on the right */}
            <div style={{
              position: 'absolute', right: 40, top: 40, bottom: 40,
              width: 80 * lineSpring, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
              opacity: 0.35 * lineSpring
            }}>
              {Array.from({length: 16}).map((_, idx) => (
                <div key={idx} style={{width: 6, height: 6, background: '#00e5ff', borderRadius: '50%'}} />
              ))}
            </div>
          </div>

          {/* Cyber bug at top right */}
          <div style={{
            position: 'absolute', top: 120, right: 160,
            width: 320 * panelSpring * overlayScale, height: 100 * panelSpring * overlayScale,
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: 'blur(20px)',
            border: '2px solid #ff007f',
            boxShadow: '0 0 25px rgba(255,0,127,0.2)',
            transformOrigin: 'right top'
          }} />
        </AbsoluteFill>
      );
    }

    case 'variant-fluid': {
      // Scale-up transitions in X/Y axes
      const scaleX = introSpring(0);
      const scaleY = introSpring(10);
      
      const outroScale = 1 - easedOutro;

      return (
        <AbsoluteFill style={{background: '#000000', overflow: 'hidden'}}>
          {/* Asymmetric pastel layered plates in Y & X axis */}
          <div style={{
            position: 'absolute', bottom: 180, left: 160,
            width: 2500 * scaleX * outroScale, height: 200 * scaleY,
            borderRadius: '40px 100px 40px 100px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            boxShadow: '0 25px 60px rgba(79,70,229,0.3)',
            transformOrigin: 'left bottom'
          }}>
            {/* Secondary layered plate nested */}
            <div style={{
              position: 'absolute', top: 20, bottom: 20, left: 20,
              width: 2400 * scaleX * 0.9 * outroScale,
              borderRadius: '25px 80px 25px 80px',
              background: '#ffffff', opacity: 0.12
            }} />
          </div>

          {/* Fluid Logo Bug */}
          <div style={{
            position: 'absolute', top: 120, left: 160,
            width: 160 * scaleX * outroScale, height: 160 * scaleY * outroScale,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
            boxShadow: '0 15px 35px rgba(236,72,153,0.35)',
            transformOrigin: 'center center'
          }} />
        </AbsoluteFill>
      );
    }

    case 'variant-ticker': {
      const tickerSpring = introSpring(0);
      const boxSpring = introSpring(15);
      
      const outroScale = 1 - easedOutro;

      return (
        <AbsoluteFill style={{background: '#000000', overflow: 'hidden'}}>
          {/* Screen-wide lower ticker strip */}
          <div style={{
            position: 'absolute', bottom: 140, left: 0, right: 0,
            height: 90 * tickerSpring, background: '#090d16',
            borderTop: '2.5px solid #3b82f6', borderBottom: '2.5px solid #3b82f6',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            transformOrigin: 'center bottom', display: 'flex', alignItems: 'center'
          }}>
            {/* Left anchor lock box */}
            <div style={{
              width: 320 * boxSpring * outroScale, height: '100%',
              background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
              transformOrigin: 'left center'
            }} />
          </div>

          {/* Box Panel at Top Right */}
          <div style={{
            position: 'absolute', top: 120, right: 160,
            width: 460 * boxSpring * outroScale, height: 180 * boxSpring * outroScale,
            borderRadius: 16, background: '#090d16',
            border: '2.5px solid #3b82f6',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
            transformOrigin: 'right top'
          }} />
        </AbsoluteFill>
      );
    }

    case 'variant-sports': {
      const mainSpring = introSpring(0);
      const scoreSpring = introSpring(12);
      
      const outroScale = 1 - easedOutro;

      return (
        <AbsoluteFill style={{background: '#000000', overflow: 'hidden'}}>
          {/* Sports scoreboard widget (Top Left) */}
          <div style={{
            position: 'absolute', top: 120, left: 160,
            width: 780 * mainSpring * outroScale, height: 110,
            display: 'flex', flexDirection: 'row',
            boxShadow: '0 20px 45px rgba(0,0,0,0.3)',
            transformOrigin: 'left top', overflow: 'hidden', borderRadius: 12
          }}>
            {/* Team Block A (Yellow) */}
            <div style={{
              width: 140 * mainSpring, height: '100%',
              background: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }} />

            {/* Score Block A (Dark Slate) */}
            <div style={{
              width: 100 * scoreSpring, height: '100%',
              background: '#1e293b', borderRight: '2px solid rgba(255,255,255,0.08)'
            }} />

            {/* Score Block B (Dark Slate) */}
            <div style={{
              width: 100 * scoreSpring, height: '100%',
              background: '#1e293b'
            }} />

            {/* Team Block B (White) */}
            <div style={{
              width: 140 * mainSpring, height: '100%',
              background: '#ffffff'
            }} />

            {/* Status Info Block (Gray) */}
            <div style={{
              flex: 1, height: '100%', background: '#0f172a'
            }} />
          </div>

          {/* Lower third banner for sports news */}
          <div style={{
            position: 'absolute', bottom: 180, left: 160,
            width: 2500 * mainSpring * outroScale, height: 120,
            background: '#0f172a', borderLeft: '12px solid #fbbf24',
            boxShadow: '0 20px 45px rgba(0,0,0,0.25)',
            transformOrigin: 'left center'
          }} />
        </AbsoluteFill>
      );
    }

    case 'variant-weather': {
      const panelSpring = introSpring(0);
      const blocksSpring = introSpring(15);
      
      const outroScale = 1 - easedOutro;

      return (
        <AbsoluteFill style={{background: '#000000', overflow: 'hidden'}}>
          {/* Weather Side Panel layout (Right side) */}
          <div style={{
            position: 'absolute', top: 120, right: 160, bottom: 120,
            width: 620 * panelSpring * outroScale,
            borderRadius: 32, background: 'rgba(15, 23, 42, 0.93)',
            boxShadow: cardShadow, border: '2.5px solid rgba(255,255,255,0.08)',
            padding: 40, display: 'flex', flexDirection: 'column', gap: 24,
            transformOrigin: 'right center'
          }}>
            {/* Top header block */}
            <div style={{
              width: '100%', height: 120 * panelSpring,
              borderRadius: 16, background: 'rgba(255,255,255,0.04)',
              borderBottom: '4px solid #38bdf8'
            }} />

            {/* 4 Staggered forecast slots (Empty blocks) */}
            {Array.from({length: 4}).map((_, idx) => {
              const delay = 15 + idx * 8;
              const slotSpring = introSpring(delay);
              
              return (
                <div key={idx} style={{
                  width: '100%', height: 130 * slotSpring * blocksSpring,
                  borderRadius: 16, background: 'rgba(255,255,255,0.03)',
                  border: '1.5px solid rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', padding: '0 24px'
                }}>
                  {/* Circle placeholder for weather icon */}
                  <div style={{
                    width: 70 * slotSpring, height: 70 * slotSpring,
                    borderRadius: '50%', background: 'rgba(255,255,255,0.06)'
                  }} />
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      );
    }

    case 'variant-election': {
      const baseSpring = introSpring(0);
      const splitSpring = introSpring(15);
      
      const outroScale = 1 - easedOutro;

      // Comparative bar width calculations
      const barW = 2800 * baseSpring * outroScale;

      return (
        <AbsoluteFill style={{background: '#000000', overflow: 'hidden'}}>
          {/* Election comparison lower bar */}
          <div style={{
            position: 'absolute', bottom: 180, left: cx - barW / 2,
            width: barW, height: 160,
            borderRadius: 20, background: '#111827',
            boxShadow: '0 30px 65px rgba(0,0,0,0.45)',
            border: '2.5px solid rgba(255,255,255,0.06)',
            display: 'flex', overflow: 'hidden'
          }}>
            {/* Candidate A (Blue side) */}
            <div style={{
              width: `${54 * splitSpring}%`, height: '100%',
              background: 'linear-gradient(90deg, #1d4ed8 0%, #3b82f6 100%)',
              borderRight: '4px solid #ffffff', transition: 'width 0.2s'
            }} />

            {/* Candidate B (Red side) */}
            <div style={{
              flex: 1, height: '100%',
              background: 'linear-gradient(90deg, #ef4444 0%, #b91c1c 100%)',
              transition: 'width 0.2s'
            }} />
          </div>

          {/* Left/Right Floating bug highlights */}
          <div style={{
            position: 'absolute', bottom: 380, left: 240,
            width: 220 * baseSpring * outroScale, height: 80 * baseSpring * outroScale,
            borderRadius: 8, background: '#3b82f6',
            boxShadow: '0 10px 20px rgba(59,130,246,0.3)',
            transformOrigin: 'left center'
          }} />

          <div style={{
            position: 'absolute', bottom: 380, right: 240,
            width: 220 * baseSpring * outroScale, height: 80 * baseSpring * outroScale,
            borderRadius: 8, background: '#ef4444',
            boxShadow: '0 10px 20px rgba(239,68,68,0.3)',
            transformOrigin: 'right center'
          }} />
        </AbsoluteFill>
      );
    }

    case 'variant-emergency': {
      const borderSpring = introSpring(0);
      const bannerSpring = introSpring(15);
      
      const outroScale = 1 - easedOutro;

      return (
        <AbsoluteFill style={{background: '#000000', overflow: 'hidden'}}>
          {/* Animated emergency framing borders (caution stripes) */}
          <svg width={width} height={height} style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}>
            <defs>
              <pattern id="stripes" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="20" height="40" fill="#facc15" />
                <rect x="20" width="20" height="40" fill="#171717" />
              </pattern>
            </defs>
            {/* Top border */}
            <rect x="0" y="0" width={width} height={24 * borderSpring} fill="url(#stripes)" opacity={0.9} />
            {/* Bottom border */}
            <rect x="0" y={height - 24 * borderSpring} width={width} height={24 * borderSpring} fill="url(#stripes)" opacity={0.9} />
          </svg>

          {/* Large emergency banner lower center */}
          <div style={{
            position: 'absolute', bottom: 180, left: cx - (2400 * bannerSpring * outroScale) / 2,
            width: 2400 * bannerSpring * outroScale, height: 220,
            borderRadius: 24, background: '#7f1d1d',
            border: '4px solid #ef4444',
            boxShadow: '0 30px 80px rgba(239,68,68,0.25)',
            transformOrigin: 'center center', overflow: 'hidden'
          }}>
            {/* Glowing heartbeat path decoy */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 12,
              background: '#ef4444', boxShadow: '0 0 15px #ef4444'
            }} />
          </div>
        </AbsoluteFill>
      );
    }

    case 'variant-split': {
      const dividerSpring = introSpring(0);
      const borderSpring = introSpring(12);
      
      const outroScale = 1 - easedOutro;

      return (
        <AbsoluteFill style={{background: '#000000', overflow: 'hidden'}}>
          {/* Slanted pembagi asimetris layar */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: width * 0.4 - 10,
            width: 20 * dividerSpring * outroScale,
            background: 'linear-gradient(#00e5ff, #8b5cf6)',
            boxShadow: '0 0 30px rgba(0,229,255,0.4)',
            transform: 'skewX(-10deg)', transformOrigin: 'center center'
          }} />

          {/* Left panel border highlights */}
          <div style={{
            position: 'absolute', top: 80, left: 80, bottom: 80,
            width: 80 * borderSpring * outroScale,
            borderLeft: '4px solid #00e5ff', borderTop: '4px solid #00e5ff',
            opacity: 0.7, transformOrigin: 'left top'
          }} />

          {/* Right panel border highlights */}
          <div style={{
            position: 'absolute', top: 80, right: 80, bottom: 80,
            width: 80 * borderSpring * outroScale,
            borderRight: '4px solid #8b5cf6', borderBottom: '4px solid #8b5cf6',
            opacity: 0.7, transformOrigin: 'right bottom'
          }} />
        </AbsoluteFill>
      );
    }
  }
};
