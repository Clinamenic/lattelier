# Distribution Modes Implementation Plan

## Lattelier - Enhanced Line & Fill Distribution System

### Executive Summary

This document outlines a comprehensive plan to implement multiple distribution modes for line and fill frequencies in the Lattelier project. The system will provide users with visually compelling, deterministic distribution options while maintaining the existing UI consistency and performance characteristics.

---

## 1. Current State Analysis

### 1.1 Existing Distribution System

**Current Implementation:**

- **Single Method**: Hash-based deterministic distribution
- **Line Distribution**: `hashPair(point1.id, point2.id) > lineFrequency`
- **Fill Distribution**: `hashPair(faceId, 'fill') > fillFrequency`
- **UI Pattern**: Simple frequency sliders (0-1 range)

**Current Limitations:**

- Limited to pseudo-random patterns only
- No artistic control over distribution style
- Single distribution algorithm for all use cases
- No visual variety in pattern generation

### 1.2 UI Reference Pattern

**Blend Mode Selector Styling:**

```css
.form-select {
  width: 100%;
  height: 1.25rem;
  padding: 0 var(--space-sm);
  font-size: var(--font-size-sm);
  border: var(--border-width) solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  cursor: pointer;
  text-transform: uppercase;
  color: var(--color-text) !important;
}
```

**Implementation Pattern:**

```tsx
<select
  value={gridConfig.blendMode}
  onChange={(e) => setGridConfig({ blendMode: e.target.value as any })}
  className="form-select"
>
  <option value="normal">Normal</option>
  <option value="multiply">Multiply</option>
  <option value="screen">Screen</option>
  <option value="overlay">Overlay</option>
</select>
```

---

## 2. Proposed Distribution Modes

### 2.1 Line Distribution Modes

#### **A. Hash-Based (Current)**

- **Description**: Pseudo-random deterministic distribution using string hashing
- **Visual Pattern**: Organic, scattered appearance
- **Use Case**: Natural, random-looking patterns
- **Parameters**: None (uses existing frequency)

#### **B. Grid-Based**

- **Description**: Regular geometric patterns based on grid position
- **Visual Pattern**: Checkerboard, stripes, or regular intervals
- **Use Case**: Geometric precision, architectural patterns
- **Parameters**:
  - `pattern`: 'checkerboard' | 'stripes' | 'every-nth'
  - `interval`: number (for every-nth patterns)
  - `offset`: number (for pattern shifting)

#### **C. Distance-Based**

- **Description**: Distribution based on connection length
- **Visual Pattern**: Density gradients favoring short/long connections
- **Use Case**: Creating focal points, density variations
- **Parameters**:
  - `preference`: 'short' | 'long' | 'medium'
  - `threshold`: number (distance threshold)
  - `gradient`: 'linear' | 'exponential' | 'smooth'

#### **D. Noise-Based**

- **Description**: Perlin/simplex noise for organic patterns
- **Visual Pattern**: Flowing, natural-looking distributions
- **Use Case**: Organic, fluid patterns
- **Parameters**:
  - `scale`: number (noise frequency)
  - `octaves`: number (noise complexity)
  - `seed`: number (deterministic variation)

#### **E. Radial-Based**

- **Description**: Patterns radiating from center points
- **Visual Pattern**: Concentric circles, spirals, sunbursts
- **Use Case**: Focal points, radial emphasis
- **Parameters**:
  - `center`: { x: number, y: number }
  - `pattern`: 'concentric' | 'spiral' | 'sunburst'
  - `density`: 'uniform' | 'gradient'

#### **F. Wave-Based**

- **Description**: Sinusoidal wave patterns
- **Visual Pattern**: Standing waves, interference patterns
- **Use Case**: Wave-like, oscillating patterns
- **Parameters**:
  - `frequency`: number (wave frequency)
  - `amplitude`: number (wave strength)
  - `direction`: number (wave angle)
  - `phase`: number (wave offset)

#### **G. Voronoi-Based**

- **Description**: Patterns based on Voronoi cell proximity
- **Visual Pattern**: Cellular, organic boundaries
- **Use Case**: Cellular patterns, natural divisions
- **Parameters**:
  - `seedPoints`: Array<{x: number, y: number}>
  - `edgeBias`: number (preference for cell edges)
  - `centerBias`: number (preference for cell centers)

### 2.2 Fill Distribution Modes

#### **A. Hash-Based (Current)**

