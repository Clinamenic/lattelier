# Woven Texture Implementation Plan

## Lattelier - Line Texture Feature

**Date:** January 12, 2025  
**Status:** Planning Document  
**Version:** 1.0

---

## Executive Summary

This document outlines the implementation of a line texture system that allows users to choose between "Solid" (default) and "Woven" textures for lattice lines. The woven texture renders each line segment as a bundle of parallel thread-like strokes with natural imperfection, creating a hand-drawn, organic appearance. The feature must work seamlessly with both straight and curved lines, maintaining compatibility with all existing line properties (width, curvature, opacity, color).

---

## 1. Feature Overview

### 1.1 Core Concept

**Woven Texture Characteristics:**

- Each line segment rendered as multiple parallel thread strokes
- Imperfect, natural appearance with slight variations in:
  - Thread position (offset perpendicular to line direction)
  - Thread thickness (slight variation)
  - Thread opacity (subtle variation)
  - Thread length (slight variation at edges)
- Works with both straight lines (curvature ≈ 0) and curved/filled lines (curvature ≠ 0)
- Curvature affects the entire line area, with threads distributed across the full width

**Solid Texture (Default):**

- Current behavior - single solid stroke or filled area
- No changes required for this mode

### 1.2 User Experience

- **Form Select Control**: Dropdown in Lines section with options "Solid" and "Woven"
- **Instant Preview**: Texture change immediately visible on canvas
- **Performance**: Maintains rendering performance even with many thread strokes
- **Export Compatibility**: Works with PNG and SVG export (may require different strategies)

---

## 2. Current State Analysis

### 2.1 Line Rendering Architecture

**Current Implementation:**

```typescript
// src/core/canvas-renderer.ts
private renderLines(points: GridPoint[], config: GridConfig): void {
  // Fast path for straight lines (curvature ≈ 0.5)
  if (config.lineCurvature > 0.49 && config.lineCurvature < 0.51) {
    // Simple stroke: ctx.stroke()
  } else {
    // Curved line: renderCurvedLine() creates filled bezier path
  }
}
```

**Key Observations:**

- Straight lines use `ctx.stroke()` with single path
- Curved lines use `ctx.fill()` with closed bezier path
- Line width affects the stroke thickness or fill width
- Curvature creates a filled area (sinew style)

### 2.2 Configuration Structure

**Current GridConfig:**

```typescript
interface GridConfig {
  lineWidth: number;
  lineFrequency: number;
  lineCurvature: number; // -1 to 1
  lineOpacity: number;
  lineColor: string;
  // ... other properties
}
```

**Missing:**

- Line texture type property

### 2.3 UI Structure

**Lines Section in CanvasSettingsPanel:**

- Located at `src/components/CanvasSettingsPanel.tsx` (lines 200-300)
- Contains: Color picker, Frequency slider, Curvature slider, Width slider, Opacity slider
- Form select pattern already exists (see Grid Type selector, lines 80-87)

---

## 3. Technical Design

### 3.1 Type System Extension

**Add Line Texture Type:**

```typescript
// src/types/grid.ts
export type LineTexture = "solid" | "woven";

export interface GridConfig {
  // ... existing properties
  lineTexture: LineTexture; // New property
}
```

**Default Value:**

```typescript
// src/state/app-store.ts
const defaultGridConfig: GridConfig = {
  // ... existing defaults
  lineTexture: "solid", // Default to current behavior
};
```

### 3.2 Woven Texture Rendering Strategy

#### **For Straight Lines (curvature ≈ 0)**

**Approach: Multiple Parallel Strokes**

```typescript
private renderWovenStraightLine(
  x1: number, y1: number,
  x2: number, y2: number,
  lineWidth: number,
  color: string,
  opacity: number
): void {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const perpX = -dy / length;
  const perpY = dx / length;

  // Calculate thread count based on line width
  const threadCount = Math.max(2, Math.ceil(lineWidth / 2));
  const threadSpacing = lineWidth / threadCount;

  // Generate threads with imperfection
  for (let i = 0; i < threadCount; i++) {
    // Base offset from centerline
    const baseOffset = (i - threadCount/2 + 0.5) * threadSpacing;

    // Add imperfection: random offset perpendicular to line
    const hash = this.hashPair(`${x1}-${y1}`, `${x2}-${y2}-${i}`);
    const imperfection = (hash - 0.5) * threadSpacing * 0.4; // ±20% variation
    const offset = baseOffset + imperfection;

    // Thread properties with variation
    const threadOpacity = opacity * (0.8 + hash * 0.4); // 80-120% of base
    const threadWidth = (lineWidth / threadCount) * (0.7 + hash * 0.6); // 70-130% of average

    // Draw thread
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = threadWidth;
    this.ctx.globalAlpha = threadOpacity;
    this.ctx.beginPath();
    this.ctx.moveTo(
      x1 + perpX * offset,
      y1 + perpY * offset
    );
    this.ctx.lineTo(
      x2 + perpX * offset,
      y2 + perpY * offset
    );
    this.ctx.stroke();
  }

  this.ctx.globalAlpha = 1;
}
```

