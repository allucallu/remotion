import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, Sequence } from "remotion";
import { C, ci, EaseOutBack, EaseOutExpo, pseudoRandom, CX, CY } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// M2: ENDLESS WAVE PROGRESS (PREMIUM REVISION)
// ═══════════════════════════════════════════════════════════════════════════════
export const EndlessWaveProgress: React.FC = () => {
  const frame = useCurrentFrame();

  const cycleLength = 90;
  const currentCycleFrame = frame % cycleLength;
  const waveNumber = 42 + Math.floor(frame / cycleLength);
  
  // Progress goes 0 -> 100% in 70 frames
  const progress = ci(currentCycleFrame, [0, 70], [0, 100], EaseOutExpo);
  const isResetting = currentCycleFrame > 75;

  const textOpacity = isResetting ? 0 : 1;
  const incomingOpacity = isResetting ? 1 : 0;
  
  // Glitch effect on reset
  const glitchX = isResetting ? pseudoRandom(frame) * 40 - 20 : 0;
  const glitchY = isResetting ? pseudoRandom(frame + 1) * 20 - 10 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", paddingTop: 150 }}>
      {/* Sci-Fi HUD Container */}
      <div style={{ position: "relative", width: 2000, height: 120 }}>
        {/* Background Track with Segments */}
        <div style={{ position: "absolute", inset: 0, border: `4px solid rgba(0, 255, 255, 0.2)`, borderRadius: 20, overflow: "hidden" }}>
          <div style={{ width: "100%", height: "100%", background: "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,255,255,0.1) 40px, rgba(0,255,255,0.1) 45px)" }} />
        </div>
        
        {/* Filling Bar */}
        <div style={{
          position: "absolute", top: 4, left: 4, bottom: 4,
          width: `calc(${progress}% - 8px)`,
          background: `linear-gradient(90deg, transparent, ${C.neonCyan})`,
          borderRadius: 15,
          boxShadow: `0 0 60px ${C.neonCyanGlow}`,
          overflow: "hidden"
        }}>
          {/* Animated scanline inside the fill */}
          <div style={{
            position: "absolute", top: 0, bottom: 0, width: 200,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
            left: `${(frame * 15) % 2000}px`
          }} />
        </div>
      </div>

      {/* Decorative HUD Elements */}
      <div style={{ width: 2000, display: "flex", justifyContent: "space-between", marginTop: 20, color: "rgba(0, 255, 255, 0.5)", fontFamily: "'Share Tech Mono', monospace", fontSize: 40 }}>
        <div>SYS_WAVE_TRACKER_V4</div>
        <div style={{ opacity: isResetting ? 1 : 0.3 }}>[ ! ] ALERT_STATUS_ACTIVE</div>
      </div>

      {/* Text Area */}
      <div style={{
        marginTop: 60,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 150, fontWeight: "bold",
        color: C.neonCyan, textShadow: `0 0 40px ${C.neonCyanGlow}`,
        transform: `translate(${glitchX}px, ${glitchY}px)`
      }}>
        <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", opacity: textOpacity, transition: "opacity 0.1s" }}>
          WAVE {waveNumber}
        </span>
        <span style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", opacity: incomingOpacity, transition: "opacity 0.1s", color: C.neonRed, textShadow: `0 0 40px ${C.neonRed}` }}>
          INCOMING...
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M2: IDLE RESOURCE GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════
export const IdleResourceGenerator: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Calculate resources: starts at 1.5K, increments based on frame
  const baseValue = 1500;
  const ratePerSecond = 1500;
  const currentValue = baseValue + (frame / fps) * ratePerSecond;
  
  const displayValue = `+${(currentValue / 1000).toFixed(1)}K`;

  // Particles
  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      x: pseudoRandom(i) * 600 - 300,
      speedY: pseudoRandom(i + 1) * 5 + 2,
      delay: pseudoRandom(i + 2) * 100,
      size: pseudoRandom(i + 3) * 15 + 5
    }));
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      {/* Number display */}
      <div style={{
        fontFamily: "'Teko', sans-serif", fontSize: 350, fontWeight: 700,
        color: C.neonGold, textShadow: `0 0 50px ${C.neonGoldGlow}`,
        zIndex: 10
      }}>
        {displayValue}/sec
      </div>
      <div style={{
        fontFamily: "'Inter', sans-serif", fontSize: 60, fontWeight: 800, letterSpacing: "5px",
        color: C.white, opacity: 0.6, marginTop: -40
      }}>
        AUTO-COLLECT
      </div>

      {/* Particles flowing upwards */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {particles.map((p, i) => {
          const activeFrame = (frame + p.delay) % 150; // Loop particle
          const pY = CY + 300 - (activeFrame * p.speedY);
          const pOpacity = ci(activeFrame, [0, 20, 130, 150], [0, 1, 1, 0]);

          return (
            <div key={i} style={{
              position: "absolute",
              left: CX + p.x, top: pY,
              width: p.size, height: p.size, borderRadius: "50%",
              backgroundColor: C.neonGold,
              boxShadow: `0 0 20px ${C.neonGold}`,
              opacity: pOpacity
            }} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M2: FLOATING DAMAGE NUMBERS (PREMIUM REVISION)
// ═══════════════════════════════════════════════════════════════════════════════
export const FloatingDamageNumbers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const damages = useMemo(() => {
    return [
      { text: "-450", color: C.white, spawnFrame: 10, angle: -Math.PI / 4 },
      { text: "-820", color: C.neonGold, spawnFrame: 20, angle: -Math.PI / 3 },
      { text: "CRITICAL HIT!", color: C.neonPink, spawnFrame: 35, angle: -Math.PI / 2, isCrit: true },
      { text: "-310", color: C.white, spawnFrame: 50, angle: -2 * Math.PI / 3 },
      { text: "-999", color: C.neonPink, spawnFrame: 65, angle: -Math.PI / 5, isCrit: true },
    ];
  }, []);

  // Screen shake logic based on crit timings
  let shakeX = 0;
  let shakeY = 0;
  damages.filter(d => d.isCrit).forEach(crit => {
    if (frame >= crit.spawnFrame && frame < crit.spawnFrame + 15) {
      shakeX += (pseudoRandom(frame) * 40 - 20) * (1 - (frame - crit.spawnFrame) / 15);
      shakeY += (pseudoRandom(frame + 1) * 40 - 20) * (1 - (frame - crit.spawnFrame) / 15);
    }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Container with screen shake */}
      <div style={{ position: "absolute", inset: 0, transform: `translate(${shakeX}px, ${shakeY}px)` }}>
        {/* Dummy Target Core */}
        <div style={{
          position: "absolute", left: CX - 150, top: CY - 150,
          width: 300, height: 300,
          backgroundColor: "rgba(255, 0, 0, 0.1)",
          border: `10px solid ${C.neonRed}`,
          borderRadius: "15%", // Octagon-ish look
          transform: `rotate(45deg) scale(${1 + Math.sin(frame * 0.5) * 0.05})`,
          boxShadow: `0 0 100px ${C.neonRedGlow}, inset 0 0 50px ${C.neonRedGlow}`
        }} />
        
        {/* Core pulsing data */}
        <div style={{ position: "absolute", left: CX - 100, top: CY - 30, width: 200, textAlign: "center", color: C.neonRed, fontFamily: "'Share Tech Mono', monospace", fontSize: 60 }}>
          {Math.max(10, 100 - frame)}%
        </div>

        {/* Floating numbers */}
        {damages.map((dmg, i) => {
          if (frame < dmg.spawnFrame) return null;

          const localFrame = frame - dmg.spawnFrame;
          // Float outwards and upwards
          const distance = ci(localFrame, [0, 45], [0, 600], EaseOutExpo);
          const yOffset = ci(localFrame, [0, 45], [0, -400], EaseOutExpo); 
          const x = CX + Math.cos(dmg.angle) * distance;
          const y = CY + Math.sin(dmg.angle) * distance + yOffset;
          
          const opacity = ci(localFrame, [0, 3, 30, 50], [0, 1, 1, 0]);
          
          // Heavy snap scale for crit
          const scale = dmg.isCrit 
            ? ci(localFrame, [0, 5, 45], [4, 1.5, 0.8], EaseOutBack) 
            : ci(localFrame, [0, 5, 45], [2, 1, 0.8], EaseOutBack);

          // Impact Flash
          const flashOpacity = ci(localFrame, [0, 5], [1, 0]);

          return (
            <React.Fragment key={i}>
              {/* Flash effect at spawn point */}
              {localFrame < 5 && (
                <div style={{
                  position: "absolute", left: CX - 100, top: CY - 100,
                  width: 200, height: 200, borderRadius: "50%",
                  backgroundColor: dmg.color, filter: "blur(30px)",
                  opacity: flashOpacity
                }} />
              )}
              
              <div style={{
                position: "absolute",
                left: x, top: y,
                fontFamily: "'Teko', sans-serif", fontSize: dmg.isCrit ? 220 : 130, fontWeight: 700,
                color: dmg.color,
                textShadow: `0 0 40px ${dmg.color}, 0 0 80px ${dmg.color}`,
                opacity, transform: `translate(-50%, -50%) scale(${scale})`,
                fontStyle: "italic"
              }}>
                {dmg.text}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Static DPS meter (outside screen shake) */}
      <div style={{
        position: "absolute", bottom: 150, right: 150,
        backgroundColor: "rgba(0, 255, 255, 0.1)",
        padding: "30px 60px", borderLeft: `10px solid ${C.neonCyan}`,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 100, fontWeight: "bold",
        color: C.neonCyan, textShadow: `0 0 20px ${C.neonCyanGlow}`
      }}>
        DPS: <span style={{ color: C.white }}>{(14.5 + Math.sin(frame * 0.2) * 0.5).toFixed(1)}K</span>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M2: MINIMALIST UPGRADE PANEL
// ═══════════════════════════════════════════════════════════════════════════════
export const MinimalistUpgradePanel: React.FC = () => {
  const frame = useCurrentFrame();

  const blocks = 10;
  // Progress blocks filling up
  const filledBlocks = Math.min(blocks, Math.floor(frame / 6));

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: 1400,
        backgroundColor: "rgba(0, 255, 255, 0.05)",
        border: `6px solid ${C.neonCyan}`,
        padding: 60,
        boxShadow: `0 0 80px ${C.neonCyanGlow}, inset 0 0 40px ${C.neonCyanGlow}`,
        borderRadius: 20
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 40 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 80, fontWeight: 900, color: C.white }}>
            CORE REACTOR
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 60, color: C.neonCyan }}>
            LVL {filledBlocks}
          </div>
        </div>

        {/* Blocks container */}
        <div style={{ display: "flex", gap: 15, width: "100%", height: 100 }}>
          {Array.from({ length: blocks }).map((_, i) => (
            <div key={i} style={{
              flex: 1,
              backgroundColor: i < filledBlocks ? C.neonCyan : "rgba(0, 255, 255, 0.1)",
              boxShadow: i < filledBlocks ? `0 0 30px ${C.neonCyan}` : "none",
              transition: "background-color 0.1s"
            }} />
          ))}
        </div>

        {/* Status text */}
        <div style={{
          marginTop: 40, textAlign: "center",
          fontFamily: "'Share Tech Mono', monospace", fontSize: 80, fontWeight: "bold",
          color: filledBlocks === blocks ? C.neonGold : C.neonRed,
          textShadow: filledBlocks === blocks ? `0 0 30px ${C.neonGoldGlow}` : "none",
          animation: filledBlocks === blocks ? "blink 1s infinite" : "none"
        }}>
          {filledBlocks === blocks ? "MAX LEVEL REACHED" : "COST: 45,000"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M2: IDLE MULTIPLIER METER
// ═══════════════════════════════════════════════════════════════════════════════
export const IdleMultiplierMeter: React.FC = () => {
  const frame = useCurrentFrame();

  // Multiplier increases from x1 to x10 over 100 frames
  const rawMult = ci(frame, [0, 100], [1, 10]);
  const currentMult = Math.min(10, Math.floor(rawMult));
  const isMax = currentMult === 10;

  // Glow intensity increases with multiplier
  const glowBlur = currentMult * 10;
  const scale = 1 + (currentMult * 0.05);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        transform: `scale(${scale})`, transition: "transform 0.1s",
        textShadow: `0 0 ${glowBlur}px ${C.neonPink}, 0 0 ${glowBlur * 2}px ${C.neonPink}`
      }}>
        {/* Ring */}
        <div style={{
          width: 600, height: 600,
          borderRadius: "50%",
          border: `${10 + currentMult * 2}px solid ${C.neonPink}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 ${glowBlur}px ${C.neonPink}, inset 0 0 ${glowBlur}px ${C.neonPink}`
        }}>
          <div style={{ fontFamily: "'Teko', sans-serif", fontSize: 350, fontWeight: 700, color: C.white, lineHeight: 1 }}>
            x{currentMult}
          </div>
        </div>
        
        <div style={{
          marginTop: 60,
          fontFamily: "'Inter', sans-serif", fontSize: 80, fontWeight: 900, letterSpacing: "15px",
          color: isMax ? C.neonGold : C.white,
          textShadow: isMax ? `0 0 40px ${C.neonGold}` : "none"
        }}>
          {isMax ? "MAX COMBO" : "MULTIPLIER ACTIVE"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
