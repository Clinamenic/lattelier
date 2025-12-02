import { create } from 'zustand';
import { GridConfig, GridPoint, Viewport, SettingsLocks } from '../types/grid';
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

    // Settings locks
    settingsLocks: SettingsLocks;
    wellsLocked: boolean;

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

    // Lock actions
    toggleSettingLock: (settingKey: string) => void;
    setWellsLocked: (locked: boolean) => void;

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

// Default settings locks (all unlocked)
const defaultSettingsLocks: SettingsLocks = {
    canvasBackgroundColor: false,
    canvasOpacity: false,
    gridType: false,
    rows: false,
    columns: false,
    spacing: false,
    pointColor: false,
    pointHueVariance: false,
    pointSize: false,
    pointOpacity: false,
    lineColor: false,
    lineHueVariance: false,
    lineStyle: false,
    lineCurvature: false,
    segmentedTextureSettings: {
        angleVariation: false,
        spacingVariation: false,
        lengthVariation: false,
    },
    lineFrequency: false,
    lineWidth: false,
    lineOpacity: false,
    fillColor: false,
    fillHueVariance: false,
    fillFrequency: false,
    fillOpacity: false,
    blendMode: false,
};

// Load settings locks from localStorage
const loadSettingsLocks = (): SettingsLocks => {
    try {
        const stored = localStorage.getItem('settingsLocks');
        if (stored) {
            const parsed = JSON.parse(stored);
            // Merge with defaults to handle new settings added in future
            return {
                ...defaultSettingsLocks,
                ...parsed,
                segmentedTextureSettings: {
                    ...defaultSettingsLocks.segmentedTextureSettings,
                    ...(parsed.segmentedTextureSettings || {}),
                },
            };
        }
    } catch {
        // Ignore errors
    }
    return defaultSettingsLocks;
};

