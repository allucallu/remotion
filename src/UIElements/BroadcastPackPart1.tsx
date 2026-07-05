import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing, interpolate, spring } from "remotion";
import { W4K, H4K, CX, CY, FPS } from "./utils";

// ─── DESIGN TOKENS (Brand Agnostic) ───────────────────────────────────────────
const C = {
  bg:      "#000000",      // Solid black for Screen/Add blend mode
  navy:    "#0A192F",      // Generic corporate navy
  red:     "#D31027",      // Generic alert red (shifted from pure red)
  redDark: "#8B0A1A",      // Darker red for depth
  white:   "#FFFFFF",
  gold:    "#F2C94C",      // Premium gold
  cyan:    "#00E5FF",      // Tech cyan
  grey:    "#222222",      // Neutral dark grey
  font:    "'Share Tech Mono', 'Roboto', sans-serif",
};

// SVG Filters for glowing and styling
const Defs: React.FC = () => (
  <defs>
    <filter id="glowRed" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="15" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glowCyan" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="motionBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="40 0" />
    </filter>
    <linearGradient id="navyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor={C.navy} />
      <stop offset="100%" stopColor="#112240" />
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor={C.red} />
      <stop offset="100%" stopColor={C.redDark} />
    </linearGradient>
  </defs>
);

