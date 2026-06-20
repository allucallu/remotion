import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { C, ci, EaseOutBack, EaseOutExpo, SPRING, W4K, H4K } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// M2: CLASSIC BREAKING NEWS TICKER
// ═══════════════════════════════════════════════════════════════════════════════
export const BreakingNewsTicker: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Ticker scrolling
  const speed = 10;
  const scrollX = (frame * speed) % 2000; // Reset seamless loop manually

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, justifyContent: "flex-end" }}>
      {/* Red Ticker Bar */}
      <div style={{
        width: "100%", height: 180,
        backgroundColor: C.newsRed,
        display: "flex", alignItems: "center",
        borderTop: "8px solid white", borderBottom: "8px solid white",
        overflow: "hidden", position: "relative"
      }}>
        {/* Seamless scrolling text */}
        <div style={{
          display: "flex", whiteSpace: "nowrap",
          transform: `translateX(${-scrollX}px)`,
        }}>
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} style={{
              color: C.white,
              fontFamily: "'Inter', sans-serif",
              fontSize: 100, fontWeight: 900,
              paddingRight: 60, display: "flex", alignItems: "center"
            }}>
              BREAKING NEWS <span style={{ marginLeft: 60, opacity: 0.5 }}>///</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M2: EMERGENCY ALERT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
export const EmergencyAlertSystem: React.FC = () => {
  const frame = useCurrentFrame();

  // Flashing effect for the text
  const isFlashOn = Math.floor(frame / 15) % 2 === 0;

  // Hazard tape moving
  const tapeMove = (frame * 5) % 100;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, justifyContent: "center" }}>
      <div style={{
        width: "100%", height: 350,
        backgroundColor: C.alertYellow,
        position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 100px rgba(255, 204, 0, 0.4)`
      }}>
        {/* Hazard Stripes */}
        <div style={{
          position: "absolute", inset: 0,
          background: "repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(0,0,0,0.15) 50px, rgba(0,0,0,0.15) 100px)",
          backgroundPosition: `${tapeMove}px 0`
        }} />

        {/* Outer Black Borders */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 20, backgroundColor: C.black }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 20, backgroundColor: C.black }} />

        {/* Text */}
        <div style={{
          color: C.black,
          fontFamily: "'Inter', sans-serif",
          fontSize: 140, fontWeight: 900,
          letterSpacing: "10px",
          opacity: isFlashOn ? 1 : 0.3,
          position: "relative", zIndex: 10,
          textShadow: `0 0 20px ${C.alertYellow}`
        }}>
          ⚠ EMERGENCY ALERT SYSTEM ⚠
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M2: CLASSIFIED / TOP SECRET WIPE
// ═══════════════════════════════════════════════════════════════════════════════
export const TopSecretWipe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stamp impact animation
  const stampScale = spring({ frame, fps, config: SPRING.snappy, from: 3, to: 1, durationInFrames: 10 });
  const stampOpacity = ci(frame, [0, 5], [0, 1]);

  // Screen shake
  const isShaking = frame > 10 && frame < 20;
  const shakeX = isShaking ? (Math.random() * 40 - 20) : 0;
  const shakeY = isShaking ? (Math.random() * 40 - 20) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      <div style={{
        transform: `translate(${shakeX}px, ${shakeY}px) scale(${stampScale}) rotate(-10deg)`,
        opacity: stampOpacity,
        border: `20px solid ${C.newsRed}`,
        padding: "40px 100px",
        borderRadius: 40,
        boxShadow: `0 0 80px ${C.termRedGlow}, inset 0 0 80px ${C.termRedGlow}`
      }}>
        <div style={{
          color: C.newsRed,
          fontFamily: "'Inter', sans-serif",
          fontSize: 250, fontWeight: 900,
          letterSpacing: "20px",
          textShadow: `0 0 40px ${C.newsRed}`
        }}>
          TOP SECRET
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M2: CYBER SECURITY LOCKDOWN
// ═══════════════════════════════════════════════════════════════════════════════
export const CyberLockdown: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Slide down animation
  const slideY = ci(frame, [0, 20], [-400, 0], EaseOutBack);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <div style={{
        transform: `translateY(${slideY}px)`,
        width: "100%", height: 280,
        backgroundColor: C.termRed,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        boxShadow: `0 20px 100px ${C.termRedGlow}`,
        borderBottom: `10px dashed ${C.black}`
      }}>
        <div style={{
          color: C.white,
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 120, fontWeight: "bold",
          letterSpacing: "15px",
          textShadow: `0 0 30px ${C.white}`
        }}>
          SECURITY BREACH DETECTED
        </div>
        <div style={{
          color: C.black,
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: 70, fontWeight: "bold",
          letterSpacing: "5px",
          marginTop: 10,
          backgroundColor: C.alertYellow,
          padding: "5px 40px",
          animation: "blink 1s infinite" // Fallback to keyframes if implemented, or we can use frame math
        }}>
          LOCKDOWN INITIATED
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M2: CRIME SCENE / POLICE LINE
// ═══════════════════════════════════════════════════════════════════════════════
export const CrimeSceneLine: React.FC = () => {
  const frame = useCurrentFrame();
  
  // Ticker scrolling
  const speed = 8;
  const scrollX = (frame * speed) % 1500;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <div style={{
        width: 6000, // Very wide to cover diagonal
        height: 180,
        backgroundColor: C.alertYellow,
        transform: "rotate(-15deg)",
        display: "flex", alignItems: "center",
        borderTop: `6px solid ${C.black}`, borderBottom: `6px solid ${C.black}`,
        boxShadow: "0 20px 80px rgba(255, 204, 0, 0.3)"
      }}>
        {/* Seamless scrolling text */}
        <div style={{
          display: "flex", whiteSpace: "nowrap",
          transform: `translateX(${-scrollX}px)`,
        }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{
              color: C.black,
              fontFamily: "'Inter', sans-serif",
              fontSize: 110, fontWeight: 900,
              paddingRight: 80, display: "flex", alignItems: "center",
              letterSpacing: "5px"
            }}>
              CRIME SCENE <span style={{ marginLeft: 80, fontSize: 80 }}>✖ DO NOT CROSS ✖</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
