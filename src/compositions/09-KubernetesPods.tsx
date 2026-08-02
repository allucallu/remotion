import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { interFontFamily } from '../utils/fonts';

export interface KubernetesPodsProps {
  background?: 'alpha' | 'solid';
}

interface Pod {
  id: string;
  name: string;
  initialStatus: 'Running' | 'Pending' | 'Error';
  switchFrame?: number;
  targetStatus?: 'Running' | 'Pending' | 'Error';
}

const podsData: Pod[] = Array.from({ length: 16 }).map((_, idx) => ({
  id: `pod-${idx + 1}`,
  name: `auth-service-pod-0${idx + 1}`,
  initialStatus: idx === 5 || idx === 11 ? 'Pending' : idx === 14 ? 'Error' : 'Running',
  switchFrame: idx === 5 ? 60 : idx === 11 ? 110 : undefined,
  targetStatus: idx === 5 || idx === 11 ? 'Running' : undefined,
}));

export const KubernetesPods: React.FC<KubernetesPodsProps> = ({ background = 'solid' }) => {
  const frame = useCurrentFrame();

  const bgColor = background === 'solid' ? '#0D1117' : 'transparent';

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
          width: '1400px',
          backgroundColor: '#161B22',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header Summary Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '18px', color: '#58A6FF', letterSpacing: '0.15em', fontWeight: 600 }}>
              KUBERNETES CLUSTER • PROD-US-WEST
            </div>
            <div style={{ fontSize: '32px', color: '#F0F6FC', fontWeight: 800, marginTop: '4px' }}>
              Namespace: default (16 Active Pods)
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '18px', fontWeight: 600 }}>
            <span style={{ color: '#58A6FF' }}>● 14 Running</span>
            <span style={{ color: '#D29922' }}>● 1 Pending</span>
            <span style={{ color: '#F85149' }}>● 1 Error</span>
          </div>
        </div>

        {/* 4x4 Modular Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {podsData.map((pod, idx) => {
            let status = pod.initialStatus;
            if (pod.switchFrame && frame >= pod.switchFrame && pod.targetStatus) {
              status = pod.targetStatus;
            }

            // Pulsing opacity per pod
            const pulse = 0.85 + Math.sin(frame * 0.15 + idx * 0.8) * 0.15;

            const statusBg =
              status === 'Running' ? '#1F6FEB' : status === 'Pending' ? '#D29922' : '#F85149';

            return (
              <div
                key={pod.id}
                style={{
                  backgroundColor: '#21262D',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  border: `1px solid ${status === 'Error' ? 'rgba(248, 81, 73, 0.5)' : 'rgba(255, 255, 255, 0.05)'}`,
                  opacity: pulse,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', color: '#8B949E', fontWeight: 600 }}>{pod.id}</span>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: statusBg,
                      boxShadow: `0 0 10px ${statusBg}`,
                    }}
                  />
                </div>

                <div style={{ fontSize: '20px', fontWeight: 700, color: '#F0F6FC' }}>{pod.name}</div>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    width: 'fit-content',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: statusBg,
                    letterSpacing: '0.05em',
                  }}
                >
                  STATUS: {status.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
