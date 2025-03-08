import React from "react";
import useVideoPlayer from "../hooks/useVideoPlayer";
import PlayerMetrics from "./PlayerMatrix"; // Import the QoE component
import RenditionSelectorAccordion from "./RenditionSelectorAccordion";
import DeviceCapabilitiesAccordion from "./DeviceCapabilitiesAccordion";
import StreamDetailsAccordion from "./StreamDetailsAccordion";

interface VideoPlayerProps {
  src: string;
  pluginName: string;
  drmType?: string | null;
  licenseUrl?: string | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  pluginName,
  drmType,
  licenseUrl,
}) => {
  const { playerContainerRef, playerInstance } = useVideoPlayer(
    pluginName,
    src,
    drmType,
    licenseUrl
  );

  return (
    <>
      <div ref={playerContainerRef} className={"videoContainer"} />
      {playerInstance && <PlayerMetrics playerInstance={playerInstance} />}
      {playerInstance && (
        <RenditionSelectorAccordion playerInstance={playerInstance} />
      )}
      <DeviceCapabilitiesAccordion />
      <StreamDetailsAccordion
        videoURL={src}
        drmType={drmType}
        licenseUrl={licenseUrl}
      />
    </>
  );
};

export default VideoPlayer;
