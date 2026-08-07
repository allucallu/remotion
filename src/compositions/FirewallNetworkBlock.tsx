import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreatDotGraphic, ShieldBlockXIcon, UserTrafficDotGraphic } from '../components/FirewallIcons';
import { NetworkNodeCard } from '../components/NetworkNodeCard';

export interface NodeLabels {
  user?: string;
  firewall?: string;
  server?: string;
  cloud?: string;
}

export interface FirewallNetworkBlockProps {
  nodeLabels?: NodeLabels;
  threatCount?: number;
  accentColor?: string;
  dangerColor?: string;
}

export const FirewallNetworkBlock: React.FC<FirewallNetworkBlockProps> = ({
  nodeLabels = {
    user: 'User Endpoint',
    firewall: 'Firewall Shield',
    server: 'App Server',
    cloud: 'Cloud Storage',
  },
  threatCount = 3,
  accentColor = '#2563EB',
  dangerColor = '#DC2626',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Topology Coordinates (3840 x 2160 UHD)
  const nodes = {
    user: { x: 720, y: 780, label: nodeLabels.user || 'User Endpoint', sub: 'IP: 192.168.1.10 • ACTIVE' },
    firewall: { x: 1920, y: 1080, label: nodeLabels.firewall || 'Firewall Shield', sub: 'PACKET FILTER ENGINE' },
    server: { x: 3120, y: 780, label: nodeLabels.server || 'App Server', sub: 'PORT 8080 • HEALTHY' },
    cloud: { x: 3120, y: 1380, label: nodeLabels.cloud || 'Cloud Storage', sub: 'ENCRYPTED BUCKET' },
  };

  const threatOrigin = { x: 720, y: 1380 };

  // 1. Frame 0-30: Node Staggered Fade-In & Line Drawing
  const userOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const firewallOpacity = interpolate(frame, [8, 18], [0, 1], { extrapolateRight: 'clamp' });
  const serverOpacity = interpolate(frame, [16, 26], [0, 1], { extrapolateRight: 'clamp' });
  const cloudOpacity = interpolate(frame, [24, 34], [0, 1], { extrapolateRight: 'clamp' });

  // Line drawing stroke-dashoffset (20 frames duration per line)
  const line1Progress = interpolate(frame, [5, 25], [1, 0], { extrapolateRight: 'clamp' });
  const line2Progress = interpolate(frame, [12, 32], [1, 0], { extrapolateRight: 'clamp' });
  const line3Progress = interpolate(frame, [18, 38], [1, 0], { extrapolateRight: 'clamp' });
  const line4Progress = interpolate(frame, [22, 42], [1, 0], { extrapolateRight: 'clamp' });

  // 2. Threat Motion & Arrival Logic (3 Threats)
  // Threat 1: Frame 40 -> 90
  // Threat 2: Frame 100 -> 150
  // Threat 3: Frame 160 -> 210
  const threatTimings = [
    { start: 40, arrive: 90 },
    { start: 100, arrive: 150 },
    { start: 160, arrive: 210 },
  ];

  let currentBlockedCount = 0;
  let isFirewallFlashing = false;
  let activeRippleScale1 = 1;
  let activeRippleScale2 = 1;
  let activeRippleOpacity1 = 0;
  let activeRippleOpacity2 = 0;
  let isServerCloudHealthyPulse = false;

  threatTimings.forEach(({ arrive }, idx) => {
    if (idx < threatCount && frame >= arrive) {
      currentBlockedCount = idx + 1;
    }

    // Reaction for 22 frames after each threat arrival
    if (frame >= arrive && frame < arrive + 22) {
      isFirewallFlashing = true;
      const rippleProgress = (frame - arrive) / 22;
      
      // Primary Wave Ring
      activeRippleScale1 = interpolate(rippleProgress, [0, 1], [1, 2.2]);
      activeRippleOpacity1 = interpolate(rippleProgress, [0, 1], [0.7, 0]);

      // Secondary Inner Wave Ring
      activeRippleScale2 = interpolate(rippleProgress, [0, 1], [1, 1.5]);
      activeRippleOpacity2 = interpolate(rippleProgress, [0, 1], [0.5, 0]);
    }

    // Server & Cloud Green Healthy Traffic Receipt Window (25 frames post block)
    if (frame >= arrive + 10 && frame < arrive + 35) {
      isServerCloudHealthyPulse = true;
    }
  });

  // Firewall Shield Micro-Flash Scale
  const firewallScale = isFirewallFlashing
    ? interpolate(Math.sin((frame % 20) * (Math.PI / 10)), [0, 1], [1, 1.08])
    : 1;

  const firewallBorderColor = isFirewallFlashing ? dangerColor : accentColor;

  // Counter Text Scale Pop per increment
  const counterSpring = spring({
    frame: currentBlockedCount > 0 ? Math.max(0, frame - threatTimings[currentBlockedCount - 1].arrive) : 0,
    fps,
    config: {
      damping: 14,
      stiffness: 220,
    },
  });

  const counterScale = currentBlockedCount > 0 ? interpolate(counterSpring, [0, 1], [1.2, 1]) : 1;

  // 3. Legitimate User Traffic Packets (User -> Firewall)
  // 3 user packets looping every 60 frames
  const userPacket1Frame = (frame % 60);
  const userPacket1X = interpolate(userPacket1Frame, [0, 60], [nodes.user.x, nodes.firewall.x]);
  const userPacket1Y = interpolate(userPacket1Frame, [0, 60], [nodes.user.y, nodes.firewall.y]);

  const userPacket2Frame = ((frame + 30) % 60);
  const userPacket2X = interpolate(userPacket2Frame, [0, 60], [nodes.user.x, nodes.firewall.x]);
  const userPacket2Y = interpolate(userPacket2Frame, [0, 60], [nodes.user.y, nodes.firewall.y]);

  // 4. Verified Clean Traffic Packets (Firewall -> Server & Firewall -> Cloud)
  // Emitted post block (f=95..125, f=155..185, f=215..245)
  let cleanPacketProgress = -1;
  threatTimings.forEach(({ arrive }) => {
    if (frame >= arrive + 5 && frame <= arrive + 30) {
      cleanPacketProgress = (frame - (arrive + 5)) / 25;
    }
  });

  const cleanServerX = cleanPacketProgress >= 0 ? interpolate(cleanPacketProgress, [0, 1], [nodes.firewall.x, nodes.server.x]) : 0;
  const cleanServerY = cleanPacketProgress >= 0 ? interpolate(cleanPacketProgress, [0, 1], [nodes.firewall.y, nodes.server.y]) : 0;

  const cleanCloudX = cleanPacketProgress >= 0 ? interpolate(cleanPacketProgress, [0, 1], [nodes.firewall.x, nodes.cloud.x]) : 0;
  const cleanCloudY = cleanPacketProgress >= 0 ? interpolate(cleanPacketProgress, [0, 1], [nodes.firewall.y, nodes.cloud.y]) : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Top Header Banner Card */}
      <div
        style={{
          position: 'absolute',
          top: '120px',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(229, 231, 235, 0.95)',
          borderRadius: '20px',
          padding: '16px 36px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          zIndex: 15,
        }}
      >
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }} />
        <span style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>
          NETWORK FIREWALL SHIELD • REAL-TIME THREAT MITIGATION ENGINE
        </span>
      </div>

      {/* SVG Connecting Path Lines & Line-Drawing Animation */}
      <svg width="3840" height="2160" viewBox="0 0 3840 2160" style={{ position: 'absolute', inset: 0 }}>
        {/* Line 1: User -> Firewall */}
        <line
          x1={nodes.user.x}
          y1={nodes.user.y}
          x2={nodes.firewall.x}
          y2={nodes.firewall.y}
          stroke="#9CA3AF"
          strokeWidth="3.5"
          strokeDasharray="1400"
          strokeDashoffset={line1Progress * 1400}
        />

        {/* Line 2: Firewall -> App Server */}
        <line
          x1={nodes.firewall.x}
          y1={nodes.firewall.y}
          x2={nodes.server.x}
          y2={nodes.server.y}
          stroke={isServerCloudHealthyPulse ? '#16A34A' : '#9CA3AF'}
          strokeWidth="3.5"
          strokeDasharray="1400"
          strokeDashoffset={line2Progress * 1400}
          style={{ transition: 'stroke 0.15s ease' }}
        />

        {/* Line 3: Firewall -> Cloud Storage */}
        <line
          x1={nodes.firewall.x}
          y1={nodes.firewall.y}
          x2={nodes.cloud.x}
          y2={nodes.cloud.y}
          stroke={isServerCloudHealthyPulse ? '#16A34A' : '#9CA3AF'}
          strokeWidth="3.5"
          strokeDasharray="1400"
          strokeDashoffset={line3Progress * 1400}
          style={{ transition: 'stroke 0.15s ease' }}
        />

        {/* Line 4 (Threat Path): Threat Origin -> Firewall */}
        <line
          x1={threatOrigin.x}
          y1={threatOrigin.y}
          x2={nodes.firewall.x}
          y2={nodes.firewall.y}
          stroke={dangerColor}
          strokeWidth="3"
          strokeDasharray="10 10"
          strokeDashoffset={line4Progress * 1400}
          opacity="0.45"
        />

        {/* External Threat Origin Node Indicator */}
        <circle cx={threatOrigin.x} cy={threatOrigin.y} r="18" fill={dangerColor} fillOpacity="0.16" stroke={dangerColor} strokeWidth="2.5" />
        <text x={threatOrigin.x} y={threatOrigin.y + 48} textAnchor="middle" fill={dangerColor} fontSize="20" fontWeight="800">
          EXTERNAL THREAT VECTOR
        </text>
      </svg>

      {/* Primary & Secondary Dual-Pulse Wave Ripple Rings around Firewall Node */}
      {activeRippleOpacity1 > 0 && (
        <>
          <div
            style={{
              position: 'absolute',
              left: `${nodes.firewall.x}px`,
              top: `${nodes.firewall.y}px`,
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              border: `3.5px solid ${dangerColor}`,
              transform: `translate(-50%, -50%) scale(${activeRippleScale1})`,
              opacity: activeRippleOpacity1,
              pointerEvents: 'none',
              zIndex: 9,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${nodes.firewall.x}px`,
              top: `${nodes.firewall.y}px`,
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              border: `2px solid ${dangerColor}`,
              transform: `translate(-50%, -50%) scale(${activeRippleScale2})`,
              opacity: activeRippleOpacity2,
              pointerEvents: 'none',
              zIndex: 9,
            }}
          />
        </>
      )}

      {/* Render Legitimate User Traffic Data Packets (User -> Firewall) */}
      {frame >= 30 && (
        <>
          <div style={{ position: 'absolute', left: `${userPacket1X}px`, top: `${userPacket1Y}px`, zIndex: 7 }}>
            <UserTrafficDotGraphic size={20} color={accentColor} />
          </div>
          <div style={{ position: 'absolute', left: `${userPacket2X}px`, top: `${userPacket2Y}px`, zIndex: 7 }}>
            <UserTrafficDotGraphic size={20} color={accentColor} />
          </div>
        </>
      )}

      {/* Render Verified Clean Traffic Packets (Firewall -> Server & Cloud) */}
      {cleanPacketProgress >= 0 && (
        <>
          <div style={{ position: 'absolute', left: `${cleanServerX}px`, top: `${cleanServerY}px`, zIndex: 7 }}>
            <UserTrafficDotGraphic size={22} color="#16A34A" />
          </div>
          <div style={{ position: 'absolute', left: `${cleanCloudX}px`, top: `${cleanCloudY}px`, zIndex: 7 }}>
            <UserTrafficDotGraphic size={22} color="#16A34A" />
          </div>
        </>
      )}

      {/* Render Network Nodes */}
      <NetworkNodeCard
        type="user"
        label={nodes.user.label}
        sublabel={nodes.user.sub}
        x={nodes.user.x}
        y={nodes.user.y}
        frame={frame}
        opacity={userOpacity}
      />

      <NetworkNodeCard
        type="firewall"
        label={nodes.firewall.label}
        sublabel={nodes.firewall.sub}
        x={nodes.firewall.x}
        y={nodes.firewall.y}
        frame={frame}
        opacity={firewallOpacity}
        scale={firewallScale}
        borderColor={firewallBorderColor}
        accentColor={accentColor}
      />

      <NetworkNodeCard
        type="server"
        label={nodes.server.label}
        sublabel={nodes.server.sub}
        x={nodes.server.x}
        y={nodes.server.y}
        frame={frame}
        opacity={serverOpacity}
        isHealthyPulse={isServerCloudHealthyPulse}
      />

      <NetworkNodeCard
        type="cloud"
        label={nodes.cloud.label}
        sublabel={nodes.cloud.sub}
        x={nodes.cloud.x}
        y={nodes.cloud.y}
        frame={frame}
        opacity={cloudOpacity}
        isHealthyPulse={isServerCloudHealthyPulse}
      />

      {/* Staggered Moving Threat Dots with Trailing Pulse (3 Threat Dots) */}
      {threatTimings.slice(0, threatCount).map(({ start, arrive }, idx) => {
        if (frame < start || frame > arrive + 10) return null;

        // Disappear & Blocked Symbol on arrival
        if (frame >= arrive) {
          const vanishProgress = (frame - arrive) / 10;
          const vanishScale = interpolate(vanishProgress, [0, 1], [1.2, 0], { extrapolateRight: 'clamp' });
          return (
            <div key={idx} style={{ position: 'absolute', left: `${nodes.firewall.x - 120}px`, top: `${nodes.firewall.y + 60}px`, transform: `scale(${vanishScale})`, zIndex: 14 }}>
              <ShieldBlockXIcon size={56} color={dangerColor} />
            </div>
          );
        }

        // Ease-in motion towards Firewall center
        const travelProgress = interpolate(frame, [start, arrive], [0, 1], {
          extrapolateRight: 'clamp',
          easing: Easing.in(Easing.cubic),
        });

        const dotX = interpolate(travelProgress, [0, 1], [threatOrigin.x, nodes.firewall.x]);
        const dotY = interpolate(travelProgress, [0, 1], [threatOrigin.y, nodes.firewall.y]);

        const popScale = interpolate(frame, [start, start + 8], [0, 1], { extrapolateRight: 'clamp' });

        return (
          <React.Fragment key={idx}>
            {/* Trailing Dot 1 */}
            {travelProgress > 0.1 && (
              <div style={{ position: 'absolute', left: `${dotX - (nodes.firewall.x - threatOrigin.x) * 0.04}px`, top: `${dotY - (nodes.firewall.y - threatOrigin.y) * 0.04}px`, opacity: 0.5, zIndex: 11 }}>
                <ThreatDotGraphic size={20} color={dangerColor} />
              </div>
            )}
            {/* Main Threat Dot */}
            <div style={{ position: 'absolute', left: `${dotX}px`, top: `${dotY}px`, transform: `scale(${popScale})`, zIndex: 12 }}>
              <ThreatDotGraphic size={32} color={dangerColor} />
            </div>
          </React.Fragment>
        );
      })}

      {/* Incremental Threat Blocked Live Counter Badge below Firewall Node */}
      {frame >= 80 && (
        <div
          style={{
            position: 'absolute',
            left: `${nodes.firewall.x}px`,
            top: `${nodes.firewall.y + 240}px`,
            transform: 'translateX(-50%)',
            backgroundColor: currentBlockedCount === threatCount ? '#F0FDF4' : '#FEF2F2',
            border: `2.5px solid ${currentBlockedCount === threatCount ? '#BBF7D0' : '#FECACA'}`,
            borderRadius: '18px',
            padding: '14px 32px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            zIndex: 11,
          }}
        >
          <span
            style={{
              fontSize: '30px',
              fontWeight: 800,
              color: currentBlockedCount === threatCount ? '#15803D' : dangerColor,
              letterSpacing: '-0.3px',
              transform: `scale(${counterScale})`,
              display: 'inline-block',
            }}
          >
            {currentBlockedCount} / {threatCount} THREATS BLOCKED & MITIGATED
          </span>
          {currentBlockedCount === threatCount && (
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#166534', backgroundColor: '#DCFCE7', padding: '6px 14px', borderRadius: '10px' }}>
              100% PROTECTED
            </span>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
