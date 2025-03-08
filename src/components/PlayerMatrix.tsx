import React, { useEffect, useState } from 'react';
import { IPlayer } from '../players/IPlayer';

interface PlayerMetricsProps {
  playerInstance: IPlayer | null;
}

const PlayerMetrics: React.FC<PlayerMetricsProps> = ({ playerInstance }) => {
    const [metrics, setMetrics] = useState({
      buffering: false,
      currentBitrate: 0,
      resolution: 'N/A',
      renditionSwitches: 0,
      events: [] as string[],
    });
  
    useEffect(() => {
      if (!playerInstance) return;
  
      const updateMetrics = () => {
        setMetrics((prev) => ({
          ...prev,
          currentBitrate: playerInstance.getBitrate?.() || prev.currentBitrate,
          resolution: playerInstance.getResolution?.() || prev.resolution,
        }));
      };
  
      const handleEvent = (event: string) => {
        setMetrics((prev) => ({
          ...prev,
          events: [`[${new Date().toLocaleTimeString()}] ${event}`, ...prev.events].slice(0, 5),
        }));
      };
  
      playerInstance.on?.('buffering', () => setMetrics(prev => ({ ...prev, buffering: true })));
      playerInstance.on?.('playing', () => setMetrics(prev => ({ ...prev, buffering: false })));
      playerInstance.on?.('renditionchange', () => {
        handleEvent('Rendition Changed');
        setMetrics((prev) => ({
          ...prev,
          renditionSwitches: prev.renditionSwitches + 1,
        }));
        updateMetrics();
      });
  
      updateMetrics();
  
      return () => {
        playerInstance.off?.('buffering', () => {});
        playerInstance.off?.('playing', () => {});
        playerInstance.off?.('renditionchange', () => {});
      };
    }, [playerInstance]);
  

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