// Helper for linear interpolation (shorthand)
const ci = (f: number, range: [number, number], out: [number, number], easing = Easing.linear) => 
  interpolate(f, range, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ═══════════════════════════════════════════════════════════════════════════════
// 01: BREAKING NEWS BANNER
// Banner horizontal merah, teks glitch shake ringan, masuk cepat, exit slide
// ═══════════════════════════════════════════════════════════════════════════════
export const BreakingNewsBanner: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Animation timings
  const IN_DUR = 12;
  const EXIT_START = 160;
  
  // Slide in from bottom-left (skewed)
  const slideIn = spring({ frame, fps: FPS, config: { damping: 14, stiffness: 120 } });
  const slideOut = ci(frame, [EXIT_START, EXIT_START + 15], [0, 1], Easing.in(Easing.exp));
  
  const mainX = interpolate(slideIn, [0, 1], [-W4K, 0]) - (slideOut * W4K);
  
  // Strobing accent line
  const strobe = frame % 6 < 3 ? 1 : 0.4;
  
  // Glitch shake for text
  const isGlitching = frame > 40 && frame < 45 || frame > 110 && frame < 113;
  const shakeX = isGlitching ? (Math.random() - 0.5) * 15 : 0;
  const shakeY = isGlitching ? (Math.random() - 0.5) * 10 : 0;
  
  // Y position of the banner
  const BY = CY + 500;
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <svg width={W4K} height={H4K}>
        <Defs />
        <g transform={`translate(${mainX}, 0)`}>
          {/* Main Red Banner */}
          <polygon points={`0,${BY} ${W4K - 200},${BY} ${W4K - 100},${BY + 200} 0,${BY + 200}`} 
                   fill="url(#redGrad)" />
                   
          {/* Top accent strobing line */}
          <polygon points={`0,${BY - 15} ${W4K - 220},${BY - 15} ${W4K - 210},${BY} 0,${BY}`} 
                   fill={C.white} opacity={strobe} />
                   
          {/* Dark under-bar */}
          <polygon points={`0,${BY + 200} ${W4K - 100},${BY + 200} ${W4K - 120},${BY + 240} 0,${BY + 240}`} 
                   fill={C.grey} />
                   
          {/* Text with subtle shadow and shake */}
          <text x={300 + shakeX} y={BY + 135 + shakeY} 
                fill={C.white} fontSize={110} fontFamily={C.font} fontWeight="bold"
                letterSpacing={6} filter="drop-shadow(4px 4px 0px rgba(0,0,0,0.5))">
            BREAKING NEWS
          </text>
          
          {/* Animated decorative lines */}
          <line x1={300} y1={BY + 160} x2={1200} y2={BY + 160} 
                stroke={C.white} strokeWidth={4} opacity={0.5} />
          
          {/* Glitch overlay blocks */}
          {isGlitching && (
            <rect x={300 + Math.random()*800} y={BY + 20} 
                  width={Math.random()*300 + 100} height={40} 
                  fill={C.white} opacity={0.8} />
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 02: LOWER THIRD — NAMA & JABATAN
// Wipe-in dari kiri dengan motion blur. Corporate Navy + White
// ═══════════════════════════════════════════════════════════════════════════════
export const LowerThirdCorporate: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Wipe animation using scaleX to simulate a fast reveal
  const reveal = ci(frame, [10, 25], [0, 1], Easing.out(Easing.exp));
  const exit = ci(frame, [160, 175], [0, 1], Easing.in(Easing.exp));
  const activeReveal = reveal - exit; // Goes 0 -> 1 -> 0
  
  // Staggered text reveal
  const textOpacity = ci(frame, [20, 30], [0, 1]) - ci(frame, [155, 160], [0, 1]);
  const textX = ci(frame, [20, 35], [-50, 0], Easing.out(Easing.back(1.5)));
  
  // Blur effect only during fast motion
  const isMoving = (frame > 10 && frame < 25) || (frame > 160 && frame < 175);
  const blurFilter = isMoving ? "url(#motionBlur)" : undefined;
  
  const BOX_X = 250;
  const BOX_Y = 1600;
  const BOX_W = 1400;
  const BOX_H = 180;
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={W4K} height={H4K}>
        <Defs />
        {/* Main Navy Box (Wipe from left) */}
        <g transform={`translate(${BOX_X}, ${BOX_Y})`}>
          {/* Background */}
          <rect x={0} y={0} width={BOX_W * activeReveal} height={BOX_H} 
                fill="url(#navyGrad)" filter={blurFilter} />
                
          {/* Cyan accent line on top */}
          <rect x={0} y={-8} width={(BOX_W + 50) * activeReveal} height={8} 
                fill={C.cyan} filter={blurFilter} />
                
          {/* Name Text */}
          <text x={60 + textX} y={90} fill={C.white} fontSize={75} 
                fontFamily={C.font} fontWeight="bold" opacity={textOpacity}>
            ALEXANDER WRIGHT
          </text>
          
          {/* Title Text */}
          <text x={60 + textX} y={150} fill={C.gold} fontSize={45} 
                fontFamily={C.font} opacity={textOpacity} letterSpacing={2}>
            CHIEF FINANCIAL OFFICER
          </text>
          
          {/* Right decorative logo/accent area */}
          <g opacity={textOpacity} transform={`translate(${BOX_W - 140}, 40)`}>
            <rect x={0} y={0} width={100} height={100} fill="none" stroke={C.white} strokeWidth={2} opacity={0.3} />
            <circle cx={50} cy={50} r={20} fill={C.cyan} />
            <line x1={-30} y1={50} x2={10} y2={50} stroke={C.cyan} strokeWidth={2} />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 03: NEWS TICKER / CRAWL BAR
// Bar bawah dengan teks berjalan infinite loop.
// ═══════════════════════════════════════════════════════════════════════════════
export const NewsTicker: React.FC = () => {
  const frame = useCurrentFrame();
  
  const BAR_Y = H4K - 120;
  const BAR_H = 120;
  
  // Ticker content
  const msg = "MARKET UPDATE: TECH STOCKS RALLY AMID NEW AI DEVELOPMENTS /// GLOBAL SUPPLY CHAIN SHOWS SIGNS OF RECOVERY /// CENTRAL BANK ANNOUNCES INTEREST RATE HOLD /// ";
  // Duplicate message to ensure seamless looping without gaps
  const fullText = msg.repeat(4);
  
  // Calculate scroll speed (pixels per frame)
  // For a seamless loop in a stock template, we just ensure it moves continuously.
  const speed = 12; 
  const textX = W4K - (frame * speed);
  
  // Entry animation for the bar itself
  const barReveal = ci(frame, [0, 15], [H4K, BAR_Y], Easing.out(Easing.cubic));
  const barExit = ci(frame, [165, 180], [0, 120], Easing.in(Easing.cubic));
  const currentY = barReveal + barExit;
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={W4K} height={H4K}>
        <Defs />
        <g transform={`translate(0, ${currentY})`}>
          {/* Main black/grey bar */}
          <rect x={0} y={0} width={W4K} height={BAR_H} fill={C.grey} />
          
          {/* Top border red */}
          <rect x={0} y={0} width={W4K} height={6} fill={C.red} />
          
          {/* Scrolling Text (Clipped to not overlap the left "TICKER" badge) */}
          <clipPath id="tickerClip">
            <rect x={350} y={0} width={W4K - 350} height={BAR_H} />
          </clipPath>
          
          <text x={textX} y={80} fill={C.white} fontSize={55} fontFamily={C.font} 
                letterSpacing={3} clipPath="url(#tickerClip)">
            {fullText}
          </text>
          
          {/* Left static badge */}
          <polygon points={`0,0 350,0 310,${BAR_H} 0,${BAR_H}`} fill={C.redDark} />
          <polygon points={`0,0 330,0 290,${BAR_H} 0,${BAR_H}`} fill={C.red} />
          <text x={60} y={80} fill={C.white} fontSize={55} fontFamily={C.font} fontWeight="bold">
            UPDATE
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 04: LIVE BROADCAST BADGE
// Elemen "LIVE" berdenyut, minimalis, reusable.
// ═══════════════════════════════════════════════════════════════════════════════
export const LiveBroadcastBadge: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Entry/Exit
  const scale = spring({ frame, fps: FPS, config: { damping: 12, stiffness: 100 } }) 
              * ci(frame, [165, 175], [1, 0], Easing.in(Easing.back(1.5)));
              
  // Pulsing red dot
  const pulse = Math.sin(frame * 0.15); // ranges -1 to 1
  const dotOpacity = interpolate(pulse, [-1, 1], [0.3, 1]);
  const ringScale = interpolate(pulse, [-1, 1], [1, 1.8]);
  const ringOpacity = interpolate(pulse, [-1, 1], [0.8, 0]);
  
  const POS_X = W4K - 350;
  const POS_Y = 200;
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={W4K} height={H4K}>
        <Defs />
        <g transform={`translate(${POS_X}, ${POS_Y}) scale(${scale})`}>
          {/* Main Pill */}
          <rect x={-150} y={-45} width={300} height={90} rx={45} 
                fill={C.redDark} opacity={0.8} stroke={C.red} strokeWidth={4} 
                filter="drop-shadow(0px 10px 15px rgba(211,16,39,0.3))" />
                
          {/* Live Text */}
          <text x={30} y={18} fill={C.white} fontSize={50} fontFamily={C.font} 
                fontWeight="bold" textAnchor="middle" letterSpacing={4}>
            LIVE
          </text>
          
          {/* Pulsing Dot Group */}
          <g transform={`translate(-80, 0)`}>
            {/* Ripple ring */}
            <circle cx={0} cy={0} r={15 * ringScale} fill="none" stroke={C.white} 
                    strokeWidth={4} opacity={ringOpacity} />
            {/* Core dot */}
            <circle cx={0} cy={0} r={14} fill={C.white} opacity={dotOpacity} 
                    filter="url(#glowRed)" />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 05: WORLD MAP / GLOBE SPIN INTRO
// Globe abstrak/radar pulse dengan cyan pin. Cocok untuk intro.
// ═══════════════════════════════════════════════════════════════════════════════
export const WorldMapIntro: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Intro zoom & fade
  const introScale = ci(frame, [0, 40], [1.5, 1], Easing.out(Easing.cubic));
  const introAlpha = ci(frame, [0, 20], [0, 1]);
  const exitAlpha = ci(frame, [160, 180], [1, 0]);
  const alpha = introAlpha * exitAlpha;
  
  // Rotation for the wireframe/radar rings
  const rot1 = frame * 0.5;
  const rot2 = frame * -0.3;
  
  // Radar sweep effect
  const sweepAngle = (frame * 3) % 360;
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={W4K} height={H4K} opacity={alpha}>
        <Defs />
        
        {/* Central Graphic Group */}
        <g transform={`translate(${CX}, ${CY}) scale(${introScale})`}>
          
          {/* Concentric Grid Rings */}
          {[200, 400, 600, 800].map((r, i) => (
            <circle key={i} cx={0} cy={0} r={r} fill="none" 
                    stroke={C.cyan} strokeWidth={2} opacity={0.2} strokeDasharray="10 15" />
          ))}
          
          {/* Rotating Data Rings */}
          <g transform={`rotate(${rot1})`}>
            <circle cx={0} cy={0} r={500} fill="none" stroke={C.cyan} strokeWidth={4} 
                    strokeDasharray="200 400" filter="url(#glowCyan)" opacity={0.5} />
            <circle cx={0} cy={0} r={700} fill="none" stroke={C.white} strokeWidth={1} 
                    strokeDasharray="50 100 10 50" opacity={0.3} />
          </g>
          
          <g transform={`rotate(${rot2})`}>
            <circle cx={0} cy={0} r={300} fill="none" stroke={C.navy} strokeWidth={20} 
                    strokeDasharray="100 200" opacity={0.8} />
          </g>
          
          {/* Radar Sweep Arc */}
          <g transform={`rotate(${sweepAngle})`}>
            <path d="M 0 0 L 0 -800 A 800 800 0 0 1 200 -770 Z" 
                  fill={C.cyan} opacity={0.15} />
            <line x1={0} y1={0} x2={0} y2={-800} stroke={C.cyan} strokeWidth={4} filter="url(#glowCyan)"/>
          </g>
          
          {/* Global Network Nodes (Static points that blink) */}
          {[
            {x: -300, y: -200}, {x: 400, y: -100}, {x: -150, y: 350}, 
            {x: 250, y: 200}, {x: -500, y: 100}, {x: 600, y: -400}
          ].map((pos, i) => {
            const blink = (Math.sin(frame * 0.1 + i) + 1) / 2; // 0 to 1
            return (
              <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
                <circle cx={0} cy={0} r={10} fill={C.cyan} opacity={blink} filter="url(#glowCyan)" />
                <line x1={0} y1={0} x2={-pos.x * 0.2} y2={-pos.y * 0.2} 
                      stroke={C.cyan} strokeWidth={1} opacity={blink * 0.5} />
              </g>
            );
          })}
          
          {/* Center Main Location Pin */}
          <g>
            <circle cx={0} cy={0} r={20} fill={C.white} filter="url(#glowCyan)" />
            <circle cx={0} cy={0} r={40 + (frame % 60)} fill="none" stroke={C.cyan} 
                    strokeWidth={4} opacity={1 - (frame % 60)/60} />
          </g>
          
        </g>
        
        {/* Overlay Tech Text */}
        <text x={200} y={200} fill={C.cyan} fontSize={40} fontFamily={C.font} opacity={0.6}>
          SYS.LOC: GLOBAL_NET // ACTIVE
        </text>
        <text x={200} y={260} fill={C.white} fontSize={30} fontFamily={C.font} opacity={0.4}>
          TRACKING: MULTIPLE VECTORS
        </text>
      </svg>
    </AbsoluteFill>
  );
};
