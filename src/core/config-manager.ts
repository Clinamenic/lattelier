import { GridConfig, Viewport, SettingsLocks } from '../types/grid';
import { DeformationConfig } from '../types/attractor';
import { GridPincherConfig, ConfigMetadata, GridSettings, DistortionSettings } from '../types/config';

export class ConfigManager {
    /**
     * Export current app state to configuration object
     */
    exportConfig(
        gridConfig: GridConfig,
        deformation: DeformationConfig,
        viewport: Viewport,
        metadata: Partial<ConfigMetadata> = {},
        settingsLocks?: SettingsLocks,
        wellsLocked?: boolean
    ): GridPincherConfig {
        const now = new Date().toISOString();

        const config: GridPincherConfig = {
            version: '1.0.0',
            metadata: {
                name: metadata.name || `Grid Pattern ${new Date().toLocaleString()}`,
                description: metadata.description,
                createdAt: metadata.createdAt || now,
                modifiedAt: now,
                tags: metadata.tags,
                author: metadata.author,
            },
            grid: this.mapGridConfigToSettings(gridConfig),
            distortion: this.mapDeformationToSettings(deformation),
            viewport: {
                x: viewport.x,
                y: viewport.y,
                zoom: viewport.zoom,
                includeInExport: true,
            },
        };

        // Include lock states if provided
        if (settingsLocks !== undefined && wellsLocked !== undefined) {
            config.locks = {
                settings: settingsLocks,
                wells: wellsLocked,
            };
        }

        return config;
    }

    /**
     * Convert internal GridConfig to export format
     */
    private mapGridConfigToSettings(config: GridConfig): GridSettings {
        return {
            type: config.gridType,
            rows: config.rows,
            columns: config.columns,
            spacing: config.spacing,
            points: {
                show: config.showPoints,
                size: config.pointSize,
                color: config.pointColor,
                hueVariance: config.pointHueVariance,
                opacity: config.pointOpacity,
            },
            lines: {
                show: config.showLines,
                width: config.lineWidth,
                frequency: config.lineFrequency,
                curvature: config.lineCurvature,
                color: config.lineColor,
                hueVariance: config.lineHueVariance,
                opacity: config.lineOpacity,
                style: config.lineStyle,
                segmentedTextureSettings: config.segmentedTextureSettings,
            },
            fill: {
                show: config.showFill,
                frequency: config.fillFrequency,
                color: config.fillColor,
                hueVariance: config.fillHueVariance,
                opacity: config.fillOpacity,
                blendMode: config.blendMode,
            },
            canvas: {
                backgroundColor: config.canvasBackgroundColor,
                opacity: config.canvasOpacity,
            },
        };
    }

    /**
     * Convert internal DeformationConfig to export format
     */
    private mapDeformationToSettings(deformation: DeformationConfig): DistortionSettings {
        return {
            globalStrength: deformation.globalStrength,
            wells: deformation.wells.map(well => ({
                id: well.id,
                position: { x: well.position.x, y: well.position.y },
                strength: well.strength,
                radius: well.radius,
                falloff: well.falloff,
                distortion: well.distortion,
                enabled: well.enabled,
            })),
        };
    }

