import React from 'react';
import { Composition } from 'remotion';
import './index.css';

import { LowerThirdCorporate } from './LowerThirdCorporate';
import { LowerThirdBroadcast } from './LowerThirdBroadcast';
import { LowerThirdTechPill } from './LowerThirdTechPill';
import { LowerThirdEditorial } from './LowerThirdEditorial';
import { LowerThirdPodcast } from './LowerThirdPodcast';
import { LowerThirdCinema } from './LowerThirdCinema';
import { LowerThirdSports } from './LowerThirdSports';
import { LowerThirdFinance } from './LowerThirdFinance';
import { LowerThirdCreative } from './LowerThirdCreative';
import { LowerThirdCyberTech } from './LowerThirdCyberTech';

const compositions = [
  { id: 'LowerThird-01-Corporate', component: LowerThirdCorporate },
  { id: 'LowerThird-02-Broadcast', component: LowerThirdBroadcast },
  { id: 'LowerThird-03-TechPill', component: LowerThirdTechPill },
  { id: 'LowerThird-04-Editorial', component: LowerThirdEditorial },
  { id: 'LowerThird-05-Podcast', component: LowerThirdPodcast },
  { id: 'LowerThird-06-Cinema', component: LowerThirdCinema },
  { id: 'LowerThird-07-Sports', component: LowerThirdSports },
  { id: 'LowerThird-08-Finance', component: LowerThirdFinance },
  { id: 'LowerThird-09-Creative', component: LowerThirdCreative },
  { id: 'LowerThird-10-CyberTech', component: LowerThirdCyberTech },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {compositions.map((comp) => (
        <Composition
          key={comp.id}
          id={comp.id}
          component={comp.component}
          durationInFrames={180} // 6 seconds at 30fps: in -> hold -> out
          fps={30}
          width={3840}
          height={2160}
        />
      ))}
    </>
  );
};