- **Description**: Same as current system
- **Visual Pattern**: Random scattered fills
- **Use Case**: Organic, unpredictable patterns

#### **B. Grid-Based**

- **Description**: Regular geometric fill patterns
- **Visual Pattern**: Checkerboard, stripes, diamonds
- **Use Case**: Geometric precision, architectural fills
- **Parameters**:
  - `pattern`: 'checkerboard' | 'stripes' | 'diamonds' | 'hexagons'
  - `size`: number (pattern scale)
  - `offset`: number (pattern shifting)

#### **C. Density-Based**

- **Description**: Fill density based on local point density
- **Visual Pattern**: Dense areas get more fill
- **Use Case**: Emphasizing crowded areas
- **Parameters**:
  - `radius`: number (density calculation radius)
  - `threshold`: number (density threshold)
  - `gradient`: 'linear' | 'exponential' | 'smooth'

#### **D. Noise-Based**

- **Description**: Smooth noise-based fill distribution
- **Visual Pattern**: Flowing, organic fill patterns
- **Use Case**: Natural, fluid fills
- **Parameters**:
  - `scale`: number (noise frequency)
  - `octaves`: number (noise complexity)
  - `threshold`: number (fill threshold)

#### **E. Proximity-Based**

- **Description**: Fill based on distance to wells or edges
- **Visual Pattern**: Wells attract/repel fill
- **Use Case**: Creating focal points, boundaries
- **Parameters**:
  - `attraction`: number (well attraction strength)
  - `decay`: number (distance decay rate)
  - `edgeBias`: number (edge preference)

#### **F. Pattern-Based**

- **Description**: Predefined artistic patterns
- **Visual Pattern**: Dots, curves, custom shapes
- **Use Case**: Specific artistic effects
- **Parameters**:
  - `pattern`: 'dots' | 'curves' | 'spirals' | 'custom'
  - `size`: number (pattern scale)
  - `spacing`: number (pattern density)

---

## 3. Technical Implementation

### 3.1 Type System Extensions

```typescript
// Distribution mode types
export type LineDistributionMode =
  | "hash"
  | "grid"
  | "distance"
  | "noise"
  | "radial"
  | "wave"
  | "voronoi";

export type FillDistributionMode =
  | "hash"
  | "grid"
  | "density"
  | "noise"
  | "proximity"
  | "pattern";

// Parameter interfaces
export interface LineDistributionParams {
  // Hash mode (no additional params)

  // Grid mode
  gridPattern?: "checkerboard" | "stripes" | "every-nth";
  gridInterval?: number;
  gridOffset?: number;

  // Distance mode
  distancePreference?: "short" | "long" | "medium";
  distanceThreshold?: number;
  distanceGradient?: "linear" | "exponential" | "smooth";

  // Noise mode
  noiseScale?: number;
  noiseOctaves?: number;
  noiseSeed?: number;

  // Radial mode
  radialCenter?: { x: number; y: number };
  radialPattern?: "concentric" | "spiral" | "sunburst";
  radialDensity?: "uniform" | "gradient";

  // Wave mode
  waveFrequency?: number;
  waveAmplitude?: number;
  waveDirection?: number;
  wavePhase?: number;

  // Voronoi mode
  voronoiSeedPoints?: Array<{ x: number; y: number }>;
  voronoiEdgeBias?: number;
  voronoiCenterBias?: number;
}

export interface FillDistributionParams {
  // Similar structure for fill-specific parameters
  gridPattern?: "checkerboard" | "stripes" | "diamonds" | "hexagons";
  gridSize?: number;
  gridOffset?: number;

  densityRadius?: number;
  densityThreshold?: number;
  densityGradient?: "linear" | "exponential" | "smooth";

  noiseScale?: number;
  noiseOctaves?: number;
  noiseThreshold?: number;

  proximityAttraction?: number;
  proximityDecay?: number;
  proximityEdgeBias?: number;

  patternType?: "dots" | "curves" | "spirals" | "custom";
  patternSize?: number;
  patternSpacing?: number;
}

// Updated GridConfig interface
export interface GridConfig {
  // ... existing properties
  lineDistributionMode: LineDistributionMode;
  fillDistributionMode: FillDistributionMode;
  lineDistributionParams: LineDistributionParams;
  fillDistributionParams: FillDistributionParams;
}
```

### 3.2 Distribution Strategy Pattern

