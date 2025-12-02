import { GridConfig, Viewport } from '../types/grid';
import { DeformationConfig } from '../types/attractor';

/**
 * Generate a consistent hash from the logical state of the application
 * This ensures the same state always produces the same hash, regardless of export format
 */
export function generateStateHash(
    gridConfig: GridConfig,
    deformation: DeformationConfig,
    viewport: Viewport
): string {
    // Create a normalized state object that represents the logical state
    const state = {
        // Grid configuration (excluding UI-only properties)
        grid: {
            type: gridConfig.gridType,
            rows: gridConfig.rows,
            columns: gridConfig.columns,
            spacing: gridConfig.spacing,
            pointSize: gridConfig.pointSize,
            pointOpacity: gridConfig.pointOpacity,
            pointColor: gridConfig.pointColor,
            pointHueVariance: gridConfig.pointHueVariance,
            lineWidth: gridConfig.lineWidth,
            lineFrequency: gridConfig.lineFrequency,
            lineCurvature: gridConfig.lineCurvature,
            lineOpacity: gridConfig.lineOpacity,
            lineColor: gridConfig.lineColor,
            lineHueVariance: gridConfig.lineHueVariance,
            fillFrequency: gridConfig.fillFrequency,
            fillOpacity: gridConfig.fillOpacity,
            fillColor: gridConfig.fillColor,
            fillHueVariance: gridConfig.fillHueVariance,
            canvasBackgroundColor: gridConfig.canvasBackgroundColor,
            canvasOpacity: gridConfig.canvasOpacity,
            blendMode: gridConfig.blendMode,
            // Note: showPoints, showLines, showFill are UI state, not logical state
        },

        // Deformation configuration
        deformation: {
            globalStrength: deformation.globalStrength,
            wells: deformation.wells.map(well => ({
                // Only include logical properties, exclude UI state like id
                position: well.position,
                strength: well.strength,
                radius: well.radius,
                falloff: well.falloff,
                distortion: well.distortion,
                enabled: well.enabled,
            })).sort((a, b) => {
                // Sort wells by position to ensure consistent ordering
                if (a.position.x !== b.position.x) return a.position.x - b.position.x;
                return a.position.y - b.position.y;
            }),
        },

        // Viewport (optional - might want to exclude this for some use cases)
        viewport: {
            x: Math.round(viewport.x * 100) / 100, // Round to 2 decimal places
            y: Math.round(viewport.y * 100) / 100,
            zoom: Math.round(viewport.zoom * 100) / 100,
        }
    };

    // Convert to JSON string with consistent formatting
    const stateString = JSON.stringify(state, null, 0);

    // Generate hash from the state string
    return hashString(stateString);
}

/**
 * Generate a short hash from string content
 */
function hashString(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
        const char = content.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    // Convert to hex and take first 8 characters
    return Math.abs(hash).toString(16).padStart(8, '0').substring(0, 8);
}
