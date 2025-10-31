import { create } from 'zustand';
import { GridConfig, GridPoint, Viewport } from '../types/grid';
import { Well, DeformationConfig } from '../types/attractor';
import { GridEngine } from '../core/grid-engine';
import { PinchCalculator } from '../core/pinch-calculator';
import { GridPincherConfig } from '../types/config';

export type Tool = 'pan' | 'placeWell';
export type ImportMode = 'replace' | 'merge';

interface AppState {
    // Grid
    gridConfig: GridConfig;
    baseGrid: GridPoint[];
    deformedGrid: GridPoint[];

    // Deformation
    deformation: DeformationConfig;

    // UI
    viewport: Viewport;
    selectedWellId: string | null;
    hoveredWellId: string | null;
    showWells: boolean;
    isDragging: boolean;
    dragStart: { x: number; y: number } | null;
    activeTool: Tool;
    leftSidebarCollapsed: boolean;
    rightSidebarCollapsed: boolean;

    // Actions
    setGridConfig: (config: Partial<GridConfig>) => void;
    regenerateGrid: () => void;
    updateDeformedGrid: () => void;
    importConfiguration: (config: GridPincherConfig, mode: ImportMode, configManager: any) => void;

    // Well actions
    addWell: (position: { x: number; y: number }) => void;
    updateWell: (id: string, updates: Partial<Well>) => void;
    removeWell: (id: string) => void;
    selectWell: (id: string | null) => void;
    setHoveredWell: (id: string | null) => void;

    // Viewport actions
    setViewport: (viewport: Partial<Viewport>) => void;
    panViewport: (dx: number, dy: number) => void;
    zoomViewport: (delta: number, centerX: number, centerY: number) => void;

    // UI actions
    setShowWells: (show: boolean) => void;
    setIsDragging: (dragging: boolean) => void;
    setDragStart: (pos: { x: number; y: number } | null) => void;
    setActiveTool: (tool: Tool) => void;
    toggleLeftSidebar: () => void;
    toggleRightSidebar: () => void;

    // Shuffle action
    shuffleSettings: () => void;

    // Viewport adjustment
    adjustViewportToFit: () => void;
}

const gridEngine = new GridEngine();
const pinchCalculator = new PinchCalculator();

// Load sidebar collapsed states from localStorage
const loadSidebarState = (key: string, defaultValue: boolean): boolean => {
    try {
        const stored = localStorage.getItem(key);
        return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
        return defaultValue;
    }
};

const defaultGridConfig: GridConfig = {
    rows: 30,
    columns: 30,
    spacing: 20,
    pointSize: 2,
    pointOpacity: 0.8,
    lineWidth: 1.5,
    lineFrequency: 1.0, // 100% = draw all connections
    lineCurvature: 0, // -100% = concave, 0% = straight, 100% = convex
    lineOpacity: 0.8,
    lineTexture: 'solid',
    segmentedTextureSettings: {
        angleVariation: 1.0, // full ±3 degree variation
        spacingVariation: 0.5, // 15% spacing variation
        lengthVariation: 1.0, // full ±12% length variation
    },
    fillFrequency: 1.0, // 100% = draw all fill polygons
    fillOpacity: 0.3,
    showPoints: true,
    showLines: true,
    showFill: true,
    pointColor: '#1f2937',
    lineColor: '#6366f1',
    fillColor: '#3b82f6',
    canvasBackgroundColor: '#f9fafb', // Default light gray (tailwind gray-50)
    gridType: 'square',
    blendMode: 'normal',
};

