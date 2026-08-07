import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { AlertBannerCard } from '../components/AlertBannerCard';

export interface DataBreachAlertBannerProps {
  alertMessage?: string;
  resolvedMessage?: string;
  dangerColor?: string;
  safeColor?: string;
}

export const DataBreachAlertBanner: React.FC<DataBreachAlertBannerProps> = ({
  alertMessage = 'Suspicious Login Detected',
  resolvedMessage = 'Threat Neutralized',
  dangerColor = '#DC2626',
  safeColor = '#16A34A',
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'transparent',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <AlertBannerCard
        frame={frame}
        alertMessage={alertMessage}
        resolvedMessage={resolvedMessage}
        dangerColor={dangerColor}
        safeColor={safeColor}
      />
    </AbsoluteFill>
  );
};
