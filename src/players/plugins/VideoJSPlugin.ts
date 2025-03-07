import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-dash'; 
import { IPlayer } from '../IPlayer';
import  VideoJsPlayerOptions  from 'video.js';

export class VideoJSPlugin implements IPlayer {
    private player: any| null = null;
  private videoElement: HTMLVideoElement | null = null;

  /**
   * Initialize the Video.js player within the given container.
   * @param container The HTML element to initialize the player in.
   * @param options Player-specific options.
   */
  initialize(container: HTMLElement, options?: any): void {
    if (!container) {
      throw new Error('Container element is required to initialize Video.js.');
    }

    // Clear the container to prevent multiple video elements
    container.innerHTML = '';

    // Create and configure the video element
    const video = document.createElement('video');
    video.className = 'video-js vjs-default-skin';
    video.style.width = '100%';
    video.style.position = 'relative'
    video.style.height = '100%';
    video.setAttribute('controls', ''); // Ensure controls are enabled
    container.appendChild(video);
    this.videoElement = video;

    // Initialize Video.js on the video element
    this.player = videojs(video, options);

    // Optional: Add event listeners for debugging
    this.player.on('error', () => {
      const error = this.player?.error();
      console.error('Video.js Error:', error);
    });
  }


  /**
   * Load the video source into the player.
   * @param src The video manifest URL.
   */
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
  }


  /**
   * Play the video.
   */
  play(): void {
    this.player?.play().catch((error:any) => {
      console.error('Error attempting to play the video:', error);
    });
  }

  /**
   * Pause the video.
   */
  pause(): void {
    this.player?.pause();
  }

  /**
   * Destroy the player instance and clean up resources.
   */
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
}