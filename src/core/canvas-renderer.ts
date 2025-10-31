import { GridConfig, GridPoint, Viewport } from '../types/grid';
import { Well } from '../types/attractor';
import { getTextureRenderer } from './line-textures';

export class CanvasRenderer {
    private ctx: CanvasRenderingContext2D;
    private viewport: Viewport;

    constructor(ctx: CanvasRenderingContext2D, viewport: Viewport) {
        this.ctx = ctx;
        this.viewport = viewport;
    }

    updateViewport(viewport: Viewport): void {
        this.viewport = viewport;
    }

    clear(): void {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.restore();
    }

    private renderBackground(points: GridPoint[], config: GridConfig, padding: number = 20): void {
        if (!config.canvasBackgroundColor || config.canvasOpacity <= 0) return;

        // Calculate bounds of the grid
        const bounds = this.calculateGridBounds(points, padding);

        // Convert hex color to rgba with opacity
        // Handle both #RRGGBB and #RGB formats
        let hex = config.canvasBackgroundColor.replace('#', '');
        if (hex.length === 3) {
            // Expand short form (#RGB to #RRGGBB)
            hex = hex.split('').map(char => char + char).join('');
        }
        
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        const rgbaColor = `rgba(${r}, ${g}, ${b}, ${config.canvasOpacity})`;

        this.ctx.fillStyle = rgbaColor;
        this.ctx.fillRect(
            bounds.minX,
            bounds.minY,
            bounds.maxX - bounds.minX,
            bounds.maxY - bounds.minY
        );
    }

    private calculateGridBounds(points: GridPoint[], padding: number = 0): {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    } {
        if (points.length === 0) {
            return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const point of points) {
            const { x, y } = point.currentPosition;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }

        return {
            minX: minX - padding,
            minY: minY - padding,
            maxX: maxX + padding,
            maxY: maxY + padding,
        };
    }

    render(
        points: GridPoint[],
        config: GridConfig,
        wells: Well[],
        showWells: boolean = true,
        hoveredWellId: string | null = null
    ): void {
        this.clear();
        this.applyTransform();

        // Render background within grid bounds
        this.renderBackground(points, config, 20);

        // Determine which wells to show
        // If showWells is true: show all wells
        // If showWells is false but hoveredWellId is set: show only the hovered well
        const shouldShowWells = showWells || hoveredWellId !== null;
        const wellsToShow = hoveredWellId && !showWells
            ? wells.filter(w => w.id === hoveredWellId)
            : wells;


        if (config.fillOpacity > 0) {
            this.renderFill(points, config);
        }

        if (config.lineOpacity > 0) {
            this.renderLines(points, config);
        }

        if (config.pointOpacity > 0) {
            this.renderPoints(points, config);
        }

        if (shouldShowWells) {
            this.renderWells(wellsToShow, hoveredWellId);
        }

        // Restore the transform applied by applyTransform()
        this.ctx.restore();
    }

    getGridBounds(points: GridPoint[], padding: number = 20): {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    } {
        return this.calculateGridBounds(points, padding);
    }

    private applyTransform(): void {
        this.ctx.save();
        this.ctx.translate(this.viewport.x, this.viewport.y);
        this.ctx.scale(this.viewport.zoom, this.viewport.zoom);
    }

