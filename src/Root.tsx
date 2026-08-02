import React from 'react';
import { Composition } from 'remotion';
import './index.css';

import { CodeTyping } from './compositions/01-CodeTyping';
import { ApiJsonStream } from './compositions/02-ApiJsonStream';
import { CicdPipeline } from './compositions/03-CicdPipeline';
import { TerminalAutocomplete } from './compositions/04-TerminalAutocomplete';
import { SqlQueryTable } from './compositions/05-SqlQueryTable';
import { ServerPing } from './compositions/06-ServerPing';
import { AiModelTraining } from './compositions/07-AiModelTraining';
import { GitCommitLog } from './compositions/08-GitCommitLog';
import { KubernetesPods } from './compositions/09-KubernetesPods';
import { BuildSuccessBadge } from './compositions/10-BuildSuccessBadge';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 01. Code Typing */}
      <Composition
        id="01-CodeTyping-Solid"
        component={CodeTyping}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'solid' }}
      />
      <Composition
        id="01-CodeTyping-Alpha"
        component={CodeTyping}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'alpha' }}
      />

      {/* 02. API JSON Stream */}
      <Composition
        id="02-ApiJsonStream-Solid"
        component={ApiJsonStream}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'solid' }}
      />
      <Composition
        id="02-ApiJsonStream-Alpha"
        component={ApiJsonStream}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'alpha' }}
      />

      {/* 03. CI/CD Pipeline */}
      <Composition
        id="03-CicdPipeline-Solid"
        component={CicdPipeline}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'solid' }}
      />
      <Composition
        id="03-CicdPipeline-Alpha"
        component={CicdPipeline}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'alpha' }}
      />

      {/* 04. Terminal Autocomplete */}
      <Composition
        id="04-TerminalAutocomplete-Solid"
        component={TerminalAutocomplete}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'solid' }}
      />
      <Composition
        id="04-TerminalAutocomplete-Alpha"
        component={TerminalAutocomplete}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'alpha' }}
      />

      {/* 05. SQL Query Table */}
      <Composition
        id="05-SqlQueryTable-Solid"
        component={SqlQueryTable}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'solid' }}
      />
      <Composition
        id="05-SqlQueryTable-Alpha"
        component={SqlQueryTable}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'alpha' }}
      />

      {/* 06. Server Ping */}
      <Composition
        id="06-ServerPing-Solid"
        component={ServerPing}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'solid' }}
      />
      <Composition
        id="06-ServerPing-Alpha"
        component={ServerPing}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'alpha' }}
      />

      {/* 07. AI Model Training */}
      <Composition
        id="07-AiModelTraining-Solid"
        component={AiModelTraining}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'solid' }}
      />
      <Composition
        id="07-AiModelTraining-Alpha"
        component={AiModelTraining}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'alpha' }}
      />

      {/* 08. Git Commit Log */}
      <Composition
        id="08-GitCommitLog-Solid"
        component={GitCommitLog}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'solid' }}
      />
      <Composition
        id="08-GitCommitLog-Alpha"
        component={GitCommitLog}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'alpha' }}
      />

      {/* 09. Kubernetes Pods */}
      <Composition
        id="09-KubernetesPods-Solid"
        component={KubernetesPods}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'solid' }}
      />
      <Composition
        id="09-KubernetesPods-Alpha"
        component={KubernetesPods}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'alpha' }}
      />

      {/* 10. Build Success Badge */}
      <Composition
        id="10-BuildSuccessBadge-Solid"
        component={BuildSuccessBadge}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'solid' }}
      />
      <Composition
        id="10-BuildSuccessBadge-Alpha"
        component={BuildSuccessBadge}
        durationInFrames={210}
        fps={30}
        width={3840}
        height={2160}
        defaultProps={{ background: 'alpha' }}
      />
    </>
  );
};
