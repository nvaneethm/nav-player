import { useEffect, useRef, useState } from "react";
import PluginManager from "../players/PluginManager";
import { IPlayer } from "../players/IPlayer";

const useVideoPlayer = (pluginName: string, src: string, drmType: string | null | undefined, licenseUrl: string | null | undefined) => {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [playerInstance, setPlayerInstance] = useState<IPlayer | null>(null);

  useEffect(() => {
    const plugin = PluginManager.getPlugin(pluginName);
    if (!plugin) {
      console.error(`Plugin "${pluginName}" not found.`);
      return;
    }

    if (playerContainerRef.current) {
      const drmConfig = drmType && licenseUrl ? { drmType, licenseUrl } : null;
      plugin.initialize(playerContainerRef.current, drmConfig ? { drm: { [drmConfig.drmType]: { serverURL: drmConfig.licenseUrl } } } : {});
      plugin.load(src, drmConfig);
      setPlayerInstance(plugin);
    }

    return () => {
      if (plugin) {
        plugin.destroy();
      }
      setPlayerInstance(null);
    };
  }, [pluginName, src, drmType, licenseUrl]);

  return { playerContainerRef, playerInstance };
};

export default useVideoPlayer;