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

  getAvailableRenditions(): { resolution: string; bitrate: number }[] {
    if (!this.player) return [];

    const variantTracks = this.player.getVariantTracks();

    return variantTracks
      .filter((track) => track.width && track.height) // Filter only valid video tracks
      .map((track) => ({
        resolution: `${track.width}x${track.height}`,
        bitrate: Math.round(track.bandwidth / 1000), // Convert to Kbps
      }))
      .sort((a, b) => a.bitrate - b.bitrate); // Sort by increasing bitrate
  }

  setRendition(resolution: string): void {
    if (!this.player) return;

    const tracks = this.player.getVariantTracks();
    const selectedTrack = tracks.find(
      (track) => `${track.width}x${track.height}` === resolution
    );

    if (selectedTrack) {
      this.player.selectVariantTrack(selectedTrack, true);
      this.player.configure({ abr: { enabled: false } }); // Disable ABR
      console.log(`Switched to ${resolution}`);
    }
  }

  setAdaptiveBitrate(enable: boolean): void {
    if (this.player) {
      this.player.configure({ abr: { enabled: enable } });
      console.log(`ABR ${enable ? "enabled" : "disabled"}`);
    }
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
