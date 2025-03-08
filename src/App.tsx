import React, { useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import PluginManager from "./players/PluginManager";
import { SHAKA_PLAYER, VIDEO_JS } from "./players/PlayerFactory";
const SAMPLE_VIDEO = // 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';
  "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8";
const App: React.FC = () => {
  const [selectedPlugin, setSelectedPlugin] = useState<string>(VIDEO_JS);
  const videoSrc = SAMPLE_VIDEO; // Replace with your DASH/HLS manifest URL

  const availablePlugins = PluginManager.getAvailablePlugins();

  return (
    <div>
      <h1>React ABR Video Player</h1>

      <div>
        <label htmlFor="player-select">Select Player: </label>
        <select
          id="player-select"
          value={selectedPlugin}
          onChange={(e) => setSelectedPlugin(e.target.value)}
        >
          {availablePlugins.map((plugin) => (
            <option key={plugin} value={plugin}>
              {plugin.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div className={"dashBoard"}>
        <VideoPlayer src={videoSrc} pluginName={selectedPlugin} />
      </div>
    </div>
  );
};

export default App;
