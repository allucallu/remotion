import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolateColors } from "remotion";
import { C, ci, EaseOutBack, EaseOutExpo, SPRING, pseudoRandom, W4K, H4K, CX, CY } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// M1: HEXAGON GRID EXPANSION
// ═══════════════════════════════════════════════════════════════════════════════
export const HexagonGridExpansion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Create a grid of hexagons
  const hexagons = useMemo(() => {
    const hexSize = 150;
    const spacingX = hexSize * 1.5;
    const spacingY = hexSize * Math.sqrt(3) / 2;
    const grid = [];
    
    for (let row = -5; row <= 5; row++) {
      for (let col = -8; col <= 8; col++) {
        const x = CX + col * spacingX;
        const y = CY + row * spacingY * 2 + (Math.abs(col % 2) === 1 ? spacingY : 0);
        
        // Distance from center to stagger animation
        const dist = Math.hypot(x - CX, y - CY);
        grid.push({ x, y, dist });
      }
    }
    // Sort by distance from center
    return grid.sort((a, b) => a.dist - b.dist);
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      {hexagons.map((hex, i) => {
        const delay = (hex.dist / 100) * 5; 
        const opacity = ci(frame - delay, [0, 10, 20], [0, 0.8, 0.2]);
        const scale = spring({ frame: frame - delay, fps, config: SPRING.snappy, from: 0, to: 1, durationInFrames: 15 });
        
        return (
          <div key={i} style={{
            position: "absolute",
            left: hex.x - 100, top: hex.y - 100,
            width: 200, height: 200,
            backgroundColor: C.neonCyan,
            clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
            opacity, transform: `scale(${scale})`,
            boxShadow: `0 0 40px ${C.neonCyan}`
          }}>
            {/* Inner cut to make it a stroke instead of solid fill */}
            <div style={{
              position: "absolute", inset: 6,
              backgroundColor: C.black,
              clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
            }} />
          </div>
        );
      })}

      {/* Center Text */}
      <div style={{
        position: "absolute",
        color: C.neonCyan,
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 120, fontWeight: "bold",
        letterSpacing: "10px",
        textShadow: `0 0 30px ${C.neonCyanGlow}, 0 0 60px ${C.neonCyanGlow}`,
        opacity: ci(frame, [30, 40], [0, 1]),
        transform: `scale(${ci(frame, [30, 60], [0.8, 1], EaseOutExpo)})`
      }}>
        SECTOR CLEARED
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M1: AUTO-TURRET RANGE INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════
export const AutoTurretRange: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Range circle expands
  const radius = spring({ frame, fps, config: SPRING.wobbly, from: 0, to: 1200, durationInFrames: 45 });
  const opacity = ci(frame, [0, 10, 45, 60], [0, 1, 1, 0.4]);
  
  // Dash rotation
  const rotation = frame * 2;

  // Flash lock at frame 45
  const flash = ci(frame, [45, 50, 60], [0, 1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      {/* Dashed Range Indicator */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity, transform: `rotate(${rotation}deg)` }}>
        <circle 
          cx={CX} cy={CY} r={radius} 
          fill="none" 
          stroke={C.neonRed} strokeWidth="15" 
          strokeDasharray="40 60"
          style={{ filter: `drop-shadow(0 0 20px ${C.neonRed})` }}
        />
      </svg>

      {/* Crosshair Center */}
      <div style={{
        position: "absolute",
        width: 200, height: 200,
        border: `4px solid ${C.neonRed}`,
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: ci(frame, [0, 15], [0, 1]),
        boxShadow: `0 0 40px ${C.neonRedGlow}, inset 0 0 40px ${C.neonRedGlow}`
      }}>
        <div style={{ position: "absolute", width: "150%", height: 4, backgroundColor: C.neonRed }} />
        <div style={{ position: "absolute", width: 4, height: "150%", backgroundColor: C.neonRed }} />
      </div>

      {/* White Lock-on Flash */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundColor: C.white,
        opacity: flash
      }} />

      {/* Status Text */}
      <div style={{
        position: "absolute", bottom: 200,
        color: C.neonRed, fontFamily: "'Share Tech Mono', monospace",
        fontSize: 100, letterSpacing: "15px",
        opacity: ci(frame, [45, 55], [0, 1]),
        textShadow: `0 0 30px ${C.neonRedGlow}`
      }}>
        TARGET ACQUIRED
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M1: TECH TREE / SKILL NODE
// ═══════════════════════════════════════════════════════════════════════════════
export const TechTreeNode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Static tree setup
  const nodes = useMemo(() => {
    return [
      { x: CX - 600, y: CY + 400 },
      { x: CX - 300, y: CY + 100 },
      { x: CX, y: CY - 200 }, // Center active node
      { x: CX + 400, y: CY - 500 },
      { x: CX + 600, y: CY - 100 },
      { x: CX + 300, y: CY + 500 },
    ];
  }, []);

  const activeNodeIndex = 2; // the CX, CY - 200 node
  const activeNode = nodes[activeNodeIndex];

  // Draw lines
  const lines = useMemo(() => {
    const l = [];
    l.push({ from: nodes[0], to: nodes[1] });
    l.push({ from: nodes[1], to: nodes[2] }); // This line will animate activation
    l.push({ from: nodes[2], to: nodes[3] });
    l.push({ from: nodes[2], to: nodes[4] });
    l.push({ from: nodes[2], to: nodes[5] });
    return l;
  }, [nodes]);

  // Activation Progress along the line to the active node
  const activationProgress = ci(frame, [15, 45], [0, 1], EaseOutExpo);
  
  // The active node glow
  const nodeGlowScale = spring({ frame: frame - 45, fps, config: SPRING.bouncy, from: 0, to: 1 });
  const textOpacity = ci(frame, [45, 55], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {/* Base dim lines */}
        {lines.map((l, i) => (
          <line key={i} x1={l.from.x} y1={l.from.y} x2={l.to.x} y2={l.to.y} stroke="rgba(0, 255, 255, 0.2)" strokeWidth="6" />
        ))}
        
        {/* Glowing activation line to node 2 */}
        <line 
          x1={lines[1].from.x} y1={lines[1].from.y} 
          x2={lines[1].from.x + (lines[1].to.x - lines[1].from.x) * activationProgress} 
          y2={lines[1].from.y + (lines[1].to.y - lines[1].from.y) * activationProgress} 
          stroke={C.neonCyan} strokeWidth="12"
          style={{ filter: `drop-shadow(0 0 20px ${C.neonCyan})` }}
        />
      </svg>

      {/* Static Nodes */}
      {nodes.map((n, i) => (
        <div key={i} style={{
          position: "absolute", left: n.x - 20, top: n.y - 20,
          width: 40, height: 40, borderRadius: "50%",
          backgroundColor: i === activeNodeIndex ? C.neonCyan : "rgba(0, 255, 255, 0.3)",
          boxShadow: i === activeNodeIndex ? `0 0 40px ${C.neonCyanGlow}` : "none",
        }} />
      ))}

      {/* Active Node Burst */}
      <div style={{
        position: "absolute", left: activeNode.x - 100, top: activeNode.y - 100,
        width: 200, height: 200, borderRadius: "50%",
        border: `4px solid ${C.neonCyan}`,
        transform: `scale(${nodeGlowScale})`, opacity: 1 - nodeGlowScale * 0.5,
        boxShadow: `inset 0 0 40px ${C.neonCyanGlow}, 0 0 40px ${C.neonCyanGlow}`
      }} />

      {/* Text Popup */}
      <div style={{
        position: "absolute", left: activeNode.x + 80, top: activeNode.y - 40,
        color: C.neonCyan, fontFamily: "'Inter', sans-serif", fontSize: 80, fontWeight: 900,
        opacity: textOpacity, textShadow: `0 0 20px ${C.neonCyan}`
      }}>
        SKILL UNLOCKED
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M1: GEOMETRY SPAWN RADAR (PREMIUM REVISION)
// ═══════════════════════════════════════════════════════════════════════════════
export const GeometrySpawnRadar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const radarRotation = frame * 2;

  // Generate some enemy spawn points
  const enemies = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      angle: pseudoRandom(i) * Math.PI * 2,
      dist: pseudoRandom(i + 1) * 600 + 200,
      spawnFrame: pseudoRandom(i + 2) * 200 + 10
    }));
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Container with 3D Isometric Tilt */}
      <div style={{ 
        position: "relative", width: 2000, height: 2000, 
        transform: `perspective(1200px) rotateX(60deg) rotateZ(${frame * 0.5}deg)`,
        transformStyle: "preserve-3d"
      }}>
        
        {/* Radar Base Grids */}
        <div style={{ position: "absolute", inset: 0, border: `4px solid ${C.neonCyan}`, borderRadius: "50%", boxShadow: `0 0 100px ${C.neonCyanGlow}, inset 0 0 100px ${C.neonCyanGlow}` }} />
        <div style={{ position: "absolute", inset: 300, border: `2px dashed rgba(0, 255, 255, 0.4)`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 600, border: `2px solid rgba(0, 255, 255, 0.6)`, borderRadius: "50%" }} />
        <div style={{ position: "absolute", inset: 900, border: `2px dashed rgba(0, 255, 255, 0.8)`, borderRadius: "50%" }} />

        {/* Crosshairs */}
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, backgroundColor: "rgba(0, 255, 255, 0.3)" }} />
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, backgroundColor: "rgba(0, 255, 255, 0.3)" }} />
        
        {/* Radar Sweep Cone */}
        <div style={{
          position: "absolute", inset: 0,
          background: `conic-gradient(from 0deg, ${C.neonCyanGlow} 0%, transparent 40%)`,
          borderRadius: "50%",
          transform: `rotate(${radarRotation}deg)`,
        }}>
          <div style={{ position: "absolute", top: 0, bottom: "50%", left: "50%", width: 6, backgroundColor: C.neonCyan, transform: "translateX(-50%)", boxShadow: `0 0 20px ${C.neonCyan}` }} />
        </div>

        {/* Sonar Ping Rings */}
        {Array.from({ length: 3 }).map((_, i) => {
          const localFrame = (frame + i * 40) % 120;
          const scale = ci(localFrame, [0, 120], [0, 1]);
          const opacity = ci(localFrame, [0, 20, 120], [0, 0.8, 0]);
          return (
            <div key={i} style={{
              position: "absolute", top: "50%", left: "50%",
              width: 2000, height: 2000, borderRadius: "50%",
              border: `10px solid ${C.neonCyan}`,
              opacity, transform: `translate(-50%, -50%) scale(${scale})`
            }} />
          );
        })}

        {/* Enemies appearing */}
        {enemies.map((e, i) => {
          const appearScale = spring({ frame: frame - e.spawnFrame, fps, config: SPRING.bouncy, from: 0, to: 1 });
          const x = 1000 + Math.cos(e.angle) * e.dist;
          const y = 1000 + Math.sin(e.angle) * e.dist;
          const isVisible = frame >= e.spawnFrame;

          return isVisible ? (
            <div key={i} style={{
              position: "absolute",
              left: x - 40, top: y - 40,
              width: 80, height: 80, 
              transform: `scale(${appearScale})`,
            }}>
              {/* Target Brackets */}
              <div style={{ position: "absolute", inset: -10, border: `4px solid ${C.neonRed}`, borderRadius: 10, opacity: Math.floor(frame / 5) % 2 === 0 ? 1 : 0.2 }} />
              {/* Dot */}
              <div style={{ width: "100%", height: "100%", backgroundColor: C.neonRed, borderRadius: "50%", boxShadow: `0 0 40px ${C.neonRedGlow}` }} />
            </div>
          ) : null;
        })}

        {/* Center Base Core */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          width: 200, height: 200, transform: "translate(-50%, -50%)",
          backgroundColor: C.neonCyan, borderRadius: "50%",
          boxShadow: `0 0 100px ${C.neonCyanGlow}`
        }} />
      </div>

      {/* Floating UI OVERLAYS (Not affected by 3D tilt) */}
      <div style={{
        position: "absolute", top: 150, left: 150,
        color: C.neonCyan, fontFamily: "'Share Tech Mono', monospace", fontSize: 60,
      }}>
        <div>LAT: 45.991</div>
        <div>LNG: -12.440</div>
        <div style={{ marginTop: 20, width: 300, height: 10, backgroundColor: "rgba(0,255,255,0.2)" }}>
          <div style={{ width: `${(frame % 100)}%`, height: "100%", backgroundColor: C.neonCyan }} />
        </div>
      </div>

      {/* Warning Text */}
      <div style={{
        position: "absolute", bottom: 150,
        backgroundColor: "rgba(255, 0, 0, 0.1)",
        padding: "20px 100px", border: `4px solid ${C.neonRed}`, borderRadius: 20,
        color: C.neonRed, fontFamily: "'Inter', sans-serif", fontSize: 100, fontWeight: 900,
        letterSpacing: "25px", textShadow: `0 0 40px ${C.neonRed}`,
        opacity: frame > 60 && Math.floor(frame / 10) % 2 === 0 ? 1 : 0.5
      }}>
        SPAWN DETECTED
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M1: ENERGY SHIELD BAR
// ═══════════════════════════════════════════════════════════════════════════════
export const EnergyShieldBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: Shield is low/cracked (red, blinking)
  // Phase 2: Shield regenerating (progress bar)
  // Phase 3: Shield full (blue solid)

  const isRegenerating = frame > 30;
  const isFull = frame > 120;

  const progress = ci(frame, [30, 120], [0.2, 1], EaseOutExpo);
  const color = interpolateColors(frame, [100, 120], [C.neonRed, C.neonCyan]);

  const shieldWidth = 1800;
  const currentWidth = progress * shieldWidth;

  const blink = !isRegenerating ? (Math.floor(frame / 10) % 2 === 0 ? 1 : 0.3) : 1;
  const textLabel = isFull ? "SHIELD AT 100%" : (isRegenerating ? "RECHARGING..." : "ARMOR CRITICAL");

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      <div style={{
        color: color, fontFamily: "'Share Tech Mono', monospace",
        fontSize: 80, letterSpacing: "10px", marginBottom: 40,
        textShadow: `0 0 20px ${color}`,
        opacity: blink
      }}>
        {textLabel}
      </div>

      <div style={{
        width: shieldWidth, height: 80,
        border: `4px solid ${color}`,
        padding: 8,
        borderRadius: 40,
        boxShadow: `0 0 40px ${color}60`,
        opacity: blink
      }}>
        <div style={{
          width: currentWidth, height: "100%",
          backgroundColor: color,
          borderRadius: 30,
          boxShadow: `0 0 40px ${color}`,
          transition: "width 0.1s linear"
        }} />
      </div>

      {/* Hexagon Shield Icon */}
      <div style={{
        marginTop: 60, width: 200, height: 200,
        backgroundColor: "transparent",
        border: `10px solid ${color}`,
        clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 50px ${color}80, inset 0 0 50px ${color}80`,
        opacity: blink
      }}>
        {/* Inner solid glow when full */}
        <div style={{
          width: "100%", height: "100%",
          backgroundColor: color,
          opacity: isFull ? 0.3 : 0
        }} />
      </div>
    </AbsoluteFill>
  );
};
