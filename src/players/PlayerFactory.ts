import { IPlayer } from './IPlayer';
import { HLSPlayerPlugin } from './plugins/HLSPlayerPlugin';
import { MSENavPlayerPlugin } from './plugins/MSENavPlayerPlugin';
import { ShakaPlayerPlugin } from './plugins/ShakaPlayerPlugin';
import { VideoJSPlugin } from './plugins/VideoJSPlugin';

export const VIDEO_JS = 'videojs'
export const SHAKA_PLAYER = 'shaka'
export const HLS_JS = 'hls'
export const NAV_MSE = 'mse-nav'


export function createPlayer(pluginName: string): IPlayer {
  switch (pluginName) {
    case SHAKA_PLAYER:
      return new ShakaPlayerPlugin();
    case VIDEO_JS:
        return new VideoJSPlugin();
    case HLS_JS:
        return new HLSPlayerPlugin();
    case NAV_MSE:
        return new MSENavPlayerPlugin();
    default:
      throw new Error(`Unknown player plugin: ${pluginName}`);
  }
}
