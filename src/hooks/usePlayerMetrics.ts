import { useEffect, useState } from 'react';
import { IPlayer } from '../players/IPlayer';

export interface PlayerMetrics {
  buffering: boolean;
  currentBitrate: number;
  resolution: string;
  renditionSwitches: number;
  events: string[];
}

const usePlayerMetrics = (playerInstance: IPlayer | null) => {
  const initalMatrix = {
    buffering: false,
    currentBitrate: 0,
    resolution: 'N/A',
    renditionSwitches: 0,
    events: [],
  }
  const [metrics, setMetrics] = useState<PlayerMetrics>(initalMatrix);

  useEffect(() => {
    if (!playerInstance) return;
    setMetrics(initalMatrix)

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

    playerInstance.on?.('buffering', () => {
      handleEvent('Buffering...');
      setMetrics((prev) => ({ ...prev, buffering: true }));
    });

    playerInstance.on?.('playing', () => {
      handleEvent('Playing...');
      setMetrics((prev) => ({ ...prev, buffering: false }));
    });

    // ✅ Detect Rendition Changes (Bitrate/Resolution Switch)
    playerInstance.on?.('renditionchange', () => {
      handleEvent('Rendition Changed');
      setMetrics((prev) => ({
        ...prev,
        renditionSwitches: prev.renditionSwitches + 1,
      }));
      updateMetrics();
    });

    // **Force periodic metric updates for Video.js**
    const interval = setInterval(updateMetrics, 1000); // Update every second

    updateMetrics();

    return () => {
      playerInstance.off?.('buffering', () => {});
      playerInstance.off?.('playing', () => {});
      playerInstance.off?.('renditionchange', () => {});
      clearInterval(interval); // Clean up interval
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerInstance]);

  return metrics;
};

export default usePlayerMetrics;