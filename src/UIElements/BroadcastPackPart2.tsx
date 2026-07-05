import React from "react";
import { AbsoluteFill, useCurrentFrame, Easing, interpolate, spring } from "remotion";
import { W4K, H4K, CX, CY, FPS } from "./utils";

// ─── DESIGN TOKENS (Brand Agnostic) ───────────────────────────────────────────
const C = {
  bg:      "#000000",
  navy:    "#0A192F",
  blue:    "#1D4ED8",
  red:     "#D31027",
  redDark: "#8B0A1A",
  white:   "#FFFFFF",
  orange:  "#F97316",
  yellow:  "#EAB308",
  cyan:    "#00E5FF",
  grey:    "#333333",
  greyL:   "#9CA3AF",
  font:    "'Share Tech Mono', 'Roboto', sans-serif",
};

const Defs: React.FC = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="15" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#000000" floodOpacity="0.8"/>
    </filter>
    <linearGradient id="weatherGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor={C.orange} />
      <stop offset="100%" stopColor={C.blue} />
    </linearGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor={C.red} />
      <stop offset="100%" stopColor={C.redDark} />
    </linearGradient>
  </defs>
);

const ci = (f: number, range: [number, number], out: [number, number], easing = Easing.linear) => 
  interpolate(f, range, out, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

// ═══════════════════════════════════════════════════════════════════════════════
// 06: WEATHER GRAPHIC TEMPLATE
// Panel cuaca, transisi icon awan ke matahari, gradasi.
// ═══════════════════════════════════════════════════════════════════════════════
export const WeatherGraphicTemplate: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Entry slide & fade
  const intro = spring({ frame, fps: FPS, config: { damping: 14 } });
  const alpha = ci(frame, [0, 15], [0, 1]) * ci(frame, [165, 175], [1, 0]);
  
  const POS_X = 200;
  const POS_Y = H4K - 600;
  
  // Temp animation: 24 to 28
  const temp = Math.round(ci(frame, [40, 90], [24, 28], Easing.inOut(Easing.cubic)));
  
  // Icon transition: Cloud to Sun
  const iconMorph = ci(frame, [40, 90], [0, 1], Easing.inOut(Easing.cubic));
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={W4K} height={H4K} opacity={alpha}>
        <Defs />
        <g transform={`translate(${POS_X}, ${POS_Y + (1-intro)*200})`}>
          {/* Main Panel */}
          <rect x={0} y={0} width={600} height={400} rx={40} 
                fill={C.navy} stroke={C.cyan} strokeWidth={4} opacity={0.9} 
                filter="url(#shadow)" />
          
          {/* City & Condition */}
          <text x={300} y={70} fill={C.white} fontSize={40} fontFamily={C.font} 
                textAnchor="middle" letterSpacing={2}>
            METROPOLIS
          </text>
          <line x1={100} y1={90} x2={500} y2={90} stroke={C.cyan} strokeWidth={2} opacity={0.5} />
          
          {/* Temperature */}
          <text x={300} y={320} fill={C.white} fontSize={120} fontFamily={C.font} 
                fontWeight="bold" textAnchor="middle">
            {temp}°
          </text>
          <text x={300} y={360} fill={C.cyan} fontSize={30} fontFamily={C.font} 
                textAnchor="middle">
            {iconMorph > 0.5 ? "CLEARING UP" : "PARTLY CLOUDY"}
          </text>
          
          {/* Weather Icon (Line Art) */}
          <g transform="translate(300, 180) scale(1.5)">
            {/* Sun (Rotates and scales up) */}
            <g transform={`rotate(${frame}) scale(${0.5 + iconMorph*0.5})`} opacity={iconMorph}>
              <circle cx={0} cy={0} r={25} fill="none" stroke={C.yellow} strokeWidth={4} />
              {[0,45,90,135,180,225,270,315].map(deg => (
                <line key={deg} x1={0} y1={-35} x2={0} y2={-45} stroke={C.yellow} strokeWidth={4} 
                      transform={`rotate(${deg})`} strokeLinecap="round" />
              ))}
            </g>
            
            {/* Cloud (Slides right and fades out) */}
            <g transform={`translate(${iconMorph * 50}, 0)`} opacity={1 - iconMorph}>
              <path d="M -15 15 Q -30 15 -30 0 Q -30 -15 -15 -15 Q -10 -35 10 -35 Q 30 -35 30 -15 Q 45 -15 45 0 Q 45 15 30 15 Z" 
                    fill="none" stroke={C.white} strokeWidth={4} strokeLinejoin="round" />
            </g>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 07: COUNTDOWN TIMER BROADCAST
// Ring progress dan angka mundur, palet Red/Black urgent.
// ═══════════════════════════════════════════════════════════════════════════════
export const CountdownTimerBroadcast: React.FC = () => {
  const frame = useCurrentFrame();
  
  const SECONDS = 5;
  const totalFrames = SECONDS * FPS; // 150 frames
  
  // Progress
  const progress = Math.min(1, Math.max(0, frame / totalFrames));
  
  // Time remaining (ceiling so it hits 0 exactly at the end)
  const remainingFrames = Math.max(0, totalFrames - frame);
  const secs = Math.ceil(remainingFrames / FPS);
  const ms = Math.floor((remainingFrames % FPS) * (100 / FPS));
  
  const R = 400;
  const CIRC = 2 * Math.PI * R;
  const dashOffset = CIRC * progress; // Ring depletes
  
  const alpha = ci(frame, [0, 10], [0, 1]) * ci(frame, [170, 180], [1, 0]);
  
  // Alarm flash at zero
  const isZero = frame >= totalFrames;
  const flash = isZero ? (Math.sin(frame * 0.5) + 1) / 2 : 0;
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={W4K} height={H4K} opacity={alpha}>
        <Defs />
        <g transform={`translate(${CX}, ${CY})`}>
          
          {/* Background Ring */}
          <circle cx={0} cy={0} r={R} fill="none" stroke={C.grey} strokeWidth={20} />
          
          {/* Progress Ring */}
          <circle cx={0} cy={0} r={R} fill="none" stroke="url(#redGrad)" strokeWidth={20} 
                  strokeDasharray={CIRC} strokeDashoffset={dashOffset} 
                  transform="rotate(-90)" strokeLinecap="round" filter="url(#glow)" />
                  
          {/* Center Flashing Background when 0 */}
          {isZero && (
            <circle cx={0} cy={0} r={R - 20} fill={C.red} opacity={flash * 0.3} filter="url(#glow)"/>
          )}
                  
          {/* Numbers */}
          <text x={0} y={80} fill={isZero ? C.red : C.white} fontSize={280} fontFamily={C.font} 
                fontWeight="bold" textAnchor="middle" filter={isZero ? "url(#glow)" : undefined}>
            00:0{secs}
          </text>
          
          <text x={0} y={180} fill={C.red} fontSize={60} fontFamily={C.font} 
                textAnchor="middle" letterSpacing={6}>
            {isZero ? "BROADCAST LIVE" : "STANDBY"}
          </text>
          
          {/* Milliseconds (small) */}
          {!isZero && (
            <text x={240} y={80} fill={C.greyL} fontSize={80} fontFamily={C.font} textAnchor="start">
              .{ms.toString().padStart(2, '0')}
            </text>
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 08: SPORTS SCOREBOARD BUG
// Bar skor pojok kiri atas, netral abu-putih.
// ═══════════════════════════════════════════════════════════════════════════════
export const SportsScoreboardBug: React.FC = () => {
  const frame = useCurrentFrame();
  
  const intro = spring({ frame, fps: FPS, config: { damping: 15 } });
  const yOffset = (1 - intro) * -300;
  
  const POS_X = 150;
  const POS_Y = 100;
  
  // Score update animation
  const team2Score = frame > 90 ? 2 : 1;
  const scoreUpdatePop = frame > 90 ? ci(frame, [90, 100], [1.5, 1], Easing.out(Easing.back(2))) : 1;
  
  const timeSec = Math.floor(frame / FPS) + 45; // Start at 45:xx
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={W4K} height={H4K}>
        <Defs />
        <g transform={`translate(${POS_X}, ${POS_Y + yOffset})`}>
          
          {/* Main Container */}
          <rect x={0} y={0} width={900} height={100} rx={10} fill={C.grey} filter="url(#shadow)" />
          
          {/* Time & Period Box */}
          <rect x={0} y={0} width={180} height={100} rx={10} fill={C.navy} />
          <text x={90} y={62} fill={C.white} fontSize={40} fontFamily={C.font} textAnchor="middle">
            {timeSec}:{(frame % FPS).toString().padStart(2, '0')}
          </text>
          
          {/* Team 1 */}
          <text x={210} y={65} fill={C.white} fontSize={45} fontFamily={C.font} fontWeight="bold">
            HME
          </text>
          <text x={380} y={65} fill={C.white} fontSize={55} fontFamily={C.font} fontWeight="bold">
            3
          </text>
          
          {/* Divider */}
          <line x1={450} y1={20} x2={450} y2={80} stroke={C.white} strokeWidth={2} opacity={0.3} />
          
          {/* Team 2 */}
          <text x={490} y={65} fill={C.white} fontSize={45} fontFamily={C.font} fontWeight="bold">
            AWY
          </text>
          <g transform={`translate(660, 65) scale(${scoreUpdatePop})`}>
            <text x={0} y={0} fill={team2Score === 2 ? C.gold : C.white} fontSize={55} 
                  fontFamily={C.font} fontWeight="bold" textAnchor="middle">
              {team2Score}
            </text>
          </g>
          
          {/* Extra Info Box (e.g. 2ND HALF) */}
          <rect x={720} y={0} width={180} height={100} rx={10} fill={C.redDark} />
          <text x={810} y={62} fill={C.white} fontSize={35} fontFamily={C.font} textAnchor="middle">
            2ND H
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 09: ELECTION / POLL RESULT BAR
// Bar chart horizontal, netral (Blue vs Red).
// ═══════════════════════════════════════════════════════════════════════════════
export const ElectionResultBar: React.FC = () => {
  const frame = useCurrentFrame();
  
  const intro = ci(frame, [0, 20], [0, 1], Easing.out(Easing.cubic));
  
  const BAR_W = 2000;
  const BAR_H = 120;
  const POS_X = CX - BAR_W / 2;
  const POS_Y = CY;
  
  // Target percentages
  const p1Target = 52.4;
  const p2Target = 47.6;
  
  // Animation (counts up)
  const animProgress = ci(frame, [30, 100], [0, 1], Easing.out(Easing.cubic));
  const p1 = (p1Target * animProgress).toFixed(1);
  const p2 = (p2Target * animProgress).toFixed(1);
  
  const w1 = BAR_W * (p1Target / 100) * animProgress;
  const w2 = BAR_W * (p2Target / 100) * animProgress;
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <svg width={W4K} height={H4K} opacity={intro}>
        <Defs />
        
        {/* Title */}
        <text x={CX} y={POS_Y - 100} fill={C.white} fontSize={60} fontFamily={C.font} 
              textAnchor="middle" letterSpacing={4}>
          NATIONAL POLL RESULTS
        </text>
        
        <g transform={`translate(${POS_X}, ${POS_Y})`}>
          {/* Background Bar */}
          <rect x={0} y={0} width={BAR_W} height={BAR_H} fill={C.grey} rx={20} />
          
          {/* Candidate 1 (Blue) - Left */}
          <rect x={0} y={0} width={w1} height={BAR_H} fill={C.blue} rx={20} />
          <text x={30} y={80} fill={C.white} fontSize={55} fontFamily={C.font} fontWeight="bold">
            CANDIDATE A
          </text>
          <text x={w1 > 200 ? w1 - 30 : w1 + 30} y={80} 
                fill={w1 > 200 ? C.white : C.blue} 
                fontSize={55} fontFamily={C.font} fontWeight="bold" 
                textAnchor={w1 > 200 ? "end" : "start"}>
            {p1}%
          </text>
          
          {/* Candidate 2 (Red) - Right (drawn from right edge) */}
          <rect x={BAR_W - w2} y={0} width={w2} height={BAR_H} fill={C.red} rx={20} />
          <text x={BAR_W - 30} y={80} fill={C.white} fontSize={55} fontFamily={C.font} 
                fontWeight="bold" textAnchor="end">
            CANDIDATE B
          </text>
          <text x={w2 > 200 ? BAR_W - w2 + 30 : BAR_W - w2 - 30} y={80} 
                fill={w2 > 200 ? C.white : C.red} 
                fontSize={55} fontFamily={C.font} fontWeight="bold" 
                textAnchor={w2 > 200 ? "start" : "end"}>
            {p2}%
          </text>
          
          {/* Center Divider Marker */}
          <line x1={BAR_W / 2} y1={-20} x2={BAR_W / 2} y2={BAR_H + 20} 
                stroke={C.white} strokeWidth={6} />
          <polygon points={`${BAR_W/2},-20 ${BAR_W/2 - 15},-40 ${BAR_W/2 + 15},-40`} fill={C.white}/>
        </g>
        
        {/* Info Text */}
        <text x={CX} y={POS_Y + 200} fill={C.greyL} fontSize={40} fontFamily={C.font} 
              textAnchor="middle">
          BASED ON 98% REPORTING
        </text>
      </svg>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 10: STUDIO TRANSITION / WIPE
// Geometri wipe melintasi layar. Monokrom + aksen merah.
// ═══════════════════════════════════════════════════════════════════════════════
export const StudioTransitionWipe: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Wipe from left to right covering the whole screen
  // frame 0 to 45: covers screen
  // frame 135 to 180: uncovers screen
  
  const inProgress = ci(frame, [10, 40], [0, 1], Easing.inOut(Easing.cubic));
  const outProgress = ci(frame, [140, 170], [0, 1], Easing.inOut(Easing.cubic));
  
  // To create a "streak" effect, we use multiple polygons overlapping
  const p1 = inProgress * (W4K + 1000) - outProgress * (W4K + 1000);
  const p2 = ci(frame, [15, 45], [0, 1], Easing.inOut(Easing.cubic)) * (W4K + 1000) - ci(frame, [135, 165], [0, 1], Easing.inOut(Easing.cubic)) * (W4K + 1000);
  const p3 = ci(frame, [20, 50], [0, 1], Easing.inOut(Easing.cubic)) * (W4K + 1000) - ci(frame, [130, 160], [0, 1], Easing.inOut(Easing.cubic)) * (W4K + 1000);
  
  // Skewed polygon shape
  const makePoly = (xOffset: number) => 
    `${xOffset - 1000},${H4K} ${xOffset},${H4K} ${xOffset + 800},0 ${xOffset - 200},0`;
    
  // Since it's a transition meant to cover and uncover, it should block the whole screen at its peak.
  // Actually, standard transition overlays need an alpha channel, but the user requested SOLID BLACK.
  // Wait, if it's solid black and they use Screen/Add, a transition wipe of solid colors won't act as an alpha matte wipe for the underlying video. 
  // If they use Screen mode, the white/grey/red shapes will ADD to the footage, creating a "flash" transition effect. This is highly desired for light-leaks or bright geometric flashes.
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <svg width={W4K} height={H4K}>
        <Defs />
        
        {/* Layer 1: Grey streak */}
        <polygon points={makePoly(p1)} fill={C.grey} opacity={0.8} />
        
        {/* Layer 2: Red accent */}
        <polygon points={makePoly(p2)} fill={C.red} opacity={0.9} filter="url(#glow)"/>
        
        {/* Layer 3: White core flash */}
        <polygon points={makePoly(p3)} fill={C.white} />
        
        {/* If frame is in the middle, flash the whole screen white to ensure a cut point */}
        {frame > 45 && frame < 135 && (
          <rect x={0} y={0} width={W4K} height={H4K} fill={C.white} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
