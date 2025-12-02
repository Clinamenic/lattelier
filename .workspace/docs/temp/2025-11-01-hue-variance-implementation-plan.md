# Hue Variance Implementation Plan

**Date:** 2025-11-01  
**Created:** 2025-11-01T19:05:05Z  
**Status:** Planning Document  
**Version:** 1.0

---

## Executive Summary

This document outlines the implementation of Hue Variance settings for Points, Lines, and Fills in the Lattelier application. The hue variance controls will allow users to introduce subtle color variation (0-100%) around the chosen base color, creating more organic and varied visual patterns. At 0%, all elements use the exact chosen color. At 100%, elements will have a mild hue variation around the chosen color, creating visual interest while maintaining the overall color scheme.

---

## 1. Current State Analysis

### 1.1 Existing Color Implementation

**Location:** `src/core/canvas-renderer.ts`

Colors are currently applied directly without variation:

1. **Point Color** (`pointColor`)

   - Type: `string` (hex format, e.g., `#1f2937`)
   - Applied in `renderPoints()`: `this.ctx.fillStyle = config.pointColor;`
   - All points use the exact same color

2. **Line Color** (`lineColor`)

   - Type: `string` (hex format, e.g., `#6366f1`)
   - Applied in `renderLines()` via `lineConfig.color`
   - All lines use the exact same color

3. **Fill Color** (`fillColor`)
   - Type: `string` (hex format, e.g., `#3b82f6`)
   - Applied in `renderFill()`: `this.ctx.fillStyle = config.fillColor;`
   - All fill polygons use the exact same color

### 1.2 Deterministic Variation Pattern

**Location:** `src/core/canvas-renderer.ts`

The application already uses deterministic hashing for variations:

- `hashPair()` method creates consistent 0-1 hash values from point/line IDs
- Used for frequency-based rendering (lineFrequency, fillFrequency)
- Same pattern can be used for hue variance to ensure consistent colors per element

### 1.3 Type Definitions

**Location:** `src/types/grid.ts`

- `GridConfig` interface includes `pointColor`, `lineColor`, `fillColor` (all `string`)
- No hue variance properties exist
- `SettingsLocks` includes color locks but no hue variance locks

### 1.4 UI Structure

**Location:** `src/components/CanvasSettingsPanel.tsx`

**Current Control Order:**

**Points section:**

- Color picker with lock button
- Opacity (range slider)
- Size (range slider)

**Lines section:**

- Color picker with lock button
- Opacity (range slider)
- Frequency (range slider)
- Width (range slider)
- Style (select dropdown)
- Conditional settings (curvature or segmented texture settings)
- Blend Mode (select dropdown) - **Note:** This doesn't exist in Lines, only Fill

**Fill section:**

- Color picker with lock button
- Opacity (range slider)
- Frequency (range slider)
- Blend Mode (select dropdown)

**Target Control Order (after implementation):**

**Points section:**

- Color picker with lock button
- **Hue Variance (range slider)** - NEW, immediately after color picker
- Opacity (range slider)
- Size (range slider)

**Lines section:**

- Color picker with lock button
- **Hue Variance (range slider)** - NEW, immediately after color picker
- Opacity (range slider)
- Frequency (range slider)
- Width (range slider)
- Style (select dropdown)
- Conditional settings (curvature or segmented texture settings)

**Fill section:**

- Color picker with lock button
- **Hue Variance (range slider)** - NEW, immediately after color picker
- Opacity (range slider)
- Frequency (range slider)
- Blend Mode (select dropdown)

### 1.5 Form Range Styling

**Location:** `src/styles/components/forms.css`

Existing form-range styling is comprehensive:

- `.form-range-container` with pill-style design matching color pickers
- `.form-range-display` with fill visualization
- `.form-range-label` for value display
- Height matches color picker (`--pill-height`)
- Range fill system for visual feedback

---

## 2. Requirements

### 2.1 Functional Requirements

1. **Add Hue Variance Settings:**

   - Three separate settings: `pointHueVariance`, `lineHueVariance`, `fillHueVariance`
   - Range: 0-1 internally (0-100% in UI)
   - Default value: 0.0 (0% - no variation, exact color)
   - Controls positioned immediately underneath their respective color pickers
   - Use existing form-range styling pattern