export const useAppStore = create<AppState>((set, get) => ({
    // Initial state
    gridConfig: defaultGridConfig,
    baseGrid: gridEngine.generateGrid(defaultGridConfig),
    deformedGrid: gridEngine.generateGrid(defaultGridConfig),

    deformation: {
        wells: [],
        globalStrength: 1,
    },

    viewport: {
        x: 50,
        y: 50,
        zoom: 1,
    },

    selectedWellId: null,
    hoveredWellId: null,
    showWells: true,
    isDragging: false,
    dragStart: null,
    activeTool: 'pan',
    leftSidebarCollapsed: loadSidebarState('leftSidebarCollapsed', false),
    rightSidebarCollapsed: loadSidebarState('rightSidebarCollapsed', false),

    // Grid actions
    setGridConfig: (config) => {
        set((state) => ({
            gridConfig: { ...state.gridConfig, ...config },
        }));
        get().regenerateGrid();
    },

    regenerateGrid: () => {
        const { gridConfig } = get();
        const baseGrid = gridEngine.generateGrid(gridConfig);
        set({ baseGrid });
        get().updateDeformedGrid();
    },

    updateDeformedGrid: () => {
        const { baseGrid, deformation } = get();
        const deformedGrid = pinchCalculator.applyWells(
            baseGrid,
            deformation.wells,
            deformation.globalStrength
        );
        set({ deformedGrid });
    },

    importConfiguration: (config, mode, configManager) => {
        if (mode === 'replace') {
            // Replace entire configuration
            const gridConfig = configManager.mapSettingsToGridConfig(config.grid);
            const deformation = configManager.mapSettingsToDeformation(config.distortion);
            const viewport = config.viewport?.includeInExport
                ? { x: config.viewport.x, y: config.viewport.y, zoom: config.viewport.zoom }
                : get().viewport;

            set({
                gridConfig,
                deformation,
                viewport,
                selectedWellId: null,
            });

            // Regenerate grids with new config
            get().regenerateGrid();
        } else if (mode === 'merge') {
            // Keep grid config, add wells
            const importedWells = config.distortion.wells.map(well => ({
                id: `well-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                position: { x: well.position.x, y: well.position.y },
                strength: Math.max(-1, Math.min(1, well.strength)),
                radius: Math.max(50, Math.min(500, well.radius)),
                falloff: well.falloff,
                distortion: Math.max(0, Math.min(1, well.distortion)),
                enabled: well.enabled,
            }));

            set((state) => ({
                deformation: {
                    ...state.deformation,
                    wells: [...state.deformation.wells, ...importedWells],
                },
                selectedWellId: null,
            }));

            // Update deformation with merged wells
            get().updateDeformedGrid();
        }
    },

    // Well actions
    addWell: (position) => {
        const newWell: Well = {
            id: `well-${Date.now()}`,
            position,
            strength: 0.5,
            radius: 150,
            falloff: 'smooth',
            enabled: true,
            distortion: 0,
        };

        set((state) => ({
            deformation: {
                ...state.deformation,
                wells: [...state.deformation.wells, newWell],
            },
            selectedWellId: newWell.id,
        }));

        get().updateDeformedGrid();
    },

    updateWell: (id, updates) => {
        set((state) => ({
            deformation: {
                ...state.deformation,
                wells: state.deformation.wells.map((w) =>
                    w.id === id ? { ...w, ...updates } : w
                ),
            },
        }));

        get().updateDeformedGrid();
    },

    removeWell: (id) => {
        set((state) => ({
            deformation: {
                ...state.deformation,
                wells: state.deformation.wells.filter((w) => w.id !== id),
            },
            selectedWellId: state.selectedWellId === id ? null : state.selectedWellId,
        }));

        get().updateDeformedGrid();
    },

    selectWell: (id) => {
        set({ selectedWellId: id });
    },

    setHoveredWell: (id) => {
        set({ hoveredWellId: id });
    },

    // Viewport actions
    setViewport: (viewport) => {
        set((state) => ({
            viewport: { ...state.viewport, ...viewport },
        }));
    },

    panViewport: (dx, dy) => {
        set((state) => ({
            viewport: {
                ...state.viewport,
                x: state.viewport.x + dx,
                y: state.viewport.y + dy,
            },
        }));
    },

    zoomViewport: (delta, centerX, centerY) => {
        set((state) => {
            const newZoom = Math.max(0.05, Math.min(5, state.viewport.zoom + delta));
            const zoomRatio = newZoom / state.viewport.zoom;

            return {
                viewport: {
                    x: centerX - (centerX - state.viewport.x) * zoomRatio,
                    y: centerY - (centerY - state.viewport.y) * zoomRatio,
                    zoom: newZoom,
                },
            };
        });
    },

    // UI actions
    setShowWells: (show) => {
        set({ showWells: show });
    },

    setIsDragging: (dragging) => {
        set({ isDragging: dragging });
    },

    setDragStart: (pos) => {
        set({ dragStart: pos });
    },

    setActiveTool: (tool) => {
        set({ activeTool: tool });
    },

    toggleLeftSidebar: () => {
        set((state) => {
            const newValue = !state.leftSidebarCollapsed;
            localStorage.setItem('leftSidebarCollapsed', JSON.stringify(newValue));
            return { leftSidebarCollapsed: newValue };
        });
    },

    toggleRightSidebar: () => {
        set((state) => {
            const newValue = !state.rightSidebarCollapsed;
            localStorage.setItem('rightSidebarCollapsed', JSON.stringify(newValue));
            return { rightSidebarCollapsed: newValue };
        });
    },

    // Shuffle action
    shuffleSettings: () => {
        const { gridConfig } = get();

        // Helper functions for random generation
        const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
        const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;
        const randomChoice = <T>(choices: T[]): T => choices[Math.floor(Math.random() * choices.length)];
        const randomHexColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

        // Calculate actual grid bounds from baseGrid points
        const calculateGridBounds = (points: GridPoint[]) => {
            if (points.length === 0) {
                return { minX: 0, minY: 0, maxX: 100, maxY: 100 };
            }

            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

            for (const point of points) {
                const { x, y } = point.originalPosition;
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }

            return { minX, minY, maxX, maxY };
        };

        // Randomize texture type
        const randomTexture = randomChoice(['solid', 'segmented'] as const);

        // Generate random grid config (preserving dimensions)
        const newGridConfig: GridConfig = {
            ...gridConfig,
            // Randomize visual settings
            gridType: randomChoice(['square', 'triangular']),
            spacing: randomInt(5, 100),
            pointSize: randomFloat(0.5, 5),
            pointOpacity: randomFloat(0, 1),
            lineWidth: randomFloat(0.5, 10),
            lineFrequency: randomFloat(0, 1),
            lineCurvature: randomTexture === 'solid' ? randomFloat(-1, 1) : gridConfig.lineCurvature,
            lineOpacity: randomFloat(0, 1),
            lineTexture: randomTexture,
            segmentedTextureSettings: randomTexture === 'segmented' ? {
                angleVariation: randomFloat(0, 1),
                spacingVariation: randomFloat(0, 1),
                lengthVariation: randomFloat(0, 1),
            } : gridConfig.segmentedTextureSettings,
            fillFrequency: randomFloat(0, 1),
            fillOpacity: randomFloat(0, 1),
            pointColor: randomHexColor(),
            lineColor: randomHexColor(),
            fillColor: randomHexColor(),
            canvasBackgroundColor: randomHexColor(),
            blendMode: randomChoice(['normal', 'multiply', 'screen', 'overlay']),
        };

        // Generate random wells (0-8 wells) within actual grid bounds
        const wellCount = randomInt(0, 8);
        const wells: Well[] = [];

        // Calculate bounds for the NEW grid configuration
        // We need to generate a temporary grid to get the correct bounds
        const tempGrid = gridEngine.generateGrid(newGridConfig);
        const gridBounds = calculateGridBounds(tempGrid);

        for (let i = 0; i < wellCount; i++) {
            const well: Well = {
                id: `well-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                position: {
                    x: randomFloat(gridBounds.minX, gridBounds.maxX),
                    y: randomFloat(gridBounds.minY, gridBounds.maxY),
                },
                strength: randomFloat(-1, 1),
                radius: randomFloat(50, 500),
                falloff: randomChoice(['linear', 'quadratic', 'exponential', 'smooth']),
                distortion: randomFloat(0, 1),
                enabled: Math.random() < 0.8, // 80% enabled
            };
            wells.push(well);
        }

        // Apply all changes atomically
        set({
            gridConfig: newGridConfig,
            deformation: {
                wells,
                globalStrength: randomFloat(0.5, 2.0),
            },
            selectedWellId: null, // Clear selection
        });

        // Regenerate grids with new settings
        get().regenerateGrid();

        // Auto-adjust viewport to fit the new pattern
        get().adjustViewportToFit();
    },

    // Viewport adjustment
    adjustViewportToFit: () => {
        const { deformedGrid } = get();

        if (deformedGrid.length === 0) return;

        // Calculate grid bounds with padding
        const padding = 50; // Extra padding around the pattern
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        for (const point of deformedGrid) {
            const { x, y } = point.currentPosition;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }

        const patternWidth = maxX - minX + (padding * 2);
        const patternHeight = maxY - minY + (padding * 2);
        const patternCenterX = (minX + maxX) / 2;
        const patternCenterY = (minY + maxY) / 2;

        // Get actual canvas dimensions from the DOM
        const canvas = document.querySelector('canvas');
        const canvasWidth = canvas?.clientWidth || 1200; // Fallback to reasonable default
        const canvasHeight = canvas?.clientHeight || 800; // Fallback to reasonable default

        // Calculate optimal zoom to fit the pattern with more breathing room
        const zoomX = canvasWidth / patternWidth;
        const zoomY = canvasHeight / patternHeight;
        const baseZoom = Math.min(zoomX, zoomY, 6.0); // Cap at 4x zoom max

        // Apply a zoom-out factor to give more breathing room (0.6 = 40% more zoomed out)
        const optimalZoom = baseZoom * 0.6;

        // Center the pattern in the viewport
        const newViewportX = (canvasWidth / 2) - (patternCenterX * optimalZoom);
        const newViewportY = (canvasHeight / 2) - (patternCenterY * optimalZoom);

        // Apply the new viewport
        set({
            viewport: {
                x: newViewportX,
                y: newViewportY,
                zoom: Math.max(0.025, optimalZoom), // Ensure minimum zoom
            }
        });
    },
}));

