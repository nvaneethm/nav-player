import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { IPlayer } from '../IPlayer';

export class VideoJSPlugin implements IPlayer {
  private player: any | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private eventListeners: { [key: string]: ((data?: any) => void)[] } = {};

  initialize(container: HTMLElement, options?: any): void {
    container.innerHTML = '';

    const video = document.createElement('video');
    video.className = 'video-js vjs-default-skin';
    video.style.width = '100%';
    video.style.position = 'relative'
    video.style.height = '100%';
    video.setAttribute('controls', '');
    container.appendChild(video);
    this.videoElement = video;

    this.player = videojs(video, options);

    this.player.on('playing', () => this.emitEvent('playing'));
    this.player.on('waiting', () => this.emitEvent('buffering'));
    this.player.on('error', () => this.emitEvent('error', this.player?.error()));
    this.player.on('resolutionchange', () => this.emitEvent('renditionchange'));
  }

  load(src: string): void {
    if (this.player && this.videoElement) {
      // Determine the source type based on the file extension
      let type: string = '';
      if (src.endsWith('.m3u8')) {
        type = 'application/x-mpegURL';
      } else if (src.endsWith('.mpd')) {
        type = 'application/dash+xml';
      } else {
        type = 'video/mp4';
      }

      // Set the source with the appropriate type
      this.player.src({ src, type });

      // Load the source
      this.player.load();
    } else {
      console.error('Video.js Player is not initialized. Call initialize() before load().');
    }
    this.emitEvent('playing');
  }

  play(): void {
    this.player?.play().catch((error:any) => {
      console.error('Error attempting to play the video:', error);
    });
    this.emitEvent('playing');
  }

  pause(): void {
    this.player?.pause();
  }

  destroy(): void {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
    if (this.videoElement && this.videoElement.parentElement) {
      this.videoElement.parentElement.removeChild(this.videoElement);
      this.videoElement = null;}
  }

  getBitrate(): number {
    return this.player?.videoTracks?.[0]?.bitrate || 0;
  }

  getResolution(): string {
    if (!this.videoElement) return 'N/A';
    return `${this.videoElement.videoWidth}x${this.videoElement.videoHeight}`;
  }

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