import { GridPoint, GridConfig, Viewport } from '../types/grid';
import { ExportConfig } from '../types/export';
import { CanvasRenderer } from './canvas-renderer';
import { Well, DeformationConfig } from '../types/attractor';
import { generateStateHash } from '../utils/state-hash';

export class ExportManager {
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
                if (window.requestIdleCallback) {
                    requestIdleCallback(convertToBlob);
                } else {
                    setTimeout(convertToBlob, 0);
                }
            };

            // Start rendering in the next idle cycle
            if (window.requestIdleCallback) {
                requestIdleCallback(renderInChunks);
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

        // Add background rectangle if background color is set
        if (gridConfig.canvasBackgroundColor) {
            const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            background.setAttribute('x', bounds.minX.toString());
            background.setAttribute('y', bounds.minY.toString());
            background.setAttribute('width', width.toString());
            background.setAttribute('height', height.toString());
            background.setAttribute('fill', gridConfig.canvasBackgroundColor);
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

            for (const point of points) {
                for (const neighborId of point.neighbors) {
                    const neighbor = pointMap.get(neighborId);
                    if (neighbor && neighborId > point.id) {
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', point.currentPosition.x.toString());
                        line.setAttribute('y1', point.currentPosition.y.toString());
                        line.setAttribute('x2', neighbor.currentPosition.x.toString());
                        line.setAttribute('y2', neighbor.currentPosition.y.toString());
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

