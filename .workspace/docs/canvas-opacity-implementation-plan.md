# Canvas Opacity Implementation Plan

**Date:** 2025-01-XX  
**Status:** Planning Document  
**Version:** 1.0

---

## Executive Summary

This document outlines the implementation of a canvas opacity setting for the Lattelier application. The canvas opacity will control the transparency of the entire canvas background, similar to how points, lines, and fill each have their own opacity controls. This will allow users to create more layered and transparent visual effects.

---

## 1. Current State Analysis

### 1.1 Existing Opacity Implementations

**Location:** `src/core/canvas-renderer.ts`

The application currently has three opacity settings:

1. **Point Opacity** (`pointOpacity`)

   - Range: 0-1 (0-100% in UI)
   - Default: 0.8
   - Applied in `renderPoints()` using `ctx.globalAlpha`

2. **Line Opacity** (`lineOpacity`)

   - Range: 0-1 (0-100% in UI)
   - Default: 0.8
   - Applied in line texture renderers using `ctx.globalAlpha`

3. **Fill Opacity** (`fillOpacity`)
   - Range: 0-1 (0-100% in UI)
   - Default: 0.3
   - Applied in `renderFill()` using `ctx.globalAlpha`

### 1.2 Canvas Background Rendering

**Location:** `src/core/canvas-renderer.ts` - `renderBackground()` method

The canvas background is currently rendered without opacity:

```typescript
private renderBackground(points: GridPoint[], config: GridConfig, padding: number = 20): void {
    if (!config.canvasBackgroundColor) return;

    const bounds = this.calculateGridBounds(points, padding);
    this.ctx.fillStyle = config.canvasBackgroundColor;
    this.ctx.fillRect(
        bounds.minX,
        bounds.minY,
        bounds.maxX - bounds.minX,
        bounds.maxY - bounds.minY
    );
}
```

### 1.3 Type Definitions

**Location:** `src/types/grid.ts`

- `GridConfig` interface includes `canvasBackgroundColor: string`
- No `canvasOpacity` property exists
- `SettingsLocks` includes `canvasBackgroundColor: boolean` but no `canvasOpacity`

### 1.4 UI Structure

**Location:** `src/components/CanvasSettingsPanel.tsx`

**Current Control Order:**

**Canvas section:**

- Background color picker with lock button
- No opacity control

**Points section:**

- Color picker
- Size (range slider)
- Opacity (range slider) - currently after Size

**Lines section:**

- Color picker
- Style (select dropdown)
- Curvature (conditional, for solid style)
- Segmented texture settings (conditional, for segmented style)
- Frequency (range slider)
- Width (range slider)
- Opacity (range slider) - currently at the end

**Fill section:**

- Color picker
- Frequency (range slider)
- Opacity (range slider) - currently after Frequency
- Blend Mode (select dropdown)

**Target Control Order (after implementation):**

All sections should have opacity controls immediately after their color pickers:

**Canvas section:**

- Background color picker with lock button
- **Opacity (range slider)** - NEW, immediately after color

**Points section:**

- Color picker
- **Opacity (range slider)** - MOVED to immediately after color
- Size (range slider)

**Lines section:**

- Color picker
- **Opacity (range slider)** - MOVED to immediately after color
- Style (select dropdown)
- Curvature (conditional, for solid style)
- Segmented texture settings (conditional, for segmented style)
- Frequency (range slider)
- Width (range slider)

**Fill section:**

- Color picker
- **Opacity (range slider)** - MOVED to immediately after color
- Frequency (range slider)
- Blend Mode (select dropdown)

---

## 2. Requirements

### 2.1 Functional Requirements

1. **Add Canvas Opacity Setting:**

   - Range: 0-1 internally, 0-100% in UI
   - Default value: 1.0 (100% opaque)
   - Control should be placed in the Canvas section of the settings panel
   - **Must be positioned immediately after the background color picker**
   - Should use the same range slider pattern as other opacity controls

2. **Reorder Existing Opacity Controls:**

   - Move Points opacity control to immediately after the point color picker
   - Move Lines opacity control to immediately after the line color picker
   - Move Fill opacity control to immediately after the fill color picker
   - This creates a consistent pattern across all sections: Color → Opacity → Other controls

3. **Rendering Behavior:**

   - When `canvasOpacity` is 0, the background should be fully transparent
   - When `canvasOpacity` is 1, the background should be fully opaque
   - Opacity should be applied to the entire background rectangle

4. **Integration Points:**
   - Must be included in state management and persistence
   - Must be included in config export/import
   - Must be included in shuffle functionality
   - Must support lock/unlock functionality
   - Must be included in state hash generation

### 2.2 Non-Functional Requirements

1. **Consistency:**

   - Follow the same pattern as existing opacity controls (points, lines, fill)
   - Use the same UI components and styling
   - Maintain consistent behavior across the application
   - **All opacity controls must be positioned immediately after their respective color pickers** to create a unified UI pattern across Canvas, Points, Lines, and Fill sections

