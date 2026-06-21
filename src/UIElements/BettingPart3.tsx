import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, ci, getGlow, getGlowClimax, springPop, springBouncy, idlePulse, textFlicker, W4K, H4K, CX, CY, random } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 11: LIVE CASH OUT PULSAR
// ═══════════════════════════════════════════════════════════════════════════════
export const LiveCashOutPulsar: React.FC = () => {
  const frame = useCurrentFrame();

  const isVisible = frame >= 20;
  
  // Capsule animation
  const capsuleScale = isVisible ? springPop(frame, 20, 0, 1) : 0;
  
  // Panic shake effect (after frame 40)
  const isPanic = frame >= 40;
  const shakeX = isPanic ? Math.sin(frame * 1.5) * 8 : 0;
  const shakeY = isPanic ? Math.cos(frame * 1.7) * 4 : 0;
  
  const currentScale = isPanic ? 1 + Math.sin(frame * 0.4) * 0.05 : capsuleScale; // Pulsing scale

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      <div style={{
        position: "relative",
        transform: `translate(${shakeX}px, ${shakeY}px) scale(${currentScale})`,
        display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        
        {/* Giant Button */}
        <div style={{
          padding: "60px 120px",
          backgroundColor: `${C.lime}33`,
          border: `6px solid ${C.lime}`,
          borderRadius: 200, // Capsule
          filter: getGlowClimax(C.lime),
          boxShadow: `inset 0 0 80px ${C.lime}66`
        }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 160, fontWeight: 700, color: C.lime, letterSpacing: "0.1em" }}>
            CASH OUT $8,420
          </div>
        </div>

        {/* Labels */}
        <div style={{
          marginTop: 60, fontFamily: "'Share Tech Mono', monospace", fontSize: 80, color: C.white, letterSpacing: "0.4em",
          opacity: textFlicker(frame, 40, 60), filter: getGlow(C.white)
        }}>
          OFFER PENDING...
        </div>

      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 12: IN-PLAY POSSESSION DOMINANCE
// ═══════════════════════════════════════════════════════════════════════════════
export const InPlayPossession: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Donut chart radii
  const radius = 600;
  const circumference = 2 * Math.PI * radius;

  // Values: Home 68%, Away 32%
  const homeTargetPct = 68;
  const homePct = ci(frame, [20, 100], [50, homeTargetPct], Easing.easeOut);
  const awayPct = 100 - homePct;

  const homeLength = (homePct / 100) * circumference;
  const awayLength = circumference - homeLength;

  // Appear animation
  const scale = springBouncy(frame, 0, 0, 1);
  const rotation = frame * 0.5; // Slow rotation

  const p = idlePulse(frame, 100);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      <div style={{
        position: "absolute", top: 200,
        fontFamily: "'Rajdhani', sans-serif", fontSize: 80, color: C.textPrimary, letterSpacing: "0.4em"
      }}>
        POSSESSION DOMINANCE
      </div>

      <div style={{ position: "relative", width: 1600, height: 1600, transform: `scale(${scale})` }}>
        <svg width="1600" height="1600" style={{ position: "absolute", inset: 0, transform: `rotate(${rotation}deg)` }}>
          
          {/* Away Segment (Blue) */}
          <circle cx="800" cy="800" r={radius} fill="none" stroke={C.blue} strokeWidth="120"
                  strokeDasharray={`${awayLength} ${circumference}`} strokeDashoffset={0}
                  style={{ filter: getGlow(C.blue) }} />
                  
          {/* Home Segment (Gold) */}
          <circle cx="800" cy="800" r={radius} fill="none" stroke={C.gold} strokeWidth="120"
                  strokeDasharray={`${homeLength} ${circumference}`} strokeDashoffset={-awayLength}
                  style={{ filter: getGlow(C.gold) }} />

        </svg>

        {/* Center Text (Counter-rotated to stay upright) */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 240, fontWeight: 700, color: C.gold, filter: getGlow(C.gold), opacity: p }}>
            {Math.round(homePct)}%
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 60, color: C.textDim, letterSpacing: "0.4em", marginTop: 20 }}>
            HOME CONTROL
          </div>
        </div>

      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 13: BOTH TEAMS TO SCORE (BTTS) RADAR