```typescript
// Base distribution strategy interface
interface DistributionStrategy {
  shouldInclude(
    point1: GridPoint,
    point2: GridPoint,
    frequency: number,
    params: any
  ): boolean;
}

interface FillDistributionStrategy {
  shouldInclude(face: GridFace, frequency: number, params: any): boolean;
}

// Strategy implementations
class HashLineDistributionStrategy implements DistributionStrategy {
  shouldInclude(
    point1: GridPoint,
    point2: GridPoint,
    frequency: number
  ): boolean {
    const hash = this.hashPair(point1.id, point2.id);
    return hash <= frequency;
  }
}

class GridLineDistributionStrategy implements DistributionStrategy {
  shouldInclude(
    point1: GridPoint,
    point2: GridPoint,
    frequency: number,
    params: LineDistributionParams
  ): boolean {
    const { gridPattern, gridInterval, gridOffset } = params;

    switch (gridPattern) {
      case "checkerboard":
        return this.checkerboardPattern(point1, point2, frequency, gridOffset);
      case "stripes":
        return this.stripesPattern(point1, point2, frequency, gridOffset);
      case "every-nth":
        return this.everyNthPattern(
          point1,
          point2,
          frequency,
          gridInterval,
          gridOffset
        );
      default:
        return false;
    }
  }
}

class NoiseLineDistributionStrategy implements DistributionStrategy {
  shouldInclude(
    point1: GridPoint,
    point2: GridPoint,
    frequency: number,
    params: LineDistributionParams
  ): boolean {
    const { noiseScale, noiseOctaves, noiseSeed } = params;
    const noiseValue = this.getNoiseValue(
      point1.currentPosition.x * noiseScale,
      point1.currentPosition.y * noiseScale,
      noiseOctaves,
      noiseSeed
    );
    return noiseValue <= frequency;
  }
}

// Similar implementations for other modes...
```

### 3.3 Distribution Factory

```typescript
class DistributionFactory {
  static createLineStrategy(mode: LineDistributionMode): DistributionStrategy {
    switch (mode) {
      case "hash":
        return new HashLineDistributionStrategy();
      case "grid":
        return new GridLineDistributionStrategy();
      case "distance":
        return new DistanceLineDistributionStrategy();
      case "noise":
        return new NoiseLineDistributionStrategy();
      case "radial":
        return new RadialLineDistributionStrategy();
      case "wave":
        return new WaveLineDistributionStrategy();
      case "voronoi":
        return new VoronoiLineDistributionStrategy();
      default:
        return new HashLineDistributionStrategy();
    }
  }

  static createFillStrategy(
    mode: FillDistributionMode
  ): FillDistributionStrategy {
    switch (mode) {
      case "hash":
        return new HashFillDistributionStrategy();
      case "grid":
        return new GridFillDistributionStrategy();
      case "density":
        return new DensityFillDistributionStrategy();
      case "noise":
        return new NoiseFillDistributionStrategy();
      case "proximity":
        return new ProximityFillDistributionStrategy();
      case "pattern":
        return new PatternFillDistributionStrategy();
      default:
        return new HashFillDistributionStrategy();
    }
  }
}
```

### 3.4 Updated Canvas Renderer

```typescript
export class CanvasRenderer {
  private lineDistributionStrategy: DistributionStrategy;
  private fillDistributionStrategy: FillDistributionStrategy;

  constructor(ctx: CanvasRenderingContext2D, viewport: Viewport) {
    this.ctx = ctx;
    this.viewport = viewport;
    this.lineDistributionStrategy = new HashLineDistributionStrategy();
    this.fillDistributionStrategy = new HashFillDistributionStrategy();
  }

  updateDistributionStrategies(config: GridConfig): void {
    this.lineDistributionStrategy = DistributionFactory.createLineStrategy(
      config.lineDistributionMode
    );
    this.fillDistributionStrategy = DistributionFactory.createFillStrategy(
      config.fillDistributionMode
    );
  }

  private renderLines(points: GridPoint[], config: GridConfig): void {
    const pointMap = new Map<string, GridPoint>();
    for (const point of points) {
      pointMap.set(point.id, point);
    }

    for (const point of points) {
      for (const neighborId of point.neighbors) {
        const neighbor = pointMap.get(neighborId);
        if (!neighbor || neighborId <= point.id) continue;

        // Use strategy pattern for distribution
        if (
          !this.lineDistributionStrategy.shouldInclude(
            point,
            neighbor,
            config.lineFrequency,
            config.lineDistributionParams
          )
        )
          continue;

        // ... existing line rendering logic
      }
    }
  }

  private renderFill(points: GridPoint[], config: GridConfig): void {
    // Similar implementation for fill distribution
  }
}
```

