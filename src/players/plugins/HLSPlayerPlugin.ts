import Hls from 'hls.js';
import { IPlayer } from '../IPlayer';

export class HLSPlayerPlugin implements IPlayer {
  private hls: Hls | null = null;
  private video: HTMLVideoElement | null = null;
  private eventListeners: { [key: string]: ((data?: any) => void)[] } = {};

  initialize(container: HTMLElement, options?: any): void {
    container.innerHTML = '';

    const video = document.createElement('video');
    video.controls = true;
    container.appendChild(video);
    this.video = video;

    if (Hls.isSupported()) {
      this.hls = new Hls(options);
      this.hls.attachMedia(video);

      this.hls.on(Hls.Events.MEDIA_ATTACHED, () => this.emitEvent('playing'));
      this.hls.on(Hls.Events.BUFFER_APPENDING, () => this.emitEvent('buffering'));
      this.hls.on(Hls.Events.ERROR, (_, data) => this.emitEvent('error', data));
      this.hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => this.emitEvent('renditionchange', data));
    }
  }

  load(src: string): void {
    if (this.hls && this.video) {
      this.hls.loadSource(src);
      this.emitEvent('playing');
    } else if (this.video) {
      this.video.src = src;
      this.video.load();
      this.emitEvent('playing');
    }
  }

  play(): void {
    this.video?.play();
    this.emitEvent('playing');
  }

  pause(): void {
    this.video?.pause();
  }

  destroy(): void {
    this.hls?.destroy();
    this.hls = null;
    this.video = null;
  }

  // QoE Metrics
  getBitrate(): number {
    return this.hls?.levels?.[this.hls.currentLevel]?.bitrate || 0;
  }

  getResolution(): string {
    if (!this.video) return 'N/A';
    return `${this.video.videoWidth}x${this.video.videoHeight}`;
  }

  // Event Handling
  on(event: string, callback: (data?: any) => void): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  off(event: string, callback: (data?: any) => void): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }

  private emitEvent(eventType: string, data?: any) {
    if (this.eventListeners[eventType]) {
      this.eventListeners[eventType].forEach(callback => callback(data));
    }
  }
}