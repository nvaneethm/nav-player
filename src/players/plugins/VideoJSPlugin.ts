import videojs from "video.js";
import "video.js/dist/video-js.css";
import { IPlayer } from "../IPlayer";

export class VideoJSPlugin implements IPlayer {
  private player: any | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private eventListeners: { [key: string]: ((data?: any) => void)[] } = {};

  initialize(
    container: HTMLElement,
    options?: { drm?: Record<string, { serverURL: string }> }
  ): void {
    container.innerHTML = "";

    const video = document.createElement("video");
    video.className = "video-js vjs-default-skin";
    video.style.width = "100%";
    video.style.position = "relative";
    video.style.height = "100%";
    video.setAttribute("controls", "");
    container.appendChild(video);
    this.videoElement = video;

    this.player = videojs(video, {
      ...options,
      html5: {
        vhs: { overrideNative: true },
      },
    });

    if (options?.drm) {
      this.setupDRM(options.drm);
    }
    this.player.on("playing", () => this.emitEvent("playing"));
    this.player.on("waiting", () => this.emitEvent("buffering"));
    this.player.on("error", () =>
      this.emitEvent("error", this.player?.error())
    );

    this.player.on("loadedmetadata", () => {
      console.log("Metadata loaded - Fetching renditions...");
      this.getAvailableRenditions();
      this.trackRenditionChange();
    });

    this.player.on("loadeddata", () => {
      console.log("New source loaded - Updating renditions...");
      this.getAvailableRenditions();
    });

    this.trackRenditionChange();
  }
  trackRenditionChange() {
    if (!this.player) return;

    const updateQoE = () => {
      this.emitEvent("renditionchange", {
        bitrate: this.getBitrate(),
        resolution: this.getResolution(),
      });
    };

    // **Detect quality level changes in HLS**
    if (this.player.tech_?.hls) {
      this.player.tech_.hls.on("mediachange", updateQoE);
    }

    // **Detect quality level changes in DASH**
    if (this.player.tech_?.vhs) {
      this.player.tech_.vhs.on("mediachange", updateQoE);
    }
  }

  private setupDRM(drmConfig: Record<string, { serverURL: string }>) {
    if (!this.player) return;

    this.player.ready(() => {
      const tech = this.player.tech({ IWillNotUseThisInPlugins: true });
      if (tech?.sourceHandler_) {
        tech.on("sourceopen", () => {
          for (const drmType in drmConfig) {
            tech.eme?.setServerCertificate?.(
              drmType,
              drmConfig[drmType].serverURL
            );
          }
        });
      }
    });
  }

  load(
    src: string,
    drmConfig?: { drmType: string; licenseUrl: string } | null
  ): void {
    if (!this.player) return;

    let type = src.endsWith(".m3u8")
      ? "application/x-mpegURL"
      : src.endsWith(".mpd")
      ? "application/dash+xml"
      : "video/mp4";

    this.player.src({ src, type });

    if (drmConfig) {
      this.setupDRM({
        [drmConfig.drmType]: { serverURL: drmConfig.licenseUrl },
      });
    }
  }

  getAvailableRenditions(): { resolution: string; bitrate: number }[] {
    if (!this.player || !this.player.qualityLevels) return [];

    return Array.from(
      this.player.qualityLevels().levels_ as {
        width: number;
        height: number;
        bitrate: number;
      }[]
    )
      .map((level) => ({
        resolution: `${level.width}x${level.height}`,
        bitrate: Math.round(level.bitrate / 1000),
      }))
      .sort((a, b) => a.bitrate - b.bitrate);
  }

  setRendition(resolution: string): void {
    if (!this.player || !this.player.qualityLevels) return;

    const qualityLevels = this.player.qualityLevels();

    qualityLevels.levels_.forEach(
      (level: { width: number; height: number; enabled: boolean }) => {
        level.enabled = `${level.width}x${level.height}` === resolution;
      }
    );

    this.setAdaptiveBitrate(false);
    console.log(`Switched to ${resolution}`);
  }

  setAdaptiveBitrate(enable: boolean): void {
    if (!this.player || !this.player.qualityLevels) return;

    const qualityLevels = this.player.qualityLevels();
    qualityLevels.levels_.forEach(
      (level: { enabled: boolean }) => (level.enabled = enable)
    );

    console.log(`ABR ${enable ? "enabled" : "disabled"}`);
  }

  play(): void {
    this.player?.play().catch((error: any) => {
      console.error("Error attempting to play the video:", error);
    });
    this.emitEvent("playing");
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
      this.videoElement = null;
    }
  }

  getBitrate(): number {
    if (!this.player) return 0;

    // HLS Source
    if (this.player.tech_?.hls) {
      const media = this.player.tech_.hls.playlists.media();
      return media?.attributes?.BANDWIDTH
        ? Math.round(media.attributes.BANDWIDTH / 1000)
        : 0; // Convert to Kbps
    }

    // DASH Source
    if (this.player.tech_?.vhs?.playlists) {
      const activePlaylist = this.player.tech_.vhs.playlists.media();
      return activePlaylist?.attributes?.BANDWIDTH
        ? Math.round(activePlaylist.attributes.BANDWIDTH / 1000)
        : 0; // Convert to Kbps
    }

    return 0;
  }

  getResolution(): string {
    if (!this.videoElement) return "N/A";
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
