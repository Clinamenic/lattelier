# Alternative Grid Types Planning Document

## Executive Summary

This document analyzes alternative grid types suitable for replacing the current hexagonal grid implementation in the Lattelier framework. Based on codebase analysis and research, several viable alternatives are presented with implementation considerations, compatibility assessments, and recommendations.

## Current Framework Analysis

### Existing Grid Implementation
The framework currently supports three grid types:
- **Square Grid**: Simple orthogonal grid with 4-neighbor connectivity
- **Triangular Grid**: Equilateral triangle tessellation with 6-neighbor connectivity  
- **Hexagonal Grid**: Hexagon tessellation with 6-neighbor connectivity

### Framework Architecture
- **GridEngine**: Handles grid generation with switch-based type selection
- **CanvasRenderer**: Renders different grid types with specialized face rendering
- **PinchCalculator**: Applies deformation effects (grid-agnostic)
- **GridPoint Interface**: Universal point representation with neighbors array

### Key Framework Capabilities
- Point-based grid representation with neighbor relationships
- Deformation system using attractor/repeller wells
- Canvas-based rendering with fill, line, and point visualization
- Viewport management and zoom functionality
- Export/import configuration system

## Alternative Grid Types Analysis

### 1. Square Grid (Already Implemented)
**Status**: ✅ Currently supported

**Characteristics**:
- 4-neighbor connectivity (orthogonal)
- Simple coordinate system (row, col)
- Uniform spacing and movement costs
- Easy pathfinding and neighbor calculations

**Advantages**:
- Simplest implementation
- Widely supported in game frameworks
- Excellent performance
- Intuitive coordinate system

**Disadvantages**:
- Limited movement directions
- Diagonal movement requires special handling
- Less visually interesting than other grids

**Framework Compatibility**: ✅ Excellent
- Already fully implemented
- No changes required
- Optimal performance

### 2. Rectangular Grid
**Status**: 🔄 Easy to implement

**Characteristics**:
- Square grid with non-uniform spacing
- Maintains 4-neighbor connectivity
- Variable width/height ratios

**Advantages**:
- Simple extension of square grid
- Useful for non-square aspect ratios
- Maintains simplicity of square grids

**Disadvantages**:
- Limited visual/functional difference from square
- May complicate coordinate calculations

**Implementation Effort**: Low
- Extend existing square grid generator
- Add width/height ratio parameters
- Update rendering logic

**Framework Compatibility**: ✅ Excellent
- Minimal changes to existing code
- Reuses square grid infrastructure

### 3. Triangular Grid (Already Implemented)
**Status**: ✅ Currently supported

**Characteristics**:
- Equilateral triangle tessellation
- 6-neighbor connectivity
- Offset row pattern for proper tessellation

**Advantages**:
- Unique visual appearance
- More movement directions than square
- Good for organic/flowing patterns

**Disadvantages**:
- Complex coordinate calculations
- Less intuitive than square/hex grids
- Limited adoption in game development

**Framework Compatibility**: ✅ Good
- Already implemented
- Working neighbor calculations
- Proper rendering support

### 4. Rhombic/Diamond Grid
**Status**: 🆕 New implementation required

**Characteristics**:
- Diamond-shaped cells
- 4-neighbor connectivity
- 45-degree rotation from square grid

**Advantages**:
- Unique visual appearance
- Maintains 4-neighbor simplicity
- Good for certain game mechanics

**Disadvantages**:
- Limited practical advantages over square
- Coordinate system complexity
- Less common in practice

**Implementation Effort**: Medium
- New grid generation algorithm
- Coordinate transformation logic
- Rendering updates

**Framework Compatibility**: ✅ Good
- Fits existing point-based architecture
- Compatible with deformation system

### 5. Penrose Tiling (Quasicrystal)
**Status**: 🆕 Complex implementation required

**Characteristics**:
- Aperiodic tiling with golden ratio proportions
- Two tile types: thick and thin rhombi
- Non-repeating pattern

**Advantages**:
- Mathematically beautiful
- Unique visual appeal
- Scientific/educational value

**Disadvantages**:
- Extremely complex implementation
- Difficult neighbor calculations
- Performance concerns
- Limited practical applications

**Implementation Effort**: High
- Complex mathematical algorithms
- Custom neighbor calculation system
- Specialized rendering logic

**Framework Compatibility**: ⚠️ Challenging
- Requires significant architecture changes
- Complex neighbor relationship handling
- May not work well with deformation system

### 6. Geodesic Grid
**Status**: 🆕 Complex implementation required

**Characteristics**:
- Spherical grid based on geodesic polyhedra
- Icosahedral subdivision
- Uniform cell distribution on sphere

**Advantages**:
- Perfect for spherical worlds
- Uniform cell sizes
- Scientific accuracy

**Disadvantages**:
- Complex 3D mathematics
- Difficult 2D projection
- Limited 2D application

**Implementation Effort**: Very High
- 3D mathematical transformations
- Spherical coordinate systems
- Complex projection algorithms

