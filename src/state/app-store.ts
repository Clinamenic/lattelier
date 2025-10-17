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
    lineCurvature: 0.0, // 0% = straight lines
    lineOpacity: 0.8,
    fillFrequency: 1.0, // 100% = draw all fill polygons
    fillOpacity: 0.3,
    showPoints: true,
    showLines: true,
    showFill: false,
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
                showRadialLines: well.showRadialLines,
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
            showRadialLines: false,
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
            const newZoom = Math.max(0.1, Math.min(5, state.viewport.zoom + delta));
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
}));