---

## 4. User Interface Implementation

### 4.1 UI Component Structure

```tsx
// Line Distribution Section
<div className="form-group">
  <label className="form-label">Line Distribution</label>
  <select
    value={gridConfig.lineDistributionMode}
    onChange={(e) =>
      setGridConfig({
        lineDistributionMode: e.target.value as LineDistributionMode,
      })
    }
    className="form-select"
  >
    <option value="hash">Hash-Based</option>
    <option value="grid">Grid-Based</option>
    <option value="distance">Distance-Based</option>
    <option value="noise">Noise-Based</option>
    <option value="radial">Radial-Based</option>
    <option value="wave">Wave-Based</option>
    <option value="voronoi">Voronoi-Based</option>
  </select>
</div>;

{
  /* Dynamic parameter controls based on selected mode */
}
{
  gridConfig.lineDistributionMode === "grid" && (
    <GridDistributionControls
      params={gridConfig.lineDistributionParams}
      onChange={(params) => setGridConfig({ lineDistributionParams: params })}
    />
  );
}

{
  gridConfig.lineDistributionMode === "noise" && (
    <NoiseDistributionControls
      params={gridConfig.lineDistributionParams}
      onChange={(params) => setGridConfig({ lineDistributionParams: params })}
    />
  );
}

// ... other mode-specific controls
```

### 4.2 Parameter Control Components

```tsx
// Grid Distribution Controls
function GridDistributionControls({
  params,
  onChange,
}: {
  params: LineDistributionParams;
  onChange: (params: LineDistributionParams) => void;
}) {
  return (
    <div className="form-group">
      <label className="form-label">Pattern</label>
      <select
        value={params.gridPattern || "checkerboard"}
        onChange={(e) =>
          onChange({ ...params, gridPattern: e.target.value as any })
        }
        className="form-select"
      >
        <option value="checkerboard">Checkerboard</option>
        <option value="stripes">Stripes</option>
        <option value="every-nth">Every Nth</option>
      </select>

      {params.gridPattern === "every-nth" && (
        <div className="form-range-container">
          <input
            type="range"
            min="2"
            max="10"
            value={params.gridInterval || 2}
            onChange={(e) =>
              onChange({ ...params, gridInterval: parseInt(e.target.value) })
            }
            className="form-range"
          />
          <div className="form-range-display">
            <span className="form-range-label">
              Interval: {params.gridInterval}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Noise Distribution Controls
function NoiseDistributionControls({
  params,
  onChange,
}: {
  params: LineDistributionParams;
  onChange: (params: LineDistributionParams) => void;
}) {
  return (
    <>
      <div className="form-group">
        <div className="form-range-container">
          <input
            type="range"
            min="0.01"
            max="0.1"
            step="0.01"
            value={params.noiseScale || 0.05}
            onChange={(e) =>
              onChange({ ...params, noiseScale: parseFloat(e.target.value) })
            }
            className="form-range"
          />
          <div className="form-range-display">
            <span className="form-range-label">Scale: {params.noiseScale}</span>
          </div>
        </div>
      </div>

      <div className="form-group">
        <div className="form-range-container">
          <input
            type="range"
            min="1"
            max="6"
            value={params.noiseOctaves || 3}
            onChange={(e) =>
              onChange({ ...params, noiseOctaves: parseInt(e.target.value) })
            }
            className="form-range"
          />
          <div className="form-range-display">
            <span className="form-range-label">
              Octaves: {params.noiseOctaves}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
```

### 4.3 State Management Updates

```typescript
// Updated default configuration
const defaultGridConfig: GridConfig = {
  // ... existing properties
  lineDistributionMode: "hash",
  fillDistributionMode: "hash",
  lineDistributionParams: {},
  fillDistributionParams: {},
};

// Updated store actions
export const useAppStore = create<AppState>((set, get) => ({
  // ... existing state

  setGridConfig: (config) => {
    set((state) => ({
      gridConfig: { ...state.gridConfig, ...config },
    }));
    get().regenerateGrid();
  },

  setLineDistributionMode: (mode: LineDistributionMode) => {
    set((state) => ({
      gridConfig: {
        ...state.gridConfig,
        lineDistributionMode: mode,
        lineDistributionParams: getDefaultLineParams(mode),
      },
    }));
    get().regenerateGrid();
  },

  setFillDistributionMode: (mode: FillDistributionMode) => {
    set((state) => ({
      gridConfig: {
        ...state.gridConfig,
        fillDistributionMode: mode,
        fillDistributionParams: getDefaultFillParams(mode),
      },
    }));
    get().regenerateGrid();
  },

  // ... other actions
}));
```

