import * as MseNavPlayer from 'mse-nav-player';
import { IPlayer } from '../IPlayer';

export class MSENavPlayerPlugin implements IPlayer {
  private player: InstanceType<typeof MseNavPlayer.Player>| null = null;
  private videoEl: HTMLVideoElement | null = null;
  private containerEl: HTMLElement | null = null;
  private eventListeners: { [key: string]: ((data?: any) => void)[] } = {};

  initialize(container: HTMLElement): void {
    this.containerEl = container;
    container.innerHTML = '';

    const video = document.createElement('video');
    video.controls = true;
    video.style.width = '100%';
    video.style.height = '100%';
    container.appendChild(video);

    this.videoEl = video;
    this.player = new MseNavPlayer.Player(); // ✅ usage
    this.player.attachVideoElement(video);

    this.player.onReady = () => this.emitEvent('ready');
    this.player.onError = (err: any) => this.emitEvent('error', err);
    this.player.onPlay = () => this.emitEvent('playing');
    this.player.onPause = () => this.emitEvent('pause');
    this.player.onEnded = () => this.emitEvent('ended');
    this.player.onBuffering = () => this.emitEvent('buffering');
    this.player.onTimeUpdate = (t: any) => this.emitEvent('timeupdate', t);
  }

  load(src: string): void {
    if (!this.player) return;
    this.player.load(src);
  }

  play(): void {
    this.player?.play();
    this.emitEvent('playing');
  }

  pause(): void {
    this.player?.pause();
    this.emitEvent('pause');
  }

  destroy(): void {
    this.player?.destroy();
    this.videoEl?.remove();
    this.videoEl = null;
    this.player = null;
  }

  getBitrate(): number {
    return this.player?.getBitrate() ?? 0;
  }

  getResolution(): string {
    return this.player?.getResolution() ?? '0x0';
  }

  getAvailableRenditions(): { resolution: string; bitrate: number }[] {
    return this.player?.getAvailableRenditions() ?? [];
  }

  setRendition(resolution: string): void {
    this.player?.setRendition(resolution);
  }

  setAdaptiveBitrate(enable: boolean): void {
    this.player?.setAdaptiveBitrate(enable);
  }

  on(event: string, callback: (data?: any) => void): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  off(event: string, callback: (data?: any) => void): void {
    this.eventListeners[event] = this.eventListeners[event]?.filter(cb => cb !== callback) || [];
  }

  private emitEvent(event: string, data?: any): void {
    this.eventListeners[event]?.forEach(cb => cb(data));
  }
}