**Framework Compatibility**: ⚠️ Poor
- Requires 3D coordinate system
- Incompatible with current 2D framework
- Major architecture changes needed

### 7. Voronoi Grid
**Status**: 🆕 Medium implementation required

**Characteristics**:
- Cell boundaries defined by Voronoi diagrams
- Irregular cell shapes
- Natural/organic appearance

**Advantages**:
- Organic, natural look
- Good for biological simulations
- Unique gameplay possibilities

**Disadvantages**:
- Complex neighbor calculations
- Variable cell sizes
- Performance concerns

**Implementation Effort**: Medium-High
- Voronoi diagram generation
- Complex neighbor detection
- Custom rendering logic

**Framework Compatibility**: ⚠️ Moderate
- Requires custom neighbor calculation
- May need grid point restructuring
- Deformation system compatibility uncertain

### 8. Hexagonal Grid (Current)
**Status**: ✅ Currently supported

**Characteristics**:
- Regular hexagon tessellation
- 6-neighbor connectivity
- Offset row pattern

**Advantages**:
- Excellent for strategy games
- Uniform neighbor distances
- Natural for certain game mechanics

**Disadvantages**:
- Complex coordinate system
- Offset row calculations
- Less intuitive than square grids

**Framework Compatibility**: ✅ Good
- Already implemented
- Working neighbor system
- Proper rendering support

## Recommendations

### Primary Recommendations

1. **Keep Square Grid as Default**
   - Simplest and most reliable
   - Best performance
   - Widest compatibility

2. **Add Rectangular Grid**
   - Low implementation effort
   - Useful for non-square layouts
   - Natural extension of existing code

3. **Consider Rhombic Grid**
   - Unique visual appeal
   - Moderate implementation effort
   - Good framework compatibility

### Secondary Considerations

4. **Evaluate Voronoi Grid**
   - High visual impact
   - Medium implementation effort
   - Requires careful compatibility testing

5. **Avoid Complex Grids**
   - Penrose tiling: Too complex for limited benefit
   - Geodesic grid: Incompatible with 2D framework
   - Focus on practical alternatives

### Implementation Strategy

#### Phase 1: Quick Wins
1. **Rectangular Grid Implementation**
   - Extend square grid generator
   - Add aspect ratio parameters
   - Update UI controls

#### Phase 2: Visual Enhancement
1. **Rhombic Grid Implementation**
   - New grid generation algorithm
   - Coordinate transformation system
   - Rendering updates

#### Phase 3: Advanced Options
1. **Voronoi Grid Evaluation**
   - Prototype implementation
   - Performance testing
   - Compatibility assessment

## Technical Implementation Details

### Grid Type Extension Pattern
```typescript
// Extend existing GridType union
export type GridType = 'square' | 'triangular' | 'hexagonal' | 'rectangular' | 'rhombic' | 'voronoi';

// Add to GridEngine switch statement
case 'rectangular':
    return this.generateRectangularGrid(config);
case 'rhombic':
    return this.generateRhombicGrid(config);
case 'voronoi':
    return this.generateVoronoiGrid(config);
```

### Configuration Updates
```typescript
// Add new parameters to GridConfig
export interface GridConfig {
    // ... existing properties
    aspectRatio?: number; // For rectangular grids
    rotation?: number;    // For rhombic grids
    seed?: number;        // For Voronoi grids
}
```

### Rendering Updates
```typescript
// Extend CanvasRenderer switch statement
if (config.gridType === 'rectangular') {
    this.renderRectangularFaces(points, pointMap, config);
} else if (config.gridType === 'rhombic') {
    this.renderRhombicFaces(points, pointMap, config);
} else if (config.gridType === 'voronoi') {
    this.renderVoronoiFaces(points, pointMap, config);
}
```

## Migration Strategy

### Removing Hexagonal Grid
1. **Update Type Definitions**
   - Remove 'hexagonal' from GridType union
   - Update default grid type to 'square'

2. **Remove Implementation Code**
   - Delete generateHexagonalGrid method
   - Remove renderHexagonalFaces method
   - Clean up switch statements

3. **Update Configuration**
   - Change default grid type in app store
   - Update UI controls
   - Handle existing configurations

4. **Testing and Validation**
   - Verify all grid types work correctly
   - Test export/import functionality
   - Ensure no breaking changes

## Conclusion

The framework is well-architected to support multiple grid types. The recommended approach is to:

1. **Remove hexagonal grid** as requested
2. **Add rectangular grid** for immediate value
3. **Consider rhombic grid** for visual enhancement
4. **Evaluate Voronoi grid** for advanced features

This approach balances implementation effort with functional benefits while maintaining the framework's flexibility and performance characteristics.

## Next Steps

1. **Implement rectangular grid** (1-2 days)
2. **Remove hexagonal grid** (1 day)
3. **Prototype rhombic grid** (2-3 days)
4. **Evaluate Voronoi grid** (3-5 days)
5. **Update documentation** (1 day)

Total estimated effort: 1-2 weeks for complete implementation and testing.
