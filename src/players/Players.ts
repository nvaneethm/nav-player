import { createPlayer, HLS_JS, NAV_MSE, SHAKA_PLAYER, VIDEO_JS } from './PlayerFactory';
import PluginManager from './PluginManager';

// Register plugins as factories
PluginManager.registerPlugin(VIDEO_JS, () => createPlayer(VIDEO_JS));
PluginManager.registerPlugin(SHAKA_PLAYER, () => createPlayer(SHAKA_PLAYER));
PluginManager.registerPlugin(HLS_JS, () => createPlayer(HLS_JS));
PluginManager.registerPlugin(NAV_MSE, ()=>createPlayer(NAV_MSE))