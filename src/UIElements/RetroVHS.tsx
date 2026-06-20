import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { C, ci, pseudoRandom, W4K, H4K } from "./utils";

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED: VHS SCANLINES
// ═══════════════════════════════════════════════════════════════════════════════
const VHSScanlines: React.FC<{ opacity?: number }> = ({ opacity = 0.15 }) => (
  <div style={{
    position: "absolute", inset: 0,
    background: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 2px, transparent 2px, transparent 6px)",
    pointerEvents: "none", zIndex: 50, opacity
  }} />
);

// ═══════════════════════════════════════════════════════════════════════════════
// M3: 90s CAMCORDER VIEWFINDER
// ═══════════════════════════════════════════════════════════════════════════════
export const Camcorder90s: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Blinking REC
  const isRecBlink = Math.floor(frame / 15) % 2 === 0;

  // Fake timestamp AM 09:45:XX
  const seconds = Math.floor(frame / fps);
  const timeStr = `AM 09:45:${seconds.toString().padStart(2, "0")}`;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, padding: 80 }}>
      <VHSScanlines opacity={0.2} />

      {/* Viewfinder Border */}
      <div style={{
        position: "absolute", inset: 120,
        border: `4px solid ${C.vhsWhite}`,
        opacity: 0.8
      }}>
        {/* Corner Brackets */}
        <div style={{ position: "absolute", top: -20, left: -20, width: 60, height: 60, borderTop: `10px solid ${C.vhsWhite}`, borderLeft: `10px solid ${C.vhsWhite}` }} />
        <div style={{ position: "absolute", top: -20, right: -20, width: 60, height: 60, borderTop: `10px solid ${C.vhsWhite}`, borderRight: `10px solid ${C.vhsWhite}` }} />
        <div style={{ position: "absolute", bottom: -20, left: -20, width: 60, height: 60, borderBottom: `10px solid ${C.vhsWhite}`, borderLeft: `10px solid ${C.vhsWhite}` }} />
        <div style={{ position: "absolute", bottom: -20, right: -20, width: 60, height: 60, borderBottom: `10px solid ${C.vhsWhite}`, borderRight: `10px solid ${C.vhsWhite}` }} />
      </div>

      {/* REC Indicator */}
      <div style={{
        position: "absolute", top: 160, left: 160,
        display: "flex", alignItems: "center", gap: 20,
        fontFamily: "'VT323', monospace", fontSize: 100, color: C.vhsWhite
      }}>
        <div style={{ width: 40, height: 40, backgroundColor: "#FF0000", borderRadius: "50%", opacity: isRecBlink ? 1 : 0 }} />
        REC
      </div>

      {/* Play Icon */}
      <div style={{
        position: "absolute", top: 160, right: 160,
        fontFamily: "'VT323', monospace", fontSize: 100, color: C.vhsWhite
      }}>
        PLAY ►
      </div>

      {/* SP Mode */}
      <div style={{
        position: "absolute", bottom: 160, left: 160,
        fontFamily: "'VT323', monospace", fontSize: 100, color: C.vhsWhite
      }}>
        SP
      </div>

      {/* Timestamp */}
      <div style={{
        position: "absolute", bottom: 160, right: 160,
        fontFamily: "'VT323', monospace", fontSize: 100, color: C.vhsWhite
      }}>
        {timeStr}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M3: LOW BATTERY WARNING
