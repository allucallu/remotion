import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  interpolateColors,
  Easing,
  spring,
  useVideoConfig,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/JetBrainsMono';

const { fontFamily: jetBrainsMonoFont } = loadFont('normal', {
  weights: ['400', '500', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
});

export interface Point2D {
  x: number;
  y: number;
}

export interface DataFlowConnectionPulseProps {
  useGreenScreen?: boolean;
  nodeALabel?: string;
  nodeBLabel?: string;
  nodeASubLabel?: string;
  nodeBSubLabel?: string;
  nodeAMetaText?: string;
  nodeBMetaText?: string;
  packetColorForward?: string;
  packetColorReturn?: string;
  pathColor?: string;
  nodeBgColor?: string;
  nodeBorderColor?: string;
  textColor?: string;
  subTextColor?: string;
}

export function getQuadraticBezierPoint(
  t: number,
  p0: Point2D,
  pc: Point2D,
  p1: Point2D
): Point2D {
  const oneMinusT = 1 - t;
  const x =
    oneMinusT * oneMinusT * p0.x + 2 * oneMinusT * t * pc.x + t * t * p1.x;
  const y =
    oneMinusT * oneMinusT * p0.y + 2 * oneMinusT * t * pc.y + t * t * p1.y;
  return { x, y };
}

/**
 * DataFlowConnectionPulse Composition
 * Upgraded duration to 360 frames (6.0 seconds @ 60fps) for smooth pacing & seamless looping.
 */
export const DataFlowConnectionPulse: React.FC<DataFlowConnectionPulseProps> = ({
  useGreenScreen = false,
  nodeALabel = 'NODE A',
  nodeBLabel = 'NODE B',
  nodeASubLabel = 'TRANSMITTER',
  nodeBSubLabel = 'RECEIVER',
  nodeAMetaText = 'IP: 192.168.1.10 | PORT: 8080',
  nodeBMetaText = 'IP: 10.0.0.4 | PORT: 443',
  packetColorForward = '#60A5FA',
  packetColorReturn = '#4ADE80',
  pathColor = '#3F3F46',
  nodeBgColor = '#141418',
  nodeBorderColor = 'rgba(255, 255, 255, 0.08)',
  textColor = '#E4E4E7',
  subTextColor = '#A1A1AA',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nodeAOffset: Point2D = { x: 960, y: 1080 };
  const nodeBOffset: Point2D = { x: 2880, y: 1080 };
  const nodeWidth = 440;
  const nodeHeight = 220;

  const topPathP0: Point2D = { x: nodeAOffset.x + nodeWidth / 2, y: nodeAOffset.y - 40 };
  const topPathPc: Point2D = { x: 1920, y: 680 };
  const topPathP1: Point2D = { x: nodeBOffset.x - nodeWidth / 2, y: nodeBOffset.y - 40 };

  const bottomPathP0: Point2D = { x: nodeBOffset.x - nodeWidth / 2, y: nodeBOffset.y + 40 };
  const bottomPathPc: Point2D = { x: 1920, y: 1480 };
  const bottomPathP1: Point2D = { x: nodeAOffset.x + nodeWidth / 2, y: nodeAOffset.y + 40 };

  const smoothCurveEasing = Easing.bezier(0.45, 0, 0.55, 1);

  // ==========================================
  // ANATOMI TIMELINE (TOTAL 360 FRAME / 6.0 DETIK @60FPS):
  // Fase 1 (Frame 0 - 110): Node A -> Node B (1.83s)
  // Fase 2 (Frame 110 - 170): Node B Pulse & Color Crossfade (1.0s)
  // Fase 3 (Frame 170 - 280): Node B -> Node A (1.83s)
  // Fase 4 (Frame 280 - 360): Node A Pulse & Fade Out Seamless Loop (1.33s)
  // ==========================================

  // Node B Pulse Spring
  const nodeBSpringProgress = spring({
    frame: Math.max(0, frame - 110),
    fps,
    config: { stiffness: 180, damping: 16, mass: 1 },
  });

  const nodeBScale =
    frame < 110
      ? 1.0
      : interpolate(nodeBSpringProgress, [0, 1], [1.0, 1.08]);

  const nodeBPulseRingScale = interpolate(frame, [110, 150], [1, 1.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const nodeBPulseRingOpacity = interpolate(frame, [110, 150], [0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Crossfade Warna Packet (Frame 110 - 134)
  const colorCrossfadeProgress = interpolate(frame, [110, 134], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.42, 0, 0.58, 1),
  });

  const currentPacketColor = interpolateColors(
    colorCrossfadeProgress,
    [0, 1],
    [packetColorForward, packetColorReturn]
  );

  // Node A Pulse Spring
  const nodeASpringProgress = spring({
    frame: Math.max(0, frame - 280),
    fps,
    config: { stiffness: 180, damping: 16, mass: 1 },
  });

  const nodeAScale =
    frame < 280
      ? 1.0
      : interpolate(nodeASpringProgress, [0, 1], [1.0, 1.08]);

  const nodeAPulseRingScale = interpolate(frame, [280, 320], [1, 1.5], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  const nodeAPulseRingOpacity = interpolate(frame, [280, 320], [0.6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Helper kalkulasi posisi 2D packet
  const getPacketPositionAtFrame = (f: number): { pos: Point2D; opacity: number } => {
    if (f < 110) {
      const prog = interpolate(f, [0, 110], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: smoothCurveEasing,
      });
      return { pos: getQuadraticBezierPoint(prog, topPathP0, topPathPc, topPathP1), opacity: 1 };
    } else if (f < 170) {
      return { pos: topPathP1, opacity: 1 };
    } else if (f < 280) {
      const prog = interpolate(f, [170, 280], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: smoothCurveEasing,
      });
      return { pos: getQuadraticBezierPoint(prog, bottomPathP0, bottomPathPc, bottomPathP1), opacity: 1 };
    } else {
      const fade = interpolate(f, [280, 320], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.bezier(0.42, 0, 0.58, 1),
      });
      return { pos: bottomPathP1, opacity: fade };
    }
  };

  const { pos: packetPosition, opacity: packetOpacity } = getPacketPositionAtFrame(frame);

  const trailOffsets = [3, 6, 9];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: useGreenScreen ? '#00FF00' : '#0A0A0C',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: jetBrainsMonoFont,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
      }}
    >
      {/* LAYER 1: Ambient Backdrop Glow & Tech Grid */}
      {!useGreenScreen && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '2600px',
              height: '1400px',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(ellipse at center, ${currentPacketColor}12 0%, transparent 65%)`,
              filter: 'blur(100px)',
              pointerEvents: 'none',
              transition: 'background 0.3s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)`,
              backgroundSize: '48px 48px',
              opacity: 0.04,
              pointerEvents: 'none',
            }}
          />

          {/* Corner Tech Marks */}
          <div style={{ position: 'absolute', top: '48px', left: '48px', color: 'rgba(255,255,255,0.15)', fontSize: '14px', letterSpacing: '2px' }}>
            + 00:38:40 / 4K UHD
          </div>
          <div style={{ position: 'absolute', top: '48px', right: '48px', color: 'rgba(255,255,255,0.15)', fontSize: '14px', letterSpacing: '2px' }}>
            NETWORK // DUAL-NODE PULSE (6.0s)
          </div>
        </>
      )}

      {/* LAYER 2: SVG Curves & Nodes */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* SVG Path Layer */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '3840px',
            height: '2160px',
            pointerEvents: 'none',
          }}
          viewBox="0 0 3840 2160"
        >
          <path
            d={`M ${topPathP0.x} ${topPathP0.y} Q ${topPathPc.x} ${topPathPc.y} ${topPathP1.x} ${topPathP1.y}`}
            fill="none"
            stroke={pathColor}
            strokeWidth="4"
            strokeDasharray="14 10"
          />

          <path
            d={`M ${bottomPathP0.x} ${bottomPathP0.y} Q ${bottomPathPc.x} ${bottomPathPc.y} ${bottomPathP1.x} ${bottomPathP1.y}`}
            fill="none"
            stroke={pathColor}
            strokeWidth="4"
            strokeDasharray="14 10"
          />
        </svg>

        {/* NODE A Container */}
        <div style={{ position: 'absolute', left: `${nodeAOffset.x - nodeWidth / 2}px`, top: `${nodeAOffset.y - nodeHeight / 2}px` }}>
          {frame >= 280 && (
            <div
              style={{
                position: 'absolute',
                width: `${nodeWidth}px`,
                height: `${nodeHeight}px`,
                borderRadius: '24px',
                border: `2px solid ${packetColorReturn}`,
                transform: `scale(${nodeAPulseRingScale})`,
                opacity: nodeAPulseRingOpacity,
                pointerEvents: 'none',
              }}
            />
          )}
          <div
            style={{
              width: `${nodeWidth}px`,
              height: `${nodeHeight}px`,
              borderRadius: '24px',
              backgroundColor: nodeBgColor,
              border: `2px solid ${frame >= 280 ? packetColorReturn : nodeBorderColor}`,
              boxShadow: `0 30px 80px rgba(0, 0, 0, 0.7), 0 0 25px ${frame >= 280 ? packetColorReturn + '30' : 'transparent'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transform: `scale(${nodeAScale})`,
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div
              style={{
                color: textColor,
                fontSize: '36px',
                fontWeight: 700,
                letterSpacing: '1px',
              }}
            >
              {nodeALabel}
            </div>
            {nodeASubLabel && (
              <div
                style={{
                  color: subTextColor,
                  fontSize: '20px',
                  fontWeight: 500,
                  letterSpacing: '1.5px',
                }}
              >
                {nodeASubLabel}
              </div>
            )}
          </div>

          {nodeAMetaText && (
            <div
              style={{
                textAlign: 'center',
                marginTop: '14px',
                fontSize: '14px',
                color: '#71717A',
                letterSpacing: '1px',
              }}
            >
              {nodeAMetaText}
            </div>
          )}
        </div>

        {/* NODE B Container */}
        <div style={{ position: 'absolute', left: `${nodeBOffset.x - nodeWidth / 2}px`, top: `${nodeBOffset.y - nodeHeight / 2}px` }}>
          {frame >= 110 && (
            <div
              style={{
                position: 'absolute',
                width: `${nodeWidth}px`,
                height: `${nodeHeight}px`,
                borderRadius: '24px',
                border: `2px solid ${packetColorForward}`,
                transform: `scale(${nodeBPulseRingScale})`,
                opacity: nodeBPulseRingOpacity,
                pointerEvents: 'none',
              }}
            />
          )}
          <div
            style={{
              width: `${nodeWidth}px`,
              height: `${nodeHeight}px`,
              borderRadius: '24px',
              backgroundColor: nodeBgColor,
              border: `2px solid ${frame >= 110 && frame < 170 ? packetColorForward : nodeBorderColor}`,
              boxShadow: `0 30px 80px rgba(0, 0, 0, 0.7), 0 0 25px ${frame >= 110 && frame < 170 ? packetColorForward + '30' : 'transparent'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transform: `scale(${nodeBScale})`,
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              backdropFilter: 'blur(20px)',
            }}
          >
            <div
              style={{
                color: textColor,
                fontSize: '36px',
                fontWeight: 700,
                letterSpacing: '1px',
              }}
            >
              {nodeBLabel}
            </div>
            {nodeBSubLabel && (
              <div
                style={{
                  color: subTextColor,
                  fontSize: '20px',
                  fontWeight: 500,
                  letterSpacing: '1.5px',
                }}
              >
                {nodeBSubLabel}
              </div>
            )}
          </div>

          {nodeBMetaText && (
            <div
              style={{
                textAlign: 'center',
                marginTop: '14px',
                fontSize: '14px',
                color: '#71717A',
                letterSpacing: '1px',
              }}
            >
              {nodeBMetaText}
            </div>
          )}
        </div>

        {/* Trailing Energy Trail Particles */}
        {trailOffsets.map((offset, idx) => {
          const trailFrame = Math.max(0, frame - offset);
          const { pos: tPos, opacity: tOp } = getPacketPositionAtFrame(trailFrame);
          const trailAlpha = (0.5 - idx * 0.15) * packetOpacity * tOp;
          const trailSize = 36 - idx * 8;

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${tPos.x - trailSize / 2}px`,
                top: `${tPos.y - trailSize / 2}px`,
                width: `${trailSize}px`,
                height: `${trailSize}px`,
                borderRadius: '50%',
                backgroundColor: currentPacketColor,
                opacity: trailAlpha,
                filter: 'blur(2px)',
                pointerEvents: 'none',
              }}
            />
          );
        })}

        {/* Moving High-Glow Packet Core */}
        <div
          style={{
            position: 'absolute',
            left: `${packetPosition.x - 24}px`,
            top: `${packetPosition.y - 24}px`,
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: currentPacketColor,
            boxShadow: `0 0 40px ${currentPacketColor}, 0 0 15px ${currentPacketColor}, 0 0 4px #FFFFFF`,
            opacity: packetOpacity,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              opacity: 0.95,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
