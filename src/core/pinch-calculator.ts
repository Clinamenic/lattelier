import { GridPoint } from '../types/grid';
import { Well, FalloffType } from '../types/attractor';
import { distance } from '../utils/math';

export class PinchCalculator {
    private randomSeeds = new Map<string, number>();

    applyWells(points: GridPoint[], wells: Well[], globalStrength: number = 1): GridPoint[] {
        return points.map(point => {
            let offsetX = 0;
            let offsetY = 0;

            for (const well of wells) {
                if (!well.enabled) continue;

                const dist = distance(
                    point.originalPosition.x,
                    point.originalPosition.y,
                    well.position.x,
                    well.position.y
                );

                if (dist < well.radius) {
                    const influence = this.calculateInfluence(dist, well.radius, well.falloff);
                    const effectiveStrength = well.strength * influence * globalStrength;

                    if (dist > 0) {
                        let targetX: number;
                        let targetY: number;

                        if (well.strength > 0) {
                            // ATTRACT: Pull toward center
                            // At strength 1.0, target is the well center (singularity)
                            targetX = well.position.x;
                            targetY = well.position.y;
                        } else {
                            // REPEL: Push toward perimeter
                            // At strength -1.0, target is on the perimeter edge (horizon)
                            // Calculate angle from well center TO the point (not from point to center)
                            const angleFromCenter = Math.atan2(
                                point.originalPosition.y - well.position.y,
                                point.originalPosition.x - well.position.x
                            );
                            targetX = well.position.x + Math.cos(angleFromCenter) * well.radius;
                            targetY = well.position.y + Math.sin(angleFromCenter) * well.radius;
                        }

                        // Calculate the offset from current position to target
                        const targetDx = targetX - point.originalPosition.x;
                        const targetDy = targetY - point.originalPosition.y;

                        // Apply the strength to interpolate toward target
                        // Use absolute strength for the lerp amount
                        const lerpAmount = Math.abs(effectiveStrength);
                        offsetX += targetDx * lerpAmount;
                        offsetY += targetDy * lerpAmount;
                    }

                    // Add distortion if enabled
                    if (well.distortion > 0) {
                        const seed = this.getPointSeed(point.id, well.id);
                        const distortionAmount = well.distortion * influence * 50;

                        offsetX += this.seededRandom(seed, 0) * distortionAmount;
                        offsetY += this.seededRandom(seed, 1) * distortionAmount;
                    }
                }
            }

            return {
                ...point,
                currentPosition: {
                    x: point.originalPosition.x + offsetX,
                    y: point.originalPosition.y + offsetY,
                },
            };
        });
    }

    private getPointSeed(pointId: string, wellId: string): number {
        const key = `${pointId}-${wellId}`;
        if (!this.randomSeeds.has(key)) {
            // Create deterministic seed from IDs
            let hash = 0;
            const str = key;
            for (let i = 0; i < str.length; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash = hash & hash;
            }
            this.randomSeeds.set(key, Math.abs(hash));
        }
        return this.randomSeeds.get(key)!;
    }

    private seededRandom(seed: number, offset: number): number {
        // Simple seeded random using sine
        const x = Math.sin(seed + offset * 12.9898) * 43758.5453;
        return (x - Math.floor(x)) * 2 - 1; // Range: -1 to 1
    }

    // Legacy method name for backward compatibility
    applyAttractors = this.applyWells;

    private calculateInfluence(distance: number, radius: number, falloff: FalloffType): number {
        const normalized = distance / radius;

        switch (falloff) {
            case 'linear':
                return 1 - normalized;

            case 'quadratic':
                return Math.pow(1 - normalized, 2);

            case 'exponential':
                return Math.exp(-normalized * 3);

            case 'smooth': {
                const t = 1 - normalized;
                return t * t * (3 - 2 * t);
            }

            default:
                return 1 - normalized;
        }
    }
}

