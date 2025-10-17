/**
 * Export Validator - Checks if exports are feasible given browser canvas limits
 * Simple, modular design for easy maintenance and future enhancements
 */

export type ExportStatus = 'safe' | 'warning' | 'disabled';

export interface ExportFeasibility {
    scale: number;
    status: ExportStatus;
    message?: string;
    recommendation?: string;
}

interface BrowserLimits {
    maxDimension: number;
    maxPixels: number;
    warnPixels: number;
}

/**
 * Conservative browser canvas limits
 * These work across all major browsers
 */
const BROWSER_LIMITS: BrowserLimits = {
    maxDimension: 16384,      // Chrome/Edge limit
    maxPixels: 268435456,     // 16384 × 16384
    warnPixels: 134217728,    // Half of max (performance warning)
};

export class ExportValidator {
    private limits: BrowserLimits;

    constructor(customLimits?: Partial<BrowserLimits>) {
        this.limits = { ...BROWSER_LIMITS, ...customLimits };
    }

    /**
     * Calculate the maximum safe scale for given dimensions
     */
    calculateMaxScale(width: number, height: number): number {
        const maxByDimension = Math.floor(Math.min(
            this.limits.maxDimension / width,
            this.limits.maxDimension / height
        ));

        const maxByPixels = Math.floor(Math.sqrt(
            this.limits.maxPixels / (width * height)
        ));

        return Math.min(maxByDimension, maxByPixels);
    }

    /**
     * Validate if a specific export configuration will work
     */
    validateExport(
        width: number,
        height: number,
        scale: number
    ): ExportFeasibility {
        const targetWidth = Math.round(width * scale);
        const targetHeight = Math.round(height * scale);
        const totalPixels = targetWidth * targetHeight;

        // Check dimension limits
        if (targetWidth > this.limits.maxDimension || targetHeight > this.limits.maxDimension) {
            const maxScale = this.calculateMaxScale(width, height);
            return {
                scale,
                status: 'disabled',
                message: 'Exceeds browser limit',
                recommendation: `Max: ${maxScale}× for this grid`
            };
        }

        // Check pixel limits
        if (totalPixels > this.limits.maxPixels) {
            const maxScale = this.calculateMaxScale(width, height);
            return {
                scale,
                status: 'disabled',
                message: 'Too many pixels',
                recommendation: `Max: ${maxScale}× for this grid`
            };
        }

        // Warning for large exports
        if (totalPixels > this.limits.warnPixels) {
            return {
                scale,
                status: 'warning',
                message: 'Large export - may be slow',
                recommendation: 'Consider using SVG for unlimited resolution'
            };
        }

        // Safe to export
        return {
            scale,
            status: 'safe'
        };
    }

    /**
     * Validate multiple scales at once
     * Returns a map of scale -> feasibility
     */
    validateMultipleScales(
        width: number,
        height: number,
        scales: number[]
    ): Map<number, ExportFeasibility> {
        const results = new Map<number, ExportFeasibility>();

        for (const scale of scales) {
            results.set(scale, this.validateExport(width, height, scale));
        }

        return results;
    }
}

// Singleton instance for convenience
export const exportValidator = new ExportValidator();

