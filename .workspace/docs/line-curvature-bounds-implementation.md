# Line Curvature Bounds Implementation Plan

## Overview

This document outlines the implementation of line width-based curvature bounds to replace the current absolute curvature values. The new system will prevent concave curves from stretching beyond the line width and wrapping past the other side, which currently creates inverse convex curves.

## Current Implementation Analysis

### Current Curvature Logic

Located in `src/core/canvas-renderer.ts` in the `renderCurvedLine` method:

```typescript
// Current implementation (lines 221-225)
const curvatureOffset = length * 0.15; // Fixed 15% of line length
const curvatureFactor = curvature * curvatureOffset; // Direct multiplication
```

### Current UI Mapping

Located in `src/components/CanvasSettingsPanel.tsx`:

```typescript
// UI range: -100 to 100 (lines 251-252)
min="-100"
max="100"
value={gridConfig.lineCurvature * 100}
onChange={(e) => setGridConfig({ lineCurvature: parseInt(e.target.value) / 100 })}
```

### Current Type Definition

Located in `src/types/grid.ts`:

```typescript
lineCurvature: number; // -1 to 1: amount of curvature (-1 = concave, 0 = straight, 1 = convex)
```

## Problems with Current Implementation

1. **Fixed Percentage**: Uses 15% of line length regardless of line width
2. **No Bounds**: Concave curves can extend beyond line width, creating visual artifacts
3. **Inconsistent Scaling**: Same curvature factor applied regardless of line thickness
4. **Inverse Curves**: Extreme concave values create inverse convex appearance

## Proposed Solution

### New Curvature Bounds System

Replace the fixed `curvatureOffset` calculation with symmetric line width-based bounds:

```typescript
// New implementation
// Symmetric bounds: curve can span 0.5 * lineWidth in either direction
const curvatureFactor = curvature * lineWidth * 0.5;
// -1 (concave) -> -0.5 * lineWidth
// 0 (straight) -> 0
// 1 (convex) -> +0.5 * lineWidth
```

### Benefits

1. **Proportional Scaling**: Curvature bounds scale with line width
2. **Prevents Artifacts**: Curves can never exceed 50% of line width in either direction
3. **Symmetric Behavior**: Equal curvature range in both concave and convex directions
4. **Consistent Visual**: Same relative curvature regardless of line thickness
5. **Intuitive Behavior**: Curvature feels natural and predictable
6. **Simple Implementation**: Single multiplication replaces complex calculation

## Implementation Plan

### Phase 1: Core Logic Update

**File**: `src/core/canvas-renderer.ts`
**Method**: `renderCurvedLine`

**Changes**:

1. Replace fixed `curvatureOffset` calculation
2. Implement line width-based bounds
3. Update curvature factor mapping
4. Add comments explaining new logic

**Code Changes**:

```typescript
// Replace lines 221-225
// OLD:
// const curvatureOffset = length * 0.15;
// const curvatureFactor = curvature * curvatureOffset;

// NEW:
// Calculate curvature factor based on line width
// Symmetric bounds: curve can span 0.5 * lineWidth in either direction
// -1 (concave extreme) -> -0.5 * lineWidth
// 0 (straight) -> 0
// 1 (convex extreme) -> +0.5 * lineWidth
const curvatureFactor = curvature * lineWidth * 0.5;
```

### Phase 2: UI Enhancement (Optional)

**File**: `src/components/CanvasSettingsPanel.tsx`

**Potential Changes**:

1. Update range labels to reflect new bounds
2. Add tooltip showing actual curvature values
3. Consider adding visual indicators for bounds

**Current Labels** (lines 262-264):

```typescript
<span>Concave</span>
<span>Straight</span>
<span>Convex</span>
```

**Potential New Labels**:

```typescript
<span>Concave (50%)</span>
<span>Straight</span>
<span>Convex (50%)</span>
```

### Phase 3: Testing and Validation

**Test Cases**:

1. **Line Width 0.5**: Both concave and convex should max at ±0.25
2. **Line Width 2.0**: Both concave and convex should max at ±1.0
3. **Line Width 5.0**: Both concave and convex should max at ±2.5
4. **Edge Cases**: Test with very thin (0.1) and thick (10.0) lines
5. **Visual Verification**: Ensure no inverse curves or wrapping artifacts
6. **Symmetry Test**: Verify concave and convex extremes are visually symmetric

## Technical Details

### Mathematical Model

The new curvature system uses a simple linear mapping with symmetric bounds:

```
For curvature ∈ [-1, 1] and lineWidth > 0:

curvatureFactor = curvature * lineWidth * 0.5

Where:
  curvature = -1 -> curvatureFactor = -0.5 * lineWidth (concave extreme)
  curvature =  0 -> curvatureFactor = 0 (straight)
  curvature = +1 -> curvatureFactor = +0.5 * lineWidth (convex extreme)
```

### Range Analysis

| Line Width | Concave Max | Convex Max | Total Range |
| ---------- | ----------- | ---------- | ----------- |
| 0.5        | -0.25       | +0.25      | 0.5         |
| 1.0        | -0.5        | +0.5       | 1.0         |
| 2.0        | -1.0        | +1.0       | 2.0         |
| 5.0        | -2.5        | +2.5       | 5.0         |

The bounds are symmetric, so the total range always equals the line width (0.5 \* lineWidth in each direction).

### Backward Compatibility

The change is backward compatible:

- Same UI range (-100% to 100%)
- Same data structure (lineCurvature: -1 to 1)
- Only internal calculation changes
- No migration needed for existing configurations

## Implementation Steps

1. **Update Canvas Renderer**: Modify `renderCurvedLine` method
2. **Test with Various Line Widths**: Verify bounds work correctly
3. **Visual Testing**: Ensure no artifacts or inverse curves
4. **Performance Check**: Ensure no performance regression
5. **Documentation Update**: Update code comments and type definitions

## Success Criteria

- [ ] Curves never exceed 50% of line width in either direction
- [ ] Symmetric behavior: concave and convex extremes are equal
- [ ] No visual artifacts or inverse curves
- [ ] Consistent behavior across all line widths
- [ ] Maintains existing UI/UX
- [ ] No performance regression
- [ ] Simple, single-line calculation

## Future Enhancements

1. **Configurable Bounds**: Allow users to adjust curvature bounds
2. **Non-linear Mapping**: Consider exponential or other curves for more natural feel
3. **Visual Feedback**: Show actual curvature values in UI
4. **Presets**: Common curvature bound configurations

## Files to Modify

1. `src/core/canvas-renderer.ts` - Core curvature calculation
2. `src/components/CanvasSettingsPanel.tsx` - UI labels (optional)
3. `src/types/grid.ts` - Type documentation (optional)

## Dependencies

- No external dependencies
- No breaking changes to existing APIs
- Compatible with current grid system
- Works with all existing deformation features