    /**
     * Serialize configuration to JSON string
     */
    serializeConfig(config: GridPincherConfig, prettify: boolean = true): string {
        return JSON.stringify(config, null, prettify ? 2 : 0);
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
     * Download configuration as JSON file
     * Uses modern File System Access API when available, falls back to legacy download method
     * Default filename is a state-based hash, which the user can edit in the save dialog
     */
    async downloadConfig(
        config: GridPincherConfig,
        filename?: string,
        stateHash?: string
    ): Promise<void> {
        const json = this.serializeConfig(config);

        // Generate default filename from state hash if not provided
        const defaultFilename = filename || `${stateHash || this.hashContent(json)}.json`;

        // Try modern File System Access API (Chrome, Edge, Opera)
        if ('showSaveFilePicker' in window) {
            try {
                const handle = await (window as any).showSaveFilePicker({
                    suggestedName: defaultFilename,
                    types: [{
                        description: 'JSON Configuration',
                        accept: { 'application/json': ['.json'] },
                    }],
                });

                const writable = await handle.createWritable();
                await writable.write(json);
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
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = defaultFilename;
        link.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Parse JSON string to configuration object
     */
    parseConfig(json: string): GridPincherConfig {
        return JSON.parse(json);
    }

    /**
     * Load configuration from file
     */
    async loadConfigFromFile(file: File): Promise<GridPincherConfig> {
        const text = await file.text();
        return this.parseConfig(text);
    }

    /**
     * Convert import format to internal GridConfig
     */
    mapSettingsToGridConfig(settings: GridSettings): GridConfig {
        return {
            gridType: settings.type,
            rows: Math.max(5, Math.min(100, settings.rows)),
            columns: Math.max(5, Math.min(100, settings.columns)),
            spacing: Math.max(5, Math.min(50, settings.spacing)),
            showPoints: settings.points.show,
            pointSize: Math.max(0.5, Math.min(10, settings.points.size)),
            pointColor: settings.points.color,
            pointHueVariance: Math.max(0, Math.min(1, settings.points.hueVariance ?? 0.0)),
            pointOpacity: Math.max(0, Math.min(1, settings.points.opacity)),
            showLines: settings.lines.show,
            lineWidth: Math.max(0.5, Math.min(10, settings.lines.width)),
            lineFrequency: Math.max(0, Math.min(1, settings.lines.frequency)),
            lineCurvature: Math.max(-1, Math.min(1, settings.lines.curvature)),
            lineColor: settings.lines.color,
            lineHueVariance: Math.max(0, Math.min(1, settings.lines.hueVariance ?? 0.0)),
            lineOpacity: Math.max(0, Math.min(1, settings.lines.opacity)),
            lineStyle: settings.lines.style || 'solid',
            segmentedTextureSettings: settings.lines.segmentedTextureSettings || {
                angleVariation: 1.0,
                spacingVariation: 0.5,
                lengthVariation: 1.0,
            },
            showFill: settings.fill.show,
            fillFrequency: Math.max(0, Math.min(1, settings.fill.frequency)),
            fillColor: settings.fill.color,
            fillHueVariance: Math.max(0, Math.min(1, settings.fill.hueVariance ?? 0.0)),
            fillOpacity: Math.max(0, Math.min(1, settings.fill.opacity)),
            blendMode: settings.fill.blendMode as any,
            canvasBackgroundColor: settings.canvas.backgroundColor,
            canvasOpacity: Math.max(0, Math.min(1, settings.canvas.opacity ?? 1.0)),
        };
    }

    /**
     * Convert import format to internal DeformationConfig
     */
    mapSettingsToDeformation(settings: DistortionSettings): DeformationConfig {
        return {
            globalStrength: settings.globalStrength,
            wells: settings.wells.map(well => ({
                id: well.id,
                position: { x: well.position.x, y: well.position.y },
                strength: Math.max(-1, Math.min(1, well.strength)),
                radius: Math.max(50, Math.min(500, well.radius)),
                falloff: well.falloff,
                distortion: Math.max(0, Math.min(1, well.distortion)),
                enabled: well.enabled,
            })),
        };
    }

    /**
     * Comprehensive validation of configuration structure
     */
    validateConfig(config: any): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Check required top-level fields
        if (!config.version) errors.push('Missing required field: version');
        if (!config.metadata) errors.push('Missing required field: metadata');
        if (!config.grid) errors.push('Missing required field: grid');
        if (!config.distortion) errors.push('Missing required field: distortion');

        // Early return if critical structure missing
        if (errors.length > 0) {
            return { valid: false, errors };
        }

        // Check metadata
        if (!config.metadata.name) {
            errors.push('Missing required field: metadata.name');
        }

        // Check grid structure
        if (!config.grid.type || !['square', 'triangular'].includes(config.grid.type)) {
            errors.push('Invalid or missing grid.type (must be square or triangular)');
        }
        if (typeof config.grid.rows !== 'number' || config.grid.rows < 5 || config.grid.rows > 100) {
            errors.push('Invalid grid.rows (must be number between 5 and 100)');
        }
        if (typeof config.grid.columns !== 'number' || config.grid.columns < 5 || config.grid.columns > 100) {
            errors.push('Invalid grid.columns (must be number between 5 and 100)');
        }
        if (typeof config.grid.spacing !== 'number' || config.grid.spacing < 5 || config.grid.spacing > 50) {
            errors.push('Invalid grid.spacing (must be number between 5 and 50)');
        }

        // Check grid sections exist
        if (!config.grid.points) errors.push('Missing required field: grid.points');
        if (!config.grid.lines) errors.push('Missing required field: grid.lines');
        if (!config.grid.fill) errors.push('Missing required field: grid.fill');
        if (!config.grid.canvas) errors.push('Missing required field: grid.canvas');

        // Check distortion structure
        if (!Array.isArray(config.distortion.wells)) {
            errors.push('distortion.wells must be an array');
        } else if (config.distortion.wells.length > 100) {
            errors.push('Too many wells (maximum 100)');
        }

        // Validate each well
        config.distortion.wells.forEach((well: any, index: number) => {
            if (!well.position || typeof well.position.x !== 'number' || typeof well.position.y !== 'number') {
                errors.push(`Well ${index + 1}: Invalid position`);
            }
            if (typeof well.strength !== 'number' || well.strength < -1 || well.strength > 1) {
                errors.push(`Well ${index + 1}: Invalid strength (must be between -1 and 1)`);
            }
            if (typeof well.radius !== 'number' || well.radius < 50 || well.radius > 500) {
                errors.push(`Well ${index + 1}: Invalid radius (must be between 50 and 500)`);
            }
        });

        return {
            valid: errors.length === 0,
            errors,
        };
    }
}

