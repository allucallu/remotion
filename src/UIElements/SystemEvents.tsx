import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { C, ci, EaseOutBack, EaseOutExpo, pseudoRandom, CX, CY, SPRING } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// M3: SYSTEM PRESTIGE / REBIRTH
// ═══════════════════════════════════════════════════════════════════════════════
export const SystemPrestigeRebirth: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // White explosion taking over screen
  const explosionScale = spring({ frame: frame - 20, fps, config: { damping: 20, stiffness: 80, mass: 2 }, from: 0, to: 80, durationInFrames: 60 });
  const textOpacity = ci(frame, [60, 80], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {/* Central implosion dot before explosion */}
      <div style={{
        position: "absolute",
        width: 100, height: 100, borderRadius: "50%",
        backgroundColor: C.white,
        transform: `scale(${ci(frame, [0, 19], [0, 1], EaseOutExpo)})`,
        opacity: frame >= 20 ? 0 : 1,
        boxShadow: `0 0 100px ${C.white}`
      }} />

      {/* Explosion */}
      <div style={{
        position: "absolute",
        width: 100, height: 100, borderRadius: "50%",
        backgroundColor: C.white,
        transform: `scale(${explosionScale})`,
      }} />

      {/* Text on top of the white background */}
      <div style={{
        position: "relative",
        fontFamily: "'Inter', sans-serif", fontSize: 200, fontWeight: 900, letterSpacing: "20px",
        color: C.black, opacity: textOpacity
      }}>
        PRESTIGE READY
      </div>
      <div style={{
        position: "relative",
        fontFamily: "'Share Tech Mono', monospace", fontSize: 80, letterSpacing: "10px",
        color: C.black, opacity: textOpacity, marginTop: 40
      }}>
        RESETTING SYSTEM...
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M3: BOSS ENCOUNTER WARNING
// ═══════════════════════════════════════════════════════════════════════════════
export const BossEncounterWarning: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Moving stripe pattern
  const moveX = (frame * 10) % 100;
  
  const isFlash = Math.floor(frame / 10) % 2 === 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, justifyContent: "space-between" }}>
      {/* Top Stripe */}
      <div style={{
        width: "100%", height: 120,
        background: "repeating-linear-gradient(45deg, #000, #000 50px, #FFD700 50px, #FFD700 100px)",
        backgroundPosition: `${moveX}px 0`,
        boxShadow: `0 20px 60px ${C.neonGoldGlow}`
      }} />

      {/* Warning Text */}
      <div style={{
        textAlign: "center",
        fontFamily: "'Teko', sans-serif", fontSize: 400, fontWeight: 700, lineHeight: 1,
        color: C.neonRed, textShadow: `0 0 60px ${C.neonRed}`,
        opacity: isFlash ? 1 : 0.3
      }}>
        BOSS WAVE
      </div>
      <div style={{
        textAlign: "center",
        fontFamily: "'Share Tech Mono', monospace", fontSize: 100, letterSpacing: "30px",
        color: C.white, textShadow: "0 0 20px rgba(255,255,255,0.5)",
        marginTop: -50
      }}>
        WARNING
      </div>

      {/* Bottom Stripe */}
      <div style={{
        width: "100%", height: 120,
        background: "repeating-linear-gradient(-45deg, #000, #000 50px, #FFD700 50px, #FFD700 100px)",
        backgroundPosition: `${moveX}px 0`,
        boxShadow: `0 -20px 60px ${C.neonGoldGlow}`
      }} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M3: OFFLINE EARNINGS POPUP