#### **For Curved Lines (curvature ≠ 0)**

**Approach: Multiple Filled Paths with Variation**

```typescript
private renderWovenCurvedLine(
  x1: number, y1: number,
  x2: number, y2: number,
  curvature: number,
  lineWidth: number,
  color: string,
  opacity: number
): void {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const perpX = -dy / length;
  const perpY = dx / length;

  // Calculate thread count
  const threadCount = Math.max(3, Math.ceil(lineWidth / 1.5));

  // Generate multiple threads within the curved area
  for (let i = 0; i < threadCount; i++) {
    const hash = this.hashPair(`${x1}-${y1}`, `${x2}-${y2}-${i}`);

    // Thread-specific curvature variation
    const threadCurvature = curvature * (0.8 + hash * 0.4);

    // Thread width variation
    const threadWidth = (lineWidth / threadCount) * (0.6 + hash * 0.8);

    // Thread opacity variation
    const threadOpacity = opacity * (0.75 + hash * 0.5);

    // Render individual curved thread using existing renderCurvedLine logic
    // but with reduced width and variation
    this.renderCurvedLine(
      x1, y1, x2, y2,
      threadCurvature,
      threadWidth,
      color,
      threadOpacity
    );
  }
}
```

**Optimization Consideration:**

- For very wide lines with many threads, may need to limit thread count
- Consider performance threshold (e.g., max 10 threads per line)

### 3.3 Imperfection Algorithm

**Deterministic Randomness:**

- Use existing `hashPair()` method for consistent, seed-based randomness
- Hash based on: point IDs, neighbor IDs, thread index
- Ensures same line always renders same woven pattern
- Enables export reproducibility

**Variation Parameters:**

```typescript
interface WovenThreadVariation {
  positionOffset: number; // ±20% of thread spacing
  widthMultiplier: number; // 70-130% of average thread width
  opacityMultiplier: number; // 75-125% of base opacity
  lengthVariation: number; // Slight shortening at edges (0-10%)
}
```

### 3.4 Integration with renderLines()

**Modified renderLines Method:**

```typescript
private renderLines(points: GridPoint[], config: GridConfig): void {
  // ... existing point map setup ...

  for (const point of points) {
    for (const neighborId of point.neighbors) {
      const neighbor = pointMap.get(neighborId);
      if (!neighbor || neighborId <= point.id) continue;

      const pairHash = this.hashPair(point.id, neighborId);
      if (pairHash > config.lineFrequency) continue;

      const x1 = point.currentPosition.x;
      const y1 = point.currentPosition.y;
      const x2 = neighbor.currentPosition.x;
      const y2 = neighbor.currentPosition.y;

      // Route to appropriate renderer based on texture
      if (config.lineTexture === 'woven') {
        if (config.lineCurvature > 0.49 && config.lineCurvature < 0.51) {
          this.renderWovenStraightLine(
            x1, y1, x2, y2,
            config.lineWidth,
            config.lineColor,
            config.lineOpacity
          );
        } else {
          this.renderWovenCurvedLine(
            x1, y1, x2, y2,
            config.lineCurvature,
            config.lineWidth,
            config.lineColor,
            config.lineOpacity
          );
        }
      } else {
        // Existing solid rendering
        if (config.lineCurvature > 0.49 && config.lineCurvature < 0.51) {
          this.ctx.strokeStyle = config.lineColor;
          this.ctx.lineWidth = config.lineWidth;
          this.ctx.globalAlpha = config.lineOpacity;
          this.ctx.beginPath();
          this.ctx.moveTo(x1, y1);
          this.ctx.lineTo(x2, y2);
          this.ctx.stroke();
        } else {
          this.renderCurvedLine(
            x1, y1, x2, y2,
            config.lineCurvature,
            config.lineWidth,
            config.lineColor,
            config.lineOpacity
          );
        }
      }
    }
  }

  this.ctx.globalAlpha = 1;
}
```

---

