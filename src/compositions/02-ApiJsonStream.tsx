import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { TerminalWindow } from '../components/TerminalWindow';
import { jetBrainsMonoFontFamily } from '../utils/fonts';

export interface ApiJsonStreamProps {
  background?: 'alpha' | 'solid';
}

export const ApiJsonStream: React.FC<ApiJsonStreamProps> = ({ background = 'solid' }) => {
  const frame = useCurrentFrame();

  // Scroll offset translateY as JSON streams in
  const scrollY = interpolate(frame, [40, 160], [0, -120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // JSON lines reveal progress
  const jsonProgress = Math.floor(
    interpolate(frame, [30, 150], [0, 16], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const jsonLines = [
    { text: '{', indent: 0 },
    { key: '"status"', val: '"success"', indent: 1 },
    { key: '"statusCode"', val: '200', indent: 1 },
    { key: '"timestamp"', val: '"2026-08-03T00:15:30Z"', indent: 1 },
    { key: '"data"', val: '{', indent: 1 },
    { key: '"totalUsers"', val: '142850', indent: 2 },
    { key: '"activeSessions"', val: '3892', indent: 2 },
    { key: '"region"', val: '"us-east-1"', indent: 2 },
    { key: '"endpoints"', val: '[', indent: 2 },
    { val: '"/v1/auth/login"', indent: 3 },
    { val: '"/v1/telemetry/stream"', indent: 3 },
    { val: '"/v1/billing/usage"', indent: 3 },
    { text: ']', indent: 2 },
    { text: '}', indent: 1 },
    { text: '}', indent: 0 },
  ];

  const bgColor = background === 'solid' ? '#0F172A' : 'transparent';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: jetBrainsMonoFontFamily,
      }}
    >
      <TerminalWindow
        title="zsh — API Gateway Telemetry Stream"
        width="1400px"
        height="880px"
        backgroundColor="#0F172A"
        borderColor="rgba(148, 163, 184, 0.2)"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '26px', lineHeight: 1.6 }}>
          {/* Command Prompt Line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ color: '#38BDF8', fontWeight: 'bold' }}>curl -X GET</span>
            <span style={{ color: '#E2E8F0' }}>https://api.saas.io/v1/telemetry/stream</span>
          </div>

          {/* Response Status Line */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              backgroundColor: 'rgba(52, 211, 153, 0.1)',
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              width: 'fit-content',
              marginTop: '8px',
            }}
          >
            <span style={{ color: '#34D399', fontWeight: 800 }}>HTTP/2 200 OK</span>
            <span style={{ color: '#94A3B8' }}>•</span>
            <span style={{ color: '#94A3B8' }}>14.2 ms</span>
            <span style={{ color: '#94A3B8' }}>•</span>
            <span style={{ color: '#94A3B8' }}>application/json</span>
          </div>

          {/* Streaming JSON Section */}
          <div
            style={{
              marginTop: '16px',
              transform: `translateY(${scrollY}px)`,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {jsonLines.slice(0, jsonProgress).map((line, idx) => (
              <div key={idx} style={{ paddingLeft: `${line.indent * 32}px`, whiteSpace: 'pre' }}>
                {line.text ? (
                  <span style={{ color: '#E2E8F0' }}>{line.text}</span>
                ) : (
                  <>
                    {line.key && <span style={{ color: '#94A3B8' }}>{line.key}: </span>}
                    {line.val && (
                      <span
                        style={{
                          color: line.val.startsWith('"') ? '#A7F3D0' : '#F472B6',
                          fontWeight: line.val.startsWith('"') ? 500 : 700,
                        }}
                      >
                        {line.val}
                      </span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </TerminalWindow>
    </AbsoluteFill>
  );
};
