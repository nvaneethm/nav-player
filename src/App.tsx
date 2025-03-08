import React, { useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import VideoURLInput from "./components/VideoURLInput"; // Import the new component
import PluginManager from "./players/PluginManager";
import { SHAKA_PLAYER, VIDEO_JS } from "./players/PlayerFactory";
import ErrorBoundary from "./components/ErrorBoundary";

const SAMPLE_VIDEO = // 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';
  "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8";

const App: React.FC = () => {
  const [selectedPlugin, setSelectedPlugin] = useState<string>(VIDEO_JS);
  const [videoSrc, setVideoSrc] = useState<string>(SAMPLE_VIDEO); // State for video URL

  const availablePlugins = PluginManager.getAvailablePlugins();

  return (
    <div>
      <h1>Nav ABR Video Player</h1>

      <div>
        <label htmlFor="player-select">🎥 Select Player: </label>
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
        <ErrorBoundary>
          <VideoPlayer src={videoSrc} pluginName={selectedPlugin} />
        </ErrorBoundary>
      </div>
      <VideoURLInput defaultURL={SAMPLE_VIDEO} onLoad={setVideoSrc} />
    </div>
  );
};

export default App;
