import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing, interpolate, spring } from "remotion";
import { W4K, H4K, CX, CY, FPS } from "./utils";

// ─── DESIGN TOKENS (Brand Agnostic) ───────────────────────────────────────────
const C = {
  bg:      "#000000",
  navy:    "#0A192F",
  red:     "#D31027",
  white:   "#FFFFFF",
  yellow:  "#EAB308",
  yellowD: "#A16207",
  cyan:    "#00E5FF",
  grey:    "#222222",
  greyL:   "#9CA3AF",
  font:    "'Share Tech Mono', 'Roboto', sans-serif",
};

const Defs: React.FC = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="15" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <linearGradient id="socialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#8B5CF6" />
      <stop offset="50%" stopColor="#EC4899" />
      <stop offset="100%" stopColor="#F59E0B" />
    </linearGradient>
    <pattern id="hazardStripes" width="100" height="100" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
      <rect width="100" height="100" fill={C.yellow} />
      <rect width="50" height="100" fill={C.bg} />
    </pattern>
    <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="2" fill={C.white} opacity="0.1" />
    </pattern>
  </defs>
);

const ci = (f: number, range: [number, number], out: [number, number], easing = Easing.linear) => 
  interpolate(f, range, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ═══════════════════════════════════════════════════════════════════════════════
// 11: SOCIAL MEDIA CALL-TO-ACTION OVERLAY
// Ikon & @username. Bounce-in, float loop. Gradien generik.
// ═══════════════════════════════════════════════════════════════════════════════
export const SocialMediaOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  
  const intro = spring({ frame, fps: FPS, config: { damping: 12, stiffness: 100 } });
  const exit = ci(frame, [160, 175], [0, 1], Easing.in(Easing.back(1.5)));
  
  // Float loop (sine wave on Y axis)
  const floatY = Math.sin(frame * 0.05) * 15;
  
  const scale = intro * (1 - exit);
  
  const POS_X = 200;
  const POS_Y = H4K - 300;
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={W4K} height={H4K}>
        <Defs />
        <g transform={`translate(${POS_X}, ${POS_Y + floatY}) scale(${scale})`}>
          
          {/* Main Box */}
          <rect x={0} y={0} width={800} height={120} rx={60} fill={C.grey} opacity={0.9} />
          
          {/* Icon Circle */}
          <circle cx={60} cy={60} r={60} fill="url(#socialGrad)" />
          
          {/* Generic "Play" / Camera Icon */}
          <polygon points="45,40 45,80 80,60" fill={C.white} />
          
          {/* Text */}
          <text x={150} y={75} fill={C.white} fontSize={55} fontFamily={C.font} fontWeight="bold">
            @OFFICIAL_NEWS
          </text>
          
          <rect x={700} y={40} width={40} height={40} rx={10} fill={C.cyan} opacity={0.5} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 12: EMERGENCY ALERT BROADCAST
// Strip hazard kuning-hitam diagonal, flash strobing (dibatasi).
// ═══════════════════════════════════════════════════════════════════════════════
export const EmergencyAlertBroadcast: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Slide in top and bottom hazard bars
  const intro = ci(frame, [0, 20], [0, 1], Easing.out(Easing.cubic));
  const exit = ci(frame, [160, 180], [1, 0], Easing.in(Easing.cubic));
  const alpha = intro * exit;
  
  const BAR_H = 150;
  const topY = (intro - 1) * BAR_H;
  const botY = H4K - (intro * BAR_H);
  
  // Strobing logic: Flash red occasionally, not too fast
  const isStrobing = (frame % 40) < 5;
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={W4K} height={H4K} opacity={exit}>
        <Defs />
        
        {/* Background Flash */}
        {isStrobing && (
          <rect x={0} y={0} width={W4K} height={H4K} fill={C.redDark} opacity={0.3} />
        )}
        
        {/* Top Hazard Bar */}
        <g transform={`translate(0, ${topY})`}>
          <rect x={0} y={0} width={W4K} height={BAR_H} fill="url(#hazardStripes)" />
          <rect x={0} y={BAR_H - 10} width={W4K} height={10} fill={C.red} />
        </g>
        
        {/* Bottom Hazard Bar */}
        <g transform={`translate(0, ${botY})`}>
          <rect x={0} y={0} width={W4K} height={BAR_H} fill="url(#hazardStripes)" />
          <rect x={0} y={0} width={W4K} height={10} fill={C.red} />
        </g>
        
        {/* Center Alert Box */}
        <g transform={`translate(${CX - 600}, ${CY - 200})`} opacity={alpha}>
          <rect x={0} y={0} width={1200} height={400} fill={C.redDark} stroke={C.red} strokeWidth={8} />
          
          <text x={600} y={150} fill={C.white} fontSize={90} fontFamily={C.font} 
                fontWeight="bold" textAnchor="middle" letterSpacing={8}>
            EMERGENCY ALERT
          </text>
          
          <text x={600} y={250} fill={C.yellow} fontSize={50} fontFamily={C.font} 
                textAnchor="middle">
            BROADCAST OVERRIDE IN EFFECT
          </text>
          
          {/* Blinking indicator */}
          <circle cx={100} cy={100} r={20} fill={C.white} opacity={Math.sin(frame*0.2) > 0 ? 1 : 0} />
          <circle cx={1100} cy={100} r={20} fill={C.white} opacity={Math.sin(frame*0.2) > 0 ? 1 : 0} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 13: SPLIT-SCREEN FRAME / MULTI-CAM LAYOUT
// Divider minimalis untuk 2 frame (kiri/kanan), garis slide-in.
// ═══════════════════════════════════════════════════════════════════════════════
export const SplitScreenLayout: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Line animates from top to bottom
  const lineY = ci(frame, [0, 30], [0, H4K], Easing.out(Easing.cubic));
  
  // Corner accents animate in after line
  const corners = ci(frame, [25, 45], [0, 1], Easing.out(Easing.back(1.5)));
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={W4K} height={H4K}>
        <Defs />
        
        {/* Center Divider */}
        <line x1={CX} y1={0} x2={CX} y2={lineY} stroke={C.white} strokeWidth={8} />
        <line x1={CX - 20} y1={0} x2={CX - 20} y2={lineY} stroke={C.grey} strokeWidth={2} opacity={0.5} />
        <line x1={CX + 20} y1={0} x2={CX + 20} y2={lineY} stroke={C.grey} strokeWidth={2} opacity={0.5} />
        
        <g transform={`scale(${corners})`} transform-origin="center">
          {/* L-Shape Accents for Left Frame */}
          <path d="M 50 250 L 50 50 L 250 50" fill="none" stroke={C.cyan} strokeWidth={6} />
          <path d={`M 50 ${H4K-250} L 50 ${H4K-50} L 250 ${H4K-50}`} fill="none" stroke={C.cyan} strokeWidth={6} />
          <path d={`M ${CX-50} 250 L ${CX-50} 50 L ${CX-250} 50`} fill="none" stroke={C.cyan} strokeWidth={6} />
          <path d={`M ${CX-50} ${H4K-250} L ${CX-50} ${H4K-50} L ${CX-250} ${H4K-50}`} fill="none" stroke={C.cyan} strokeWidth={6} />
          
          {/* L-Shape Accents for Right Frame */}
          <path d={`M ${CX+50} 250 L ${CX+50} 50 L ${CX+250} 50`} fill="none" stroke={C.cyan} strokeWidth={6} />
          <path d={`M ${CX+50} ${H4K-250} L ${CX+50} ${H4K-50} L ${CX+250} ${H4K-50}`} fill="none" stroke={C.cyan} strokeWidth={6} />
          <path d={`M ${W4K-50} 250 L ${W4K-50} 50 L ${W4K-250} 50`} fill="none" stroke={C.cyan} strokeWidth={6} />
          <path d={`M ${W4K-50} ${H4K-250} L ${W4K-50} ${H4K-50} L ${W4K-250} ${H4K-50}`} fill="none" stroke={C.cyan} strokeWidth={6} />
          
          {/* Location / Name Labels */}
          <rect x={50} y={H4K-120} width={400} height={70} fill={C.grey} opacity={0.8} />
          <text x={70} y={H4K-70} fill={C.white} fontSize={40} fontFamily={C.font}>
            STUDIO A
          </text>
          
          <rect x={CX+50} y={H4K-120} width={400} height={70} fill={C.redDark} opacity={0.8} />
          <text x={CX+70} y={H4K-70} fill={C.white} fontSize={40} fontFamily={C.font}>
            ON LOCATION
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 14: CORPORATE PRESS BACKDROP ACCENT
// Ambient motion di pojok, persistent background. Navy-emas.
// ═══════════════════════════════════════════════════════════════════════════════
export const PressConferenceBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Slow ambient rotations and translations
  const rot = frame * 0.1;
  const pulse = (Math.sin(frame * 0.02) + 1) / 2; // 0 to 1 over long time
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={W4K} height={H4K}>
        <Defs />
        
        {/* Background Dot Grid */}
        <rect x={0} y={0} width={W4K} height={H4K} fill="url(#dotGrid)" />
        
        {/* Large subtle corner geometric shapes (Navy & Gold) */}
        <g transform={`translate(${W4K}, 0)`}>
          <circle cx={0} cy={0} r={1200} fill="none" stroke={C.navy} strokeWidth={150} opacity={0.5} />
          <circle cx={0} cy={0} r={1400} fill="none" stroke={C.gold} strokeWidth={4} strokeDasharray="50 150" transform={`rotate(${rot})`} />
          <circle cx={0} cy={0} r={1600} fill="none" stroke={C.cyan} strokeWidth={1} opacity={0.2} />
        </g>
        
        <g transform={`translate(0, ${H4K})`}>
          <path d="M 0 0 L 800 0 L 0 -800 Z" fill={C.navy} opacity={0.3} />
          <path d={`M 0 0 L ${1000 + pulse*200} 0 L 0 ${-1000 - pulse*200} Z`} fill="none" stroke={C.gold} strokeWidth={2} opacity={0.3} />
        </g>
        
        {/* Logo Placeholder Area (Bottom Right) */}
        <g transform={`translate(${W4K - 400}, ${H4K - 200})`}>
          <rect x={0} y={0} width={300} height={100} fill={C.grey} opacity={0.8} />
          <text x={150} y={60} fill={C.white} fontSize={30} fontFamily={C.font} textAnchor="middle" letterSpacing={2}>
            [ YOUR LOGO ]
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 15: NEWS INTRO/OUTRO STINGER
// Burst of energy lines, snap to logo. 
// ═══════════════════════════════════════════════════════════════════════════════
export const NewsIntroStinger: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Build-up: lines converge to center
  const buildUp = ci(frame, [0, 45], [2000, 0], Easing.in(Easing.cubic));
  
  // Explosion / Logo Reveal
  const explosion = ci(frame, [45, 60], [0, 1], Easing.out(Easing.exp));
  const logoScale = ci(frame, [45, 70], [0.5, 1], Easing.out(Easing.back(1.5)));
  
  // Outro: Collapse back
  const collapse = ci(frame, [150, 165], [0, 1], Easing.in(Easing.exp));
  
  const currentLogoScale = logoScale * (1 - collapse);
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={W4K} height={H4K}>
        <Defs />
        
        {/* Converging Energy Lines (Before Snap) */}
        {frame < 50 && (
          <g transform={`translate(${CX}, ${CY})`}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
              <g key={deg} transform={`rotate(${deg})`}>
                <line x1={buildUp} y1={0} x2={buildUp + 800} y2={0} 
                      stroke={C.cyan} strokeWidth={20} opacity={1 - (buildUp/2000)} 
                      filter="url(#glow)" />
              </g>
            ))}
          </g>
        )}
        
        {/* Explosion Ring */}
        {frame >= 45 && frame < 90 && (
          <circle cx={CX} cy={CY} r={explosion * 2000} fill="none" 
                  stroke={C.white} strokeWidth={100 * (1 - explosion)} opacity={1 - explosion} />
        )}
        
        {/* Logo Reveal Area */}
        {frame >= 45 && (
          <g transform={`translate(${CX}, ${CY}) scale(${currentLogoScale})`}>
            {/* Base Polygon */}
            <polygon points="0,-300 260,-150 260,150 0,300 -260,150 -260,-150" 
                     fill={C.navy} stroke={C.cyan} strokeWidth={10} filter="url(#glow)" />
            
            <polygon points="0,-270 234,-135 234,135 0,270 -234,135 -234,-135" 
                     fill="none" stroke={C.white} strokeWidth={2} opacity={0.5} />
            
            <text x={0} y={-30} fill={C.white} fontSize={80} fontFamily={C.font} 
                  fontWeight="bold" textAnchor="middle" letterSpacing={6}>
              NEWS
            </text>
            <text x={0} y={60} fill={C.gold} fontSize={60} fontFamily={C.font} 
                  textAnchor="middle" letterSpacing={12}>
              NETWORK
            </text>
            
            {/* Spinning accent rings around logo */}
            <g transform={`rotate(${frame * 2})`}>
              <circle cx={0} cy={0} r={450} fill="none" stroke={C.cyan} strokeWidth={4} strokeDasharray="100 200" opacity={0.8} />
              <circle cx={0} cy={0} r={500} fill="none" stroke={C.red} strokeWidth={2} strokeDasharray="50 350" opacity={0.6} />
            </g>
          </g>
        )}
      </svg>
    </AbsoluteFill>
  );
};
