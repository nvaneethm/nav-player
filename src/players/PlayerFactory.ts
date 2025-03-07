import { IPlayer } from './IPlayer';
import { HLSPlayerPlugin } from './plugins/HLSPlayerPlugin';
import { ShakaPlayerPlugin } from './plugins/ShakaPlayerPlugin';
import { VideoJSPlugin } from './plugins/VideoJSPlugin';

export const VIDEO_JS = 'videojs'
export const SHAKA_PLAYER = 'shaka'
export const HLS_JS = 'hls'


export function createPlayer(pluginName: string): IPlayer {
  switch (pluginName) {
    case SHAKA_PLAYER:
      return new ShakaPlayerPlugin();
    case VIDEO_JS:
        return new VideoJSPlugin();
    case HLS_JS:
        return new HLSPlayerPlugin();
    default:
      throw new Error(`Unknown player plugin: ${pluginName}`);
  }
}
