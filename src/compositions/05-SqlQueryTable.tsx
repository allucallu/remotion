import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from 'remotion';
import { TerminalWindow } from '../components/TerminalWindow';
import { jetBrainsMonoFontFamily } from '../utils/fonts';

export interface SqlQueryTableProps {
  background?: 'alpha' | 'solid';
}

const tableData = [
  { id: '1021', name: 'Acme Corp', plan: 'Enterprise', revenue: '$14,500' },
  { id: '1022', name: 'Stripe Global', plan: 'Scale', revenue: '$9,200' },
  { id: '1023', name: 'Vercel Inc', plan: 'Enterprise', revenue: '$22,000' },
  { id: '1024', name: 'Supabase Inc', plan: 'Growth', revenue: '$4,800' },
  { id: '1025', name: 'Figma Systems', plan: 'Enterprise', revenue: '$31,000' },
];

export const SqlQueryTable: React.FC<SqlQueryTableProps> = ({ background = 'solid' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Table slide-up spring entrance
  const tableSpring = frame >= 70
    ? spring({
        frame: frame - 70,
        fps,
        config: { damping: 12, stiffness: 100 },
      })
    : 0;

  const bgColor = background === 'solid' ? '#212121' : 'transparent';

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
        title="PostgreSQL 16.2 — DB Query Console"
        width="1450px"
        height="880px"
        backgroundColor="#212121"
        borderColor="rgba(255, 255, 255, 0.1)"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* SQL Editor Area */}
          <div style={{ fontSize: '28px', lineHeight: 1.5, color: '#EEFFFF' }}>
            <span style={{ color: '#80CBC4', fontWeight: 'bold' }}>SELECT </span>
            <span>id, name, plan, revenue </span>
            <span style={{ color: '#80CBC4', fontWeight: 'bold' }}>FROM </span>
            <span>subscriptions </span>
            <span style={{ color: '#80CBC4', fontWeight: 'bold' }}>WHERE </span>
            <span>status = </span>
            <span style={{ color: '#C3E88D' }}>'active'</span>
            <span>;</span>
          </div>

          {/* Table Result Header Status */}
          {frame >= 70 && (
            <div style={{ color: '#80CBC4', fontSize: '20px', letterSpacing: '0.1em' }}>
              ✓ 5 ROWS RETURNED IN 3.4 MS
            </div>
          )}

          {/* SQL Result Table Grid */}
          {frame >= 70 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #333333',
                transform: `translateY(${(1 - tableSpring) * 60}px)`,
                opacity: tableSpring,
              }}
            >
              {/* Header Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 2fr 1.5fr',
                  backgroundColor: '#1A1A1A',
                  padding: '16px 28px',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: '#80CBC4',
                  borderBottom: '2px solid #333333',
                }}
              >
                <div>ID</div>
                <div>ORGANIZATION</div>
                <div>TIER PLAN</div>
                <div style={{ textAlign: 'right' }}>REVENUE</div>
              </div>

              {/* Data Rows */}
              {tableData.map((row, index) => {
                const rowDelay = 70 + index * 8;
                const rowOpacity = interpolate(frame, [rowDelay, rowDelay + 10], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                });

                return (
                  <div
                    key={row.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr 2fr 1.5fr',
                      backgroundColor: index % 2 === 0 ? '#2B2B2B' : '#212121',
                      padding: '18px 28px',
                      fontSize: '24px',
                      color: '#EEFFFF',
                      opacity: rowOpacity,
                      borderBottom: '1px solid #333333',
                    }}
                  >
                    <div style={{ color: '#888888' }}>#{row.id}</div>
                    <div style={{ fontWeight: 600 }}>{row.name}</div>
                    <div>
                      <span
                        style={{
                          backgroundColor: row.plan === 'Enterprise' ? 'rgba(128, 203, 196, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                          color: row.plan === 'Enterprise' ? '#80CBC4' : '#CCCCCC',
                          padding: '4px 14px',
                          borderRadius: '6px',
                          fontSize: '20px',
                        }}
                      >
                        {row.plan}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right', fontWeight: 'bold', color: '#C3E88D' }}>{row.revenue}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </TerminalWindow>
    </AbsoluteFill>
  );
};
