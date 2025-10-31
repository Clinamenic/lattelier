// Configuration export/import types

import { SettingsLocks } from './grid';

export interface GridPincherConfig {
    version: string;
    metadata: ConfigMetadata;
    grid: GridSettings;
    distortion: DistortionSettings;
    viewport?: ViewportSettings;
    locks?: SettingsLocksConfig; // Optional for backward compatibility
}

export interface SettingsLocksConfig {
    settings: SettingsLocks;
    wells: boolean;
}

export interface ConfigMetadata {
    name: string;
    description?: string;
    createdAt: string; // ISO 8601
    modifiedAt: string; // ISO 8601
    tags?: string[];
    author?: string;
}

export interface GridSettings {
    type: 'square' | 'triangular';
    rows: number;
    columns: number;
    spacing: number;
    points: {
        show: boolean;
        size: number;
        color: string;
        opacity: number;
    };
    lines: {
        show: boolean;
        width: number;
        frequency: number;
        curvature: number; // Only relevant when style === 'solid'
        color: string;
        opacity: number;
        style: 'solid' | 'segmented';
        segmentedTextureSettings?: {
            angleVariation: number;
            spacingVariation: number;
            lengthVariation: number;
        };
    };
    fill: {
        show: boolean;
        frequency: number;
        color: string;
        opacity: number;
        blendMode: string;
    };
    canvas: {
        backgroundColor: string;
        opacity: number;
    };
}

export interface DistortionSettings {
    globalStrength: number;
    wells: Array<{
        id: string;
        position: { x: number; y: number };
        strength: number;
        radius: number;
        falloff: 'linear' | 'quadratic' | 'exponential' | 'smooth';
        distortion: number;
        enabled: boolean;
    }>;
}

export interface ViewportSettings {
    x: number;
    y: number;
    zoom: number;
    includeInExport: boolean;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

