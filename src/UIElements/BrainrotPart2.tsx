import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Easing, interpolate, spring } from "remotion";
import { C, ci, getGlow, springPop, springBouncy, W4K, H4K, CX, CY } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 06: SLOW LIVING PROTOCOL ENGAGED
// ═══════════════════════════════════════════════════════════════════════════════
export const SlowLivingProtocol: React.FC = () => {
  const frame = useCurrentFrame();

  // Smooth switch animation over 1 second (30 frames)
  // Starts at frame 20
  const toggleProgress = ci(frame - 20, [0, 30], [0, 1], Easing.inOut(Easing.ease));

  // Switch Dimensions
  const sWidth = 600;
  const sHeight = 320;
  const knobSize = 280;
  const padding = 20;

  // Knob X movement
  const knobStart = padding;
  const knobEnd = sWidth - knobSize - padding;
  const currentKnobX = knobStart + toggleProgress * (knobEnd - knobStart);

  // Colors
  // Off: #EBEBEB, On: #34C759
  // Background transition: black -> dark green tint
  return (
    <AbsoluteFill style={{ 
      backgroundColor: toggleProgress > 0 ? `rgba(52, 199, 89, ${toggleProgress * 0.15})` : C.black,
      alignItems: "center", justifyContent: "center",
      transition: "background-color 0.1s"
    }}>
      
      {/* Switch Track */}
      <div style={{
        position: "relative", width: sWidth, height: sHeight, borderRadius: sHeight / 2,
        backgroundColor: toggleProgress > 0.5 ? C.iosGreen : C.macGrey,
        transition: "background-color 0.2s ease-in-out",
        boxShadow: "inset 0 10px 20px rgba(0,0,0,0.2)"
      }}>
        {/* Switch Knob */}
        <div style={{
          position: "absolute", left: currentKnobX, top: padding,
          width: knobSize, height: knobSize, borderRadius: "50%",
          backgroundColor: C.white,
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }} />
      </div>

      <div style={{
        position: "absolute", top: CY + 300,
        fontFamily: "'Rajdhani', sans-serif", fontSize: 80, fontWeight: 700, color: C.white, letterSpacing: "0.2em",
        opacity: ci(frame, [0, 20], [0, 1])
      }}>
        SLOW LIVING MODE: <span style={{ color: toggleProgress > 0.5 ? C.iosGreen : C.textDim }}>{toggleProgress > 0.5 ? "ON" : "OFF"}</span>
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 07: MEETING TO EMAIL CONVERTER
// ═══════════════════════════════════════════════════════════════════════════════
export const MeetingToEmailConverter: React.FC = () => {
  const frame = useCurrentFrame();

  const winWidth = 1200;
  const winHeight = 400;

  // Frustrating progress logic
  let pct = 0;
  if (frame < 30) pct = ci(frame, [0, 30], [0, 80]); // fast to 80%
  else if (frame < 60) pct = 80; // stuck
  else if (frame < 90) pct = ci(frame, [60, 90], [80, 98]); // fast to 98%
  else {
    // bounce between 98, 99
    const bounce = Math.sin(frame * 0.5);
    pct = 98.5 + bounce * 0.5;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#008080", alignItems: "center", justifyContent: "center" }}>
      
      {/* Windows 98 Dialog Box */}
      <div style={{
        width: winWidth, height: winHeight,
        backgroundColor: C.win98Grey,
        borderTop: `4px solid ${C.win98Light}`, borderLeft: `4px solid ${C.win98Light}`,
        borderBottom: `4px solid ${C.win98Dark}`, borderRight: `4px solid ${C.win98Dark}`,
        display: "flex", flexDirection: "column"
      }}>
        {/* Title Bar */}
        <div style={{ height: 60, backgroundColor: "#000080", display: "flex", alignItems: "center", padding: "0 20px" }}>
          <span style={{ fontFamily: "monospace", fontSize: 24, color: C.white, textTransform: "none" }}>Installation Progress</span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "40px", display: "flex", flexDirection: "column", gap: 40 }}>
          
          <div style={{ fontFamily: "monospace", fontSize: 32, color: C.black, textTransform: "none" }}>
            CONVERTING THIS MEETING INTO AN EMAIL...
          </div>

          {/* Progress Bar Container */}
          <div style={{
            height: 60, width: "100%",
            borderTop: `4px solid ${C.win98Dark}`, borderLeft: `4px solid ${C.win98Dark}`,
            borderBottom: `4px solid ${C.win98Light}`, borderRight: `4px solid ${C.win98Light}`,
            backgroundColor: C.white, padding: 4
          }}>
            {/* Progress Fill (segmented look) */}
            <div style={{
              width: `${pct}%`, height: "100%", backgroundColor: "#000080",
              backgroundImage: "linear-gradient(90deg, #000080 0%, #000080 80%, #0000ff 80%, #0000ff 100%)",
              backgroundSize: "20px 100%"
            }} />
          </div>

          <div style={{ fontFamily: "monospace", fontSize: 24, color: C.black, textAlign: "right", marginTop: -20 }}>
            {pct.toFixed(0)}%
          </div>

        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 08: HUSTLE MODE FAILED
// ═══════════════════════════════════════════════════════════════════════════════
export const HustleModeFailed: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stamp hits at frame 20
  const hitFrame = 20;
  const isHit = frame >= hitFrame;

  // Stamp scale: massive to 1
  const stampScale = isHit ? 1 : ci(frame, [0, hitFrame], [10, 1], Easing.easeIn);
  const stampOpacity = isHit ? 0.8 : ci(frame, [0, hitFrame], [0, 0.8], Easing.easeIn);

  // Camera shake after hit (frames 20-30)
  const shakeX = frame >= hitFrame && frame < hitFrame + 10 ? (Math.random() - 0.5) * 80 : 0;
  const shakeY = frame >= hitFrame && frame < hitFrame + 10 ? (Math.random() - 0.5) * 80 : 0;

  // Fade in subtitle
  const subtitleOpacity = isHit ? ci(frame - hitFrame, [10, 30], [0, 1]) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center", transform: `translate(${shakeX}px, ${shakeY}px)` }}>
      
      {/* Background Document (faded) */}
      <div style={{ position: "absolute", width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 40, padding: 200, opacity: 0.2 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} style={{ width: i % 3 === 0 ? "80%" : "100%", height: 30, backgroundColor: C.white, borderRadius: 15 }} />
        ))}
      </div>

      {/* STAMP */}
      <div style={{
        position: "absolute",
        transform: `scale(${stampScale}) rotate(-15deg)`,
        opacity: stampOpacity,
        border: `30px solid ${C.red}`, borderRadius: 40, padding: "40px 80px",
        color: C.red, fontFamily: "'Share Tech Mono', monospace", fontSize: 200, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.1em",
        filter: "drop-shadow(0 20px 30px rgba(255,59,48,0.5))"
      }}>
        FAILED
      </div>

      {/* Subtitle */}
      <div style={{
        position: "absolute", bottom: 400,
        backgroundColor: C.black, padding: "20px 60px", border: `4px solid ${C.white}`,
        fontFamily: "'Rajdhani', sans-serif", fontSize: 80, fontWeight: 600, color: C.white, letterSpacing: "0.2em",
        opacity: subtitleOpacity
      }}>
        HUSTLE MODE DISABLED: TOUCHING GRASS INITIATED
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 09: COPING MECHANISM UPDATE
// ═══════════════════════════════════════════════════════════════════════════════
export const CopingMechanismUpdate: React.FC = () => {
  const frame = useCurrentFrame();

  // Slow fade in
  const opacity = ci(frame, [0, 60], [0, 1], Easing.easeOut);
  
  // Abstract spinner
  const rotation = frame * 1.5;
  const innerRotation = -frame * 2.5;

  return (
    <AbsoluteFill style={{ 
      backgroundColor: C.black, alignItems: "center", justifyContent: "center",
      background: "radial-gradient(circle at center, #1A1A1A 0%, #000000 70%)"
    }}>
      
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity }}>
        
        {/* Abstract Spinner */}
        <div style={{ position: "relative", width: 400, height: 400, marginBottom: 120 }}>
          <svg width="400" height="400" style={{ position: "absolute", inset: 0, transform: `rotate(${rotation}deg)` }}>
            <circle cx="200" cy="200" r="180" fill="none" stroke={`${C.white}4D`} strokeWidth="8" strokeDasharray="150 50" strokeLinecap="round" />
          </svg>
          <svg width="400" height="400" style={{ position: "absolute", inset: 0, transform: `rotate(${innerRotation}deg)` }}>
            <circle cx="200" cy="200" r="120" fill="none" stroke={`${C.white}80`} strokeWidth="12" strokeDasharray="80 120" strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", left: 180, top: 180, width: 40, height: 40, borderRadius: "50%", backgroundColor: C.white, filter: getGlow(C.white) }} />
        </div>

        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 64, color: C.white, letterSpacing: "0.2em", fontWeight: 500 }}>
          INSTALLING NEW COPING MECHANISM...
        </div>
        
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 40, color: C.textDim, letterSpacing: "0.4em", marginTop: 40 }}>
          DO NOT REBOOT REALITY.
        </div>

        <div style={{ width: 800, height: 4, backgroundColor: `${C.white}1A`, marginTop: 80, borderRadius: 2 }}>
          <div style={{ width: `${(frame / 300) * 100}%`, height: "100%", backgroundColor: C.white, borderRadius: 2 }} />
        </div>

      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 10: ACHIEVEMENT UNLOCKED (BARE MINIMUM)
