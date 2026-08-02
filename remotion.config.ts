import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');

// Stock Footage CLI Render Commands Reference:
// For ProRes 4444 Transparent Alpha Stock Footage:
// npx remotion render 01-CodeTyping-Alpha out/01-CodeTyping-Alpha.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le
//
// For H.264 MP4 4K Stock Footage:
// npx remotion render 01-CodeTyping-Solid out/01-CodeTyping-Solid.mp4 --codec=h264
