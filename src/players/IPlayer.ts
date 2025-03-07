export interface IPlayer {
    initialize(container: HTMLElement, options?: any): void;
    load(src: string): void;
    play(): void;
    pause(): void;
    destroy(): void;
  
    // QoE Metrics
    getBitrate?(): number;  // Returns current bitrate in Kbps
    getResolution?(): string; // Returns current resolution as "width x height"
  
    // Event Handling
    on?(event: string, callback: (data?: any) => void): void;
    off?(event: string, callback: (data?: any) => void): void;
  }