import shaka from 'shaka-player';
import { IPlayer } from '../IPlayer';

export class ShakaPlayerPlugin implements IPlayer {
  private player: shaka.Player | null = null;
  private video: HTMLVideoElement | null = null;

  async initialize(container: HTMLElement, options?: any): Promise<void> {
    container.innerHTML = '';

    const video = document.createElement('video');
    video.controls = true;
    container.appendChild(video);
    this.video = video;

    this.player = new shaka.Player(video);

    this.player.addEventListener('error', (event) => this.emitEvent('error', event));
    this.player.addEventListener('buffering', () => this.emitEvent('buffering'));
    this.player.addEventListener('adaptation', () => this.emitEvent('renditionchange'));
  }

  load(src: string): void {
    this.player?.load(src).then(() => this.emitEvent('playing')).catch((error) => this.emitEvent('error', error));
  }

  play(): void {
    this.video?.play();
    this.emitEvent('playing');
  }

  pause(): void {
    this.video?.pause();
  }

  destroy(): void {
    this.player?.destroy();
    this.player = null;
    this.video = null;
  }

  private emitEvent(eventType: string, data?: any) {
    const event = new CustomEvent(eventType, { detail: data });
    this.video?.dispatchEvent(event);
  }
}