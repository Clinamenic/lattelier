# Sinews Feature Implementation Plan

**Date**: October 16, 2025  
**Feature**: Grid Sinews - Smooth Concave Curves Between Neighboring Nodes  
**Application**: Grid Pincher Web App

---

## Executive Summary

This document outlines the implementation plan for adding "sinews" to the Grid Pincher application. Sinews are smooth, concave curves that connect pairs of neighboring nodes, creating an organic, tissue-like visual effect. The feature will be toggleable with adjustable frequency control.

---

## 1. Feature Definition

### 1.1 What are Sinews?

**Sinews** are smooth, concave curves that visually connect two neighboring nodes in the grid, resembling connective tissue or organic fibers. Key characteristics:

- **Smooth curves**: Uses Bézier curves for fluid, organic appearance
- **Concave shape**: Curves bow inward between the two nodes
- **Neighboring nodes only**: Only connects nodes that are direct neighbors in the grid topology
- **Adjustable frequency**: User controls how many node pairs are connected (sparse to dense)

### 1.2 Visual Concept

```
Node A -------- Node B  (straight line - current)
Node A ~~~~>~~~ Node B  (concave sinew - new)
```

The sinew curves inward (concave) between the nodes, creating an organic appearance.

---

## 2. Technical Implementation

### 2.1 Rendering Method

Since the app uses **Canvas API** (not SVG), we'll use Canvas quadratic or cubic Bézier curves:

#### Canvas Bézier Curve Methods

**Option A: Quadratic Bézier Curve** (Simpler)
```typescript
ctx.quadraticCurveTo(cpX, cpY, endX, endY)
```
- One control point determines the curve
- Sufficient for simple concave curves

**Option B: Cubic Bézier Curve** (More control)
```typescript
ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY)
```
- Two control points for more complex shapes
- Better for varied curvature

**Recommendation**: Start with **quadratic curves** for simplicity and performance.

### 2.2 Control Point Calculation

To create a concave curve between two nodes:

```typescript
interface SinewCurve {
  startNode: GridPoint;
  endNode: GridPoint;
  controlPoint: { x: number; y: number };
  curvature: number;
}

function calculateControlPoint(
  nodeA: GridPoint,
  nodeB: GridPoint,
  curvature: number
): { x: number; y: number } {
  // 1. Calculate midpoint
  const midX = (nodeA.currentPosition.x + nodeB.currentPosition.x) / 2;
  const midY = (nodeA.currentPosition.y + nodeB.currentPosition.y) / 2;
  
  // 2. Calculate perpendicular vector
  const dx = nodeB.currentPosition.x - nodeA.currentPosition.x;
  const dy = nodeB.currentPosition.y - nodeA.currentPosition.y;
  
  // Perpendicular vector (rotate 90 degrees)
  const perpX = -dy;
  const perpY = dx;
  
  // Normalize
  const length = Math.sqrt(perpX * perpX + perpY * perpY);
  const normX = perpX / length;
  const normY = perpY / length;
  
  // 3. Offset midpoint along perpendicular (creates concavity)
  // Negative offset = concave inward
  const offsetDistance = -length * curvature * 0.2; // 20% of distance
  
  return {
    x: midX + normX * offsetDistance,
    y: midY + normY * offsetDistance
  };
}
```

### 2.3 Neighbor Selection Algorithm