// ═══════════════════════════════════════════════════════════════════════════════
export const LowBatteryWarning: React.FC = () => {
  const frame = useCurrentFrame();
  const isBlink = Math.floor(frame / 20) % 2 === 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, alignItems: "center", justifyContent: "center" }}>
      <VHSScanlines opacity={0.3} />
      
      <div style={{ opacity: isBlink ? 1 : 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
        {/* Battery Icon */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{
            width: 400, height: 160, border: `12px solid #FF0000`, borderRadius: 10,
            padding: 10, position: "relative"
          }}>
            <div style={{ width: "20%", height: "100%", backgroundColor: "#FF0000" }} />
            {/* Red strike-through line indicating empty */}
            <div style={{ position: "absolute", inset: 0, borderTop: `10px solid #FF0000`, transform: "rotate(20deg) translateY(60px)", opacity: 0.5 }} />
          </div>
          <div style={{ width: 20, height: 60, backgroundColor: "#FF0000", borderTopRightRadius: 10, borderBottomRightRadius: 10 }} />
        </div>

        <div style={{
          fontFamily: "'VT323', monospace", fontSize: 150, color: "#FF0000", letterSpacing: "10px"
        }}>
          REPLACE BATTERY
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M3: GLITCHY "NO SIGNAL"
// ═══════════════════════════════════════════════════════════════════════════════
export const GlitchyNoSignal: React.FC = () => {
  const frame = useCurrentFrame();
  
  // High frequency jitter
  const isGlitchFrame = pseudoRandom(frame) > 0.4;
  const offsetX = isGlitchFrame ? pseudoRandom(frame * 2) * 60 - 30 : 0;
  const offsetY = isGlitchFrame ? pseudoRandom(frame * 3) * 20 - 10 : 0;

  // SMPTE Color Bars (optional, mostly covered by static)
  const colors = ["#C0C0C0", "#C0C000", "#00C0C0", "#00C000", "#C000C0", "#C00000", "#0000C0"];

  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      {/* Background Color Bars (faint) */}
      <div style={{ display: "flex", width: "100%", height: "100%", opacity: 0.2 }}>
        {colors.map((c, i) => <div key={i} style={{ flex: 1, backgroundColor: c }} />)}
      </div>

      {/* Artificial VHS Noise */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1%, transparent 1%)`,
        backgroundSize: "20px 20px",
        backgroundPosition: `${pseudoRandom(frame) * 100}px ${pseudoRandom(frame+1) * 100}px`,
        opacity: 0.5
      }} />
      <VHSScanlines opacity={0.4} />

      {/* "NO SIGNAL" Text Box */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center"
      }}>
        <div style={{
          transform: `translate(${offsetX}px, ${offsetY}px)`,
          backgroundColor: C.black,
          padding: "40px 80px",
          border: `6px solid ${C.vhsWhite}`
        }}>
          <div style={{
            color: C.vhsWhite,
            fontFamily: "'VT323', monospace",
            fontSize: 200, letterSpacing: "15px",
            filter: isGlitchFrame ? "drop-shadow(10px 0 0 red) drop-shadow(-10px 0 0 blue)" : "none"
          }}>
            NO SIGNAL
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M3: FAST FORWARD / REWIND TAPE
// ═══════════════════════════════════════════════════════════════════════════════
export const VCRFastForward: React.FC = () => {
  const frame = useCurrentFrame();

  // Tracking lines moving fast vertically
  const trackingY = (frame * 60) % H4K;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, padding: 120 }}>
      <VHSScanlines opacity={0.3} />

      {/* Tracking distortion line */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: trackingY,
        height: 200,
        background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2) 50%, transparent)",
        filter: "blur(4px)", zIndex: 40
      }} />
      <div style={{
        position: "absolute", left: 0, right: 0, top: trackingY + 80,
        height: 10,
        backgroundColor: "rgba(255,255,255,0.5)",
        zIndex: 41
      }} />

      {/* FFWD UI */}
      <div style={{
        position: "absolute", top: 120, right: 120,
        display: "flex", alignItems: "center", gap: 30,
        fontFamily: "'VT323', monospace", fontSize: 160, color: C.vhsWhite,
        textShadow: "0 0 20px rgba(255,255,255,0.5)"
      }}>
        FFWD ►►
      </div>
      
      {/* Noise at the bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 150,
        background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2) 2px, transparent 2px, transparent 10px)",
        backgroundPosition: `${pseudoRandom(frame) * 50}px 0`,
        opacity: 0.5
      }} />
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// M3: SECURITY CCTV FEED
// ═══════════════════════════════════════════════════════════════════════════════
export const SecurityCCTV: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isRecBlink = Math.floor(frame / 30) % 2 === 0;

  // Fake timestamp 2026-06-20 14:03:XX
  const seconds = Math.floor(frame / fps);
  const timeStr = `2026-06-20 14:03:${seconds.toString().padStart(2, "0")}`;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      {/* Fisheye lens effect mask */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at center, transparent 70%, rgba(0,0,0,0.8) 100%)",
        pointerEvents: "none", zIndex: 100
      }} />

      <VHSScanlines opacity={0.1} />

      <div style={{
        position: "absolute", inset: 80,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        fontFamily: "'Share Tech Mono', monospace", color: "#00FF00", fontSize: 70,
        textShadow: "0 0 10px #00FF00"
      }}>
        {/* Top Row */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 30, height: 30, backgroundColor: "#00FF00", borderRadius: "50%", opacity: isRecBlink ? 1 : 0 }} />
            REC
          </div>
          <div>CAM 01</div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>ENTRANCE SOUTH</div>
          <div>{timeStr}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
