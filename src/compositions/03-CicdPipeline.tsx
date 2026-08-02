import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { interFontFamily } from '../utils/fonts';

export interface CicdPipelineProps {
  background?: 'alpha' | 'solid';
}

interface Stage {
  name: string;
  duration: string;
  startFrame: number;
  runDuration: number;
}

const stages: Stage[] = [
  { name: '01 / BUILD & COMPILE', duration: '14.2s', startFrame: 15, runDuration: 35 },
  { name: '02 / UNIT & INTEGRATION TESTS', duration: '22.8s', startFrame: 50, runDuration: 40 },
  { name: '03 / VULNERABILITY SECURITY SCAN', duration: '8.4s', startFrame: 90, runDuration: 30 },
  { name: '04 / KUBERNETES PRODUCTION DEPLOY', duration: '5.1s', startFrame: 120, runDuration: 35 },
];

export const CicdPipeline: React.FC<CicdPipelineProps> = ({ background = 'solid' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Container spring scale entrance
  const containerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const bgColor = background === 'solid' ? '#0B0F19' : 'transparent';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: interFontFamily,
      }}
    >
      <div
        style={{
          width: '1350px',
          backgroundColor: '#111827',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '36px',
          transform: `scale(${containerSpring})`,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '18px', color: '#9CA3AF', letterSpacing: '0.15em', fontWeight: 600 }}>
              DEPLOYMENT PIPELINE • MAIN BRANCH
            </div>
            <div style={{ fontSize: '32px', color: '#F3F4F6', fontWeight: 800, marginTop: '4px' }}>
              production-release-v2.4.0
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(5, 150, 105, 0.15)',
              border: '1px solid #059669',
              padding: '10px 24px',
              borderRadius: '100px',
              color: '#34D399',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            ● PIPELINE ACTIVE
          </div>
        </div>

        {/* Pipeline Stages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {stages.map((stage, idx) => {
            const stageProgress = interpolate(
              frame,
              [stage.startFrame, stage.startFrame + stage.runDuration],
              [0, 100],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            const isDone = frame >= stage.startFrame + stage.runDuration;
            const isRunning = frame >= stage.startFrame && !isDone;

            const checkScale = isDone
              ? spring({
                  frame: frame - (stage.startFrame + stage.runDuration),
                  fps,
                  config: { damping: 10, stiffness: 120 },
                })
              : 0;

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#1F2937',
                  borderRadius: '16px',
                  padding: '24px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '22px', fontWeight: 700, color: '#F3F4F6' }}>{stage.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '18px', color: '#9CA3AF' }}>{stage.duration}</span>
                    {isDone ? (
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#059669',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: `scale(${checkScale})`,
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    ) : isRunning ? (
                      <span style={{ color: '#FBBF24', fontSize: '18px', fontWeight: 600 }}>RUNNING...</span>
                    ) : (
                      <span style={{ color: '#6B7280', fontSize: '18px' }}>PENDING</span>
                    )}
                  </div>
                </div>

                {/* Progress Bar Track */}
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#374151',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${stageProgress}%`,
                      height: '100%',
                      backgroundColor: isDone ? '#059669' : '#FBBF24',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
