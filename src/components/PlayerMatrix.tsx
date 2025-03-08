import React from 'react';
import { IPlayer } from '../players/IPlayer';
import usePlayerMetrics from '../hooks/usePlayerMetrics';

interface PlayerMetricsProps {
  playerInstance: IPlayer | null;
}

const PlayerMetrics: React.FC<PlayerMetricsProps> = ({ playerInstance }) => {
    
  const metrics = usePlayerMetrics(playerInstance);


  return (
    <div className={"qoeContainer"}>
      <h3>🎥 Player QoE Metrics</h3>
      <div className={"metrics"}>
        <p><strong>📶 Bitrate:</strong> {metrics.currentBitrate} Kbps</p>
        <p><strong>📺 Resolution:</strong> {metrics.resolution}</p>
        <p><strong>🔄 Rendition Switches:</strong> {metrics.renditionSwitches}</p>
        <p><strong>⏳ Buffering:</strong> {metrics.buffering ? 'Yes 🔴' : 'No 🟢'}</p>
      </div>
      <h4>📋 Recent Player Events</h4>
      <ul className={"events"}>
        {metrics.events.map((event, index) => (
          <li key={index}>{event}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerMetrics;