export interface LineRenderConfig {
    width: number;
    color: string;
    opacity: number;
    lineId: string; // For deterministic randomness (point pair hash)
    segmentedTextureSettings?: {
        angleVariation: number;
        spacingVariation: number;
        lengthVariation: number;
    };
}

export interface LineTextureRenderer {
    /**
     * Check if this texture supports curvature
     */
    supportsCurvature(): boolean;

    /**
     * Render a straight line with this texture
     */
    renderStraightLine(
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        config: LineRenderConfig
    ): void;

    /**
     * Render a curved line with this texture (if supported)
     */
    renderCurvedLine?(
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        curvature: number,
        config: LineRenderConfig
    ): void;

    /**
     * Export line to SVG format (optional)
     */
    exportToSVG?(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        config: LineRenderConfig
    ): SVGElement | SVGElement[];
}

