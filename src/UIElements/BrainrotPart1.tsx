import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import { C, ci, getGlow, getGlowClimax, springBouncy, W4K, H4K, CX, CY } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 01: THE 404 WILL TO LIVE
// ═══════════════════════════════════════════════════════════════════════════════
export const WillToLive404: React.FC = () => {
  const frame = useCurrentFrame();

  // Glassmorphism Window Pop-up
  const popScale = springBouncy(frame, 15, 0, 1);
  const winWidth = 1600;
  const winHeight = 900;

  // Dino blink
  const isBlink = Math.floor(frame / 60) % 2 === 0 && frame % 60 < 5;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Background ambient light */}
      <div style={{ position: "absolute", width: 1000, height: 1000, borderRadius: "50%", backgroundColor: `${C.cyan}1A`, filter: "blur(200px)" }} />

      <div style={{
        width: winWidth, height: winHeight,
        background: C.transparentGlass,
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        border: `2px solid ${C.borderGlass}`,
        borderRadius: 40,
        boxShadow: "0 40px 100px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.2)",
        transform: `scale(${popScale})`,
        display: "flex", flexDirection: "column",
        overflow: "hidden"
      }}>
        
        {/* Browser Header */}
        <div style={{ height: 80, borderBottom: `2px solid ${C.borderGlass}`, display: "flex", alignItems: "center", padding: "0 40px", gap: 20 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: C.red }} />
          <div style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: C.gold }} />
          <div style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: C.lime }} />
          <div style={{ flex: 1, marginLeft: 40, height: 40, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 20, display: "flex", alignItems: "center", paddingLeft: 30 }}>
            <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 24, color: C.textDim, textTransform: "lowercase" }}>https://reality.sys/life-purpose</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 60 }}>
          
          {/* Dino Vector (Simple blocks to look 3D-ish) */}
          <div style={{ position: "relative", width: 200, height: 200, filter: "drop-shadow(0 20px 20px rgba(0,0,0,0.5))" }}>
            {/* Body */}
            <div style={{ position: "absolute", bottom: 0, left: 60, width: 80, height: 120, backgroundColor: C.textDim, borderRadius: 10 }} />
            {/* Head */}
            <div style={{ position: "absolute", top: 20, right: 0, width: 100, height: 80, backgroundColor: C.textDim, borderRadius: 10 }} />
            {/* Eye */}
            <div style={{ position: "absolute", top: 30, right: 30, width: 16, height: 16, backgroundColor: isBlink ? C.textDim : C.black }} />
            {/* Arm */}
            <div style={{ position: "absolute", top: 100, right: 40, width: 40, height: 16, backgroundColor: C.textDim }} />
            {/* Legs */}
            <div style={{ position: "absolute", bottom: -20, left: 70, width: 16, height: 40, backgroundColor: C.textDim }} />
            <div style={{ position: "absolute", bottom: -20, left: 110, width: 16, height: 40, backgroundColor: C.textDim }} />
          </div>

          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 80, fontWeight: 700, color: C.white, textAlign: "center", letterSpacing: "0.1em" }}>
            ERROR 404
          </div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 56, color: C.textDim, textAlign: "center", letterSpacing: "0.2em", maxWidth: "80%" }}>
            WILL TO LIVE NOT FOUND
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 02: BRAIN.EXE IS NOT RESPONDING
// ═══════════════════════════════════════════════════════════════════════════════
export const BrainExeError: React.FC = () => {
  const frame = useCurrentFrame();

  const winWidth = 1000;
  const winHeight = 360;

  // Glitch logic: spawn recursive copies after frame 40
  const isGlitch = frame >= 40;
  // Calculate how many copies to show (grows over time)
  const copies = isGlitch ? Math.min(60, Math.floor((frame - 40) * 1.5)) : 0;

  // Single dialog box renderer
  const renderDialog = (key: number, xOff: number, yOff: number, isTop: boolean) => (
    <div key={key} style={{
      position: "absolute", left: CX - winWidth / 2 + xOff, top: CY - winHeight / 2 + yOff,
      width: winWidth, height: winHeight,
      backgroundColor: C.winGrey,
      borderTop: `4px solid ${C.white}`, borderLeft: `4px solid ${C.white}`,
      borderBottom: `4px solid #808080`, borderRight: `4px solid #808080`,
      boxShadow: "10px 10px 0 rgba(0,0,0,0.5)",
      display: "flex", flexDirection: "column",
      zIndex: key
    }}>
      {/* Title Bar */}
      <div style={{ height: 60, backgroundColor: C.xpBlue, display: "flex", alignItems: "center", padding: "0 20px" }}>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 32, color: C.white, textTransform: "none" }}>Brain.exe</span>
      </div>
      {/* Content */}
      <div style={{ flex: 1, padding: "40px", display: "flex", alignItems: "center", gap: 40 }}>
        {/* Error Icon (Red X circle) */}
        <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: C.red, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 60, color: C.white, fontWeight: 700 }}>X</div>
        </div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 36, color: C.black, fontWeight: 500, lineHeight: 1.4 }}>
          Brain.exe is not responding.<br/>Wait or Force Quit Reality?
        </div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#008080", alignItems: "center", justifyContent: "center" }}>
      {/* Windows 95/98 Teal background */}
      
      {/* Recursive shadow trail */}
      {Array.from({ length: copies }).map((_, i) => {
        // Parametric path for the dragged windows
        const t = (copies - i) * 0.1; 
        const xOff = Math.sin(t * 1.5) * 600 * (t / 6);
        const yOff = Math.cos(t * 2.0) * 400 * (t / 6);
        return renderDialog(i, xOff, yOff, false);
      })}

      {/* Main active window */}
      {frame >= 10 && renderDialog(100, 0, 0, true)}

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 03: OVERTHINKING BUFFER
// ═══════════════════════════════════════════════════════════════════════════════
export const OverthinkingBuffer: React.FC = () => {
  const frame = useCurrentFrame();

  // Frustrating rotation calculation
  // Base rotation is normal, but we add sporadic spikes and pauses
  let totalRotation = 0;
  for (let i = 0; i < frame; i++) {
    const cycle = i % 150;
    let speed = 4; // base speed
    if (cycle > 30 && cycle < 60) speed = 0.5; // stuck
    if (cycle > 60 && cycle < 70) speed = 25; // panic fast
    if (cycle > 120 && cycle < 130) speed = -10; // backwards?
    totalRotation += speed;
  }

  // Generate 12 petals for spinner
  const petals = [];
  for (let i = 0; i < 12; i++) {
    const angle = i * 30;
    const opacity = ci(i, [0, 11], [1, 0.2]); // Gradient opacity
    petals.push(
      <div key={i} style={{
        position: "absolute", left: "50%", top: "50%",
        width: 30, height: 100, backgroundColor: C.textPrimary,
        borderRadius: 15,
        transformOrigin: "center 180px", // rotate around a point 180px down
        transform: `translate(-50%, -180px) rotate(${angle}deg)`,
        opacity
      }} />
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      {/* Spinner */}
      <div style={{ position: "relative", width: 400, height: 400, transform: `rotate(${totalRotation}deg)` }}>
        {petals}
      </div>

      <div style={{
        position: "absolute", top: CY + 300,
        display: "flex", flexDirection: "column", alignItems: "center"
      }}>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 64, color: C.white, letterSpacing: "0.2em", opacity: ci(frame % 30, [0, 15, 30], [0.6, 1, 0.6]) }}>
          OVERTHINKING... PLEASE WAIT
        </div>
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 40, color: C.textDim, letterSpacing: "0.2em", marginTop: 30 }}>
          (EST. TIME: FOREVER)
        </div>
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 04: SOCIAL BATTERY WARNING
// ═══════════════════════════════════════════════════════════════════════════════
export const SocialBatteryWarning: React.FC = () => {
  const frame = useCurrentFrame();

  // Pop-up bounce
  const scale = springBouncy(frame, 10, 0, 1);
  
  // Throbbing glow for 1% battery
  const pulse = 1 + Math.abs(Math.sin(frame * 0.1)) * 0.2;

  return (
    <AbsoluteFill style={{ backgroundColor: "rgba(0,0,0,0.8)", alignItems: "center", justifyContent: "center" }}>
      
      {/* Main Alert Box (iOS style) */}
      <div style={{
        width: 1200, backgroundColor: "rgba(30, 30, 30, 0.85)",
        backdropFilter: "blur(40px)", borderRadius: 60,
        display: "flex", flexDirection: "column", alignItems: "center",
        transform: `scale(${scale})`,
        border: "2px solid rgba(255,255,255,0.1)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.8)"
      }}>
        
        {/* Content Area */}
        <div style={{ padding: "80px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          
          {/* Battery Icon (SVG) */}
          <div style={{ position: "relative", width: 280, height: 120, marginBottom: 60, transform: `scale(${pulse})` }}>
            {/* Battery Body */}
            <div style={{
              position: "absolute", left: 0, top: 0, width: 260, height: 120,
              border: `10px solid ${C.textDim}`, borderRadius: 20
            }} />
            {/* Battery Nub */}
            <div style={{
              position: "absolute", right: 0, top: 35, width: 20, height: 50,
              backgroundColor: C.textDim, borderRadius: "0 10px 10px 0"
            }} />
            {/* 1% Fill */}
            <div style={{
              position: "absolute", left: 15, top: 15, width: 30, height: 90,
              backgroundColor: C.iosRed, borderRadius: 8,
              filter: getGlow(C.iosRed)
            }} />
          </div>

          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 60, fontWeight: 700, color: C.white, letterSpacing: "0.05em", textAlign: "center" }}>
            SOCIAL BATTERY: 1% REMAINING.
          </div>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 40, color: C.textDim, letterSpacing: "0.1em", marginTop: 40, textAlign: "center" }}>
            IMMEDIATE ISOLATION REQUIRED.
          </div>
        </div>

        {/* Button Area */}
        <div style={{
          width: "100%", height: 120, borderTop: "2px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: C.iosRed, fontFamily: "'Rajdhani', sans-serif", fontSize: 50, fontWeight: 600, letterSpacing: "0.1em"
        }}>
          DISCONNECT
        </div>

      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 05: WINDOWS XP BLUE SCREEN OF BURNOUT
