import shaka from 'shaka-player';
import { IPlayer } from '../IPlayer';


export class ShakaPlayerPlugin implements IPlayer {
    private player: shaka.Player | null = null;
    private video: HTMLVideoElement | null = null;
  
    // Define the error handler as an arrow function to preserve 'this' context
    private onErrorEvent = (event: any) => {
      console.error('Shaka Player Error:', event.detail);
    };
  
    // Define a generic error handler for load failures
    private onError = (error: any) => {
      console.error('Shaka Player Error:', error);
    };
  
    /**
     * Initialize the Shaka Player within the given container.
     * @param container The HTML element to initialize the player in.
     * @param options Player-specific options.
     */
    async initialize(container: HTMLElement, options?: any): Promise<void> {
      if (!container) throw new Error('Container element is required.');
    
      container.innerHTML = ''; // Clear container
    
      const video = document.createElement('video');
      video.controls = true;
      video.style.width = '100%';
      video.style.height = '100%';
      container.appendChild(video);
      this.video = video;
    
      this.player = new shaka.Player(video); // Attach inside constructor
      this.player.addEventListener('error', this.onErrorEvent);
    }
  
    /**
     * Load the video source into the player.
     * Ensures that the player is initialized before attempting to load.
     * @param src The video manifest URL.
     */
    async load(src: string): Promise<void> {
      if (!this.player) {
        console.error('Shaka Player is not initialized. Call initialize() before load().');
        return;
      }
  
      try {
        await this.player.load(src);
        console.log('Shaka Player: Video loaded successfully.');
      } catch (error) {
        this.onError(error);
      }
    }
  
    /**
     * Play the video.
     */
    play(): void {
      this.video?.play().catch((error) => {
        console.error('Error attempting to play the video:', error);
      });
    }
  
    /**
     * Pause the video.
     */
    pause(): void {
      this.video?.pause();
    }
  
    /**
     * Destroy the player instance and clean up resources.
     */
    destroy(): void {
      if (this.player) {
        // Remove the error event listener
        this.player.removeEventListener('error', this.onErrorEvent);
        this.player.destroy();
        this.player = null;
      }
      if (this.video && this.video.parentElement) {
        this.video.parentElement.removeChild(this.video);
        this.video = null;
      }
    }
  }