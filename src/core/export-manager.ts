import { GridPoint, GridConfig, Viewport, SegmentedTextureSettings } from '../types/grid';
import { ExportConfig } from '../types/export';
import { CanvasRenderer } from './canvas-renderer';
import { Well } from '../types/attractor';

export class ExportManager {
    /**
     * Deterministic hash function for consistent randomness
     * Improved to produce better distribution for segment variations
     */
    private hashPair(id1: string, id2: string): number {
        const str = `${id1}-${id2}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
            // Add more mixing for better distribution
            hash = hash ^ (hash >>> 16);
        }
        // Use larger modulus and add additional mixing
        hash = Math.abs(hash);
        hash = hash ^ (hash << 13);
        hash = hash ^ (hash >>> 7);
        hash = Math.abs(hash); // Ensure positive after XOR operations
        return ((hash % 1000000) / 1000000); // Normalize to 0-1 with better precision
    }

    /**
     * Generate segments for segmented texture (same algorithm as renderer)
     */
    private generateSegments(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        pointId: string,
        neighborId: string,
        settings?: SegmentedTextureSettings
    ): Array<{ x1: number; y1: number; x2: number; y2: number }> {
        const segSettings = settings || {
            angleVariation: 1.0,
            spacingVariation: 0.5,
            lengthVariation: 1.0,
        };

        const lineHash = this.hashPair(pointId, neighborId);
        const segmentCounts = [3, 4, 5];
        const segmentCountIndex = Math.floor(lineHash * 3);
        const segmentCount = segmentCounts[segmentCountIndex];

        const dx = x2 - x1;
        const dy = y2 - y1;
        const totalLength = Math.sqrt(dx * dx + dy * dy);

        if (totalLength === 0) return [];

        const baseAngle = Math.atan2(dy, dx);
        const unitX = dx / totalLength; // Unit vector X component
        const unitY = dy / totalLength; // Unit vector Y component
        
        // Calculate buffer to prevent terminal segments from overlapping at endpoints
        // Segments can angle away from base line, so we need to account for:
        // 1. Maximum segment extension perpendicular to the line
        // 2. Maximum segment length (with length variation)
        // 3. Fixed safety margin
        // Buffer is calculated based on worst-case segment extension, independent of grid spacing
        const maxAngleVariation = 0.05; // ±3 degrees in radians
        const lengthVariationRange = 0.24; // ±12% of base segment length
        
        // Estimate maximum segment length for buffer calculation
        // Use a conservative initial estimate to calculate buffer, then refine
        // Assume worst case: 5 segments (shortest segments), full length variation
        const estimatedSegmentCount = 5;
        const estimatedUsableLength = totalLength * 0.85; // Conservative initial estimate
        const estimatedTotalSegmentLength = estimatedUsableLength * 0.6;
        const estimatedBaseSegmentLength = estimatedTotalSegmentLength / estimatedSegmentCount;
        const estimatedMaxSegmentLength = estimatedBaseSegmentLength * (1 + lengthVariationRange * (segSettings.lengthVariation || 1.0));
        
        // Maximum perpendicular extension = segment length * sin(max angle)
        // This is the worst-case distance a segment extends perpendicular to the base line
        const maxPerpendicularExtension = estimatedMaxSegmentLength * Math.sin(maxAngleVariation * (segSettings.angleVariation || 1.0));
        
        // Fixed buffer: max perpendicular extension + safety margin
        // Safety margin ensures even segments at max angle/length stay clear of endpoints
        // This buffer is independent of grid spacing and scales appropriately
        const fixedBuffer = maxPerpendicularExtension + 4.0; // 4px safety margin
        
        // Ensure minimum buffer (for very short lines or small angles)
        const minBuffer = 6.0;
        const endBuffer = Math.max(fixedBuffer, minBuffer);
        
        // Use total length minus buffers on both ends
        // This ensures terminal segments stay away from endpoints
        const usableLength = Math.max(0, totalLength - (endBuffer * 2));
        const startOffset = endBuffer;
        
        // Calculate base segment and gap lengths
        const segmentRatio = 0.75; // 75% of usable length for segments
        const gapRatio = 0.25; // 25% of usable length for gaps (reduced from 40% for tighter spacing)
        
        const totalSegmentLength = usableLength * segmentRatio;
        const totalGapLength = usableLength * gapRatio;
        
        const baseSegmentLength = totalSegmentLength / segmentCount;
        const baseGapLength = totalGapLength / (segmentCount - 1 || 1);

        const maxSpacingVariation = 0.4;

        // Start position: offset from x1, y1 by the calculated buffer
        const startX = x1 + unitX * startOffset;
        const startY = y1 + unitY * startOffset;

        const segments: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
        let progressAlongBaseLine = 0; // Track progress along the base line axis

        for (let i = 0; i < segmentCount; i++) {
            // Use separate hash seeds for angle, length, and spacing to ensure independence
            const lineId = this.hashPair(pointId, neighborId).toString();
            const segmentHash = this.hashPair(lineId, `seg-${i}-angle`);
            const lengthHash = this.hashPair(lineId, `seg-${i}-length`);
            const nextSegmentHash = i < segmentCount - 1 
                ? this.hashPair(lineId, `seg-${i + 1}-spacing`) 
                : 0;

            // Angle variation (scaled by setting) - each segment gets independent angle
            // The base line axis remains constant - only individual segments angle away from it
            const angleOffset =
                (segmentHash - 0.5) * maxAngleVariation * segSettings.angleVariation;
            const segmentAngle = baseAngle + angleOffset;

            const baseLengthMultiplier = 1.0;
            const lengthMultiplier =
                baseLengthMultiplier +
                (lengthHash - 0.5) * lengthVariationRange * segSettings.lengthVariation;
            let segmentLength = baseSegmentLength * lengthMultiplier;

            // Calculate how much this segment would advance along the base line
            const segmentProgress = segmentLength * Math.cos(angleOffset);
            
            // Constrain: ensure we don't exceed the usable length boundary
            const remainingProgress = usableLength - progressAlongBaseLine;
            if (segmentProgress > remainingProgress) {
                // Adjust segment length so its projection fits
                segmentLength = remainingProgress / Math.cos(angleOffset);
            }

            // Calculate segment start position - ALWAYS on the base line axis
            // This ensures the base line axis never changes when angleVariation is adjusted
            const segmentStartX = startX + unitX * progressAlongBaseLine;
            const segmentStartY = startY + unitY * progressAlongBaseLine;

            // Calculate segment end point (angled away from base line)
            const segEndX = segmentStartX + Math.cos(segmentAngle) * segmentLength;
            const segEndY = segmentStartY + Math.sin(segmentAngle) * segmentLength;

            segments.push({
                x1: segmentStartX,
                y1: segmentStartY,
                x2: segEndX,
                y2: segEndY,
            });

            // Update progress along base line (projection of segment)
            const actualSegmentProgress = segmentLength * Math.cos(angleOffset);
            progressAlongBaseLine += actualSegmentProgress;

            if (i < segmentCount - 1) {
                const remainingProgressAfterSegment = usableLength - progressAlongBaseLine;
                
                // If no space left, stop
                if (remainingProgressAfterSegment <= 0) {
                    break;
                }

                const spacingMultiplier = 1.0 + 
                    (nextSegmentHash - 0.5) * maxSpacingVariation * segSettings.spacingVariation;
                let gapLength = baseGapLength * spacingMultiplier;

                // Constrain gap to fit in remaining space
                if (gapLength > remainingProgressAfterSegment) {
                    gapLength = remainingProgressAfterSegment;
                }

                // Move progress along base line for next segment
                // The next segment will start on the base line axis at this position
                progressAlongBaseLine += gapLength;
                
                // If we've reached the end, stop adding more segments
                if (progressAlongBaseLine >= usableLength) {
                    break;
                }
            }
        }

        return segments;
    }

    /**
     * Generate a short hash from string content for unique filenames
     */
    private hashContent(content: string): string {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        // Convert to hex and take first 8 characters
        return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 8);
    }

    /**
     * Generate hash from blob data for unique filenames
     */
    private async hashBlob(blob: Blob): Promise<string> {
        const text = await blob.text();
        return this.hashContent(text);
    }

    exportPNG(
        points: GridPoint[],
        gridConfig: GridConfig,
        wells: Well[],
        bounds: { minX: number; minY: number; maxX: number; maxY: number },
        config: Partial<ExportConfig> = {}
    ): Promise<Blob | null> {
        return new Promise((resolve) => {
            try {
                const scale = config.scale || 1;

                // Calculate dimensions in world space
                const worldWidth = bounds.maxX - bounds.minX;
                const worldHeight = bounds.maxY - bounds.minY;

                // Calculate target canvas size
                const targetWidth = Math.round(worldWidth * scale);
                const targetHeight = Math.round(worldHeight * scale);

                // For large exports, use non-blocking rendering
                if (targetWidth * targetHeight > 1000000) { // 1M pixels threshold
                    this.exportPNGNonBlocking(
                        points, gridConfig, wells, bounds, scale, targetWidth, targetHeight
                    ).then(resolve).catch(() => resolve(null));
                    return;
                }

                // For smaller exports, use synchronous rendering
                this.exportPNGSync(
                    points, gridConfig, wells, bounds, scale, targetWidth, targetHeight
                ).then(resolve).catch(() => resolve(null));

            } catch (error) {
                console.error('Error in exportPNG:', error);
                resolve(null);
            }
        });
    }

    private async exportPNGSync(
        points: GridPoint[],
        gridConfig: GridConfig,
        wells: Well[],
        bounds: { minX: number; minY: number; maxX: number; maxY: number },
        scale: number,
        targetWidth: number,
        targetHeight: number
    ): Promise<Blob | null> {
        // Create high-resolution export canvas
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = targetWidth;
        exportCanvas.height = targetHeight;

        const ctx = exportCanvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get 2D context');
            return null;
        }

        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Create viewport that centers the grid in the export canvas
        const exportViewport: Viewport = {
            x: -bounds.minX * scale,
            y: -bounds.minY * scale,
            zoom: scale,
        };

        // Render the grid at high resolution
        const renderer = new CanvasRenderer(ctx, exportViewport);
        renderer.render(points, gridConfig, wells, false, null);

        return new Promise((resolve) => {
            exportCanvas.toBlob(resolve, 'image/png', 1.0);
        });
    }

    private async exportPNGNonBlocking(
        points: GridPoint[],
        gridConfig: GridConfig,
        wells: Well[],
        bounds: { minX: number; minY: number; maxX: number; maxY: number },
        scale: number,
        targetWidth: number,
        targetHeight: number
    ): Promise<Blob | null> {
        return new Promise((resolve) => {
            // Create high-resolution export canvas
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = targetWidth;
            exportCanvas.height = targetHeight;

            const ctx = exportCanvas.getContext('2d');
            if (!ctx) {
                console.error('Failed to get 2D context');
                resolve(null);
                return;
            }

            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            // Create viewport that centers the grid in the export canvas
            const exportViewport: Viewport = {
                x: -bounds.minX * scale,
                y: -bounds.minY * scale,
                zoom: scale,
            };

            // Use requestIdleCallback to render in chunks
            const renderer = new CanvasRenderer(ctx, exportViewport);

            // Render in idle time to avoid blocking the main thread
            const renderInChunks = () => {
                // Render the grid at high resolution
                renderer.render(points, gridConfig, wells, false, null);

                // Convert to blob in the next idle cycle
                const convertToBlob = () => {
                    exportCanvas.toBlob(resolve, 'image/png', 1.0);
                };

                // Use requestIdleCallback if available, otherwise setTimeout
                if (typeof window.requestIdleCallback === 'function') {
                    window.requestIdleCallback(convertToBlob);
                } else {
                    setTimeout(convertToBlob, 0);
                }
            };

            // Start rendering in the next idle cycle
            if (typeof window.requestIdleCallback === 'function') {
                window.requestIdleCallback(renderInChunks);
            } else {
                setTimeout(renderInChunks, 0);
            }
        });
    }

    exportSVG(
        points: GridPoint[],
        gridConfig: GridConfig,
        bounds: { minX: number; minY: number; maxX: number; maxY: number }
    ): string {
        const width = bounds.maxX - bounds.minX;
        const height = bounds.maxY - bounds.minY;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width.toString());
        svg.setAttribute('height', height.toString());
        svg.setAttribute('viewBox', `${bounds.minX} ${bounds.minY} ${width} ${height}`);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        // Add background rectangle if background color is set and opacity > 0
        if (gridConfig.canvasBackgroundColor && gridConfig.canvasOpacity > 0) {
            const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            background.setAttribute('x', bounds.minX.toString());
            background.setAttribute('y', bounds.minY.toString());
            background.setAttribute('width', width.toString());
            background.setAttribute('height', height.toString());
            background.setAttribute('fill', gridConfig.canvasBackgroundColor);
            background.setAttribute('opacity', gridConfig.canvasOpacity.toString());
            svg.appendChild(background);
        }

        const pointMap = new Map<string, GridPoint>();
        for (const point of points) {
            pointMap.set(point.id, point);
        }

        if (gridConfig.lineOpacity > 0) {
            const linesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            linesGroup.setAttribute('stroke', gridConfig.lineColor);
            linesGroup.setAttribute('stroke-width', gridConfig.lineWidth.toString());
            linesGroup.setAttribute('opacity', gridConfig.lineOpacity.toString());
            
            if (gridConfig.lineStyle === 'segmented') {
                linesGroup.setAttribute('stroke-linecap', 'butt'); // Sharp ends
            }

            for (const point of points) {
                for (const neighborId of point.neighbors) {
                    const neighbor = pointMap.get(neighborId);
                    if (!neighbor || neighborId <= point.id) continue;

                    const x1 = point.currentPosition.x;
                    const y1 = point.currentPosition.y;
                    const x2 = neighbor.currentPosition.x;
                    const y2 = neighbor.currentPosition.y;

                    if (gridConfig.lineStyle === 'segmented') {
                        // Generate segments for segmented texture
                        const segments = this.generateSegments(
                            x1,
                            y1,
                            x2,
                            y2,
                            point.id,
                            neighborId,
                            gridConfig.segmentedTextureSettings
                        );
                        segments.forEach((seg) => {
                            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                            line.setAttribute('x1', seg.x1.toString());
                            line.setAttribute('y1', seg.y1.toString());
                            line.setAttribute('x2', seg.x2.toString());
                            line.setAttribute('y2', seg.y2.toString());
                            linesGroup.appendChild(line);
                        });
                    } else {
                        // Solid texture - single line
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', x1.toString());
                        line.setAttribute('y1', y1.toString());
                        line.setAttribute('x2', x2.toString());
                        line.setAttribute('y2', y2.toString());
                        linesGroup.appendChild(line);
                    }
                }
            }

            svg.appendChild(linesGroup);
        }

        if (gridConfig.pointOpacity > 0) {
            const pointsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            pointsGroup.setAttribute('fill', gridConfig.pointColor);
            pointsGroup.setAttribute('opacity', gridConfig.pointOpacity.toString());

            for (const point of points) {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', point.currentPosition.x.toString());
                circle.setAttribute('cy', point.currentPosition.y.toString());
                circle.setAttribute('r', gridConfig.pointSize.toString());
                pointsGroup.appendChild(circle);
            }

            svg.appendChild(pointsGroup);
        }

        return new XMLSerializer().serializeToString(svg);
    }

    /**
     * Download a blob with modern File System Access API when available
     * Default filename is a state-based hash if not provided
     */
    async downloadBlob(
        blob: Blob,
        filename?: string,
        mimeType?: string,
        stateHash?: string
    ): Promise<void> {
        // Generate default filename from state hash if not provided
        const hash = stateHash || await this.hashBlob(blob);
        const extension = mimeType === 'image/png' ? '.png' : '.svg';
        const defaultFilename = filename || `${hash}${extension}`;

        // Determine accept types based on mime type
        const acceptTypes = mimeType === 'image/png'
            ? { 'image/png': ['.png'] }
            : { 'image/svg+xml': ['.svg'] };

        const description = mimeType === 'image/png' ? 'PNG Image' : 'SVG Image';

        // Try modern File System Access API (Chrome, Edge, Opera)
        if ('showSaveFilePicker' in window) {
            try {
                const handle = await (window as any).showSaveFilePicker({
                    suggestedName: defaultFilename,
                    types: [{
                        description,
                        accept: acceptTypes,
                    }],
                });

                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
                return;
            } catch (err) {
                // User cancelled or API not fully supported - fall through to legacy method
                if ((err as Error).name === 'AbortError') {
                    // User explicitly cancelled - don't fall back
                    return;
                }
                // Otherwise, fall through to legacy method
            }
        }

        // Fallback to legacy download method (works in all browsers)
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = defaultFilename;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Download text content (e.g., SVG) with modern File System Access API when available
     */
    async downloadText(
        text: string,
        filename?: string,
        mimeType: string = 'image/svg+xml',
        stateHash?: string
    ): Promise<void> {
        const blob = new Blob([text], { type: mimeType });
        await this.downloadBlob(blob, filename, mimeType, stateHash);
    }
}

