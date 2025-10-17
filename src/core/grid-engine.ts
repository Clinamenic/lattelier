import { GridConfig, GridPoint } from '../types/grid';

export class GridEngine {
    generateGrid(config: GridConfig): GridPoint[] {
        switch (config.gridType) {
            case 'square':
                return this.generateSquareGrid(config);
            case 'triangular':
                return this.generateTriangularGrid(config);
            case 'hexagonal':
                return this.generateHexagonalGrid(config);
            default:
                return this.generateSquareGrid(config);
        }
    }

    private generateSquareGrid(config: GridConfig): GridPoint[] {
        const points: GridPoint[] = [];
        const { rows, columns, spacing } = config;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const id = `${row}-${col}`;
                const x = col * spacing;
                const y = row * spacing;

                const neighbors: string[] = [];
                if (row > 0) neighbors.push(`${row - 1}-${col}`);
                if (row < rows - 1) neighbors.push(`${row + 1}-${col}`);
                if (col > 0) neighbors.push(`${row}-${col - 1}`);
                if (col < columns - 1) neighbors.push(`${row}-${col + 1}`);

                points.push({
                    id,
                    originalPosition: { x, y },
                    currentPosition: { x, y },
                    neighbors,
                });
            }
        }

        return points;
    }

    private generateTriangularGrid(config: GridConfig): GridPoint[] {
        const points: GridPoint[] = [];
        const { rows, columns, spacing } = config;
        const height = spacing * Math.sqrt(3) / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const id = `${row}-${col}`;
                const xOffset = (row % 2) * (spacing / 2);
                const x = col * spacing + xOffset;
                const y = row * height;

                const neighbors: string[] = [];

                // Horizontal neighbors
                if (col > 0) neighbors.push(`${row}-${col - 1}`);
                if (col < columns - 1) neighbors.push(`${row}-${col + 1}`);

                // Neighbors in adjacent rows
                if (row % 2 === 0) {
                    // Even row
                    if (row > 0) {
                        if (col > 0) neighbors.push(`${row - 1}-${col - 1}`);
                        neighbors.push(`${row - 1}-${col}`);
                    }
                    if (row < rows - 1) {
                        if (col > 0) neighbors.push(`${row + 1}-${col - 1}`);
                        neighbors.push(`${row + 1}-${col}`);
                    }
                } else {
                    // Odd row
                    if (row > 0) {
                        neighbors.push(`${row - 1}-${col}`);
                        if (col < columns - 1) neighbors.push(`${row - 1}-${col + 1}`);
                    }
                    if (row < rows - 1) {
                        neighbors.push(`${row + 1}-${col}`);
                        if (col < columns - 1) neighbors.push(`${row + 1}-${col + 1}`);
                    }
                }

                points.push({
                    id,
                    originalPosition: { x, y },
                    currentPosition: { x, y },
                    neighbors,
                });
            }
        }

        return points;
    }

    private generateHexagonalGrid(config: GridConfig): GridPoint[] {
        const points: GridPoint[] = [];
        const { rows, columns, spacing } = config;
        const hexWidth = spacing * 2;
        const hexHeight = spacing * Math.sqrt(3);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const id = `${row}-${col}`;
                const xOffset = (row % 2) * (hexWidth * 0.75);
                const x = col * hexWidth * 1.5 + xOffset;
                const y = row * hexHeight;

                const neighbors: string[] = [];

                // Horizontal neighbors (always present)
                if (col > 0) neighbors.push(`${row}-${col - 1}`);
                if (col < columns - 1) neighbors.push(`${row}-${col + 1}`);

                // Diagonal neighbors (depend on even/odd row)
                if (row % 2 === 0) {
                    // Even row
                    if (row > 0) {
                        if (col > 0) neighbors.push(`${row - 1}-${col - 1}`);
                        neighbors.push(`${row - 1}-${col}`);
                    }
                    if (row < rows - 1) {
                        if (col > 0) neighbors.push(`${row + 1}-${col - 1}`);
                        neighbors.push(`${row + 1}-${col}`);
                    }
                } else {
                    // Odd row
                    if (row > 0) {
                        neighbors.push(`${row - 1}-${col}`);
                        if (col < columns - 1) neighbors.push(`${row - 1}-${col + 1}`);
                    }
                    if (row < rows - 1) {
                        neighbors.push(`${row + 1}-${col}`);
                        if (col < columns - 1) neighbors.push(`${row + 1}-${col + 1}`);
                    }
                }

                points.push({
                    id,
                    originalPosition: { x, y },
                    currentPosition: { x, y },
                    neighbors,
                });
            }
        }

        return points;
    }

    getBounds(points: GridPoint[]): {
        minX: number;
        minY: number;
        maxX: number;
        maxY: number;
    } {
        if (points.length === 0) {
            return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const point of points) {
            minX = Math.min(minX, point.currentPosition.x);
            minY = Math.min(minY, point.currentPosition.y);
            maxX = Math.max(maxX, point.currentPosition.x);
            maxY = Math.max(maxY, point.currentPosition.y);
        }

        return { minX, minY, maxX, maxY };
    }
}

