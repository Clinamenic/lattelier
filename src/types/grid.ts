export type GridType = 'square' | 'triangular';
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay';
export type LineTexture = 'solid' | 'segmented';

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
    lineTexture: LineTexture;
    segmentedTextureSettings?: SegmentedTextureSettings; // Optional, only used when lineTexture === 'segmented'
    fillFrequency: number; // 0-1: percentage of fill polygons to draw
    fillOpacity: number; // 0-1: fill transparency
    showPoints: boolean;
    showLines: boolean;
    showFill: boolean;
    pointColor: string;
    lineColor: string;
    fillColor: string;
    canvasBackgroundColor: string;
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

