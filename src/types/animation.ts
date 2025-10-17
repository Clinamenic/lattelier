import { DeformationConfig } from './attractor';

export interface AnimationConfig {
    duration: number;
    fps: number;
    loop: boolean;
    playbackSpeed: number;
    easing: string;
}

export interface Keyframe {
    time: number;
    state: DeformationConfig;
    easing: string;
}

