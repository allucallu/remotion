import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import { C, ci, getGlow, getGlowClimax, W4K, H4K, CX, CY } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 16: SENDING THOUGHTS & PRAYERS
// ═══════════════════════════════════════════════════════════════════════════════
export const ThoughtsAndPrayers: React.FC = () => {
  const frame = useCurrentFrame();

  const winWidth = 1000;
  const winHeight = 400;

  // Paper animation: 1 paper moves from left folder to right folder every 15 frames
  // The paper will rotate in 3D during transit
  const paperTransit = (frame % 30) / 30; // 0 to 1 over 30 frames
  const paperX = ci(paperTransit, [0, 1], [-200, 200]); // relative to center
  const paperY = ci(paperTransit, [0, 0.5, 1], [0, -100, 0], Easing.easeOut); // arc jump
  const paperRotX = paperTransit * 720;
  const paperRotY = paperTransit * 360;

  return (
    <AbsoluteFill style={{ backgroundColor: "#008080", alignItems: "center", justifyContent: "center" }}>
      
      {/* Windows 95/98 Window */}
      <div style={{
        width: winWidth, height: winHeight,
        backgroundColor: C.win98Grey,
        borderTop: `4px solid ${C.win98Light}`, borderLeft: `4px solid ${C.win98Light}`,
        borderBottom: `4px solid ${C.win98Dark}`, borderRight: `4px solid ${C.win98Dark}`,
        display: "flex", flexDirection: "column"
      }}>
        {/* Title Bar */}
        <div style={{ height: 60, backgroundColor: "#000080", display: "flex", alignItems: "center", padding: "0 20px" }}>
          <span style={{ fontFamily: "monospace", fontSize: 24, color: C.white }}>Copying...</span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "30px", display: "flex", flexDirection: "column", gap: 20 }}>
          
          <div style={{ fontFamily: "monospace", fontSize: 28, color: C.black }}>
            SENDING THOUGHTS & PRAYERS...
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            
            {/* Left Folder */}
            <div style={{ position: "absolute", left: 100, fontSize: 100 }}>📁</div>
            
            {/* Flying Paper */}
            <div style={{
              position: "absolute", left: CX - (W4K/2 - winWidth/2) - 50 + paperX, top: 40 + paperY,
              width: 40, height: 60, backgroundColor: C.white, border: "2px solid black",
              transform: `rotateX(${paperRotX}deg) rotateY(${paperRotY}deg)`,
              transformStyle: "preserve-3d"
            }}>
              <div style={{ width: "60%", height: 2, backgroundColor: "black", margin: "10px auto" }} />
              <div style={{ width: "80%", height: 2, backgroundColor: "black", margin: "10px auto" }} />
              <div style={{ width: "40%", height: 2, backgroundColor: "black", margin: "10px auto" }} />
            </div>

            {/* Right Folder */}
            <div style={{ position: "absolute", right: 100, fontSize: 100 }}>📂</div>

          </div>

          <div style={{ fontFamily: "monospace", fontSize: 24, color: C.black }}>
            TRANSFER RATE: 0 Bytes/sec
          </div>

        </div>
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 17: TERMS OF ENDLESS ANXIETY
// ═══════════════════════════════════════════════════════════════════════════════
export const TermsOfAnxiety: React.FC = () => {
  const frame = useCurrentFrame();

  const winWidth = 1200;
  const winHeight = 800;

  // Extremely fast scrolling
  // Over 60 frames, scroll by thousands of pixels
  const scrollY = ci(frame, [0, 60], [0, -4000], Easing.easeIn);

  const blurAmt = frame > 10 && frame < 55 ? 10 : 0; // motion blur when fast

  // Fake text lines
  const lines = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => "You agree to overthink every minor interaction you had today. You will lie awake at 3 AM remembering that one embarrassing thing you did 7 years ago. By accepting these terms, you surrender your peace of mind.");
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      <div style={{
        width: winWidth, height: winHeight, backgroundColor: C.macGrey, borderRadius: 20,
        display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
        
        {/* Header */}
        <div style={{ height: 80, backgroundColor: "#DDDDDD", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "2px solid #CCCCCC" }}>
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 32, fontWeight: 700, color: C.black }}>End User License Agreement</span>
        </div>

        {/* Scroll Area */}
        <div style={{ flex: 1, padding: 40, overflow: "hidden", position: "relative" }}>
          <div style={{
            transform: `translateY(${scrollY}px)`,
            filter: `blur(${blurAmt}px)`,
            display: "flex", flexDirection: "column", gap: 20
          }}>
            {lines.map((text, i) => (
              <div key={i} style={{ fontFamily: "sans-serif", fontSize: 24, color: "#444444", lineHeight: 1.5 }}>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ height: 120, borderTop: "2px solid #CCCCCC", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
          <div style={{ fontFamily: "sans-serif", fontSize: 28, color: C.black }}>
            DO YOU ACCEPT ENDLESS ANXIETY?
          </div>
          <div style={{ padding: "15px 40px", backgroundColor: C.blue, color: C.white, borderRadius: 10, fontFamily: "sans-serif", fontSize: 24, fontWeight: 700 }}>
            I ACCEPT
          </div>
        </div>

      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 18: DELUSION RADAR PING
// ═══════════════════════════════════════════════════════════════════════════════
export const DelusionRadarPing: React.FC = () => {
  const frame = useCurrentFrame();

  const radius = 600;
  const radarRotation = frame * 3; // Sweep speed

  // Target lock at center
  const isLock = frame >= 60;
  
  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      
      <div style={{ position: "relative", width: radius*2, height: radius*2 }}>
        
        {/* Wireframe grids */}
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            position: "absolute", inset: (4 - i) * (radius/4),
            border: `2px solid ${C.lime}4D`, borderRadius: "50%"
          }} />
        ))}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, backgroundColor: `${C.lime}4D`, transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, backgroundColor: `${C.lime}4D`, transform: "translateY(-50%)" }} />

        {/* Sweep */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: `conic-gradient(from 0deg, ${C.lime}80 0%, transparent 40%)`,
          transform: `rotate(${radarRotation}deg)`,
          filter: getGlow(C.lime)
        }} />

        {/* Target */}
        {isLock && (
          <div style={{
            position: "absolute", left: radius, top: radius, transform: "translate(-50%, -50%)",
            width: 40, height: 40, borderRadius: "50%", backgroundColor: C.red,
            filter: getGlowClimax(C.red)
          }}>
            <div style={{ position: "absolute", inset: -40, border: `4px solid ${C.red}`, borderRadius: "50%" }} />
            <div style={{ position: "absolute", inset: -80, border: `2px solid ${C.red}`, borderRadius: "50%" }} />
          </div>
        )}
      </div>

      <div style={{
        position: "absolute", top: CY + radius + 100,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 80, fontWeight: 700, color: C.red, letterSpacing: "0.2em",
        opacity: isLock ? 1 : 0, filter: getGlow(C.red)
      }}>
        DELUSION DETECTED IN YOUR EXACT LOCATION
      </div>

    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ITEM 19: UNSUBSCRIBE FROM ADULTHOOD
