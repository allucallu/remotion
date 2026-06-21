import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, ci, getGlow, getGlowClimax, springPop, springBouncy, idlePulse, textFlicker, W4K, H4K, CX, CY } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 06: EXPECTED GOALS (xG) DYNAMICS
// ═══════════════════════════════════════════════════════════════════════════════
export const ExpectedGoalsDynamics: React.FC = () => {
  const frame = useCurrentFrame();

  const svgWidth = 2400;
  const svgHeight = 1000;

  // Chart data points (xG builds up slowly, then spikes)
  // Base xG line
  const d = `M 200 900 
             C 400 850, 600 800, 800 750 
             S 1200 700, 1400 650 
             S 1800 500, 2000 100`; // Spike at the end

  const pathLength = 2500;
  
  // Animation
  const drawOffset = ci(frame, [0, 120], [pathLength, 0], Easing.easeOut);
  
  // Spike event
  const isSpike = frame >= 100;
  const spikeScale = isSpike ? springPop(frame, 100, 0, 1) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Title */}
      <div style={{
        position: "absolute", top: 200, left: CX - 1200,
        fontFamily: "'Rajdhani', sans-serif", fontSize: 64, color: C.textDim, letterSpacing: "0.3em",
      }}>
        EXPECTED GOALS (xG)
      </div>

      <div style={{ position: "relative", width: svgWidth, height: svgHeight }}>
        
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(ratio => (
          <div key={ratio} style={{
            position: "absolute", bottom: ratio * svgHeight, left: 200, right: 0, height: 2,
            backgroundColor: `${C.white}1A`
          }} />
        ))}
        <div style={{ position: "absolute", bottom: 0, left: 200, right: 0, height: 4, backgroundColor: `${C.white}33` }} />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 200, width: 4, backgroundColor: `${C.white}33` }} />

        {/* The Line */}
        <svg width={svgWidth} height={svgHeight} style={{ position: "absolute", inset: 0 }}>
          <path d={d} fill="none" stroke={C.cyan} strokeWidth="12" 
                strokeDasharray={pathLength} strokeDashoffset={drawOffset}
                style={{ filter: getGlow(C.cyan) }} />
          <path d={d} fill="none" stroke={C.white} strokeWidth="4" 
                strokeDasharray={pathLength} strokeDashoffset={drawOffset} />
        </svg>

        {/* Spike Marker */}
        {isSpike && (
          <div style={{
            position: "absolute", left: 2000, top: 100, transform: `translate(-50%, -50%) scale(${spikeScale})`,
            width: 48, height: 48, borderRadius: "50%", backgroundColor: C.cyan,
            filter: getGlowClimax(C.cyan)
          }}>
            <div style={{
              position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
              fontFamily: "'Share Tech Mono', monospace", fontSize: 48, color: C.white,
              backgroundColor: C.black, padding: "10px 20px", border: `2px solid ${C.cyan}`, borderRadius: 10
            }}>
              2.84 xG
            </div>
          </div>
        )}

      </div>

      {/* Alert Text */}
      <div style={{
        position: "absolute", top: CY + 500, right: CX - 1200,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 100, fontWeight: 700,
        color: C.cyan, letterSpacing: "0.2em",
        transform: `scale(${isSpike ? springBouncy(frame, 100, 0, 1) : 0})`,
        filter: getGlow(C.cyan),
        opacity: idlePulse(frame, 130)
      }}>
        SCORING CHANCE
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 07: ASIAN HANDICAP INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════
export const AsianHandicapIndicator: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Balance scale (tilt left to right)
  // Damped oscillation using spring
  // Let's use a spring that goes from -30deg to 0deg
  const tilt = springBouncy(frame, 0, -30, 0); 
  
  // Values
  const showValues = frame >= 60;
  const valueScale = showValues ? springPop(frame, 60, 0, 1) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Title */}
      <div style={{
        position: "absolute", top: 300,
        fontFamily: "'Rajdhani', sans-serif", fontSize: 80, color: C.textPrimary, letterSpacing: "0.4em",
        opacity: textFlicker(frame, 0, 80)
      }}>
        ASIAN HANDICAP
      </div>

      {/* Scale Assembly */}
      <div style={{ position: "relative", width: 1600, height: 800 }}>
        
        {/* Base Triangle */}
        <svg width="200" height="200" style={{ position: "absolute", bottom: 0, left: 700 }}>
          <polygon points="100,0 200,200 0,200" fill={`${C.white}1A`} stroke={C.white} strokeWidth="4" style={{ filter: getGlow(C.white) }}/>
        </svg>

        {/* Seesaw Bar */}
        <div style={{
          position: "absolute", top: 600, left: 0, width: 1600, height: 20,
          backgroundColor: C.white, borderRadius: 10,
          transformOrigin: "center center",
          transform: `translateY(-10px) rotate(${tilt}deg)`,
          filter: getGlow(C.white)
        }}>
          
          {/* Left Plate */}
          <div style={{
            position: "absolute", left: 0, top: 20, width: 240, height: 240,
            transform: "translateX(-50%)", borderTop: `10px solid ${C.cyan}`,
            filter: getGlow(C.cyan)
          }}>
            <div style={{ textAlign: "center", paddingTop: 40, fontFamily: "'Share Tech Mono', monospace", fontSize: 100, color: C.cyan, transform: `scale(${valueScale})` }}>
              -1.5
            </div>
          </div>

          {/* Right Plate */}
          <div style={{
            position: "absolute", right: 0, top: 20, width: 240, height: 240,
            transform: "translateX(50%)", borderTop: `10px solid ${C.magenta}`,
            filter: getGlow(C.magenta)
          }}>
            <div style={{ textAlign: "center", paddingTop: 40, fontFamily: "'Share Tech Mono', monospace", fontSize: 100, color: C.magenta, transform: `scale(${valueScale})` }}>
              +1.5
            </div>
          </div>
          
        </div>

      </div>

      {/* Alert Text */}
      <div style={{
        position: "absolute", bottom: 300,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 80, fontWeight: 700,
        color: C.gold, letterSpacing: "0.2em",
        transform: `scale(${showValues ? springBouncy(frame, 80, 0, 1) : 0})`,
        filter: getGlowClimax(C.gold)
      }}>
        COVER THE LINE
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 08: FORM GUIDE TRACKER
// ═══════════════════════════════════════════════════════════════════════════════
export const FormGuideTracker: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Results: Win (Green), Win (Green), Draw (Gray), Loss (Red), Win (Green)
  const boxes = [
    { label: "W", color: C.lime },
    { label: "W", color: C.lime },
    { label: "D", color: C.textDim },
    { label: "L", color: C.red },
    { label: "W", color: C.lime },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Title */}
      <div style={{
        position: "absolute", top: 400,
        fontFamily: "'Rajdhani', sans-serif", fontSize: 80, color: C.textPrimary, letterSpacing: "0.4em"
      }}>
        RECENT FORM
      </div>

      {/* Box Container */}
      <div style={{ display: "flex", gap: 60, perspective: 1500 }}>
        {boxes.map((b, i) => {
          const appearFrame = i * 15; // Stagger
          // 3D Flip from 90deg to 0deg
          const flip = frame > appearFrame ? springBouncy(frame, appearFrame, 90, 0) : 90;
          const isVisible = frame > appearFrame;

          return (
            <div key={i} style={{
              width: 240, height: 240, 
              backgroundColor: isVisible ? `${b.color}33` : "transparent",
              border: isVisible ? `4px solid ${b.color}` : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: `rotateY(${flip}deg)`,
              transformStyle: "preserve-3d",
              filter: isVisible ? getGlow(b.color) : "none"
            }}>
              <div style={{
                fontFamily: "'Share Tech Mono', monospace", fontSize: 120, fontWeight: 700, color: C.white,
                transform: `rotateY(${flip > 45 ? 180 : 0}deg)` // Hide text when flipped backwards
              }}>
                {flip < 45 ? b.label : ""}
              </div>
            </div>
          );
        })}
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 09: SHARP MONEY / VALUE BET ALERT
// ═══════════════════════════════════════════════════════════════════════════════
export const SharpMoneyAlert: React.FC = () => {
  const frame = useCurrentFrame();

  const radarRotation = frame * 4; // Fast rotation
  const isAlert = frame >= 60; // Alert triggers at 60

  const radarColor = isAlert ? C.red : C.cyan;
  const alertScale = isAlert ? springBouncy(frame, 60, 0, 1) : 0;
  
  // Red siren flash overlay
  const flashOpacity = isAlert ? (Math.floor(frame / 15) % 2 === 0 ? 0.15 : 0) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {flashOpacity > 0 && <div style={{ position: "absolute", inset: 0, backgroundColor: C.red, opacity: flashOpacity, zIndex: 100 }} />}

      <div style={{ position: "relative", width: 1200, height: 1200 }}>
        
        {/* Radar Circles */}
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            position: "absolute", inset: (3 - i) * 200,
            border: `2px solid ${radarColor}33`, borderRadius: "50%"
          }} />
        ))}
        
        {/* Radar Sweep */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `conic-gradient(from 0deg, ${radarColor}80 0%, transparent 40%)`,
          transform: `rotate(${radarRotation}deg)`,
          filter: getGlow(radarColor)
        }} />

        {/* Center */}
        <div style={{
          position: "absolute", left: 600, top: 600, transform: "translate(-50%, -50%)",
          width: 60, height: 60, borderRadius: "50%", backgroundColor: radarColor,
          filter: getGlow(radarColor)
        }} />

      </div>

      {/* Alert Text */}
      <div style={{
        position: "absolute", top: CY + 700,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 140, fontWeight: 700,
        color: C.red, letterSpacing: "0.2em",
        transform: `scale(${alertScale})`,
        filter: getGlowClimax(C.red)
      }}>
        SHARP MONEY DETECTED
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 10: CLEAN SHEET PROBABILITY
// ═══════════════════════════════════════════════════════════════════════════════
export const CleanSheetProbability: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Shield Path (vector)
  const shieldWidth = 600;
  const shieldHeight = 700;
  const d = `M 300 0 L 600 100 L 600 400 C 600 600, 300 700, 300 700 C 300 700, 0 600, 0 400 L 0 100 Z`;

  // Draw animation
  const drawOffset = ci(frame, [0, 60], [2500, 0], Easing.easeOut);
  
  // Heartbeat pulse (organic)
  // Sinusoidal with a strong bump
  const pulse = 1 + Math.abs(Math.sin(frame * 0.1)) * 0.1;
  const scale = frame < 60 ? 1 : pulse;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Title */}
      <div style={{
        position: "absolute", top: 300,
        fontFamily: "'Rajdhani', sans-serif", fontSize: 80, color: C.textPrimary, letterSpacing: "0.4em"
      }}>
        CLEAN SHEET PROBABILITY
      </div>

      <div style={{
        position: "relative", width: shieldWidth, height: shieldHeight,
        transform: `scale(${scale})`, transformOrigin: "center center"
      }}>
        <svg width={shieldWidth} height={shieldHeight} style={{ position: "absolute", inset: 0 }}>
          {/* Fill glow */}
          <path d={d} fill={`${C.cyan}1A`} style={{ filter: getGlow(C.cyan) }} />
          {/* Stroke */}
          <path d={d} fill="none" stroke={C.cyan} strokeWidth="16" strokeLinejoin="round"
                strokeDasharray={2500} strokeDashoffset={drawOffset}
                style={{ filter: getGlow(C.cyan) }} />
        </svg>

        {/* Center Text */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Share Tech Mono', monospace", fontSize: 180, fontWeight: 700, color: C.white,
          opacity: ci(frame, [60, 80], [0, 1])
        }}>
          82%
        </div>
      </div>

      {/* Alert Text */}
      <div style={{
        position: "absolute", top: CY + 500,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 80, fontWeight: 700,
        color: C.cyan, letterSpacing: "0.2em",
        opacity: ci(frame, [60, 80], [0, 1]),
        filter: getGlow(C.cyan)
      }}>
        DEFENSIVE SOLIDITY
      </div>

    </AbsoluteFill>
  );
};