    private renderPoints(points: GridPoint[], config: GridConfig): void {
        this.ctx.fillStyle = config.pointColor;
        this.ctx.globalAlpha = config.pointOpacity;

        for (const point of points) {
            this.ctx.beginPath();
            this.ctx.arc(
                point.currentPosition.x,
                point.currentPosition.y,
                config.pointSize,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }

        this.ctx.globalAlpha = 1;
    }

    private renderLines(points: GridPoint[], config: GridConfig): void {
        const pointMap = new Map<string, GridPoint>();
        for (const point of points) {
            pointMap.set(point.id, point);
        }

        const textureRenderer = getTextureRenderer(config.lineStyle);

        // Render lines based on frequency and style
        for (const point of points) {
            for (const neighborId of point.neighbors) {
                const neighbor = pointMap.get(neighborId);
                if (!neighbor || neighborId <= point.id) continue;

                // Frequency check: skip some connections probabilistically
                const pairHash = this.hashPair(point.id, neighborId);
                if (pairHash > config.lineFrequency) continue;

                const x1 = point.currentPosition.x;
                const y1 = point.currentPosition.y;
                const x2 = neighbor.currentPosition.x;
                const y2 = neighbor.currentPosition.y;

                const lineConfig = {
                    width: config.lineWidth,
                    color: config.lineColor,
                    opacity: config.lineOpacity,
                    lineId: pairHash.toString(),
                    segmentedTextureSettings: config.segmentedTextureSettings,
                };

                // Check if curvature is supported and should be applied
                // Curvature of 0 = straight, use curved rendering if significantly non-zero
                const useCurvature =
                    textureRenderer.supportsCurvature() &&
                    (config.lineCurvature < -0.01 || config.lineCurvature > 0.01);

                if (useCurvature && textureRenderer.renderCurvedLine) {
                    textureRenderer.renderCurvedLine(
                        this.ctx,
                        x1,
                        y1,
                        x2,
                        y2,
                        config.lineCurvature,
                        lineConfig
                    );
                } else {
                    textureRenderer.renderStraightLine(
                        this.ctx,
                        x1,
                        y1,
                        x2,
                        y2,
                        lineConfig
                    );
                }
            }
        }

        this.ctx.globalAlpha = 1;
    }

    private hashPair(id1: string, id2: string): number {
        // Create deterministic hash between 0 and 1
        const str = `${id1}-${id2}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        return (Math.abs(hash) % 1000) / 1000; // Normalize to 0-1
    }

    private renderFill(points: GridPoint[], config: GridConfig): void {
        this.ctx.fillStyle = config.fillColor;
        this.ctx.globalAlpha = config.fillOpacity;
        this.ctx.globalCompositeOperation = config.blendMode as GlobalCompositeOperation;

        const pointMap = new Map<string, GridPoint>();
        for (const point of points) {
            pointMap.set(point.id, point);
        }

        if (config.gridType === 'square') {
            this.renderSquareFaces(points, pointMap, config);
        } else if (config.gridType === 'triangular') {
            this.renderTriangularFaces(points, pointMap, config);
        }

        this.ctx.globalAlpha = 1;
        this.ctx.globalCompositeOperation = 'source-over'; // Reset blend mode
    }

    private renderSquareFaces(
        _points: GridPoint[],
        pointMap: Map<string, GridPoint>,
        config: GridConfig
    ): void {
        // For square grids, draw quads formed by each cell
        for (let row = 0; row < config.rows - 1; row++) {
            for (let col = 0; col < config.columns - 1; col++) {
                const faceId = `${row}-${col}`;
                const fillHash = this.hashPair(faceId, 'fill');
                if (fillHash > config.fillFrequency) continue;

                // Get the 4 corners of the square
                const topLeft = pointMap.get(`${row}-${col}`);
                const topRight = pointMap.get(`${row}-${col + 1}`);
                const bottomLeft = pointMap.get(`${row + 1}-${col}`);
                const bottomRight = pointMap.get(`${row + 1}-${col + 1}`);

                if (topLeft && topRight && bottomLeft && bottomRight) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(topLeft.currentPosition.x, topLeft.currentPosition.y);
                    this.ctx.lineTo(topRight.currentPosition.x, topRight.currentPosition.y);
                    this.ctx.lineTo(bottomRight.currentPosition.x, bottomRight.currentPosition.y);
                    this.ctx.lineTo(bottomLeft.currentPosition.x, bottomLeft.currentPosition.y);
                    this.ctx.closePath();
                    this.ctx.fill();
                }
            }
        }
    }

    private renderTriangularFaces(
        _points: GridPoint[],
        pointMap: Map<string, GridPoint>,
        config: GridConfig
    ): void {
        // For triangular grids, we have two types of triangles per cell
        for (let row = 0; row < config.rows - 1; row++) {
            for (let col = 0; col < config.columns - 1; col++) {
                const isEvenRow = row % 2 === 0;

                // Upward-pointing triangle
                const faceId1 = `${row}-${col}-up`;
                const fillHash1 = this.hashPair(faceId1, 'fill');
                if (fillHash1 <= config.fillFrequency) {
                    if (isEvenRow) {
                        // Even row: triangle points to current and next row
                        const pt1 = pointMap.get(`${row}-${col}`);
                        const pt2 = pointMap.get(`${row}-${col + 1}`);
                        const pt3 = pointMap.get(`${row + 1}-${col}`);

                        if (pt1 && pt2 && pt3) {
                            this.ctx.beginPath();
                            this.ctx.moveTo(pt1.currentPosition.x, pt1.currentPosition.y);
                            this.ctx.lineTo(pt2.currentPosition.x, pt2.currentPosition.y);
                            this.ctx.lineTo(pt3.currentPosition.x, pt3.currentPosition.y);
                            this.ctx.closePath();
                            this.ctx.fill();
                        }
                    } else {
                        // Odd row
                        const pt1 = pointMap.get(`${row}-${col}`);
                        const pt2 = pointMap.get(`${row}-${col + 1}`);
                        const pt3 = pointMap.get(`${row + 1}-${col + 1}`);

                        if (pt1 && pt2 && pt3) {
                            this.ctx.beginPath();
                            this.ctx.moveTo(pt1.currentPosition.x, pt1.currentPosition.y);
                            this.ctx.lineTo(pt2.currentPosition.x, pt2.currentPosition.y);
                            this.ctx.lineTo(pt3.currentPosition.x, pt3.currentPosition.y);
                            this.ctx.closePath();
                            this.ctx.fill();
                        }
                    }
                }

                // Downward-pointing triangle
                const faceId2 = `${row}-${col}-down`;
                const fillHash2 = this.hashPair(faceId2, 'fill');
                if (fillHash2 <= config.fillFrequency) {
                    if (isEvenRow) {
                        const pt1 = pointMap.get(`${row}-${col + 1}`);
                        const pt2 = pointMap.get(`${row + 1}-${col + 1}`);
                        const pt3 = pointMap.get(`${row + 1}-${col}`);

                        if (pt1 && pt2 && pt3) {
                            this.ctx.beginPath();
                            this.ctx.moveTo(pt1.currentPosition.x, pt1.currentPosition.y);
                            this.ctx.lineTo(pt2.currentPosition.x, pt2.currentPosition.y);
                            this.ctx.lineTo(pt3.currentPosition.x, pt3.currentPosition.y);
                            this.ctx.closePath();
                            this.ctx.fill();
                        }
                    } else {
                        const pt1 = pointMap.get(`${row}-${col}`);
                        const pt2 = pointMap.get(`${row + 1}-${col + 1}`);
                        const pt3 = pointMap.get(`${row + 1}-${col}`);

                        if (pt1 && pt2 && pt3) {
                            this.ctx.beginPath();
                            this.ctx.moveTo(pt1.currentPosition.x, pt1.currentPosition.y);
                            this.ctx.lineTo(pt2.currentPosition.x, pt2.currentPosition.y);
                            this.ctx.lineTo(pt3.currentPosition.x, pt3.currentPosition.y);
                            this.ctx.closePath();
                            this.ctx.fill();
                        }
                    }
                }
            }
        }
    }



    private renderWells(wells: Well[], hoveredWellId?: string | null): void {
        for (const well of wells) {
            if (!well.enabled) continue;

            const isHovered = hoveredWellId === well.id;
            const isAttract = well.strength >= 0;

            if (isHovered) {
                this.renderHoveredWell(well, isAttract);
            } else {
                this.renderNormalWell(well, isAttract);
            }
        }
    }

    private renderNormalWell(well: Well, isAttract: boolean): void {
        this.ctx.strokeStyle = isAttract ? '#3b82f6' : '#ef4444';
        this.ctx.fillStyle = isAttract ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)';
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.arc(
            well.position.x,
            well.position.y,
            well.radius,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.stroke();

        // Center point - larger for better grabbability
        this.ctx.fillStyle = isAttract ? '#3b82f6' : '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(
            well.position.x,
            well.position.y,
            10, // Increased from 6 to 10 for easier interaction
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    private renderHoveredWell(well: Well, isAttract: boolean): void {
        // Create animated striped pattern
        const time = Date.now() * 0.0008; // Much slower animation speed
        const stripeWidth = 12;
        const radius = well.radius;

        // Save context for clipping
        this.ctx.save();

        // Create clipping path for the well circle
        this.ctx.beginPath();
        this.ctx.arc(well.position.x, well.position.y, radius, 0, Math.PI * 2);
        this.ctx.clip();

        // Draw animated stripes with lighter, more transparent colors
        const baseColor = isAttract ? '#3b82f6' : '#ef4444';
        const lightColor = isAttract ? 'rgba(96, 165, 250, 0.3)' : 'rgba(248, 113, 113, 0.3)';
        const darkColor = isAttract ? 'rgba(29, 78, 216, 0.2)' : 'rgba(220, 38, 38, 0.2)';

        // Calculate smooth sliding offset
        const offset = (time * 30) % (stripeWidth * 2);

        // Draw stripes at their actual animated positions
        const startX = well.position.x - radius - stripeWidth;
        const endX = well.position.x + radius + stripeWidth;

        for (let x = startX; x < endX; x += stripeWidth) {
            // Calculate the actual position of this stripe with offset
            const actualX = x - offset;
            const stripeIndex = Math.floor((x - startX) / stripeWidth);
            const isEvenStripe = stripeIndex % 2 === 0;

            this.ctx.fillStyle = isEvenStripe ? lightColor : darkColor;
            this.ctx.fillRect(
                actualX,
                well.position.y - radius,
                stripeWidth,
                radius * 2
            );
        }

        // Restore context
        this.ctx.restore();

        // Draw border
        this.ctx.strokeStyle = baseColor;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(
            well.position.x,
            well.position.y,
            radius,
            0,
            Math.PI * 2
        );
        this.ctx.stroke();

        // Center point - larger for better grabbability
        this.ctx.fillStyle = baseColor;
        this.ctx.beginPath();
        this.ctx.arc(
            well.position.x,
            well.position.y,
            10,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
        return {
            x: (screenX - this.viewport.x) / this.viewport.zoom,
            y: (screenY - this.viewport.y) / this.viewport.zoom,
        };
    }

    worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
        return {
            x: worldX * this.viewport.zoom + this.viewport.x,
            y: worldY * this.viewport.zoom + this.viewport.y,
        };
    }
}

