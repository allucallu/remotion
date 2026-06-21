import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import { C, ci, getGlow, getGlowClimax, springBouncy, W4K, H4K, CX, CY } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 11: DOPAMINE RESTOCKING BAR
// ═══════════════════════════════════════════════════════════════════════════════
export const DopamineRestockingBar: React.FC = () => {
  const frame = useCurrentFrame();

  // Instant drain at frame 30
  const isDrained = frame >= 30;
  const hpWidth = isDrained ? 0 : 100;

  // Blinking red text after drain
  const isBlink = isDrained && (Math.floor(frame / 10) % 2 === 0);

  // Particles (Squares falling)
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      x: random(`x${i}`) * 2000 - 1000,
      yVel: random(`y${i}`) * 20 + 10,
      size: random(`s${i}`) * 20 + 20,
      rotSpeed: random(`r${i}`) * 10 - 5
    }));
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Title */}
      <div style={{
        fontFamily: "'Rajdhani', sans-serif", fontSize: 100, fontWeight: 700, 
        color: isDrained ? C.red : C.white, letterSpacing: "0.2em", marginBottom: 80,
        opacity: isDrained && !isBlink ? 0.3 : 1, filter: isDrained && isBlink ? getGlowClimax(C.red) : "none"
      }}>
        DOPAMINE LEVEL: {isDrained ? "CRITICAL" : "FULL"}
      </div>

      {/* HP Bar */}
      <div style={{
        position: "relative", width: 2000, height: 100,
        border: `8px solid ${C.white}`, padding: 8,
        transform: "skewX(-15deg)",
        backgroundColor: "rgba(255,255,255,0.1)"
      }}>
        <div style={{
          width: `${hpWidth}%`, height: "100%", backgroundColor: C.lime,
          transition: "width 0.1s linear", filter: getGlow(C.lime)
        }} />

        {/* Particles falling from bar */}
        {isDrained && particles.map((p, i) => {
          const fallFrame = frame - 30;
          const currentY = fallFrame * p.yVel;
          const currentRot = fallFrame * p.rotSpeed;

          return (
            <div key={i} style={{
              position: "absolute", top: 100 + currentY, left: 1000 + p.x,
              width: p.size, height: p.size, backgroundColor: C.lime,
              transform: `rotate(${currentRot}deg)`,
              opacity: ci(fallFrame, [0, 60], [1, 0])
            }} />
          )
        })}
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 12: THE DELUSION reCAPTCHA
// ═══════════════════════════════════════════════════════════════════════════════
export const DelusionRecaptcha: React.FC = () => {
  const frame = useCurrentFrame();

  // Box specs
  const boxW = 800;
  const boxH = 200;

  // Fake cursor logic (Bezier curve movement)
  // Start: bottom right (1400, 1000)
  // End: checkbox center (0, 0 relative to checkbox)
  const t = ci(frame, [10, 50], [0, 1], Easing.bezier(0.4, 0, 0.2, 1));
  
  // Bezier curve points: P0, P1, P2
  const p0 = { x: 1400, y: 1000 };
  const p1 = { x: 800, y: 600 };
  const p2 = { x: CX - 220, y: CY }; // Checkbox center

  const cursorX = Math.pow(1-t, 2)*p0.x + 2*(1-t)*t*p1.x + Math.pow(t, 2)*p2.x;
  const cursorY = Math.pow(1-t, 2)*p0.y + 2*(1-t)*t*p1.y + Math.pow(t, 2)*p2.y;

  const isChecked = frame >= 50;
  const checkScale = isChecked ? springBouncy(frame, 50, 0, 1) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* reCAPTCHA Box */}
      <div style={{
        width: boxW, height: boxH, backgroundColor: "#F9F9F9",
        border: "4px solid #D3D3D3", borderRadius: 10,
        display: "flex", alignItems: "center", padding: "0 40px", gap: 40,
        boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
      }}>
        
        {/* Checkbox */}
        <div style={{
          width: 80, height: 80, backgroundColor: C.white, border: "6px solid #C1C1C1", borderRadius: 8,
          position: "relative"
        }}>
          {/* Green Check */}
          {isChecked && (
            <div style={{
              position: "absolute", left: 10, top: -20,
              fontFamily: "sans-serif", fontSize: 100, color: C.iosGreen, fontWeight: 700,
              transform: `scale(${checkScale})`
            }}>
              ✓
            </div>
          )}
        </div>

        {/* Text */}
        <div style={{ fontFamily: "sans-serif", fontSize: 48, color: "#222222", flex: 1 }}>
          I am not delusional
        </div>

        {/* Logo area */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: C.blue, opacity: 0.2 }} />
          <div style={{ fontFamily: "sans-serif", fontSize: 24, color: "#888888", marginTop: 10 }}>reCAPTCHA</div>
        </div>

      </div>

      {/* Fake Cursor (Mac/Windows arrow) */}
      <div style={{
        position: "absolute", left: cursorX, top: cursorY,
        width: 0, height: 0,
        borderLeft: "20px solid transparent", borderRight: "20px solid transparent",
        borderBottom: `60px solid ${C.black}`,
        transform: "rotate(-30deg) translate(-10px, -20px)",
        filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.5))",
        zIndex: 100
      }}>
        <div style={{ position: "absolute", left: -14, top: 4, width: 0, height: 0, borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderBottom: `44px solid ${C.white}` }} />
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 13: DOWNLOADING SEROTONIN...
// ═══════════════════════════════════════════════════════════════════════════════
export const DownloadingSerotonin: React.FC = () => {
  const frame = useCurrentFrame();

  // Progress logic
  let pct = 0;
  if (frame < 80) {
    pct = ci(frame, [0, 80], [0, 100]);
  } else if (frame >= 80 && frame < 90) {
    pct = 100; // brief pause at 100
  } else {
    pct = 0; // sudden reset
  }

  const winWidth = 1000;
  const winHeight = 300;

  return (
    <AbsoluteFill style={{ backgroundColor: "#008080", alignItems: "center", justifyContent: "center" }}>
      
      {/* Win 95/98 Window */}
      <div style={{
        width: winWidth, height: winHeight,
        backgroundColor: C.win98Grey,
        borderTop: `4px solid ${C.win98Light}`, borderLeft: `4px solid ${C.win98Light}`,
        borderBottom: `4px solid ${C.win98Dark}`, borderRight: `4px solid ${C.win98Dark}`,
        display: "flex", flexDirection: "column"
      }}>
        {/* Title Bar */}
        <div style={{ height: 60, backgroundColor: "#000080", display: "flex", alignItems: "center", padding: "0 20px" }}>
          <span style={{ fontFamily: "monospace", fontSize: 24, color: C.white }}>Download Manager</span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "30px", display: "flex", flexDirection: "column", gap: 20 }}>
          
          <div style={{ fontFamily: "monospace", fontSize: 28, color: C.black }}>
            DOWNLOADING SEROTONIN...
          </div>

          {/* Progress Bar Container */}
          <div style={{
            height: 40, width: "100%",
            borderTop: `4px solid ${C.win98Dark}`, borderLeft: `4px solid ${C.win98Dark}`,
            borderBottom: `4px solid ${C.win98Light}`, borderRight: `4px solid ${C.win98Light}`,
            backgroundColor: C.white, padding: 4
          }}>
            <div style={{ width: `${pct}%`, height: "100%", backgroundColor: "#000080" }} />
          </div>

          <div style={{ fontFamily: "monospace", fontSize: 24, color: C.black }}>
            ESTIMATED TIME: {pct === 100 ? "COMPLETE" : "NEVER"}
          </div>

        </div>
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 14: ARE YOU STILL DOOMSCROLLING?
// ═══════════════════════════════════════════════════════════════════════════════
export const AreYouStillDoomscrolling: React.FC = () => {
  const frame = useCurrentFrame();

  // Focus breathing on the button
  const pulse = 1 + Math.sin(frame * 0.1) * 0.05;

  return (
    <AbsoluteFill style={{ 
      backgroundColor: C.black, alignItems: "center", justifyContent: "center",
      background: "radial-gradient(circle at center, #333333 0%, #000000 80%)"
    }}>
      
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 80 }}>
        
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 100, fontWeight: 700, color: C.white, letterSpacing: "0.05em" }}>
          ARE YOU STILL DOOMSCROLLING?
        </div>

        <div style={{ display: "flex", gap: 60 }}>
          
          <div style={{
            padding: "30px 80px", border: `4px solid ${C.white}`, borderRadius: 10,
            fontFamily: "'Share Tech Mono', monospace", fontSize: 64, color: C.white,
            backgroundColor: "transparent", opacity: 0.6
          }}>
            YES
          </div>
          
          <div style={{
            padding: "30px 80px", border: `4px solid ${C.white}`, borderRadius: 10,
            fontFamily: "'Share Tech Mono', monospace", fontSize: 64, color: C.black,
            backgroundColor: C.white,
            transform: `scale(${pulse})`,
            boxShadow: `0 0 40px ${C.white}`
          }}>
            OF COURSE
          </div>

        </div>

      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 15: ATTENTION SPAN CHECKPOINT