---

## 5. Implementation Phases

### Phase 1: Foundation (Week 1)

- [ ] Extend type system with distribution modes and parameters
- [ ] Implement base distribution strategy interfaces
- [ ] Create distribution factory
- [ ] Update GridConfig interface

### Phase 2: Core Distribution Modes (Week 2)

- [ ] Implement Hash-based distribution (current system)
- [ ] Implement Grid-based distribution
- [ ] Implement Distance-based distribution
- [ ] Update CanvasRenderer to use strategy pattern

### Phase 3: Advanced Distribution Modes (Week 3)

- [ ] Implement Noise-based distribution
- [ ] Implement Radial-based distribution
- [ ] Implement Wave-based distribution
- [ ] Implement Voronoi-based distribution

### Phase 4: Fill Distribution Modes (Week 4)

- [ ] Implement all fill distribution strategies
- [ ] Update fill rendering logic
- [ ] Test fill distribution modes

### Phase 5: User Interface (Week 5)

- [ ] Create distribution mode selectors
- [ ] Implement parameter control components
- [ ] Add dynamic parameter panels
- [ ] Update state management

### Phase 6: Testing & Polish (Week 6)

- [ ] Comprehensive testing of all modes
- [ ] Performance optimization
- [ ] UI/UX polish
- [ ] Documentation updates

---

## 6. Visual Examples & Use Cases

### 6.1 Line Distribution Examples

**Hash-Based**: Organic, scattered lines with natural randomness
**Grid-Based**: Precise geometric patterns, architectural precision
**Distance-Based**: Density gradients, focal point emphasis
**Noise-Based**: Flowing, organic patterns with natural variation
**Radial-Based**: Concentric patterns, focal point emphasis
**Wave-Based**: Oscillating patterns, interference effects
**Voronoi-Based**: Cellular patterns, natural boundaries

### 6.2 Fill Distribution Examples

**Hash-Based**: Random scattered fills
**Grid-Based**: Checkerboard, stripes, geometric precision
**Density-Based**: Emphasizes crowded areas
**Noise-Based**: Smooth, organic fill patterns
**Proximity-Based**: Wells attract/repel fill
**Pattern-Based**: Artistic patterns, dots, curves

---

## 7. Performance Considerations

### 7.1 Optimization Strategies

- **Lazy Loading**: Load distribution strategies only when needed
- **Caching**: Cache distribution calculations for repeated use
- **Efficient Algorithms**: Optimize each distribution method
- **Memory Management**: Clean up unused strategies

### 7.2 Performance Targets

- **Rendering Time**: < 16ms for 60fps
- **Memory Usage**: < 100MB for large grids
- **Startup Time**: < 1s for initial load

---

## 8. Future Enhancements

### 8.1 Advanced Features

- **Custom Distribution Functions**: User-defined distribution logic
- **Animation Support**: Animated distribution parameters
- **Preset System**: Save/load distribution configurations
- **Export Options**: Export distribution patterns as images

### 8.2 Integration Opportunities

- **Well Integration**: Distribution modes that respond to wells
- **Animation Integration**: Distribution changes over time
- **Export Integration**: Distribution-aware export options

---

## 9. Success Metrics

### 9.1 Technical Metrics

- [ ] All distribution modes render correctly
- [ ] Performance targets met
- [ ] No memory leaks
- [ ] Deterministic output for all modes

### 9.2 User Experience Metrics

- [ ] Intuitive UI for mode selection
- [ ] Clear parameter controls
- [ ] Real-time preview updates
- [ ] Consistent visual design

### 9.3 Artistic Metrics

- [ ] Visually distinct patterns for each mode
- [ ] Artistic value and creative potential
- [ ] Smooth parameter transitions
- [ ] Professional-quality output

---

This comprehensive plan provides a roadmap for implementing multiple distribution modes while maintaining the existing UI consistency and performance characteristics. The system will offer users unprecedented creative control over pattern generation while remaining deterministic and performant.