2. **Backward Compatibility:**
   - Existing configurations without `canvasOpacity` should default to 1.0
   - Import of old configs should handle missing `canvasOpacity` gracefully

---

## 3. Implementation Plan

### 3.1 Type Definitions

**File:** `src/types/grid.ts`

**Changes:**

1. Add `canvasOpacity: number` to `GridConfig` interface

   - Type: `number` (0-1 range)
   - Comment: `// 0-1: canvas background transparency`

2. Add `canvasOpacity: boolean` to `SettingsLocks` interface
   - Type: `boolean` (true = locked, false = unlocked)

### 3.2 State Management

**File:** `src/state/app-store.ts`

**Changes:**

1. Update `defaultGridConfig`:

   ```typescript
   canvasOpacity: 1.0, // Default to fully opaque
   ```

2. Update `defaultSettingsLocks`:

   ```typescript
   canvasOpacity: false, // Default to unlocked
   ```

3. Update `shuffleSettings()` function:
   - Add canvas opacity to randomized settings
   - Respect the lock when `settingsLocks.canvasOpacity` is true
   - Randomize between 0 and 1 when unlocked

### 3.3 Rendering

**File:** `src/core/canvas-renderer.ts`

**Changes:**

1. Update `renderBackground()` method:
   - Apply `ctx.globalAlpha = config.canvasOpacity` before drawing
   - Reset `ctx.globalAlpha = 1` after drawing
   - Only render if `config.canvasOpacity > 0`

### 3.4 UI Components

**File:** `src/components/CanvasSettingsPanel.tsx`

**Changes:**

1. **Add opacity control to Canvas section** (immediately after background color picker):

   - Range slider (0-100%)
   - Display showing percentage
   - Lock button

2. **Move existing opacity controls** to immediately after their color pickers:

   - **Points section:** Move opacity control from after Size to immediately after Color picker
   - **Lines section:** Move opacity control from end of section to immediately after Color picker
   - **Fill section:** Move opacity control from after Frequency to immediately after Color picker

3. Follow the exact same pattern for all opacity controls:
   ```tsx
   <div className="form-group">
     <div className="form-group-row">
       <div className="form-range-container">
         <input
           type="range"
           min="0"
           max="100"
           value={gridConfig.canvasOpacity * 100}
           onChange={(e) =>
             setGridConfig({ canvasOpacity: parseInt(e.target.value) / 100 })
           }
           className="form-range"
         />
         <div className="form-range-display">
           <span className="form-range-label">
             Opacity: {Math.round(gridConfig.canvasOpacity * 100)}%
           </span>
         </div>
       </div>
       <LockButton
         settingKey="canvasOpacity"
         locked={settingsLocks.canvasOpacity}
       />
     </div>
   </div>
   ```

### 3.5 Configuration Management

**File:** `src/core/config-manager.ts`

**Changes:**

1. Update `mapGridConfigToSettings()`:

   - Add `opacity: config.canvasOpacity` to `canvas` object in returned `GridSettings`

2. Update `mapSettingsToGridConfig()`:

   - Extract `canvasOpacity` from `settings.canvas.opacity` if present
   - Default to `1.0` if not present (backward compatibility)
   - Clamp value between 0 and 1: `Math.max(0, Math.min(1, settings.canvas.opacity ?? 1.0))`

3. Update `GridSettings` interface import/usage:
   - Update `canvas` object in `GridSettings` to include `opacity: number`

### 3.6 Export Functionality

**File:** `src/core/export-manager.ts`

**Changes:**

1. Update `exportSVG()` method:
   - Apply opacity to background rectangle:
     ```typescript
     if (gridConfig.canvasOpacity > 0) {
       background.setAttribute("fill", gridConfig.canvasBackgroundColor);
       background.setAttribute("opacity", gridConfig.canvasOpacity.toString());
       svg.appendChild(background);
     }
     ```
   - Only add background if `canvasOpacity > 0`

**Note:** PNG export uses the canvas renderer directly, so no changes needed there.

### 3.7 State Hash Generation

**File:** `src/utils/state-hash.ts`

**Changes:**

1. Update `generateStateHash()` function:
   - Add `canvasOpacity: gridConfig.canvasOpacity` to the state object in the grid section

### 3.8 Type Exports

**File:** `src/types/config.ts`

**Changes:**

1. Update `GridSettings` interface:
   - Modify `canvas` object to include `opacity: number`:
     ```typescript
     canvas: {
       backgroundColor: string;
       opacity: number;
     }
     ```

---

## 4. Implementation Steps

### Step 1: Type Definitions

1. Update `GridConfig` in `src/types/grid.ts`
2. Update `SettingsLocks` in `src/types/grid.ts`
3. Update `GridSettings` in `src/types/config.ts`

### Step 2: State Management

1. Add default value to `defaultGridConfig`
2. Add lock default to `defaultSettingsLocks`
3. Update `shuffleSettings()` to handle canvas opacity

### Step 3: Rendering

1. Update `renderBackground()` to apply opacity

