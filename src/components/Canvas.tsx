import { useEffect, useRef, useState } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useAppStore } from '../state/app-store';
import { distance } from '../utils/math';

export function Canvas() {
    const { canvasRef, rendererRef } = useCanvas();
    const lastMousePos = useRef<{ x: number; y: number } | null>(null);
    const isPanning = useRef(false);
    const draggedWellId = useRef<string | null>(null);
    const [isHoveringWell, setIsHoveringWell] = useState(false);

    const addWell = useAppStore((state) => state.addWell);
    const updateWell = useAppStore((state) => state.updateWell);
    const selectWell = useAppStore((state) => state.selectWell);
    const panViewport = useAppStore((state) => state.panViewport);
    const zoomViewport = useAppStore((state) => state.zoomViewport);
    const wells = useAppStore((state) => state.deformation.wells);
    const selectedWellId = useAppStore((state) => state.selectedWellId);
    const activeTool = useAppStore((state) => state.activeTool);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = -e.deltaY * 0.001;
            const rect = canvas.getBoundingClientRect();
            const centerX = e.clientX - rect.left;
            const centerY = e.clientY - rect.top;
            zoomViewport(delta, centerX, centerY);
        };

        const handleMouseDown = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            if (!rendererRef.current) return;

            const worldPos = rendererRef.current.screenToWorld(mouseX, mouseY);

            // Middle or right mouse button always pans
            if (e.button === 1 || e.button === 2) {
                isPanning.current = true;
                lastMousePos.current = { x: mouseX, y: mouseY };
                e.preventDefault();
                return;
            }

            // Pan tool: left click pans
            if (activeTool === 'pan') {
                isPanning.current = true;
                lastMousePos.current = { x: mouseX, y: mouseY };
                return;
            }

            // Place Well tool: check for well interaction or place new well
            if (activeTool === 'placeWell') {
                let clickedWell: string | null = null;
                for (const well of wells) {
                    const dist = distance(
                        worldPos.x,
                        worldPos.y,
                        well.position.x,
                        well.position.y
                    );
                    if (dist < 10) {
                        clickedWell = well.id;
                        break;
                    }
                }

                if (clickedWell) {
                    draggedWellId.current = clickedWell;
                    selectWell(clickedWell);
                } else {
                    addWell(worldPos);
                }

                lastMousePos.current = { x: mouseX, y: mouseY };
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Check if hovering over a well center (for cursor change)
            if (rendererRef.current && activeTool === 'placeWell') {
                const worldPos = rendererRef.current.screenToWorld(mouseX, mouseY);
                let hoveringWell = false;

                for (const well of wells) {
                    const dist = distance(
                        worldPos.x,
                        worldPos.y,
                        well.position.x,
                        well.position.y
                    );
                    if (dist < 10) {
                        hoveringWell = true;
                        break;
                    }
                }

                setIsHoveringWell(hoveringWell);
            } else {
                setIsHoveringWell(false);
            }

            if (!lastMousePos.current) return;

            if (isPanning.current) {
                const dx = mouseX - lastMousePos.current.x;
                const dy = mouseY - lastMousePos.current.y;
                panViewport(dx, dy);
            } else if (draggedWellId.current && rendererRef.current) {
                const worldPos = rendererRef.current.screenToWorld(mouseX, mouseY);
                updateWell(draggedWellId.current, { position: worldPos });
            }

            lastMousePos.current = { x: mouseX, y: mouseY };
        };

        const handleMouseUp = () => {
            isPanning.current = false;
            draggedWellId.current = null;
            lastMousePos.current = null;
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        canvas.addEventListener('wheel', handleWheel, { passive: false });
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('mouseleave', handleMouseUp);
        canvas.addEventListener('contextmenu', handleContextMenu);

        return () => {
            canvas.removeEventListener('wheel', handleWheel);
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            canvas.removeEventListener('mouseleave', handleMouseUp);
            canvas.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [
        canvasRef,
        rendererRef,
        addWell,
        updateWell,
        selectWell,
        panViewport,
        zoomViewport,
        wells,
        selectedWellId,
        activeTool,
    ]);

    // Dynamic cursor based on tool and hover state
    const getCursorClass = () => {
        if (activeTool === 'placeWell' && isHoveringWell) {
            return 'cursor-pointer'; // Pointer when hovering over well
        }
        return activeTool === 'pan' ? 'cursor-grab' : 'cursor-crosshair';
    };

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${getCursorClass()}`}
        />
    );
}

