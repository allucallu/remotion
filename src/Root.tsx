import React from 'react';
import { Composition } from 'remotion';
import './index.css';

import { SecurityToastStack } from './compositions/SecurityToastStack';
import { PasswordStrengthMeter } from './compositions/PasswordStrengthMeter';
import { VulnerabilityScanSweep } from './compositions/VulnerabilityScanSweep';
import { EncryptedDataTransfer } from './compositions/EncryptedDataTransfer';
import { TwoFactorAuthFlow } from './compositions/TwoFactorAuthFlow';
import { FirewallNetworkBlock } from './compositions/FirewallNetworkBlock';
import { PrivacyToggleSwitcher } from './compositions/PrivacyToggleSwitcher';
import { DataBreachAlertBanner } from './compositions/DataBreachAlertBanner';
import { ComplianceBadgeReveal } from './compositions/ComplianceBadgeReveal';
import { LiveThreatCounterTicker } from './compositions/LiveThreatCounterTicker';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 1. Security Toast Stack Composition (4K UHD @ 60fps, 480 frames / 8s, Full Alpha) */}
      <Composition
        id="SecurityToastStack"
        component={SecurityToastStack}
        durationInFrames={480}
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          position: 'top-right',
          accentColor: '#2563EB',
        }}
      />

      {/* 2. Password Strength Meter Composition (4K UHD @ 60fps, 360 frames / 6s, Full Alpha) */}
      <Composition
        id="PasswordStrengthMeter"
        component={PasswordStrengthMeter}
        durationInFrames={360}
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          showInputField: true,
          labelTexts: {
            weak: 'Weak Password',
            fair: 'Fair Password',
            strong: 'Strong Password',
            veryStrong: 'Very Strong Password',
          },
        }}
      />

      {/* 3. Vulnerability Scan Sweep Composition (4K UHD @ 60fps, 480 frames / 8s, Full Alpha) */}
      <Composition
        id="VulnerabilityScanSweep"
        component={VulnerabilityScanSweep}
        durationInFrames={480}
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          scanDirection: 'vertical',
          accentColor: '#2563EB',
        }}
      />

      {/* 4. Encrypted Data Transfer Composition (4K UHD @ 60fps, 480 frames / 8s, Full Alpha) */}
      <Composition
        id="EncryptedDataTransfer"
        component={EncryptedDataTransfer}
        durationInFrames={480}
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          packetCount: 6,
          gateLabel: 'AES-256 Encryption',
          accentColor: '#2563EB',
          direction: 'left-to-right',
        }}
      />

      {/* 5. Two-Factor Authentication Flow Composition (4K UHD @ 60fps, 360 frames / 6s, Full Alpha) */}
      <Composition
        id="TwoFactorAuthFlow"
        component={TwoFactorAuthFlow}
        durationInFrames={360}
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          otpLength: 6,
          successMessage: 'Verified',
          accentColor: '#2563EB',
        }}
      />

      {/* 6. Firewall Network Block Composition (4K UHD @ 60fps, 480 frames / 8s, Full Alpha) */}
      <Composition
        id="FirewallNetworkBlock"
        component={FirewallNetworkBlock}
        durationInFrames={480}
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          nodeLabels: {
            user: 'User Endpoint',
            firewall: 'Firewall Shield',
            server: 'App Server',
            cloud: 'Cloud Storage',
          },
          threatCount: 3,
          accentColor: '#2563EB',
          dangerColor: '#DC2626',
        }}
      />

      {/* 7. Privacy Toggle Switcher Composition (4K UHD @ 60fps, 420 frames / 7s, Full Alpha) */}
      <Composition
        id="PrivacyToggleSwitcher"
        component={PrivacyToggleSwitcher}
        durationInFrames={420}
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#2563EB',
          panelTitle: 'Privacy Settings',
        }}
      />

      {/* 8. Data Breach Alert Banner Composition (4K UHD @ 60fps, 420 frames / 7s, Full Alpha) */}
      <Composition
        id="DataBreachAlertBanner"
        component={DataBreachAlertBanner}
        durationInFrames={420}
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          alertMessage: 'Suspicious Login Detected',
          resolvedMessage: 'Threat Neutralized',
          dangerColor: '#DC2626',
          safeColor: '#16A34A',
        }}
      />

      {/* 9. Compliance Badge Reveal Composition (4K UHD @ 60fps, 480 frames / 8s, Full Alpha) */}
      <Composition
        id="ComplianceBadgeReveal"
        component={ComplianceBadgeReveal}
        durationInFrames={480}
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          layout: 'horizontal-row',
          accentColor: '#2563EB',
          titleText: 'TRUSTED & COMPLIANT ENTERPRISE SECURITY',
        }}
      />

      {/* 10. Live Threat Counter Ticker Composition (4K UHD @ 60fps, 600 frames / 10s, Full Alpha Seamless Loop) */}
      <Composition
        id="LiveThreatCounterTicker"
        component={LiveThreatCounterTicker}
        durationInFrames={600}
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#2563EB',
          showMiniChart: true,
        }}
      />
    </>
  );
};
