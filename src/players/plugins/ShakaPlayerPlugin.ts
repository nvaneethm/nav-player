import shaka from "shaka-player";
import { IPlayer } from "../IPlayer";

export class ShakaPlayerPlugin implements IPlayer {
  private player: shaka.Player | null = null;
  private video: HTMLVideoElement | null = null;
  private eventListeners: { [key: string]: ((data?: any) => void)[] } = {};

  async initialize(container: HTMLElement, options?: any): Promise<void> {
    container.innerHTML = "";

    const video = document.createElement("video");
    video.controls = true;
    container.appendChild(video);
    this.video = video;

    this.player = new shaka.Player(video);

    this.player.addEventListener("error", (event) =>
      this.emitEvent("error", event)
    );
    this.player.addEventListener("buffering", () =>
      this.emitEvent("buffering")
    );
    this.player.addEventListener("adaptation", () =>
      this.emitEvent("renditionchange")
    );

    this.player.addEventListener("adaptation", () => {
      const bitrate = this.getBitrate();
      const resolution = this.getResolution();
      this.emitEvent("renditionchange", { bitrate, resolution });
    });
  }

  load(src: string): void {
    this.player
      ?.load(src)
      .then(() => this.emitEvent("playing"))
      .catch((error) => this.emitEvent("error", error));
  }

  play(): void {
    this.video?.play();
    this.emitEvent("playing");
  }

  pause(): void {
    this.video?.pause();
  }

  destroy(): void {
    this.player?.destroy();
    this.player = null;
    this.video = null;
  }

  getBitrate(): number {
    if (!this.player) return 0;
    const activeTrack = this.player
      .getVariantTracks()
      .find((track) => track.active);
    return activeTrack?.bandwidth
      ? Math.round(activeTrack.bandwidth / 1000)
      : 0; // Convert to Kbps
  }

  getResolution(): string {
    if (!this.video) return "N/A";
    return `${this.video.videoWidth}x${this.video.videoHeight}`;
  }

  on(event: string, callback: (data?: any) => void): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  off(event: string, callback: (data?: any) => void): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(
        (cb) => cb !== callback
      );
    }
  }

  private emitEvent(eventType: string, data?: any) {
    if (this.eventListeners[eventType]) {
      this.eventListeners[eventType].forEach((callback) => callback(data));
    }
  }
}
