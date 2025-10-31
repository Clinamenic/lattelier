import { LineTextureRenderer, LineRenderConfig } from './base-texture';

export class SegmentedTextureRenderer implements LineTextureRenderer {
    supportsCurvature(): boolean {
        return false;
    }

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

    renderStraightLine(
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        config: LineRenderConfig
    ): void {
        // Get settings from config (with defaults if not set)
        const settings = config.segmentedTextureSettings || {
            angleVariation: 1.0,
            spacingVariation: 0.5,
            lengthVariation: 1.0,
        };

        // Use lineId for deterministic segment count determination
        // lineId is already a hash (0-1), use it directly
        const lineHash = parseFloat(config.lineId);
        
        // Map to 3, 4, or 5 segments
        const segmentCounts = [3, 4, 5];
        const segmentCountIndex = Math.floor(lineHash * 3);
        const segmentCount = segmentCounts[segmentCountIndex];

        // Calculate base direction and length
        const dx = x2 - x1;
        const dy = y2 - y1;
        const totalLength = Math.sqrt(dx * dx + dy * dy);
        
        if (totalLength === 0) return;

        const baseAngle = Math.atan2(dy, dx);
        const unitX = dx / totalLength; // Unit vector X component
        const unitY = dy / totalLength; // Unit vector Y component
        
        // Use 95% of total length for segments + gaps, leave 2.5% at each end
        const usableLength = totalLength * 0.95;
        const startOffset = totalLength * 0.025;
        
        // Calculate base segment and gap lengths
        // Distribute usable length: segments take ~60%, gaps take ~40% (adjustable)
        const segmentRatio = 0.6; // 60% of usable length for segments
        const gapRatio = 0.4; // 40% of usable length for gaps
        
        const totalSegmentLength = usableLength * segmentRatio;
        const totalGapLength = usableLength * gapRatio;
        
        const baseSegmentLength = totalSegmentLength / segmentCount;
        const baseGapLength = totalGapLength / (segmentCount - 1 || 1); // gaps between segments

        // Map settings values (0-1) to actual ranges
        const maxAngleVariation = 0.05; // ±3 degrees in radians
        const maxSpacingVariation = 0.4; // ±40% variation in gap length
        const lengthVariationRange = 0.24; // ±12% of base segment length

        // Start position: offset from x1, y1 by 2.5% of line length
        const startX = x1 + unitX * startOffset;
        const startY = y1 + unitY * startOffset;
        
        let progressAlongBaseLine = 0; // Track progress along the base line axis

        ctx.strokeStyle = config.color;
        ctx.lineWidth = config.width;
        ctx.lineCap = 'butt'; // Sharp ends
        ctx.globalAlpha = config.opacity;

        for (let i = 0; i < segmentCount; i++) {
            // Variation based on segment index + line hash
            // Use a more distinct identifier to ensure each segment gets unique variation
            // Combine lineId and segment index with additional seed to maximize variation
            const segmentHash = this.hashPair(config.lineId, `seg-${i}-angle`);
            const nextSegmentHash = i < segmentCount - 1 
                ? this.hashPair(config.lineId, `seg-${i + 1}-spacing`) 
                : 0;

            // Angle variation (scaled by setting) - each segment gets independent angle
            // Each segment has its own unique angleOffset based on its individual hash
            // This ensures adjusting angleVariation affects each segment independently
            // The base line axis remains constant - only individual segments angle away from it
            const angleOffset =
                (segmentHash - 0.5) * maxAngleVariation * settings.angleVariation;
            const segmentAngle = baseAngle + angleOffset;

            // Length variation (scaled by setting) - use separate hash for length
            const lengthHash = this.hashPair(config.lineId, `seg-${i}-length`);
            const baseLengthMultiplier = 1.0; // Base multiplier
            const lengthMultiplier =
                baseLengthMultiplier +
                (lengthHash - 0.5) * lengthVariationRange * settings.lengthVariation;
            let segmentLength = baseSegmentLength * lengthMultiplier;

            // Calculate how much this segment would advance along the base line
            const segmentProgress = segmentLength * Math.cos(angleOffset);
            
            // Constrain: ensure we don't exceed the 95% boundary
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

            // Render segment with rounded caps
            ctx.beginPath();
            ctx.moveTo(segmentStartX, segmentStartY);
            ctx.lineTo(segEndX, segEndY);
            ctx.stroke();

            // Update progress along base line (projection of segment)
            const actualSegmentProgress = segmentLength * Math.cos(angleOffset);
            progressAlongBaseLine += actualSegmentProgress;

            // Calculate gap for next segment (except after last segment)
            if (i < segmentCount - 1) {
                const remainingProgressAfterSegment = usableLength - progressAlongBaseLine;
                
                // If no space left, stop
                if (remainingProgressAfterSegment <= 0) {
                    break;
                }

                // Spacing variation (scaled by setting)
                const spacingMultiplier = 1.0 + 
                    (nextSegmentHash - 0.5) * maxSpacingVariation * settings.spacingVariation;
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

        ctx.globalAlpha = 1;
    }
}

