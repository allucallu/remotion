import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { TerminalWindow } from '../components/TerminalWindow';
import { jetBrainsMonoFontFamily } from '../utils/fonts';

export interface TerminalAutocompleteProps {
  background?: 'alpha' | 'solid';
}

export const TerminalAutocomplete: React.FC<TerminalAutocompleteProps> = ({ background = 'solid' }) => {
  const frame = useCurrentFrame();

  const fullCommand = 'git commit -m "feat(auth): implement oauth2 token flow"';
  const typedLength = Math.floor(
    interpolate(frame, [15, 120], [0, fullCommand.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const typedText = fullCommand.slice(0, typedLength);

  // Suggestions panel appears after frame 45
  const showSuggestions = frame >= 45;
  const suggestionOpacity = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const suggestions = [
    { cmd: 'git commit -m "feat(auth): implement oauth2 token flow"', desc: 'commit changes with message' },
    { cmd: 'git commit --amend --no-edit', desc: 'modify previous commit' },
    { cmd: 'git commit -S -m "release: v2.4.0"', desc: 'signed release commit' },
  ];

  const isCursorVisible = Math.floor(frame / 15) % 2 === 0;
  const bgColor = background === 'solid' ? '#111111' : 'transparent';

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
        title="fish — ~/projects/saas-core"
        width="1400px"
        height="750px"
        backgroundColor="#111111"
        borderColor="rgba(255, 255, 255, 0.12)"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', fontSize: '32px' }}>
          {/* Previous Command Log */}
          <div style={{ color: '#666666', fontSize: '24px' }}>
            [info] Working tree clean. 3 commits ahead of origin/main.
          </div>

          {/* Active Command Prompt Line */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#4ADE80', fontWeight: 'bold', marginRight: '16px' }}>❯</span>
            <span style={{ color: '#38BDF8', fontWeight: 600, marginRight: '16px' }}>~/saas-core</span>
            <span style={{ color: '#FACC15', marginRight: '20px' }}>(main)</span>

            <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{typedText}</span>

            {/* Blinking Cursor */}
            <span
              style={{
                opacity: isCursorVisible ? 1 : 0,
                backgroundColor: '#4ADE80',
                width: '16px',
                height: '36px',
                display: 'inline-block',
                marginLeft: '4px',
                verticalAlign: 'middle',
              }}
            />
          </div>

          {/* AI Autocomplete Suggestion Popup */}
          {showSuggestions && (
            <div
              style={{
                opacity: suggestionOpacity,
                backgroundColor: '#1E1E1E',
                border: '1px solid #333333',
                borderRadius: '12px',
                padding: '20px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                marginTop: '10px',
              }}
            >
              <div style={{ fontSize: '18px', color: '#888888', letterSpacing: '0.1em', fontWeight: 600 }}>
                AI AUTOCOMPLETE SUGGESTIONS [TAB TO ACCEPT]
              </div>
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '24px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: index === 0 ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
                    borderLeft: index === 0 ? '4px solid #4ADE80' : '4px solid transparent',
                  }}
                >
                  <span style={{ color: index === 0 ? '#FFFFFF' : '#777777' }}>{item.cmd}</span>
                  <span style={{ fontSize: '18px', color: '#555555' }}>{item.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </TerminalWindow>
    </AbsoluteFill>
  );
};
