// Configuration export/import types

export interface GridPincherConfig {
    version: string;
    metadata: ConfigMetadata;
    grid: GridSettings;
    distortion: DistortionSettings;
    viewport?: ViewportSettings;
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
    type: 'square' | 'triangular' | 'hexagonal';
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
        curvature: number;
        color: string;
        opacity: number;
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
        showRadialLines: boolean;
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