// ═══════════════════════════════════════════════════════════════════════════════
export const UnsubscribeAdulthood: React.FC = () => {
  const frame = useCurrentFrame();

  const winWidth = 1000;
  const winHeight = 500;

  // Fake Cursor Movement
  // Cursor tries to reach the button center, but the button moves away
  const cursorX = ci(frame, [0, 80], [W4K, CX]);
  const cursorY = ci(frame, [0, 80], [H4K, CY + 80]); // Approaching button area

  // Button Avoidance Math
  // Initial button position relative to window center
  const btnBaseX = 0;
  const btnBaseY = 80;

  // If cursor distance to button < 200px, push button away
  // Cursor pos relative to window center
  const relCX = cursorX - CX;
  const relCY = cursorY - CY;

  // Let's create a deterministic fake random movement for the button based on frame
  let escapeX = 0;
  let escapeY = 0;
  if (frame > 50) {
    escapeX = Math.sin(frame * 0.5) * 300;
    escapeY = Math.cos(frame * 0.4) * 200;
  }

  const btnX = btnBaseX + escapeX;
  const btnY = btnBaseY + escapeY;

  return (
    <AbsoluteFill style={{ backgroundColor: "#F0F2F5", alignItems: "center", justifyContent: "center" }}>
      
      {/* Modern Modal */}
      <div style={{
        position: "relative",
        width: winWidth, height: winHeight, backgroundColor: C.white,
        borderRadius: 40, boxShadow: "0 40px 100px rgba(0,0,0,0.1)",
        display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 80,
        overflow: "hidden"
      }}>
        
        <div style={{ fontFamily: "sans-serif", fontSize: 60, fontWeight: 700, color: "#111", marginBottom: 20 }}>
          Warning
        </div>
        <div style={{ fontFamily: "sans-serif", fontSize: 40, color: "#666" }}>
          Unsubscribe from Adulthood?
        </div>

        {/* Avoiding Button */}
        <div style={{
          position: "absolute", left: winWidth/2 + btnX, top: winHeight/2 + btnY,
          transform: "translate(-50%, -50%)",
          padding: "20px 60px", backgroundColor: C.red, color: C.white, borderRadius: 100,
          fontFamily: "sans-serif", fontSize: 36, fontWeight: 700, cursor: "pointer",
          transition: "left 0.1s, top 0.1s"
        }}>
          Unsubscribe
        </div>

      </div>

      {/* Fake Cursor */}
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
// ITEM 20: VIBE CHECK TERMINAL
// ═══════════════════════════════════════════════════════════════════════════════
export const VibeCheckTerminal: React.FC = () => {
  const frame = useCurrentFrame();

  const lines = [
    "> INITIATING VIBE PROTOCOL...",
    "> BYPASSING EMOTIONAL FIREWALL...",
    "> SCANNING AURA...",
    "> WARNING: CORRUPTION DETECTED IN SECTOR 7G",
    "> ANALYZING VIBES..."
  ];

  // Typewriter effect logic
  // 1 line per 10 frames
  const visibleLines = Math.floor(frame / 10);
  
  const isFailed = frame >= 60;
  const isBlink = isFailed && (Math.floor(frame / 5) % 2 === 0);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, padding: 120 }}>
      
      {/* Terminal UI */}
      <div style={{
        width: "100%", height: "100%", border: `4px solid ${C.lime}`,
        backgroundColor: "rgba(0,255,0,0.05)", padding: 60,
        display: "flex", flexDirection: "column", gap: 20
      }}>
        
        {lines.map((line, i) => (
          i < visibleLines && (
            <div key={i} style={{
              fontFamily: "monospace", fontSize: 48, color: C.lime, textShadow: `0 0 10px ${C.lime}`
            }}>
              {line}
            </div>
          )
        ))}

        {isFailed && (
          <div style={{
            marginTop: 80, fontFamily: "monospace", fontSize: 160, fontWeight: 700,
            color: C.red, opacity: isBlink ? 1 : 0, filter: getGlowClimax(C.red)
          }}>
            VIBE CHECK: FAILED
          </div>
        )}

      </div>

    </AbsoluteFill>
  );
};