// ═══════════════════════════════════════════════════════════════════════════════
export const BTTSRadar: React.FC = () => {
  const frame = useCurrentFrame();

  // 0-90: Blinking left and right dots
  // Blink interval starts slow, gets faster
  const speed = ci(frame, [0, 90], [20, 2]);
  const blinkPhase = Math.floor(frame / speed) % 2;
  
  const isLeftOn = frame < 90 && blinkPhase === 0;
  const isRightOn = frame < 90 && blinkPhase === 1;

  // 90+: Center clash
  const isClash = frame >= 90;
  const clashScale = isClash ? springPop(frame, 90, 0, 1) : 0;

  // Coordinates
  const dist = ci(frame, [80, 95], [800, 0], Easing.easeIn); // move to center

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Target Lines */}
      <div style={{ position: "absolute", left: CX - 1200, right: CX - 1200, height: 4, backgroundColor: `${C.white}33` }} />

      {/* Left Dot */}
      {frame < 95 && (
        <div style={{
          position: "absolute", left: CX - dist, top: CY, transform: "translate(-50%, -50%)",
          width: 80, height: 80, borderRadius: "50%", backgroundColor: C.cyan,
          opacity: isLeftOn || frame >= 80 ? 1 : 0.2, filter: getGlow(C.cyan)
        }} />
      )}

      {/* Right Dot */}
      {frame < 95 && (
        <div style={{
          position: "absolute", left: CX + dist, top: CY, transform: "translate(-50%, -50%)",
          width: 80, height: 80, borderRadius: "50%", backgroundColor: C.magenta,
          opacity: isRightOn || frame >= 80 ? 1 : 0.2, filter: getGlow(C.magenta)
        }} />
      )}

      {/* Center Clash */}
      {isClash && (
        <div style={{
          position: "absolute", left: CX, top: CY, transform: `translate(-50%, -50%) scale(${clashScale})`,
          width: 240, height: 240, borderRadius: "50%", backgroundColor: C.white,
          filter: getGlowClimax(C.white)
        }} />
      )}

      {/* Text */}
      <div style={{
        position: "absolute", top: CY + 300,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 160, fontWeight: 700,
        color: C.white, letterSpacing: "0.2em",
        transform: `scale(${clashScale})`, filter: getGlow(C.white)
      }}>
        BTTS SECURED
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 14: INJURY TIME DRAMA
// ═══════════════════════════════════════════════════════════════════════════════
export const InjuryTimeDrama: React.FC = () => {
  const frame = useCurrentFrame();

  // Strobe effect modulo logic
  const isStrobeOn = frame % 10 === 0 || frame % 10 === 1; // Quick flash

  // Timer: 90:00 -> 94:00 over 120 frames
  const minutes = 90 + Math.floor(ci(frame, [0, 120], [0, 4]));
  const seconds = Math.floor(ci(frame, [0, 120], [0, 240])) % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const textColor = isStrobeOn ? C.white : C.red;
  const textGlow = isStrobeOn ? getGlowClimax(C.white) : getGlow(C.red);

  return (
    <AbsoluteFill style={{ backgroundColor: isStrobeOn ? `${C.red}33` : C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Bar */}
      <div style={{
        position: "absolute", top: 200, width: "100%", height: 160,
        backgroundColor: C.red, display: "flex", alignItems: "center", justifyContent: "center",
        opacity: isStrobeOn ? 1 : 0.8
      }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 100, fontWeight: 700, color: C.black, letterSpacing: "0.4em" }}>
          LATE GOAL THREAT
        </div>
      </div>

      {/* Giant Timer */}
      <div style={{
        fontFamily: "'Share Tech Mono', monospace", fontSize: 500, fontWeight: 700,
        color: textColor, filter: textGlow
      }}>
        {timeStr}
      </div>

      <div style={{
        position: "absolute", bottom: 400,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 100, color: C.red, letterSpacing: "0.3em",
        opacity: textFlicker(frame, 0, 40)
      }}>
        INJURY TIME
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 15: BANKROLL ROI TRACKER
// ═══════════════════════════════════════════════════════════════════════════════
export const BankrollROITracker: React.FC = () => {
  const frame = useCurrentFrame();

  // Arrow path diagonal: bottom left to top right
  // X: 800 -> 3000, Y: 1800 -> 600
  const pathLength = 2500;
  const d = `M 800 1800 L 3000 600`;
  
  const drawOffset = ci(frame, [0, 60], [pathLength, 0], Easing.easeOut);

  // Arrow Head coords at current position
  const currentDist = ci(frame, [0, 60], [0, pathLength], Easing.easeOut);
  const headX = 800 + (currentDist / pathLength) * (3000 - 800);
  const headY = 1800 - (currentDist / pathLength) * (1800 - 600);

  // Particles (Golden Coins falling from arrow head)
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      spawnFrame: Math.floor(random(10, 60)),
      xOffset: random(-40, 40),
      size: random(10, 30)
    }));
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* SVG Arrow Line */}
      <svg width={W4K} height={H4K} style={{ position: "absolute", inset: 0 }}>
        <path d={d} fill="none" stroke={C.lime} strokeWidth="40" strokeLinecap="round"
              strokeDasharray={pathLength} strokeDashoffset={drawOffset}
              style={{ filter: getGlow(C.lime) }} />
      </svg>

      {/* Arrow Head Triangle */}
      {frame > 0 && (
        <div style={{
          position: "absolute", left: headX, top: headY,
          width: 0, height: 0,
          borderLeft: "60px solid transparent",
          borderRight: "60px solid transparent",
          borderBottom: `100px solid ${C.lime}`,
          transform: "translate(-50%, -50%) rotate(60deg)", // roughly match slope
          filter: getGlowClimax(C.lime)
        }} />
      )}

      {/* Particles */}
      {particles.map((p, i) => {
        if (frame < p.spawnFrame) return null;
        
        // At spawn frame, it was at some position along the arrow. Let's just drop them from the headX/Y at that frame
        const spawnDist = ci(p.spawnFrame, [0, 60], [0, pathLength], Easing.easeOut);
        const spawnX = 800 + (spawnDist / pathLength) * (3000 - 800);
        const spawnY = 1800 - (spawnDist / pathLength) * (1800 - 600);

        const fallFrame = frame - p.spawnFrame;
        const fallY = spawnY + fallFrame * 20; // Gravity
        
        return (
          <div key={i} style={{
            position: "absolute", left: spawnX + p.xOffset, top: fallY,
            width: p.size, height: p.size, backgroundColor: C.gold,
            transform: `rotate(${fallFrame * 10}deg)`,
            filter: getGlow(C.gold)
          }} />
        );
      })}

      {/* Text */}
      <div style={{
        position: "absolute", left: 1000, top: 400,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 160, fontWeight: 700,
        color: C.lime, letterSpacing: "0.2em",
        opacity: ci(frame, [40, 60], [0, 1]),
        filter: getGlow(C.lime)
      }}>
        +420% ROI SECURED
      </div>

    </AbsoluteFill>
  );
};