// ═══════════════════════════════════════════════════════════════════════════════
export const OfflineEarningsPopup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const popScale = spring({ frame, fps, config: SPRING.bouncy, from: 0, to: 1, durationInFrames: 30 });

  return (
    <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        transform: `scale(${popScale})`,
        width: 1200,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        border: `4px solid ${C.neonCyan}`,
        borderRadius: 40,
        padding: 80,
        display: "flex", flexDirection: "column", alignItems: "center",
        boxShadow: `0 0 100px ${C.neonCyanGlow}, inset 0 0 50px ${C.neonCyanGlow}`
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: 80, fontWeight: 900, color: C.white,
          marginBottom: 20
        }}>
          OFFLINE PROGRESS
        </div>
        <div style={{
          fontFamily: "'Share Tech Mono', monospace", fontSize: 60, color: C.neonCyan,
          marginBottom: 60, animation: "blink 2s infinite"
        }}>
          SYNCING DATA...
        </div>

        {/* Resources grid */}
        <div style={{ display: "flex", gap: 60, width: "100%", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 150, height: 150, backgroundColor: C.neonGold, borderRadius: "50%", marginBottom: 20, boxShadow: `0 0 40px ${C.neonGold}` }} />
            <div style={{ fontFamily: "'Teko', sans-serif", fontSize: 120, fontWeight: 600, color: C.white }}>+14.2M</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: 150, height: 150, backgroundColor: C.neonPink, borderRadius: 20, transform: "rotate(45deg)", marginBottom: 20, boxShadow: `0 0 40px ${C.neonPink}` }} />
            <div style={{ fontFamily: "'Teko', sans-serif", fontSize: 120, fontWeight: 600, color: C.white }}>+850</div>
          </div>
        </div>

        {/* Claim Button */}
        <div style={{
          marginTop: 80, padding: "30px 100px",
          backgroundColor: C.neonCyan, color: C.black,
          fontFamily: "'Inter', sans-serif", fontSize: 60, fontWeight: 900,
          borderRadius: 20, boxShadow: `0 0 40px ${C.neonCyan}`
        }}>
          CLAIM ALL
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M3: CORE OVERCLOCK
// ═══════════════════════════════════════════════════════════════════════════════
export const CoreOverclock: React.FC = () => {
  const frame = useCurrentFrame();

  // Exponential rotation for spin up effect
  // Slow at first, then extremely fast
  const rotation = Math.pow(frame, 1.6);
  
  // Blur effect based on speed
  const blurAmount = ci(frame, [0, 100], [0, 15]);
  const glow = ci(frame, [0, 100], [0, 100]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      {/* Gear outer */}
      <div style={{
        position: "absolute",
        transform: `rotate(${rotation}deg)`,
        filter: `blur(${blurAmount}px) drop-shadow(0 0 ${glow}px ${C.neonRed})`
      }}>
        {/* Simple Gear SVG */}
        <svg width="800" height="800" viewBox="0 0 100 100" fill="none" stroke={C.neonRed} strokeWidth="2">
          <circle cx="50" cy="50" r="35" strokeDasharray="10 10" strokeWidth="4" />
          <circle cx="50" cy="50" r="25" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1="50" y1="15" x2="50" y2="5" transform={`rotate(${i * 45} 50 50)`} strokeWidth="4" />
          ))}
        </svg>
      </div>

      {/* Inner Core */}
      <div style={{
        width: 150, height: 150, borderRadius: "50%",
        backgroundColor: C.neonRed,
        boxShadow: `0 0 ${glow * 2}px ${C.neonRed}`
      }} />

      {/* Text overlays */}
      <div style={{
        position: "absolute", bottom: 200,
        textAlign: "center",
        fontFamily: "'Share Tech Mono', monospace", color: C.white,
        textShadow: `0 0 20px ${C.neonRed}`
      }}>
        <div style={{ fontSize: 100, fontWeight: "bold" }}>OVERCLOCK INITIATED</div>
        <div style={{ fontSize: 80, marginTop: 20, color: frame > 100 ? C.neonGold : C.white }}>SPEED: {Math.min(100, Math.floor((frame / 100) * 100))}%</div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M3: NEON PARTICLE LOOT DROP
// ═══════════════════════════════════════════════════════════════════════════════
export const NeonParticleLootDrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Diamond drops in
  const dropY = spring({ frame, fps, config: SPRING.bouncy, from: -800, to: 0, durationInFrames: 30 });
  const isShattered = frame >= 45;

  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      angle: pseudoRandom(i) * Math.PI * 2,
      dist: pseudoRandom(i + 1) * 800 + 200,
      size: pseudoRandom(i + 2) * 20 + 5
    }));
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Intact Diamond */}
      {!isShattered && (
        <div style={{
          transform: `translateY(${dropY}px) rotate(45deg)`,
          width: 300, height: 300,
          border: `10px solid ${C.neonGold}`,
          boxShadow: `0 0 50px ${C.neonGoldGlow}, inset 0 0 50px ${C.neonGoldGlow}`
        }} />
      )}

      {/* Shattered Particles */}
      {isShattered && particles.map((p, i) => {
        const localFrame = frame - 45;
        const progress = ci(localFrame, [0, 45], [0, 1], EaseOutExpo);
        
        const x = Math.cos(p.angle) * p.dist * progress;
        const y = Math.sin(p.angle) * p.dist * progress;
        const opacity = ci(localFrame, [30, 60], [1, 0]);

        return (
          <div key={i} style={{
            position: "absolute",
            left: CX + x, top: CY + y,
            width: p.size, height: p.size,
            backgroundColor: C.neonGold,
            boxShadow: `0 0 20px ${C.neonGold}`,
            opacity,
            transform: `rotate(${localFrame * 10}deg)`
          }} />
        );
      })}

      {/* Result Text */}
      <div style={{
        position: "absolute",
        fontFamily: "'Inter', sans-serif", fontSize: 150, fontWeight: 900, letterSpacing: "10px",
        color: C.neonGold, textShadow: `0 0 40px ${C.neonGold}`,
        opacity: isShattered ? ci(frame, [45, 60], [0, 1]) : 0,
        transform: `scale(${isShattered ? spring({ frame: frame - 45, fps, config: SPRING.wobbly, from: 0.5, to: 1 }) : 1})`
      }}>
        RARE DROP
      </div>
      <div style={{
        position: "absolute", top: CY + 120,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 70,
        color: C.white, opacity: isShattered ? ci(frame, [60, 75], [0, 1]) : 0,
      }}>
        ITEM SECURED
      </div>
    </AbsoluteFill>
  );
};
