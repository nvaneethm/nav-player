export interface IPlayer {
    initialize(container: HTMLElement, options?: any): void;
    load(src: string): void;
    play(): void;
    pause(): void;
    destroy(): void;
}
