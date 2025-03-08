export interface IPlayer {
  initialize(
    container: HTMLElement,
    options?: { drm?: Record<string, { serverURL: string }> }
  ): void;
  load(
    src: string,
    drmConfig?: { drmType: string; licenseUrl: string } | null
  ): void;
  play(): void;
  pause(): void;
  destroy(): void;
  getBitrate(): number;
  getResolution(): string;
  on(event: string, callback: (data?: any) => void): void;
  off(event: string, callback: (data?: any) => void): void;
}
