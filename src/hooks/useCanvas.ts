import { useEffect, useRef } from 'react';
import { CanvasRenderer } from '../core/canvas-renderer';
import { useAppStore } from '../state/app-store';

export function useCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rendererRef = useRef<CanvasRenderer | null>(null);

    const deformedGrid = useAppStore((state) => state.deformedGrid);
    const gridConfig = useAppStore((state) => state.gridConfig);
    const wells = useAppStore((state) => state.deformation.wells);
    const viewport = useAppStore((state) => state.viewport);
    const showWells = useAppStore((state) => state.showWells);
    const hoveredWellId = useAppStore((state) => state.hoveredWellId);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        if (!rendererRef.current) {
            rendererRef.current = new CanvasRenderer(ctx, viewport);
        }

        const renderer = rendererRef.current;
        renderer.updateViewport(viewport);

        const render = () => {
            renderer.render(deformedGrid, gridConfig, wells, showWells, hoveredWellId);
        };

        render();
    }, [deformedGrid, gridConfig, wells, viewport, showWells, hoveredWellId]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const setViewport = useAppStore.getState().setViewport;
        const gridConfig = useAppStore.getState().gridConfig;
        let isInitialLoad = true;

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;

                // Center the grid on initial load
                if (isInitialLoad) {
                    isInitialLoad = false;

                    // Calculate approximate grid size
                    const gridWidth = gridConfig.columns * gridConfig.spacing;
                    const gridHeight = gridConfig.rows * gridConfig.spacing;

                    // Center viewport on the grid
                    const centerX = (canvas.width - gridWidth) / 2;
                    const centerY = (canvas.height - gridHeight) / 2;

                    setViewport({ x: centerX, y: centerY });
                }
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return { canvasRef, rendererRef };
}

