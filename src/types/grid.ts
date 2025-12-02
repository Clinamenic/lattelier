export type GridType = 'square' | 'triangular';
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay';
export type LineStyle = 'solid' | 'segmented';

export interface SegmentedTextureSettings {
    angleVariation: number; // 0-1, maps to ±3 degrees in radians (0.05 rad)
    spacingVariation: number; // 0-1, maps to 0-30% of segment length
    lengthVariation: number; // 0-1, maps to ±12% of base segment length
}

export interface GridConfig {
    rows: number;
    columns: number;
    spacing: number;
    pointSize: number;
    pointOpacity: number; // 0-1: point transparency
    lineWidth: number;
    lineFrequency: number; // 0-1: percentage of connections to draw
    lineCurvature: number; // -1 to 1: amount of curvature (-1 = concave, 0 = straight, 1 = convex)
    lineOpacity: number; // 0-1: line transparency
    lineStyle: LineStyle;
    segmentedTextureSettings?: SegmentedTextureSettings; // Optional, only used when lineStyle === 'segmented'
    fillFrequency: number; // 0-1: percentage of fill polygons to draw
    fillOpacity: number; // 0-1: fill transparency
    showPoints: boolean;
    showLines: boolean;
    showFill: boolean;
    pointColor: string;
    pointHueVariance: number; // 0-1: hue variation range around pointColor
    lineColor: string;
    lineHueVariance: number; // 0-1: hue variation range around lineColor
    fillColor: string;
    fillHueVariance: number; // 0-1: hue variation range around fillColor
    canvasBackgroundColor: string;
    canvasOpacity: number; // 0-1: canvas background transparency
    gridType: GridType;
    blendMode: BlendMode;
}

export interface GridPoint {
    id: string;
    originalPosition: { x: number; y: number };
    currentPosition: { x: number; y: number };
    neighbors: string[];
}

export interface Viewport {
    x: number;
    y: number;
    zoom: number;
}

export interface SettingsLocks {
    // Canvas settings
    canvasBackgroundColor: boolean; // true = locked, false = unlocked
    canvasOpacity: boolean;

    // Grid settings
    gridType: boolean;
    rows: boolean;
    columns: boolean;
    spacing: boolean;

    // Points settings
    pointColor: boolean;
    pointHueVariance: boolean;
    pointSize: boolean;
    pointOpacity: boolean;

    // Lines settings
    lineColor: boolean;
    lineHueVariance: boolean;
    lineStyle: boolean;
    lineCurvature: boolean;
    segmentedTextureSettings: {
        angleVariation: boolean;
        spacingVariation: boolean;
        lengthVariation: boolean;
    };
    lineFrequency: boolean;
    lineWidth: boolean;
    lineOpacity: boolean;

    // Fill settings
    fillColor: boolean;
    fillHueVariance: boolean;
    fillFrequency: boolean;
    fillOpacity: boolean;
    blendMode: boolean;
}