// Load wells locked state from localStorage
const loadWellsLocked = (): boolean => {
    try {
        const stored = localStorage.getItem('wellsLocked');
        return stored !== null ? JSON.parse(stored) : false;
    } catch {
        return false;
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
    lineStyle: 'solid',
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
    pointHueVariance: 0.0,
    lineColor: '#6366f1',
    lineHueVariance: 0.0,
    fillColor: '#3b82f6',
    fillHueVariance: 0.0,
    canvasBackgroundColor: '#f9fafb', // Default light gray (tailwind gray-50)
    canvasOpacity: 1.0, // Default to fully opaque
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

    settingsLocks: loadSettingsLocks(),
    wellsLocked: loadWellsLocked(),

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

            // Restore lock states if present in config
            let newSettingsLocks = get().settingsLocks;
            let newWellsLocked = get().wellsLocked;

            if (config.locks) {
                // Merge with defaults to handle new settings added in future
                const defaultLocks = loadSettingsLocks();
                newSettingsLocks = {
                    ...defaultLocks,
                    ...config.locks.settings,
                    segmentedTextureSettings: {
                        ...defaultLocks.segmentedTextureSettings,
                        ...(config.locks.settings.segmentedTextureSettings || {}),
                    },
                };
                newWellsLocked = config.locks.wells ?? false;

                // Persist to localStorage
                localStorage.setItem('settingsLocks', JSON.stringify(newSettingsLocks));
                localStorage.setItem('wellsLocked', JSON.stringify(newWellsLocked));
            }

            set({
                gridConfig,
                deformation,
                viewport,
                settingsLocks: newSettingsLocks,
                wellsLocked: newWellsLocked,
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

    // Lock actions
    toggleSettingLock: (settingKey: string) => {
        set((state) => {
            // Handle nested keys (e.g., "segmentedTextureSettings.angleVariation")
            if (settingKey.includes('.')) {
                const [parent, child] = settingKey.split('.');
                const newLocks = {
                    ...state.settingsLocks,
                    [parent]: {
                        ...(state.settingsLocks[parent as keyof SettingsLocks] as any),
                        [child]: !(state.settingsLocks[parent as keyof SettingsLocks] as any)[child],
                    },
                };
                localStorage.setItem('settingsLocks', JSON.stringify(newLocks));
                return { settingsLocks: newLocks };
            }

            const newLocks = {
                ...state.settingsLocks,
                [settingKey]: !state.settingsLocks[settingKey as keyof SettingsLocks],
            };
            localStorage.setItem('settingsLocks', JSON.stringify(newLocks));
            return { settingsLocks: newLocks };
        });
    },

    setWellsLocked: (locked: boolean) => {
        set({ wellsLocked: locked });
        localStorage.setItem('wellsLocked', JSON.stringify(locked));
    },

    // Shuffle action
    shuffleSettings: () => {
        const { gridConfig, settingsLocks, wellsLocked } = get();

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

        // Randomize style type only if unlocked
        const randomStyle = settingsLocks.lineStyle
            ? gridConfig.lineStyle
            : randomChoice(['solid', 'segmented'] as const);

        // Generate new grid config - respect locks
        const newGridConfig: GridConfig = {
            ...gridConfig,
            // Only randomize if unlocked
            gridType: settingsLocks.gridType ? gridConfig.gridType : randomChoice(['square', 'triangular']),
            rows: settingsLocks.rows ? gridConfig.rows : randomInt(5, 200),
            columns: settingsLocks.columns ? gridConfig.columns : randomInt(5, 200),
            spacing: settingsLocks.spacing ? gridConfig.spacing : randomInt(5, 100),
            pointSize: settingsLocks.pointSize ? gridConfig.pointSize : randomFloat(0.5, 5),
            pointOpacity: settingsLocks.pointOpacity ? gridConfig.pointOpacity : randomFloat(0, 1),
            lineWidth: settingsLocks.lineWidth ? gridConfig.lineWidth : randomFloat(0.5, 10),
            lineFrequency: settingsLocks.lineFrequency ? gridConfig.lineFrequency : randomFloat(0, 1),
            lineCurvature: settingsLocks.lineCurvature
                ? gridConfig.lineCurvature
                : (randomStyle === 'solid' ? randomFloat(-1, 1) : gridConfig.lineCurvature),
            lineOpacity: settingsLocks.lineOpacity ? gridConfig.lineOpacity : randomFloat(0, 1),
            lineStyle: randomStyle,
            segmentedTextureSettings: randomStyle === 'segmented'
                ? {
                      angleVariation: settingsLocks.segmentedTextureSettings.angleVariation
                          ? gridConfig.segmentedTextureSettings?.angleVariation ?? 1.0
                          : randomFloat(0, 1),
                      spacingVariation: settingsLocks.segmentedTextureSettings.spacingVariation
                          ? gridConfig.segmentedTextureSettings?.spacingVariation ?? 0.5
                          : randomFloat(0, 1),
                      lengthVariation: settingsLocks.segmentedTextureSettings.lengthVariation
                          ? gridConfig.segmentedTextureSettings?.lengthVariation ?? 1.0
                          : randomFloat(0, 1),
                  }
                : gridConfig.segmentedTextureSettings,
            fillFrequency: settingsLocks.fillFrequency ? gridConfig.fillFrequency : randomFloat(0, 1),
            fillOpacity: settingsLocks.fillOpacity ? gridConfig.fillOpacity : randomFloat(0, 1),
            pointColor: settingsLocks.pointColor ? gridConfig.pointColor : randomHexColor(),
            pointHueVariance: settingsLocks.pointHueVariance ? gridConfig.pointHueVariance : randomFloat(0, 1),
            lineColor: settingsLocks.lineColor ? gridConfig.lineColor : randomHexColor(),
            lineHueVariance: settingsLocks.lineHueVariance ? gridConfig.lineHueVariance : randomFloat(0, 1),
            fillColor: settingsLocks.fillColor ? gridConfig.fillColor : randomHexColor(),
            fillHueVariance: settingsLocks.fillHueVariance ? gridConfig.fillHueVariance : randomFloat(0, 1),
            canvasBackgroundColor: settingsLocks.canvasBackgroundColor
                ? gridConfig.canvasBackgroundColor
                : randomHexColor(),
            canvasOpacity: settingsLocks.canvasOpacity ? gridConfig.canvasOpacity : randomFloat(0, 1),
            blendMode: settingsLocks.blendMode ? gridConfig.blendMode : randomChoice(['normal', 'multiply', 'screen', 'overlay']),
        };

        // Handle wells randomization
        let newWells: Well[] = [];
        let newGlobalStrength: number;

        if (!wellsLocked) {
            // Randomize wells
            const wellCount = randomInt(0, 8);

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
                newWells.push(well);
            }

            newGlobalStrength = randomFloat(0.5, 2.0);
        } else {
            // Preserve existing wells
            newWells = get().deformation.wells;
            newGlobalStrength = get().deformation.globalStrength;
        }

        // Apply all changes atomically
        set({
            gridConfig: newGridConfig,
            deformation: {
                wells: newWells,
                globalStrength: newGlobalStrength,
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

