import React, { useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import VideoURLInput from "./components/VideoURLInput"; // Import the new component
import PluginManager from "./players/PluginManager";
import { SHAKA_PLAYER, VIDEO_JS } from "./players/PlayerFactory";
import ErrorBoundary from "./components/ErrorBoundary";
import PlayerSelectorAccordion from "./components/PlayerSelectorAccordion";

const SAMPLE_VIDEO = // 'https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd';
  "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8";

const App: React.FC = () => {
  const [selectedPlugin, setSelectedPlugin] = useState<string>(VIDEO_JS);
  const [videoSrc, setVideoSrc] = useState<string>(SAMPLE_VIDEO);
  const [drmType, setDrmType] = useState<string | null>(null);
  const [licenseUrl, setLicenseUrl] = useState<string | null>(null);

  const handleLoadVideo = (
    url: string,
    drm: string | null,
    license: string | null
  ) => {
    setVideoSrc(url);
    setDrmType(drm);
    setLicenseUrl(license);
  };

  const availablePlugins = PluginManager.getAvailablePlugins();

  return (
    <div>
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Nav Stream/Player Tester
      </h1>

      <div className={"dashBoard"}>
        <PlayerSelectorAccordion
          selectedPlayer={selectedPlugin}
          availablePlayers={availablePlugins}
          onSelect={setSelectedPlugin}
        ></PlayerSelectorAccordion>

        <ErrorBoundary>
          <VideoPlayer
            src={videoSrc}
            pluginName={selectedPlugin}
            drmType={drmType}
            licenseUrl={licenseUrl}
          />
        </ErrorBoundary>
      </div>

      <VideoURLInput defaultURL={SAMPLE_VIDEO} onLoad={handleLoadVideo} />
    </div>
  );
};

export default App;