2. **Hue Variation Behavior:**

   - 0% (0.0): All elements use exact chosen color (no variation)
   - 100% (1.0): Elements have mild hue variation around chosen color
   - Variation should be deterministic (same element always gets same varied color)
   - Variation should be visually pleasing (not too extreme)
   - Suggested maximum variation: ±30 degrees in HSL color space

3. **Rendering Implementation:**

   - For each point/line/fill, calculate a deterministic hash
   - Use hash to determine hue offset within variance range
   - Convert base color from hex to HSL
   - Apply hue offset (scaled by variance setting)
   - Convert back to hex/RGB for rendering
   - Maintain saturation and lightness of base color (only vary hue)

4. **UI Controls:**

   - Range slider with percentage display (0-100%)
   - Lock button support (follow existing pattern)
   - Positioned immediately after color picker in respective sections
   - Use existing `.form-range-container` styling

5. **Integration Points:**
   - Must be included in state management (`GridConfig`)
   - Must be included in config export/import (`GridSettings`)
   - Must be included in shuffle functionality
   - Must support lock/unlock functionality (`SettingsLocks`)
   - Must be included in state hash generation

### 2.2 Non-Functional Requirements

1. **Performance:**

   - Color conversion (hex ↔ HSL) should be efficient
   - Deterministic hashing should not add significant overhead
   - Consider caching converted colors if needed (though hash-based approach may be sufficient)

2. **Visual Quality:**

   - Hue variation should feel natural and organic
   - Maximum variation should remain visually cohesive (not too chaotic)
   - Colors should maintain their general appearance (saturation/lightness preserved)

3. **Consistency:**

   - Follow exact same UI pattern as existing range controls
   - Use same styling classes and structure
   - Match behavior of other variance settings (frequency, etc.)

4. **Backward Compatibility:**
   - Existing configurations without hue variance should default to 0.0
   - Import of old configs should handle missing properties gracefully

---

## 3. Baseline Knowledge

### 3.1 Key Interfaces

**File:** `src/types/grid.ts`

- `GridConfig` - Main configuration interface
- `SettingsLocks` - Lock state interface
- `GridPoint` - Point data structure with `id` for hashing

**File:** `src/types/config.ts`

- `GridSettings` - Export/import format
  - `points.color` - Point color (string)
  - `lines.color` - Line color (string)
  - `fill.color` - Fill color (string)

### 3.2 Dependencies

**Existing Components:**

- `LockButton` component - Used for all settings locks
- `form-range-container` CSS class - Styling for range sliders
- `hashPair()` method - Deterministic hashing for variations

**Required Utilities:**

- Hex to HSL conversion function (new)
- HSL to Hex conversion function (new)
- Hue variance calculation function (new)

### 3.3 File Modification Requirements

**Type Definitions:**

- `src/types/grid.ts` - Add hue variance properties to `GridConfig` and `SettingsLocks`
- `src/types/config.ts` - Add hue variance to `GridSettings` interface

**State Management:**

- `src/state/app-store.ts` - Add defaults, update shuffle function

**Rendering:**

- `src/core/canvas-renderer.ts` - Implement hue variation in `renderPoints()`, `renderLines()`, `renderFill()`

**UI Components:**

- `src/components/CanvasSettingsPanel.tsx` - Add hue variance controls

**Configuration:**

- `src/core/config-manager.ts` - Update export/import mappings

**Export:**

- `src/core/export-manager.ts` - Apply hue variance in SVG export (if applicable)

**Utilities:**

- `src/utils/state-hash.ts` - Include hue variance in hash generation
- `src/utils/math.ts` (or new color utility) - Color conversion functions

---

## 4. Type Definitions

### 4.1 New Properties

**File:** `src/types/grid.ts`

**GridConfig Interface:**

```typescript
export interface GridConfig {
  // ... existing properties ...
  pointColor: string;
  pointHueVariance: number; // 0-1: hue variation range around pointColor
  lineColor: string;
  lineHueVariance: number; // 0-1: hue variation range around lineColor
  fillColor: string;
  fillHueVariance: number; // 0-1: hue variation range around fillColor
  // ... existing properties ...
}
```

**SettingsLocks Interface:**

```typescript
export interface SettingsLocks {
  // ... existing locks ...
  pointColor: boolean;
  pointHueVariance: boolean;
  lineColor: boolean;
  lineHueVariance: boolean;
  fillColor: boolean;
  fillHueVariance: boolean;
  // ... existing locks ...
}
```

