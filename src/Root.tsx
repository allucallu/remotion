import React from 'react';
import { Composition, CalculateMetadataFunction } from 'remotion';
import './index.css';
import { LiveJSONResponseStream } from './compositions/LiveJSONResponseStream';
import { DigitalDataStreamBackground } from './compositions/DigitalDataStreamBackground';
import {
  StatusIndicatorBadgeCycle,
  StatusIndicatorBadgeCycleProps,
} from './compositions/StatusIndicatorBadgeCycle';
import { DataFlowConnectionPulse } from './compositions/DataFlowConnectionPulse';
import { RequestBuilderMockup } from './compositions/RequestBuilderMockup';
import { TerminalCurlTyping } from './compositions/TerminalCurlTyping';
import { JSONTreeExpandCollapse } from './compositions/JSONTreeExpandCollapse';
import { LoadingResultTransition } from './compositions/LoadingResultTransition';
import { HeaderInspectorPanel } from './compositions/HeaderInspectorPanel';
import { RealtimeDataTicker } from './compositions/RealtimeDataTicker';
import { DataDiffValidationOverlay } from './compositions/DataDiffValidationOverlay';

const calculateBadgeCycleMetadata: CalculateMetadataFunction<
  StatusIndicatorBadgeCycleProps
> = ({ props }) => {
  const itemsCount = props.items?.length || 5;
  const framesPerCycle = props.framesPerCycle || 180;
  return {
    durationInFrames: itemsCount * framesPerCycle,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LiveJSONResponseStream"
        component={LiveJSONResponseStream}
        durationInFrames={480} // 8.0 seconds at 60fps
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          useGreenScreen: false,
          fileName: 'response.json',
          panelWidthRatio: 0.7,
          panelBorderRadius: 24,
          fontSize: 36,
          lineHeight: 60,
          staggerDelayFrames: 6,
          lineAnimationDurationFrames: 18,
          tokenFadeDurationFrames: 12,
        }}
      />
      <Composition
        id="DigitalDataStreamBackground"
        component={DigitalDataStreamBackground}
        durationInFrames={480} // 8.0 seconds at 60fps (loop-friendly)
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          useGreenScreen: false,
          headerLabel: 'SYSTEM',
          panelWidthRatio: 0.7,
          panelBorderRadius: 24,
          fontSize: 36,
          lineHeight: 60,
          staggerDelayFrames: 6,
          lineAnimationDurationFrames: 18,
          tokenFadeDurationFrames: 12,
          enableLoopCrossfade: true,
          loopCrossfadeDurationFrames: 30,
        }}
      />
      <Composition
        id="StatusIndicatorBadgeCycle"
        component={StatusIndicatorBadgeCycle}
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          useGreenScreen: false,
          framesPerCycle: 180,
          badgeWidth: 1180,
          badgeHeight: 110,
          fontSize: 30,
        }}
        calculateMetadata={calculateBadgeCycleMetadata}
      />
      <Composition
        id="DataFlowConnectionPulse"
        component={DataFlowConnectionPulse}
        durationInFrames={360} // 6.0 seconds at 60fps (loop-friendly)
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          useGreenScreen: false,
          nodeALabel: 'NODE A',
          nodeBLabel: 'NODE B',
          nodeASubLabel: 'TRANSMITTER',
          nodeBSubLabel: 'RECEIVER',
          packetColorForward: '#60A5FA',
          packetColorReturn: '#4ADE80',
        }}
      />
      <Composition
        id="RequestBuilderMockup"
        component={RequestBuilderMockup}
        durationInFrames={360} // 6.0 seconds at 60fps
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          useGreenScreen: false,
          method: 'GET',
          urlPath: 'https://api.cloud.internal/v1/resource',
          sendButtonLabel: 'Send',
          sendClickFrame: 180,
          responseStatusText: '200 OK',
        }}
      />
      <Composition
        id="TerminalCurlTyping"
        component={TerminalCurlTyping}
        durationInFrames={360} // 6.0 seconds at 60fps
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          useGreenScreen: false,
          windowTitle: 'terminal',
          promptSymbol: '$ ',
          commandText: 'curl -X GET https://example.com/api/data',
          startTypingFrame: 24,
          pauseDurationFrames: 24,
        }}
      />
      <Composition
        id="JSONTreeExpandCollapse"
        component={JSONTreeExpandCollapse}
        durationInFrames={420} // 7.0 seconds at 60fps (loop-friendly)
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          useGreenScreen: false,
          panelWidthRatio: 0.7,
          panelBorderRadius: 24,
          fontSize: 32,
          lineHeight: 56,
        }}
      />
      <Composition
        id="LoadingResultTransition"
        component={LoadingResultTransition}
        durationInFrames={360} // 6.0 seconds at 60fps
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          useGreenScreen: false,
          resultType: 'success',
          label: 'Request Succeeded',
          circleSize: 240,
        }}
      />
      <Composition
        id="HeaderInspectorPanel"
        component={HeaderInspectorPanel}
        durationInFrames={360} // 6.0 seconds at 60fps
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          useGreenScreen: false,
          panelPosition: 'bottom-right',
          headerTitle: 'Details',
          panelWidth: 960,
          fontSize: 26,
        }}
      />
      <Composition
        id="RealtimeDataTicker"
        component={RealtimeDataTicker}
        durationInFrames={480} // 8.0 seconds at 60fps (loop-friendly)
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          useGreenScreen: false,
          headerTitle: 'LIVE METRICS TICKER',
          containerWidthRatio: 0.7,
          fontSize: 30,
          lineHeight: 76,
        }}
      />
      <Composition
        id="DataDiffValidationOverlay"
        component={DataDiffValidationOverlay}
        durationInFrames={360} // 6.0 seconds at 60fps
        fps={60}
        width={3840}
        height={2160}
        defaultProps={{
          useGreenScreen: false,
          leftLabel: 'Expected',
          rightLabel: 'Actual',
          differenceCount: 2,
        }}
      />
    </>
  );
};
