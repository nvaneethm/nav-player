import React from "react";
import useVideoPlayer from "../hooks/useVideoPlayer";
import PlayerMetrics from "./PlayerMatrix"; // Import the QoE component


interface VideoPlayerProps {
  src: string;
  pluginName: string;
  drmType?: string | null;
  licenseUrl?: string | null;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, pluginName, drmType, licenseUrl }) => {
  const { playerContainerRef, playerInstance } = useVideoPlayer(pluginName, src, drmType, licenseUrl);

  return (
    <>
      <div ref={playerContainerRef} className={"videoContainer"} />
      {playerInstance && <PlayerMetrics playerInstance={playerInstance} />}
    </>
  );
};

export default VideoPlayer;