### 4.2 Export/Import Types

**File:** `src/types/config.ts`

**GridSettings Interface:**

```typescript
export interface GridSettings {
  // ... existing properties ...
  points: {
    show: boolean;
    size: number;
    color: string;
    hueVariance?: number; // Optional for backward compatibility
    opacity: number;
  };
  lines: {
    show: boolean;
    width: number;
    frequency: number;
    curvature: number;
    color: string;
    hueVariance?: number; // Optional for backward compatibility
    opacity: number;
    style: "solid" | "segmented";
    segmentedTextureSettings?: {
      angleVariation: number;
      spacingVariation: number;
      lengthVariation: number;
    };
  };
  fill: {
    show: boolean;
    frequency: number;
    color: string;
    hueVariance?: number; // Optional for backward compatibility
    opacity: number;
    blendMode: string;
  };
  // ... existing properties ...
}
```

### 4.3 Validation

- Hue variance values must be clamped to 0-1 range
- Missing hue variance in imports should default to 0.0
- Values outside 0-1 should be clamped, not rejected

---

## 5. Implementation Order

### Step 1: Color Conversion Utilities

**Priority:** Critical Path (required for rendering)

**File:** `src/utils/math.ts` or `src/utils/color.ts` (new file)

**Implementation:**

1. Create `hexToHsl(hex: string): { h: number, s: number, l: number }` function
   - Parse hex color (handle both #RRGGBB and #RGB formats)
   - Convert RGB to HSL (0-360 for hue, 0-1 for saturation/lightness)
2. Create `hslToHex(h: number, s: number, l: number): string` function

   - Convert HSL to RGB
   - Format as hex string

3. Create `applyHueVariance(hex: string, variance: number, hash: number): string` function
   - Convert hex to HSL
   - Calculate hue offset: `(hash - 0.5) * variance * maxHueOffset`
   - Suggested `maxHueOffset = 30` degrees for 100% variance
   - Add offset to hue (handle wrapping around 360)
   - Convert back to hex

**Dependencies:** None (can be implemented independently)

### Step 2: Type Definitions

**Priority:** Critical Path (required for all other steps)

**Files:**

- `src/types/grid.ts` - Add to `GridConfig` and `SettingsLocks`
- `src/types/config.ts` - Add to `GridSettings` (optional for backward compat)

**Dependencies:** None

### Step 3: State Management

**Priority:** Critical Path (required for UI and rendering)

**File:** `src/state/app-store.ts`

**Changes:**

1. Update `defaultGridConfig`:

   ```typescript
   pointHueVariance: 0.0,
   lineHueVariance: 0.0,
   fillHueVariance: 0.0,
   ```

2. Update `defaultSettingsLocks`:

   ```typescript
   pointHueVariance: false,
   lineHueVariance: false,
   fillHueVariance: false,
   ```

3. Update `shuffleSettings()` function:
   - Randomize hue variance when unlocked (0-1 range)
   - Respect locks

**Dependencies:** Step 2 (Type Definitions)

### Step 4: Rendering Implementation

**Priority:** Critical Path (core functionality)

**File:** `src/core/canvas-renderer.ts`

**Changes:**

1. **renderPoints() method:**

   ```typescript
   private renderPoints(points: GridPoint[], config: GridConfig): void {
       this.ctx.globalAlpha = config.pointOpacity;

       for (const point of points) {
           // Calculate deterministic hash for this point
           const pointHash = this.hashPoint(point.id);

           // Apply hue variance if enabled
           const color = config.pointHueVariance > 0
               ? applyHueVariance(config.pointColor, config.pointHueVariance, pointHash)
               : config.pointColor;

           this.ctx.fillStyle = color;
           // ... rest of rendering ...
       }
   }
   ```

2. **renderLines() method:**

   - Apply hue variance per line using existing `pairHash`
   - Update `lineConfig.color` calculation

3. **renderFill() method:**
   - Apply hue variance per fill polygon using existing `fillHash`
   - Update `fillStyle` before each `ctx.fill()` call

**Dependencies:** Step 1 (Color Utilities), Step 2 (Type Definitions), Step 3 (State Management)

### Step 5: UI Components

**Priority:** High (user-facing feature)

**File:** `src/components/CanvasSettingsPanel.tsx`

**Changes:**

Add hue variance controls immediately after each color picker:

1. **Points Section** (after line 223, after color picker):

   ```tsx
   <div className="form-group">
     <div className="form-group-row">
       <div className="form-range-container">
         <input
           type="range"
           min="0"
           max="100"
           value={gridConfig.pointHueVariance * 100}
           onChange={(e) =>
             setGridConfig({ pointHueVariance: parseInt(e.target.value) / 100 })
           }
           className="form-range"
         />
         <div className="form-range-display">
           <span className="form-range-label">
             Hue Variance: {Math.round(gridConfig.pointHueVariance * 100)}%
           </span>
         </div>
       </div>
       <LockButton
         settingKey="pointHueVariance"
         locked={settingsLocks.pointHueVariance}
       />
     </div>
   </div>
   ```

2. **Lines Section** (after line 302, after color picker):

   - Same pattern, using `lineHueVariance`

3. **Fill Section** (after line 549, after color picker):
   - Same pattern, using `fillHueVariance`

**Dependencies:** Step 2 (Type Definitions), Step 3 (State Management)

### Step 6: Configuration Management

**Priority:** Medium (export/import functionality)

**File:** `src/core/config-manager.ts`

**Changes:**

1. Update `mapGridConfigToSettings()`:

   - Add `hueVariance: config.pointHueVariance` to `points` object
   - Add `hueVariance: config.lineHueVariance` to `lines` object
   - Add `hueVariance: config.fillHueVariance` to `fill` object

2. Update `mapSettingsToGridConfig()`:
   - Extract hue variance values with defaults (0.0 if missing)
   - Clamp values: `Math.max(0, Math.min(1, settings.points.hueVariance ?? 0.0))`

**Dependencies:** Step 2 (Type Definitions)

### Step 7: Export Functionality

**Priority:** Medium (SVG export)

**File:** `src/core/export-manager.ts`

**Considerations:**

- SVG export may need to apply hue variance per element
- Consider whether to apply variance in export or use base colors
- If applying variance, need to use same hashing as rendering

**Decision Needed:** Should exported SVG include hue variance, or use base colors only?

**Dependencies:** Step 4 (Rendering Implementation)

### Step 8: State Hash Generation

**Priority:** Low (state tracking)

**File:** `src/utils/state-hash.ts`

**Changes:**

- Add hue variance values to state hash object:
  ```typescript
  pointHueVariance: gridConfig.pointHueVariance,
  lineHueVariance: gridConfig.lineHueVariance,
  fillHueVariance: gridConfig.fillHueVariance,
  ```

**Dependencies:** Step 2 (Type Definitions)

---

## 6. Integration Points

### 6.1 Color Conversion API

**Location:** `src/utils/math.ts` or `src/utils/color.ts`

**Functions:**

- `hexToHsl(hex: string): { h: number, s: number, l: number }`
- `hslToHex(h: number, s: number, l: number): string`
- `applyHueVariance(hex: string, variance: number, hash: number): string`

**Usage:**

- Called from `canvas-renderer.ts` during rendering
- Must handle edge cases (invalid hex, hue wrapping)

### 6.2 Deterministic Hashing

**Existing:** `hashPair(id1: string, id2: string): number`

**New:** May need `hashPoint(id: string): number` for points

- Or reuse existing hash method with consistent seed

**Usage:**

- Points: Hash point ID
- Lines: Use existing `pairHash` from `hashPair(pointId, neighborId)`
- Fill: Use existing `fillHash` from `hashPair(faceId, 'fill')`

### 6.3 State Management

**Update Points:**

- `setGridConfig()` automatically triggers re-render
- Hue variance changes will update canvas via existing reactivity

### 6.4 Error Handling

- Invalid hex colors: Default to base color if conversion fails
- Out of range values: Clamp to 0-1
- Missing config values: Default to 0.0

---

## 7. Success Criteria

### 7.1 Functional Requirements

1. ✅ Three hue variance controls appear in Points, Lines, and Fills sections
2. ✅ Controls positioned immediately underneath respective color pickers
3. ✅ Range sliders display 0-100% with percentage labels
4. ✅ At 0%, all elements use exact chosen color (no variation)
5. ✅ At 100%, elements show mild hue variation around chosen color
6. ✅ Variation is deterministic (same element always same color)
7. ✅ Lock buttons work and persist state
8. ✅ Shuffle respects hue variance locks
9. ✅ Config export includes hue variance values
10. ✅ Config import handles hue variance (with backward compatibility)
11. ✅ State hash includes hue variance values

### 7.2 Visual Requirements

1. ✅ Hue variation feels natural and organic
2. ✅ Colors remain visually cohesive at 100% variance
3. ✅ Saturation and lightness preserved (only hue varies)
4. ✅ UI matches existing form-range styling exactly

### 7.3 Technical Requirements

1. ✅ No performance degradation (rendering remains smooth)
2. ✅ No breaking changes to existing functionality
3. ✅ Backward compatible with existing configs
4. ✅ Code follows existing patterns and conventions

---

## 8. Risk & Rollback

### 8.1 Risks

1. **Performance:** Color conversion on every render could be expensive

   - **Mitigation:** Use efficient conversion algorithms, consider caching if needed
   - **Rollback:** If performance issues, can disable feature or optimize

2. **Visual Quality:** Hue variation might not look good at higher values

   - **Mitigation:** Limit max variation to ±30 degrees, test various color combinations
   - **Rollback:** Can reduce max variation range if needed

3. **Complexity:** HSL conversion and hue wrapping adds complexity
   - **Mitigation:** Well-tested utility functions, clear comments
   - **Rollback:** Feature can be disabled if bugs occur

### 8.2 Rollback Strategy

- Hue variance defaults to 0.0 (no variation)
- If issues occur, can temporarily disable rendering variation
- Config export/import can gracefully handle missing values
- Type definitions are additive (non-breaking)

---

## 9. Testing Considerations

### 9.1 Functional Testing

1. **UI Interaction:**

   - Verify hue variance sliders work and update display
   - Verify lock buttons toggle correctly
   - Verify values persist across page refresh

2. **Rendering:**

   - Verify 0% shows exact color (no variation)
   - Verify 100% shows variation (all elements different colors)
   - Verify variation is deterministic (same IDs = same colors)
   - Verify intermediate values work correctly

3. **Color Conversion:**

   - Test with various hex colors (#RRGGBB and #RGB formats)
   - Test edge cases (pure colors, grays, etc.)
   - Verify hue wrapping around 360 degrees

4. **Shuffle:**

   - Verify hue variance is randomized when unlocked
   - Verify hue variance is preserved when locked

5. **Export/Import:**
   - Verify exported config includes hue variance
   - Verify imported config with hue variance works
   - Verify imported config without hue variance defaults to 0.0

### 9.2 Visual Testing

1. Test with various base colors (red, blue, green, etc.)
2. Test at different variance levels (0%, 50%, 100%)
3. Verify visual cohesion at maximum variance
4. Test with different grid densities

### 9.3 Edge Cases

1. **Zero Variance:**

   - Should render identical to current behavior (no variation)

2. **Maximum Variance:**

   - Should not create jarring color differences
   - Should remain within reasonable hue range

3. **Invalid Colors:**
   - Should gracefully handle malformed hex strings
   - Should default to base color if conversion fails

---

## 10. Future Considerations

Potential enhancements (not in scope):

- Separate saturation/lightness variance controls
- Different variance algorithms (e.g., Gaussian distribution)
- Visual preview of variance range
- Per-element color override (individual point/line color)
- Animated hue variance over time
- Preset variance values or quick-access buttons

---

## 11. References

### 11.1 Related Files

- Type definitions: `src/types/grid.ts`, `src/types/config.ts`
- State management: `src/state/app-store.ts`
- Rendering: `src/core/canvas-renderer.ts`
- UI: `src/components/CanvasSettingsPanel.tsx`
- Config management: `src/core/config-manager.ts`
- Export: `src/core/export-manager.ts`
- State hash: `src/utils/state-hash.ts`
- Utilities: `src/utils/math.ts` (or new `src/utils/color.ts`)

### 11.2 Existing Patterns

- Form range controls: See `CanvasSettingsPanel.tsx` lines 82-100 (canvas opacity example)
- Deterministic hashing: See `canvas-renderer.ts` `hashPair()` method
- Color picker UI: See `CanvasSettingsPanel.tsx` lines 198-223 (points color example)

### 11.3 Color Space Reference

- HSL color space: Hue (0-360°), Saturation (0-1), Lightness (0-1)
- Hue variance: ±30 degrees suggested maximum for 100% setting
- Color conversion formulas: Standard RGB ↔ HSL algorithms

---

**End of Planning Document**
