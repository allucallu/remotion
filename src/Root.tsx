import React from 'react';
import { Composition } from 'remotion';
import './index.css';

import { SocialCtaSubscribePill } from './SocialCtaSubscribePill';
import { SocialCtaFollowerCount } from './SocialCtaFollowerCount';
import { SocialCtaNotifyBell } from './SocialCtaNotifyBell';
import { SocialCtaHandleBar } from './SocialCtaHandleBar';
import { SocialCtaPlayWatch } from './SocialCtaPlayWatch';
import { SocialCtaLikeEngage } from './SocialCtaLikeEngage';
import { SocialCtaJoinCommunity } from './SocialCtaJoinCommunity';
import { SocialCtaSplitDualBar } from './SocialCtaSplitDualBar';
import { SocialCtaSwipeUp } from './SocialCtaSwipeUp';
import { SocialCtaLiveNow } from './SocialCtaLiveNow';

const compositions = [
  { id: 'SocialCta-01-SubscribePill', component: SocialCtaSubscribePill, dur: 180 },
  { id: 'SocialCta-02-FollowerCount', component: SocialCtaFollowerCount, dur: 180 },
  { id: 'SocialCta-03-NotifyBell', component: SocialCtaNotifyBell, dur: 210 },
  { id: 'SocialCta-04-HandleBar', component: SocialCtaHandleBar, dur: 180 },
  { id: 'SocialCta-05-PlayWatch', component: SocialCtaPlayWatch, dur: 180 },
  { id: 'SocialCta-06-LikeEngage', component: SocialCtaLikeEngage, dur: 180 },
  { id: 'SocialCta-07-JoinCommunity', component: SocialCtaJoinCommunity, dur: 210 },
  { id: 'SocialCta-08-SplitDualBar', component: SocialCtaSplitDualBar, dur: 180 },
  { id: 'SocialCta-09-SwipeUp', component: SocialCtaSwipeUp, dur: 210 },
  { id: 'SocialCta-10-LiveNow', component: SocialCtaLiveNow, dur: 180 },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {compositions.map((comp) => (
        <Composition
          key={comp.id}
          id={comp.id}
          component={comp.component}
          durationInFrames={comp.dur}
          fps={30}
          width={3840}
          height={2160}
        />
      ))}
    </>
  );
};