```typescript
interface SinewConfig {
  enabled: boolean;
  frequency: number; // 0 to 1 (sparse to dense)
  curvature: number; // 0 to 1 (subtle to extreme)
  lineWidth: number;
  color: string;
  opacity: number;
}

class SinewGenerator {
  generateSinews(
    points: GridPoint[],
    config: SinewConfig
  ): SinewCurve[] {
    if (!config.enabled) return [];
    
    const sinews: SinewCurve[] = [];
    const pointMap = new Map<string, GridPoint>();
    
    // Build point lookup
    for (const point of points) {
      pointMap.set(point.id, point);
    }
    
    // For each point, consider connections to neighbors
    for (const point of points) {
      for (const neighborId of point.neighbors) {
        const neighbor = pointMap.get(neighborId);
        if (!neighbor) continue;
        
        // Avoid duplicates (only process if current ID < neighbor ID)
        if (point.id >= neighborId) continue;
        
        // Frequency check (probabilistic)
        // Use deterministic hash for consistent selection
        const pairHash = this.hashPair(point.id, neighborId);
        if (pairHash > config.frequency) continue;
        
        // Create sinew
        const controlPoint = calculateControlPoint(
          point,
          neighbor,
          config.curvature
        );
        
        sinews.push({
          startNode: point,
          endNode: neighbor,
          controlPoint,
          curvature: config.curvature
        });
      }
    }
    
    return sinews;
  }
  
  private hashPair(id1: string, id2: string): number {
    // Create deterministic hash between 0 and 1
    const str = `${id1}-${id2}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash % 1000) / 1000;
  }
}
```

### 2.4 Canvas Rendering

```typescript
class CanvasRenderer {
  renderSinews(sinews: SinewCurve[], config: SinewConfig): void {
    if (sinews.length === 0) return;
    
    this.ctx.strokeStyle = config.color;
    this.ctx.lineWidth = config.lineWidth;
    this.ctx.globalAlpha = config.opacity;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    for (const sinew of sinews) {
      this.ctx.beginPath();
      this.ctx.moveTo(
        sinew.startNode.currentPosition.x,
        sinew.startNode.currentPosition.y
      );
      this.ctx.quadraticCurveTo(
        sinew.controlPoint.x,
        sinew.controlPoint.y,
        sinew.endNode.currentPosition.x,
        sinew.endNode.currentPosition.y
      );
      this.ctx.stroke();
    }
    
    this.ctx.globalAlpha = 1.0;
  }
}
```

---

## 3. User Interface Design

### 3.1 Grid Settings Panel (Left Panel)

Add new section after "Color" tab:

```
┌─────────────────────────┐
│ Grid Settings           │
├─────────────────────────┤
│ □ Grid                  │
│ □ Style                 │
│ □ Color                 │
│ ☑ Sinews            NEW │
└─────────────────────────┘
```

### 3.2 Sinews Configuration Panel

```typescript
// New section in ControlPanel.tsx

