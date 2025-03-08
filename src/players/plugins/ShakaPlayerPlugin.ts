import shaka from "shaka-player";
import { IPlayer } from "../IPlayer";

export class ShakaPlayerPlugin implements IPlayer {
  private player: shaka.Player | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private eventListeners: { [key: string]: ((data?: any) => void)[] } = {};

  async initialize(
    container: HTMLElement,
    options?: { drm?: Record<string, { serverURL: string }> }
  ): Promise<void> {
    container.innerHTML = "";

    const video = document.createElement("video");
    video.controls = true;
    container.appendChild(video);
    this.videoElement = video;

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

    if (options?.drm) {
      for (const drmType in options.drm) {
        this.player.configure({
          drm: {
            servers: {
              [drmType]: options.drm[drmType].serverURL,
            },
          },
        });
      }
    }
  }

  async load(
    src: string,
    drmConfig?: { drmType: string; licenseUrl: string } | null
  ): Promise<void> {
    if (!this.player) return;

    if (drmConfig) {
      const drmServer =
        drmConfig.drmType === "widevine"
          ? "com.widevine.alpha"
          : "com.microsoft.playready";
      this.player.configure({
        drm: {
          servers: {
            [drmServer]: drmConfig.licenseUrl,
          },
        },
      });
    }

    await this.player
      ?.load(src)
      .then(() => this.emitEvent("playing"))
      .catch((error) => this.emitEvent("error", error));
  }

  play(): void {
    this.videoElement?.play();
    this.emitEvent("playing");
  }

  pause(): void {
    this.videoElement?.pause();
  }

  destroy(): void {
    this.player?.destroy();
    this.player = null;
    this.videoElement = null;
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
    return this.videoElement
      ? `${this.videoElement.videoWidth}x${this.videoElement.videoHeight}`
      : "N/A";
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
