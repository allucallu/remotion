import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { jetBrainsMonoFontFamily } from '../utils/fonts';

export interface GitCommitLogProps {
  background?: 'alpha' | 'solid';
}

interface CommitItem {
  hash: string;
  msg: string;
  author: string;
  time: string;
  tag?: string;
  startFrame: number;
}

const commits: CommitItem[] = [
  { hash: 'a8f12c9', msg: 'feat(auth): implement jwt refresh token rotation', author: 'alex.dev', time: '2m ago', tag: 'v2.4.0', startFrame: 15 },
  { hash: '9b3e104', msg: 'fix(billing): resolve stripe webhook idempotency', author: 'sarah.m', time: '14m ago', startFrame: 50 },
  { hash: '4c7d8a1', msg: 'refactor(db): optimize postgres connection pooling', author: 'david.k', time: '1h ago', startFrame: 85 },
  { hash: '7e2f5b6', msg: 'ci(deploy): add automated helm chart release', author: 'ops.bot', time: '3h ago', startFrame: 120 },
];

export const GitCommitLog: React.FC<GitCommitLogProps> = ({ background = 'solid' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scroll offset translateY
  const scrollY = interpolate(frame, [80, 180], [0, -60], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bgColor = background === 'solid' ? '#1E1E2E' : 'transparent';

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
      <div
        style={{
          width: '1400px',
          backgroundColor: '#181825',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
        }}
      >
        {/* Header Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '18px', color: '#FAB387', letterSpacing: '0.15em', fontWeight: 'bold' }}>
              GIT BRANCH LOG • ORIGIN/MAIN
            </div>
            <div style={{ fontSize: '30px', color: '#CDD6F4', fontWeight: 'bold', marginTop: '4px' }}>
              Recent Repository Commits
            </div>
          </div>
          <span style={{ fontSize: '18px', color: '#A6ADC8' }}>HEAD -&gt; main, origin/main</span>
        </div>

        {/* Git Tree Commit List */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            transform: `translateY(${scrollY}px)`,
          }}
        >
          {/* Vertical Branch Line */}
          <div
            style={{
              position: 'absolute',
              left: '27px',
              top: '20px',
              bottom: '20px',
              width: '4px',
              backgroundColor: 'rgba(250, 179, 135, 0.3)',
              borderRadius: '2px',
            }}
          />

          {commits.map((commit) => {
            const isVisible = frame >= commit.startFrame;

            const scale = isVisible
              ? spring({
                  frame: frame - commit.startFrame,
                  fps,
                  config: { damping: 12, stiffness: 110 },
                })
              : 0;

            const opacity = interpolate(frame, [commit.startFrame, commit.startFrame + 10], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            return (
              <div
                key={commit.hash}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '28px',
                  opacity,
                  transform: `scale(${scale})`,
                  transformOrigin: 'left center',
                }}
              >
                {/* Commit Node Circle */}
                <div
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    backgroundColor: '#FAB387',
                    border: '6px solid #181825',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 15px rgba(250, 179, 135, 0.4)',
                  }}
                >
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#181825' }} />
                </div>

                {/* Commit Card Info */}
                <div
                  style={{
                    flex: 1,
                    backgroundColor: '#1E1E2E',
                    borderRadius: '16px',
                    padding: '20px 28px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ color: '#FAB387', fontWeight: 'bold', fontSize: '22px' }}>
                        commit {commit.hash}
                      </span>
                      {commit.tag && (
                        <span
                          style={{
                            backgroundColor: 'rgba(166, 227, 161, 0.2)',
                            color: '#A6E3A1',
                            padding: '2px 10px',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                          }}
                        >
                          tag: {commit.tag}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '24px', color: '#CDD6F4', fontWeight: 500 }}>{commit.msg}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ fontSize: '20px', color: '#BAC2DE', fontWeight: 600 }}>{commit.author}</span>
                    <span style={{ fontSize: '16px', color: '#6C7086' }}>{commit.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
