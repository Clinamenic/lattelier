export type FalloffType = 'linear' | 'quadratic' | 'exponential' | 'smooth';

export interface Well {
  id: string;
  position: { x: number; y: number };
  strength: number;
  radius: number;
  falloff: FalloffType;
  enabled: boolean;
  showRadialLines: boolean;
  distortion: number;
}

export interface DeformationConfig {
    wells: Well[];
    globalStrength: number;
}

// Legacy alias for backward compatibility
export type AttractorPoint = Well;