### Step 4: UI

1. Add opacity control to Canvas section in `CanvasSettingsPanel.tsx` (immediately after background color picker)
2. Move Points opacity control to immediately after point color picker
3. Move Lines opacity control to immediately after line color picker
4. Move Fill opacity control to immediately after fill color picker

### Step 5: Configuration Management

1. Update `mapGridConfigToSettings()` to export opacity
2. Update `mapSettingsToGridConfig()` to import opacity with backward compatibility

### Step 6: Export

1. Update `exportSVG()` to include opacity in background element

### Step 7: State Hash

1. Update `generateStateHash()` to include canvas opacity

---

## 5. Testing Considerations

### 5.1 Functional Testing

1. **UI Interaction:**

   - Verify opacity slider works and updates display
   - Verify lock button toggles correctly
   - Verify opacity value persists across page refresh

2. **Rendering:**

   - Verify background is fully opaque at 100%
   - Verify background is fully transparent at 0%
   - Verify intermediate values render correctly
   - Verify background still renders when opacity > 0

3. **Shuffle:**

   - Verify canvas opacity is randomized when unlocked
   - Verify canvas opacity is preserved when locked
   - Verify shuffle respects opacity lock

4. **Export/Import:**

   - Verify exported config includes `canvas.opacity`
   - Verify imported config with opacity works correctly
   - Verify imported config without opacity defaults to 1.0 (backward compatibility)

5. **SVG Export:**
   - Verify SVG includes opacity attribute on background
   - Verify SVG doesn't include background when opacity is 0

### 5.2 Edge Cases

1. **Zero Opacity:**

   - Background should not render when opacity is 0
   - Should not interfere with other rendering layers

2. **Backward Compatibility:**

   - Old configs without opacity should load with 1.0 default
   - Should not cause errors or warnings

3. **State Persistence:**
   - Lock state should persist in localStorage
   - Opacity value should persist in state

---

## 6. Dependencies

### 6.1 Existing Dependencies

- `LockButton` component - Already exists and used in other opacity controls
- Range slider styles - Already defined in `forms.css`
- State management - Already handles opacity for points, lines, fill

### 6.2 No New Dependencies Required

All functionality can be implemented using existing patterns and components.

---

## 7. Risk Assessment

### 7.1 Low Risk Areas

- Type definitions (straightforward additions)
- State management (following existing patterns)
- UI implementation (copying existing opacity control pattern)

### 7.2 Medium Risk Areas

- Rendering changes (need to ensure opacity doesn't affect other layers)
- Export/import (need to ensure backward compatibility)

### 7.3 Mitigation Strategies

- Follow exact same patterns as existing opacity implementations
- Test thoroughly with edge cases (0, 1, intermediate values)
- Verify backward compatibility with existing configs
- Test SVG export with various opacity values

---

## 8. Success Criteria

1. ✅ Canvas opacity control appears in Canvas section of settings panel
2. ✅ Canvas opacity control is positioned immediately after background color picker
3. ✅ Points opacity control is positioned immediately after point color picker
4. ✅ Lines opacity control is positioned immediately after line color picker
5. ✅ Fill opacity control is positioned immediately after fill color picker
6. ✅ Opacity slider controls background transparency (0-100%)
7. ✅ Lock button works and persists state
8. ✅ Background renders with correct opacity
9. ✅ Shuffle respects opacity lock
10. ✅ Config export includes canvas opacity
11. ✅ Config import handles opacity (with backward compatibility)
12. ✅ SVG export includes opacity attribute
13. ✅ State hash includes canvas opacity
14. ✅ No breaking changes to existing functionality

---

## 9. Future Considerations

Potential enhancements (not in scope):

- Separate opacity controls for different canvas layers (if multi-layer canvas is added)
- Animation/transition effects for opacity changes
- Preset opacity values or quick-access buttons

---

## 10. References

### 10.1 Existing Opacity Implementations

**Current Locations (to be moved):**

- Point opacity: `src/components/CanvasSettingsPanel.tsx` lines 227-247 (currently after Size)
- Line opacity: `src/components/CanvasSettingsPanel.tsx` lines 478-498 (currently at end of Lines section)
- Fill opacity: `src/components/CanvasSettingsPanel.tsx` lines 560-580 (currently after Frequency)

**Target Locations (after implementation):**

- Canvas opacity: Immediately after background color picker (Canvas section)
- Point opacity: Immediately after point color picker (Points section)
- Line opacity: Immediately after line color picker (Lines section)
- Fill opacity: Immediately after fill color picker (Fill section)

### 10.2 Related Files

- Type definitions: `src/types/grid.ts`, `src/types/config.ts`
- State management: `src/state/app-store.ts`
- Rendering: `src/core/canvas-renderer.ts`
- UI: `src/components/CanvasSettingsPanel.tsx`
- Config management: `src/core/config-manager.ts`
- Export: `src/core/export-manager.ts`
- State hash: `src/utils/state-hash.ts`

---

**End of Planning Document**
