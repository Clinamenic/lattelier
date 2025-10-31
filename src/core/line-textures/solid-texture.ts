import { LineTextureRenderer, LineRenderConfig } from './base-texture';

export class SolidTextureRenderer implements LineTextureRenderer {
    supportsCurvature(): boolean {
        return true;
    }

    renderStraightLine(
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        config: LineRenderConfig
    ): void {
        ctx.strokeStyle = config.color;
        ctx.lineWidth = config.width;
        ctx.globalAlpha = config.opacity;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.globalAlpha = 1;
    }

    renderCurvedLine(
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        curvature: number,
        config: LineRenderConfig
    ): void {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);

        if (length === 0) return;

        // Perpendicular unit vector
        const perpX = -dy / length;
        const perpY = dx / length;

        // Base thickness
        const halfWidth = config.width / 2;

        // Calculate control points along the STRAIGHT centerline
        const cp1CenterX = x1 + dx * 0.33;
        const cp1CenterY = y1 + dy * 0.33;
        const cp2CenterX = x1 + dx * 0.67;
        const cp2CenterY = y1 + dy * 0.67;

        // Calculate curvature factor based on line width
        // Symmetric bounds: curve can span 0.5 * lineWidth in either direction
        // -1 (concave extreme) -> -0.5 * lineWidth
        // 0 (straight) -> 0
        // 1 (convex extreme) -> +0.5 * lineWidth
        const curvatureFactor = curvature * config.width * 0.5;

        ctx.fillStyle = config.color;
        ctx.globalAlpha = config.opacity;

        // Create a closed path with two curves that bulge in/out
        ctx.beginPath();

        // Top edge: starts at base offset, bulges at control points
        ctx.moveTo(x1 + perpX * halfWidth, y1 + perpY * halfWidth);
        ctx.bezierCurveTo(
            cp1CenterX + perpX * (halfWidth + curvatureFactor),
            cp1CenterY + perpY * (halfWidth + curvatureFactor),
            cp2CenterX + perpX * (halfWidth + curvatureFactor),
            cp2CenterY + perpY * (halfWidth + curvatureFactor),
            x2 + perpX * halfWidth,
            y2 + perpY * halfWidth
        );

        // Bottom edge: starts at base offset, bulges oppositely at control points
        ctx.lineTo(x2 - perpX * halfWidth, y2 - perpY * halfWidth);
        ctx.bezierCurveTo(
            cp2CenterX - perpX * (halfWidth + curvatureFactor),
            cp2CenterY - perpY * (halfWidth + curvatureFactor),
            cp1CenterX - perpX * (halfWidth + curvatureFactor),
            cp1CenterY - perpY * (halfWidth + curvatureFactor),
            x1 - perpX * halfWidth,
            y1 - perpY * halfWidth
        );

        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}