## 4. UI Implementation

### 4.1 Form Select Control

**Location:**

- Lines section, `src/components/CanvasSettingsPanel.tsx`
- Place after color picker, before frequency slider
- Follow existing form-select pattern (Grid Type selector)

**Implementation:**

```typescript
{
  /* Lines Section */
}
<section className="settings-section">
  <h3 className="settings-section-title">Lines</h3>

  {/* Color picker - existing */}
  <div className="form-group">{/* ... color picker ... */}</div>

  {/* NEW: Texture selector */}
  <div className="form-group">
    <label className="form-label">Texture</label>
    <select
      value={gridConfig.lineTexture}
      onChange={(e) =>
        setGridConfig({
          lineTexture: e.target.value as LineTexture,
        })
      }
      className="form-select"
    >
      <option value="solid">Solid</option>
      <option value="woven">Woven</option>
    </select>
  </div>

  {/* Frequency, Curvature, Width, Opacity - existing */}
  {/* ... rest of controls ... */}
</section>;
```

### 4.2 Visual Consistency

- Match styling of existing Grid Type selector
- Use same `form-label` and `form-select` classes
- Maintain consistent spacing with other form groups

---

## 5. Export Compatibility

### 5.1 PNG Export

**Status:** Fully Compatible

- Canvas rendering handles woven texture automatically
- High-resolution exports will capture thread detail
- No special handling needed

### 5.2 SVG Export

**Current SVG Implementation:**

- Uses simple `<line>` elements for straight lines
- Does not support curved lines (renders as straight)
- Does not support texture variations

**Options:**

**Option A: Simplified SVG (Recommended for MVP)**

- Export woven lines as single `<line>` elements
- Note: SVG will not preserve woven texture appearance
- Add comment or attribute to indicate texture type
- Future enhancement: convert to path groups with multiple strokes

**Option B: Complex SVG (Future Enhancement)**

- Export each thread as separate `<line>` or `<path>` element
- Group threads within `<g>` element
- Significantly increases SVG complexity and file size
- May hit performance issues with large grids

**Recommendation:** Start with Option A, document limitation, plan Option B as future enhancement.

**Implementation:**

```typescript
// src/core/export-manager.ts - exportSVG()
if (gridConfig.lineOpacity > 0) {
  const linesGroup = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );

  // Add texture info as data attribute (for future processing)
  if (gridConfig.lineTexture === "woven") {
    linesGroup.setAttribute("data-texture", "woven");
  }

  // ... existing line rendering (simplified) ...
}
```

---

## 6. Implementation Phases

### 6.1 Phase 1: Core Implementation (MVP)

**Tasks:**

- [ ] Add `LineTexture` type to `src/types/grid.ts`
- [ ] Add `lineTexture` property to `GridConfig` interface
- [ ] Update `defaultGridConfig` in `src/state/app-store.ts`
- [ ] Implement `renderWovenStraightLine()` method
- [ ] Implement `renderWovenCurvedLine()` method
- [ ] Modify `renderLines()` to route by texture type
- [ ] Add texture form-select to `CanvasSettingsPanel`
- [ ] Test with various line widths and curvatures
- [ ] Verify performance with large grids

**Acceptance Criteria:**

- Texture selector visible in Lines section
- Switching between Solid and Woven updates canvas immediately
- Woven texture shows thread-like appearance
- Works with both straight and curved lines
- Maintains acceptable performance

### 6.2 Phase 2: Refinement & Optimization

**Tasks:**

- [ ] Fine-tune imperfection parameters for natural appearance
- [ ] Optimize thread count calculation
- [ ] Add performance threshold (max threads per line)
- [ ] Test with extreme values (very wide lines, high curvature)
- [ ] Verify export compatibility (PNG and SVG)

**Acceptance Criteria:**

- Woven texture looks natural and organic
- Performance remains acceptable with 100+ lines
- PNG exports preserve texture detail
- SVG exports (with limitation note) work correctly

### 6.3 Phase 3: Enhanced SVG Export (Future)

**Tasks:**

- [ ] Implement thread-by-thread SVG export for woven texture
- [ ] Group threads in SVG structure
- [ ] Optimize SVG generation performance
- [ ] Test with large grids

---

## 7. Technical Considerations

### 7.1 Performance

**Potential Issues:**

- Multiple strokes per line increases draw calls
- Large grids with many lines may see performance impact

**Mitigation Strategies:**

- Limit thread count based on line width (max ~10 threads)
- Consider batching similar threads
- Profile rendering performance with various grid sizes