// ═══════════════════════════════════════════════════════════════════════════════
export const AttentionSpanCheckpoint: React.FC = () => {
  const frame = useCurrentFrame();

  // Scanner moves left to right
  const scanX = ci(frame, [0, 60], [-W4K/2, W4K/2], Easing.linear);

  // Text appears exactly when scanner passes the center
  const isPassed = frame >= 30;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,255,255,0.1) 2px, transparent 2px), linear-gradient(90deg, rgba(0,255,255,0.1) 2px, transparent 2px)",
        backgroundSize: "100px 100px",
        backgroundPosition: "center center"
      }} />

      {/* Main Text */}
      <div style={{
        fontFamily: "'Share Tech Mono', monospace", fontSize: 120, fontWeight: 700, color: C.cyan, letterSpacing: "0.1em",
        opacity: isPassed ? 1 : 0.2, filter: isPassed ? getGlow(C.cyan) : "none"
      }}>
        ATTENTION SPAN CHECKPOINT PASSED
      </div>

      {/* Neon Scanner Line */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, width: 200, left: CX + scanX - 100,
        background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`,
        mixBlendMode: "overlay", // Aggressive blend
        filter: "blur(20px)"
      }} />
      <div style={{
        position: "absolute", top: 0, bottom: 0, width: 10, left: CX + scanX - 5,
        backgroundColor: C.white, filter: getGlowClimax(C.cyan)
      }} />

    </AbsoluteFill>
  );
};
