import React from 'react';
import { Composition } from 'remotion';
import './index.css';
import { ScanningGridOverlay } from './compositions/ScanningGridOverlay';
import { RotatingCipherLockRings } from './compositions/RotatingCipherLockRings';
import { CircuitBoardPulseLines } from './compositions/CircuitBoardPulseLines';
import { BinaryCodeCascade } from './compositions/BinaryCodeCascade';
import { LockAssemblyAnimation } from './compositions/LockAssemblyAnimation';
import { VPNConnectionStatusWidget } from './compositions/VPNConnectionStatusWidget';
import { SecureFileTransferCard } from './compositions/SecureFileTransferCard';
import { NewLoginAlertCard } from './compositions/NewLoginAlertCard';
import { AntivirusScanResultCard } from './compositions/AntivirusScanResultCard';
import { E2EEncryptionToggleCard } from './compositions/E2EEncryptionToggleCard';
import { SessionTimeoutCountdownCard } from './compositions/SessionTimeoutCountdownCard';
import { TrustedDevicesListCard } from './compositions/TrustedDevicesListCard';
import { PasswordManagerAutofillPopup } from './compositions/PasswordManagerAutofillPopup';
import { SecurityHealthScoreCard } from './compositions/SecurityHealthScoreCard';
import { DataAccessPermissionCard } from './compositions/DataAccessPermissionCard';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ScanningGridOverlay"
        component={ScanningGridOverlay}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          gridSize: { cols: 12, rows: 7 },
          accentColor: '#3B82F6',
          nodeCount: 5,
        }}
      />
      <Composition
        id="RotatingCipherLockRings"
        component={RotatingCipherLockRings}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          ringCount: 4,
          accentColor: '#22D3EE',
          segmentPerRing: 16,
          lockState: 'locking',
        }}
      />
      <Composition
        id="CircuitBoardPulseLines"
        component={CircuitBoardPulseLines}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          pathCount: 8,
          accentColor: '#22D3EE',
          pulseSpeed: 'medium',
        }}
      />
      <Composition
        id="BinaryCodeCascade"
        component={BinaryCodeCascade}
        durationInFrames={240}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          columnCount: 24,
          rowCount: 14,
          accentColor: '#22D3EE',
          highlightRatio: 0.08,
        }}
      />
      <Composition
        id="LockAssemblyAnimation"
        component={LockAssemblyAnimation}
        durationInFrames={240}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#22D3EE',
          particleCount: 60,
          lockShapeSize: 400,
        }}
      />
      <Composition
        id="VPNConnectionStatusWidget"
        component={VPNConnectionStatusWidget}
        durationInFrames={240}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          locationLabel: 'Singapore',
          accentColor: '#22D3EE',
          connectDuration: 60,
        }}
      />
      <Composition
        id="SecureFileTransferCard"
        component={SecureFileTransferCard}
        durationInFrames={240}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          fileName: 'financial_report.pdf',
          fileSize: '24.6 MB',
          accentColor: '#22D3EE',
        }}
      />
      <Composition
        id="NewLoginAlertCard"
        component={NewLoginAlertCard}
        durationInFrames={270}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          deviceType: 'laptop',
          locationLabel: 'Jakarta, Indonesia',
          timeLabel: 'Today, 14:32',
          accentColor: '#22D3EE',
        }}
      />
      <Composition
        id="AntivirusScanResultCard"
        component={AntivirusScanResultCard}
        durationInFrames={240}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          filesScanned: 1204,
          threatsFound: 0,
          scanDuration: '2m 14s',
          accentColor: '#22D3EE',
        }}
      />
      <Composition
        id="E2EEncryptionToggleCard"
        component={E2EEncryptionToggleCard}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#22D3EE',
        }}
      />
      <Composition
        id="SessionTimeoutCountdownCard"
        component={SessionTimeoutCountdownCard}
        durationInFrames={300}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          startSeconds: 30,
          warningThreshold: 10,
          accentColor: '#22D3EE',
        }}
      />
      <Composition
        id="TrustedDevicesListCard"
        component={TrustedDevicesListCard}
        durationInFrames={270}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          accentColor: '#22D3EE',
        }}
      />
      <Composition
        id="PasswordManagerAutofillPopup"
        component={PasswordManagerAutofillPopup}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          siteLabel: 'example.com',
          accentColor: '#22D3EE',
        }}
      />
      <Composition
        id="SecurityHealthScoreCard"
        component={SecurityHealthScoreCard}
        durationInFrames={240}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          score: 92,
          recommendationCount: 3,
          accentColor: '#22D3EE',
        }}
      />
      <Composition
        id="DataAccessPermissionCard"
        component={DataAccessPermissionCard}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{
          appName: 'PhotoEditor Pro',
          dataCategory: 'contacts',
          accentColor: '#22D3EE',
        }}
      />
    </>
  );
};