### 7.2 Visual Quality

**Thread Appearance:**

- Ensure threads are visible but not overwhelming
- Balance between detail and performance
- Maintain coherence across line segments

**Variation Parameters:**

- Start with conservative variation (±20% position, ±30% width, ±25% opacity)
- Allow fine-tuning based on visual testing
- Document parameters for future adjustment

### 7.3 Edge Cases

**Very Thin Lines (width < 1):**

- Minimum 2 threads to maintain woven appearance
- May need special handling for sub-pixel rendering

**Very Thick Lines (width > 10):**

- Cap thread count at reasonable maximum (10-15)
- Ensure threads don't become too sparse

**Extreme Curvature:**

- Verify curved threads render correctly
- Test concave (negative) and convex (positive) curvature

---

## 8. Testing Strategy

### 8.1 Visual Testing

**Test Cases:**

- [ ] Solid texture matches current behavior exactly
- [ ] Woven texture visible and natural-looking
- [ ] Texture works with straight lines (curvature = 0)
- [ ] Texture works with curved lines (curvature ≠ 0)
- [ ] Texture works across line width range (0.5 - 10)
- [ ] Texture works with various opacity values
- [ ] Texture works with various colors

### 8.2 Performance Testing

**Metrics:**

- [ ] Rendering time for 100 lines (woven vs solid)
- [ ] Rendering time for 1000 lines (woven vs solid)
- [ ] Memory usage comparison
- [ ] Frame rate during pan/zoom

### 8.3 Export Testing

**PNG:**

- [ ] High-resolution PNG (4×, 8×) preserves thread detail
- [ ] File size comparison (woven vs solid)

**SVG:**

- [ ] SVG export completes successfully
- [ ] SVG file structure correct
- [ ] SVG renders in external viewers (browser, Inkscape, etc.)

---

## 9. Documentation

### 9.1 User Documentation

**Update GuideModal or Help Text:**

- Explain Solid vs Woven texture options
- Note SVG export limitation (if applicable)
- Provide visual examples or screenshots

### 9.2 Code Documentation

**Add JSDoc Comments:**

```typescript
/**
 * Renders a straight line with woven texture (multiple thread strokes)
 * @param x1 Start X coordinate
 * @param y1 Start Y coordinate
 * @param x2 End X coordinate
 * @param y2 End Y coordinate
 * @param lineWidth Total line width (distributed across threads)
 * @param color Line color
 * @param opacity Base opacity (varied per thread)
 */
private renderWovenStraightLine(...): void
```

---

## 10. Dependencies & Prerequisites

### 10.1 Required Changes

- **Type System**: Add `LineTexture` type
- **State Management**: Add `lineTexture` to `GridConfig`
- **Rendering Engine**: New rendering methods in `CanvasRenderer`
- **UI Components**: Form select in `CanvasSettingsPanel`
- **Export Manager**: Minimal changes (SVG attribute, if any)

### 10.2 No Breaking Changes

- All changes are additive
- Existing functionality remains unchanged
- Default texture ("solid") maintains current behavior

---

## 11. Success Metrics

### 11.1 Feature Adoption

- Users can successfully switch between textures
- Woven texture renders correctly in majority of cases
- Performance impact is acceptable

### 11.2 Visual Quality

- Woven texture appears natural and organic
- Texture adds visual interest without overwhelming
- Works well with existing line properties

### 11.3 Technical Quality

- Code follows existing patterns and conventions
- Performance remains acceptable
- No regressions in existing functionality

---

## 12. Future Enhancements

### 12.1 Texture Variations

- **More Texture Types**:
  - Dotted/dashed patterns
  - Crosshatch patterns
  - Gradient textures
  - Noise-based textures

### 12.2 Texture Parameters

- **Thread Count Control**: User-adjustable thread density
- **Imperfection Amount**: Slider for variation intensity
- **Thread Direction**: Angle control for thread orientation

### 12.3 Enhanced SVG Export

- Full thread-by-thread SVG export
- Preserve woven appearance in vector format
- Optimized SVG generation

---

## 13. Conclusion

The woven texture feature will add significant visual interest to the Lattelier application, allowing users to create more organic, hand-crafted looking patterns. The implementation leverages existing rendering infrastructure while adding new visual capabilities.

Key priorities:

1. Maintain performance with large grids
2. Ensure natural, organic appearance
3. Preserve all existing functionality
4. Plan for future enhancements (SVG export, additional textures)

The phased approach allows for iterative refinement and ensures the feature integrates smoothly with the existing codebase.