<div className="border-t border-gray-200 pt-4">
  <h3 className="text-sm font-semibold text-gray-800 mb-3">Sinews</h3>
  
  <label className="flex items-center mb-3">
    <input
      type="checkbox"
      checked={sinewConfig.enabled}
      onChange={(e) => setSinewConfig({ enabled: e.target.checked })}
      className="mr-2"
    />
    <span className="text-sm text-gray-700">Enable Sinews</span>
  </label>
  
  {sinewConfig.enabled && (
    <>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Frequency: {Math.round(sinewConfig.frequency * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={sinewConfig.frequency * 100}
          onChange={(e) => setSinewConfig({ 
            frequency: parseInt(e.target.value) / 100 
          })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Sparse</span>
          <span>Dense</span>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Curvature: {Math.round(sinewConfig.curvature * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={sinewConfig.curvature * 100}
          onChange={(e) => setSinewConfig({ 
            curvature: parseInt(e.target.value) / 100 
          })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Subtle</span>
          <span>Extreme</span>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Line Width: {sinewConfig.lineWidth}
        </label>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.5"
          value={sinewConfig.lineWidth}
          onChange={(e) => setSinewConfig({ 
            lineWidth: parseFloat(e.target.value) 
          })}
          className="w-full"
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sinew Color
        </label>
        <input
          type="color"
          value={sinewConfig.color}
          onChange={(e) => setSinewConfig({ color: e.target.value })}
          className="w-full h-10 rounded cursor-pointer"
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Opacity: {Math.round(sinewConfig.opacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={sinewConfig.opacity * 100}
          onChange={(e) => setSinewConfig({ 
            opacity: parseInt(e.target.value) / 100 
          })}
          className="w-full"
        />
      </div>
    </>
  )}
</div>
```

---

## 4. State Management

### 4.1 Type Definitions

```typescript
// src/types/sinew.ts

export interface SinewConfig {
  enabled: boolean;
  frequency: number;    // 0-1: percentage of neighbor pairs to connect
  curvature: number;    // 0-1: how much the curve bows inward
  lineWidth: number;    // 0.5-5: width of sinew lines
  color: string;        // Hex color
  opacity: number;      // 0-1: transparency
}

export interface SinewCurve {
  startNodeId: string;
  endNodeId: string;
  controlPoint: { x: number; y: number };
}
```

### 4.2 Store Integration

```typescript
// Add to app-store.ts

interface AppState {
  // ... existing state
  sinewConfig: SinewConfig;
  sinews: SinewCurve[];
  
  // Actions
  setSinewConfig: (config: Partial<SinewConfig>) => void;
  regenerateSinews: () => void;
}

const defaultSinewConfig: SinewConfig = {
  enabled: false,
  frequency: 0.3,    // 30% of connections
  curvature: 0.5,    // Medium curvature
  lineWidth: 1.5,
  color: '#6366f1',  // Indigo
  opacity: 0.6,
};

export const useAppStore = create<AppState>((set, get) => ({
  // ... existing state
  sinewConfig: defaultSinewConfig,
  sinews: [],
  
  setSinewConfig: (config) => {
    set((state) => ({
      sinewConfig: { ...state.sinewConfig, ...config },
    }));
    get().regenerateSinews();
  },
  
  regenerateSinews: () => {
    const { deformedGrid, sinewConfig } = get();
    const generator = new SinewGenerator();
    const sinews = generator.generateSinews(deformedGrid, sinewConfig);
    set({ sinews });
  },
}));
```

---

## 5. Rendering Order

To ensure proper visual layering:

```typescript
render() {
  this.clear();
  this.applyTransform();
  
  // 1. Radial lines (if enabled)
  if (showWells) {
    this.renderRadialLines(points, wells);
  }
  
  // 2. Fill (if enabled)
  if (config.showFill) {
    this.renderFill(points, config);
  }
  
  // 3. SINEWS (NEW - render before grid lines for depth)
  if (sinewConfig.enabled && sinews.length > 0) {
    this.renderSinews(sinews, sinewConfig);
  }
  
  // 4. Grid lines (if enabled)
  if (config.showLines) {
    this.renderLines(points, config);
  }
  
  // 5. Points (if enabled)
  if (config.showPoints) {
    this.renderPoints(points, config);
  }
  
  // 6. Wells (if enabled)
  if (showWells) {
    this.renderWells(wells);
  }
}
```

---

## 6. Performance Optimization

### 6.1 Concerns

- Large grids (200x200 = 40,000 points) with high sinew frequency could create thousands of curves
- Each curve requires multiple drawing operations
- Need to maintain 60fps

### 6.2 Optimization Strategies

**1. Caching**
```typescript
class SinewCache {
  private cache = new Map<string, SinewCurve[]>();
  
  getCached(
    gridHash: string,
    config: SinewConfig
  ): SinewCurve[] | null {
    const key = `${gridHash}-${config.frequency}-${config.curvature}`;
    return this.cache.get(key) || null;
  }
  
  setCached(
    gridHash: string,
    config: SinewConfig,
    sinews: SinewCurve[]
  ): void {
    const key = `${gridHash}-${config.frequency}-${config.curvature}`;
    this.cache.set(key, sinews);
  }
}
```

**2. Culling**
- Only render sinews within viewport bounds
- Skip sinews with both endpoints outside viewport

**3. Level of Detail (LOD)**
- Reduce sinew frequency automatically at high zoom-out levels
- Increase frequency when zoomed in

**4. Batching**
- Group sinews by color/style
- Reduce state changes in Canvas API

---

## 7. Advanced Features (Future)

### 7.1 Sinew Variation Modes

**Bidirectional Curvature**
- Some sinews curve inward, others outward
- Creates more organic, varied appearance

**Thickness Variation**
- Sinews vary in width based on grid density or random
- More natural, hand-drawn feel

**Multiple Control Points**
- Use cubic Bézier for more complex curves
- "S-curves" or wave patterns

### 7.2 Interaction with Wells

**Well-Affected Sinews**
- Sinews within well radius could have modified curvature
- Attract wells: sinews curve toward center
- Repel wells: sinews curve away from center

**Sinew Breaking**
- High distortion breaks some sinews
- Creates gaps in the tissue-like appearance

---

## 8. Implementation Phases

### Phase 1: Core Functionality (Week 1)
- [ ] Define types and interfaces
- [ ] Implement control point calculation
- [ ] Create basic sinew generation algorithm
- [ ] Add Canvas rendering method
- [ ] Test with small grids

### Phase 2: UI Integration (Week 1)
- [ ] Add sinew config to state management
- [ ] Create UI controls in ControlPanel
- [ ] Implement enable/disable toggle
- [ ] Add frequency and curvature sliders
- [ ] Hook up to rendering pipeline

### Phase 3: Optimization (Week 2)
- [ ] Implement caching system
- [ ] Add viewport culling
- [ ] Performance testing with large grids
- [ ] Optimize rendering loop
- [ ] Profile and fix bottlenecks

### Phase 4: Polish (Week 2)
- [ ] Add color and opacity controls
- [ ] Fine-tune default values
- [ ] Add presets with sinews
- [ ] Update export functionality to include sinews
- [ ] Documentation and examples

---

## 9. Technical Challenges & Solutions

### Challenge 1: Deformed Grid Updates
**Problem**: When wells deform the grid, sinew control points need to update
**Solution**: Regenerate sinews whenever grid deformation changes

### Challenge 2: Performance with High Density
**Problem**: 100% frequency on 200x200 grid = ~80,000 sinews
**Solution**: 
- Implement LOD system
- Warn user if frequency too high for grid size
- Automatic throttling

### Challenge 3: Export Consistency
**Problem**: Sinews must be included in PNG/SVG exports
**Solution**: Ensure rendering order is consistent between live view and export

### Challenge 4: Deterministic Selection
**Problem**: Need consistent sinew placement across sessions
**Solution**: Use deterministic hash function based on node IDs

---

## 10. Testing Strategy

### Unit Tests
- Control point calculation accuracy
- Neighbor pair generation
- Hash function determinism
- Frequency filtering

### Visual Tests
- Render sinews at various frequencies
- Test with different grid types
- Verify with/without wells
- Export quality checks

### Performance Tests
- Measure FPS at different grid sizes
- Profile rendering with 0%, 50%, 100% frequency
- Memory usage monitoring
- Large grid stress tests

---

## 11. User Documentation

### Feature Description
"Sinews add organic, tissue-like curves between neighboring grid points, creating a biological or anatomical visual effect. Control the density and curvature to achieve different aesthetics."

### Tips for Users
- Start with low frequency (10-30%) to see the effect
- Increase curvature for more dramatic bowing
- Combine with wells for dynamic deformation
- Use with sparse grids for clearer visualization
- Adjust opacity to layer with existing grid lines

---

## 12. Research References

Based on web research, the following resources are relevant:

### Bézier Curves
- **MDN Web Docs**: Canvas quadraticCurveTo() and bezierCurveTo()
- **W3C Spec**: Mathematical foundations of Bézier curves
- **Stack Overflow**: Smooth curve implementations in Canvas

### Control Point Calculation
- Perpendicular vector mathematics
- Midpoint offset techniques
- Curve smoothing algorithms

### Performance
- Canvas optimization techniques
- Path batching strategies
- Viewport culling methods

---

## 13. Success Criteria

✅ **Functional Requirements**
- Toggle sinews on/off
- Adjust frequency from sparse (0%) to dense (100%)
- Adjust curvature from subtle to extreme
- Works with all grid types (square, triangular, hexagonal)
- Updates in real-time with grid deformation
- Exports correctly in PNG and SVG

✅ **Performance Requirements**
- Maintains 60fps with 30x30 grid at 50% frequency
- Maintains 30fps with 100x100 grid at 50% frequency
- Renders without lag on grid parameter changes

✅ **Quality Requirements**
- Smooth, visually appealing curves
- Consistent appearance across rendering
- No visual artifacts or overlaps
- Professional, polished UI controls

---

## 14. Next Steps

1. **Review & Approval**: Get feedback on this plan
2. **Prototype**: Create minimal working version
3. **Iterate**: Test and refine algorithm
4. **Implement**: Full feature development
5. **Test**: Comprehensive testing
6. **Document**: Update user documentation
7. **Deploy**: Release with updated features

---

**Document Version**: 1.0  
**Last Updated**: October 16, 2025  
**Status**: Ready for Implementation

