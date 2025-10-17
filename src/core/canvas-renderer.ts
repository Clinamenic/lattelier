import { GridConfig, GridPoint, Viewport } from '../types/grid';
import { Well } from '../types/attractor';
import { distance } from '../utils/math';

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
        if (!config.canvasBackgroundColor) return;

        // Calculate bounds of the grid
        const bounds = this.calculateGridBounds(points, padding);

        this.ctx.fillStyle = config.canvasBackgroundColor;
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

        // Render radial lines first (behind everything)
        if (shouldShowWells) {
            this.renderRadialLines(points, wellsToShow);
        }

        if (config.showFill) {
            this.renderFill(points, config);
        }

        if (config.showLines) {
            this.renderLines(points, config);
        }

        if (config.showPoints) {
            this.renderPoints(points, config);
        }

        if (shouldShowWells) {
            this.renderWells(wellsToShow);
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

        // Render lines based on frequency and curvature
        for (const point of points) {
            for (const neighborId of point.neighbors) {
                const neighbor = pointMap.get(neighborId);
                if (!neighbor || neighborId <= point.id) continue;

                // Frequency check: skip some connections probabilistically
                const pairHash = this.hashPair(point.id, neighborId);
                if (pairHash > config.lineFrequency) continue;

                // If curvature = 0, draw straight lines (fast path)
                if (config.lineCurvature === 0) {
                    this.ctx.strokeStyle = config.lineColor;
                    this.ctx.lineWidth = config.lineWidth;
                    this.ctx.globalAlpha = config.lineOpacity;

                    this.ctx.beginPath();
                    this.ctx.moveTo(point.currentPosition.x, point.currentPosition.y);
                    this.ctx.lineTo(neighbor.currentPosition.x, neighbor.currentPosition.y);
                    this.ctx.stroke();
                } else {
                    // Draw curved/filled lines (sinew style)
                    this.renderCurvedLine(
                        point.currentPosition.x,
                        point.currentPosition.y,
                        neighbor.currentPosition.x,
                        neighbor.currentPosition.y,
                        config.lineCurvature,
                        config.lineWidth,
                        config.lineColor,
                        config.lineOpacity
                    );
                }
            }
        }

        this.ctx.globalAlpha = 1;
    }

    private renderCurvedLine(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        curvature: number,
        lineWidth: number,
        color: string,
        opacity: number
    ): void {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length === 0) return;

        // Perpendicular unit vector
        const perpX = -dy / length;
        const perpY = dx / length;

        // Base thickness
        const halfWidth = lineWidth / 2;

        // Calculate control points along the STRAIGHT centerline
        const cp1CenterX = x1 + dx * 0.33;
        const cp1CenterY = y1 + dy * 0.33;
        const cp2CenterX = x1 + dx * 0.67;
        const cp2CenterY = y1 + dy * 0.67;

        // Calculate curvature offset (how much fatter/thinner the middle gets)
        const curvatureOffset = length * 0.15;

        // Map curvature: 0 = thin, 0.5 = normal, 1 = fat
        const curvatureFactor = (curvature - 0.5) * 2 * curvatureOffset;

        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = opacity;

        // Create a closed path with two curves that bulge in/out
        this.ctx.beginPath();

        // Top edge: starts at base offset, bulges at control points
        this.ctx.moveTo(x1 + perpX * halfWidth, y1 + perpY * halfWidth);
        this.ctx.bezierCurveTo(
            cp1CenterX + perpX * (halfWidth + curvatureFactor),
            cp1CenterY + perpY * (halfWidth + curvatureFactor),
            cp2CenterX + perpX * (halfWidth + curvatureFactor),
            cp2CenterY + perpY * (halfWidth + curvatureFactor),
            x2 + perpX * halfWidth,
            y2 + perpY * halfWidth
        );

        // Bottom edge: starts at base offset, bulges oppositely at control points
        this.ctx.lineTo(x2 - perpX * halfWidth, y2 - perpY * halfWidth);
        this.ctx.bezierCurveTo(
            cp2CenterX - perpX * (halfWidth + curvatureFactor),
            cp2CenterY - perpY * (halfWidth + curvatureFactor),
            cp1CenterX - perpX * (halfWidth + curvatureFactor),
            cp1CenterY - perpY * (halfWidth + curvatureFactor),
            x1 - perpX * halfWidth,
            y1 - perpY * halfWidth
        );

        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
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
        } else if (config.gridType === 'hexagonal') {
            this.renderHexagonalFaces(points, pointMap, config);
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

        private renderHexagonalFaces(
            _points: GridPoint[],
            pointMap: Map<string, GridPoint>,
            config: GridConfig
        ): void {
        // For hexagonal grids, render hexagons
        // This is complex - for now, let's use a simpler approach with triangulation
        for (let row = 0; row < config.rows - 1; row++) {
            for (let col = 0; col < config.columns - 1; col++) {
                const faceId = `${row}-${col}`;
                const fillHash = this.hashPair(faceId, 'fill');
                if (fillHash > config.fillFrequency) continue;

                const isEvenRow = row % 2 === 0;

                // Draw diamond-shaped faces between hexagons
                if (isEvenRow) {
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
        }
    }

    private renderRadialLines(points: GridPoint[], wells: Well[]): void {
        for (const well of wells) {
            if (!well.enabled || !well.showRadialLines) continue;

            this.ctx.strokeStyle = well.strength >= 0 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)';
            this.ctx.lineWidth = 0.5;

            for (const point of points) {
                const dist = distance(
                    point.currentPosition.x,
                    point.currentPosition.y,
                    well.position.x,
                    well.position.y
                );

                if (dist < well.radius) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(point.currentPosition.x, point.currentPosition.y);
                    this.ctx.lineTo(well.position.x, well.position.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    private renderWells(wells: Well[]): void {
        for (const well of wells) {
            if (!well.enabled) continue;

            this.ctx.strokeStyle = well.strength >= 0 ? '#3b82f6' : '#ef4444';
            this.ctx.fillStyle = well.strength >= 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)';
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
            this.ctx.fillStyle = well.strength >= 0 ? '#3b82f6' : '#ef4444';
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

