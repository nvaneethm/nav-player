import Hls from 'hls.js';
import { IPlayer } from '../IPlayer';

export class HLSPlayerPlugin implements IPlayer {
  private hls: Hls | null = null;
  private video: HTMLVideoElement | null = null;

  initialize(container: HTMLElement, options?: any): void {
    const video = document.createElement('video');
    video.controls = true;
    container.appendChild(video);
    this.video = video;

    if (Hls.isSupported()) {
      this.hls = new Hls(options);
      this.hls.attachMedia(video);
      this.hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS.js Error:', data);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = '';
    } else {
      console.error('HLS is not supported in this browser.');
    }
  }

  load(src: string): void {
    if (this.hls && this.video) {
      this.hls.loadSource(src);
    } else if (this.video) {
      if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
        this.video.src = src;
        this.video.load();
      } else {
        console.error('HLS is not supported in this browser.');
      }
    }
  }

  play(): void {
    this.video?.play();
  }

  pause(): void {
    this.video?.pause();
  }

  destroy(): void {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    if (this.video && this.video.parentElement) {
      this.video.parentElement.removeChild(this.video);
      this.video = null;
    }
  }
}