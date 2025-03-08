import React from "react";
import useVideoPlayer from "../hooks/useVideoPlayer";
import PlayerMetrics from "./PlayerMatrix"; // Import the QoE component

interface VideoPlayerProps {
  src: string;
  pluginName: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, pluginName }) => {
  const { playerContainerRef, playerInstance } = useVideoPlayer(pluginName, src);

  return (
    <>
      <div ref={playerContainerRef} className={"videoContainer"} />
      {playerInstance && <PlayerMetrics playerInstance={playerInstance} />}
    </>
  );
};

export default VideoPlayer;