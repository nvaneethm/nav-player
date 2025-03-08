import React, { useEffect, useRef, useState } from "react";
import PluginManager from "../players/PluginManager";
import { IPlayer } from "../players/IPlayer";
import PlayerMetrics from "./PlayerMatrix"; // Import the new component

interface VideoPlayerProps {
  src: string;
  pluginName: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, pluginName }) => {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [playerInstance, setPlayerInstance] = useState<IPlayer | null>(null);

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

  return (
    <>
      <div ref={playerContainerRef} className={"videoContainer"} />
      {playerInstance && <PlayerMetrics playerInstance={playerInstance} />}
    </>
  );
};

export default VideoPlayer;