// ═══════════════════════════════════════════════════════════════════════════════
export const BlueScreenOfBurnout: React.FC = () => {
  const frame = useCurrentFrame();

  const isDistorted = frame > 60 && frame < 80;
  
  // Use SVG filter for CRT distortion and noise
  return (
    <AbsoluteFill style={{ backgroundColor: "#0000AA", padding: "120px", display: "flex", flexDirection: "column" }}>
      
      {/* SVG Filters */}
      <svg width="0" height="0">
        <filter id="crt-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" in="noise" result="coloredNoise" />
          <feComposite operator="in" in="SourceGraphic" in2="coloredNoise" result="composite" />
          <feBlend mode="screen" in="composite" in2="SourceGraphic" />
        </filter>
        <filter id="glitch">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.9" numOctaves="1" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="100" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div style={{
        flex: 1,
        filter: isDistorted ? "url(#glitch) url(#crt-noise)" : "none",
        transform: isDistorted ? `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)` : "none"
      }}>
        
        {/* White Error Box */}
        <div style={{ backgroundColor: C.white, color: "#0000AA", display: "inline-block", padding: "10px 40px", fontFamily: "monospace", fontSize: 48, fontWeight: 700, marginBottom: 80 }}>
          Windows
        </div>

        <div style={{ fontFamily: "monospace", fontSize: 64, color: C.white, lineHeight: 1.5, textTransform: "none", whiteSpace: "pre-wrap" }}>
          A fatal exception 0E has occurred at 0028:C0011E36 in VxD VMM(01) + <br/>
          00010E36. The current task will be terminated.<br/><br/>
          * Press CTRL+ALT+DEL to restart your brain.<br/>
          * You will lose any unsaved memories from the last 24 hours.<br/><br/>
          <span style={{ color: C.gold, fontSize: 80 }}>FATAL SYSTEM CRASH: SEVERE BURNOUT DETECTED.</span><br/><br/>
          GO TO SLEEP.
        </div>

        <div style={{ fontFamily: "monospace", fontSize: 48, color: C.white, marginTop: 120, opacity: ci(frame % 60, [0, 30, 60], [1, 0, 1]) }}>
          Press any key to continue _
        </div>

      </div>

      {/* CRT Scanline Overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(0,0,0,0.1) 4px, rgba(0,0,0,0.1) 8px)",
        pointerEvents: "none"
      }} />

    </AbsoluteFill>
  );
};