// ═══════════════════════════════════════════════════════════════════════════════
export const BareMinimumAchievement: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide up from bottom
  const popY = springBouncy(frame, 20, 400, 0);
  
  // Light sweep animation (from left to right)
  const sweepPos = ci(frame - 40, [0, 40], [-100, 200], Easing.easeOut); // Percentage

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "flex-end", paddingBottom: 200 }}>
      
      {/* Achievement Box */}
      <div style={{
        position: "relative",
        width: 1400, height: 240,
        backgroundColor: "#111111",
        border: "4px solid #444444", borderRadius: 120,
        display: "flex", alignItems: "center", padding: "0 60px", gap: 60,
        transform: `translateY(${popY}px)`,
        boxShadow: "0 40px 80px rgba(0,0,0,0.8)",
        overflow: "hidden"
      }}>
        
        {/* Light Sweep */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(90deg, transparent ${sweepPos - 10}%, rgba(255,255,255,0.4) ${sweepPos}%, transparent ${sweepPos + 10}%)`,
          pointerEvents: "none"
        }} />

        {/* Trophy Icon */}
        <div style={{
          width: 120, height: 120, borderRadius: "50%", backgroundColor: "#333333",
          border: `6px solid ${C.white}`, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 60, color: C.white, fontWeight: 700 }}>🏆</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 40, color: C.textDim, letterSpacing: "0.2em" }}>
            ACHIEVEMENT UNLOCKED — 10G
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 56, color: C.white, fontWeight: 700, letterSpacing: "0.05em" }}>
            SURVIVED THE DAY DOING THE BARE MINIMUM
          </div>
        </div>

      </div>

    </AbsoluteFill>
  );
};
