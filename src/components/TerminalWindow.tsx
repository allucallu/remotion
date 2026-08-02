import React from 'react';

export interface TerminalWindowProps {
  title?: string;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  borderColor?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  title = 'bash — 120×40',
  width = '1100px',
  height = 'auto',
  backgroundColor = '#1E1E1E',
  borderColor = 'rgba(255, 255, 255, 0.1)',
  children,
  style,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor,
        borderRadius: '16px',
        border: `1px solid ${borderColor}`,
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Title Bar */}
      <div
        style={{
          height: '52px',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          borderBottom: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          position: 'relative',
        }}
      >
        {/* macOS Action Buttons */}
        <div style={{ display: 'flex', gap: '9px' }}>
          <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: '#FF5F56', border: '1px solid #E0443E' }} />
          <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: '#FFBD2E', border: '1px solid #DEA123' }} />
          <div style={{ width: '13px', height: '13px', borderRadius: '50%', backgroundColor: '#27C93F', border: '1px solid #1AAB29' }} />
        </div>

        {/* Window Title */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.45)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            pointerEvents: 'none',
          }}
        >
          {title}
        </div>
      </div>

      {/* Terminal Body Content */}
      <div style={{ padding: '40px', flex: 1, position: 'relative' }}>
        {children}
      </div>
    </div>
  );
};
