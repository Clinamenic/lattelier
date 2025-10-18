export type GridType = 'square' | 'triangular';
export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay';

export interface GridConfig {
    rows: number;
    columns: number;
    spacing: number;
    pointSize: number;
    pointOpacity: number; // 0-1: point transparency
    lineWidth: number;
    lineFrequency: number; // 0-1: percentage of connections to draw
    lineCurvature: number; // 0-1: amount of curvature (0 = straight, 1 = maximum bulge)
    lineOpacity: number; // 0-1: line transparency
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

