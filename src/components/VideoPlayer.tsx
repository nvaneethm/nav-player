import React, { useEffect, useRef, useState } from 'react';
import PluginManager from '../players/PluginManager';
import { IPlayer } from '../players/IPlayer';
import styles from './VideoPlayer.module.css'; // Import the CSS module


interface VideoPlayerProps {
  src: string; // Video manifest URL
  pluginName: string; // Name of the plugin to use
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, pluginName }) => {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [playerInstance, setPlayerInstance] = useState<IPlayer | null>(null);
//   const bandwidth = useBandwidth(); // in Kbps
useEffect(() => {
  const plugin = PluginManager.getPlugin(pluginName);
  if (!plugin) {
    console.error(`Plugin "${pluginName}" not found.`);
    return;
  }

  if (playerContainerRef.current) {
    plugin.initialize(playerContainerRef.current, {});
    plugin.load(src);
    setPlayerInstance(plugin);
  }

  return () => {
    if (plugin) {
      plugin.destroy();
    }
    setPlayerInstance(null);
  };
}, [pluginName, src]);

//   useEffect(() => {
//     if (playerInstance) {
//       // Adjust max bandwidth based on current bandwidth
//       // This is a simplistic approach; you might want to implement more sophisticated logic
//       playerInstance['setMaxBandwidth']?.(bandwidth);
//     }
//   }, [bandwidth, playerInstance]);

return <div ref={playerContainerRef} className={styles.videoContainer} />;

};

export default VideoPlayer;