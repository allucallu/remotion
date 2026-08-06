import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');

// Stock Footage CLI Render Commands Reference (ProRes 4444 Alpha MOV):
// npx remotion render 01-TargetLockReticle-Alpha out/01-TargetLockReticle-Alpha.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le
