# Conditional Settings Pattern Architecture

## 0.6.0 - 2025-10-31

**Segmented Line Texture System**: Introduced modular line texture rendering architecture with extensible texture system. Implemented segmented texture option with conditional settings pattern, allowing users to choose between solid and segmented line textures with style-specific controls. Enhanced export functionality to support segmented textures in both PNG and SVG exports. Added comprehensive architecture documentation for the conditional settings pattern.

### Impacted Components
- **Line Texture System**: New modular architecture (`src/core/line-textures/`) with base texture interface and renderer implementations
- **Canvas Renderer**: Updated to use texture registry system for selecting appropriate renderer
- **Export Manager**: Enhanced to generate segmented lines in SVG exports matching renderer algorithm
- **Settings UI**: Implemented conditional settings pattern in CanvasSettingsPanel with texture selector and style-specific controls
- **Type System**: Extended grid types with LineTexture union and SegmentedTextureSettings interface
- **Configuration**: Updated config manager to handle texture settings in export/import

## Overview

This document describes the architectural pattern for implementing settings with sub-settings (style-specific settings) in the Lattelier application. This pattern allows settings panels to show different controls based on a parent setting selection, creating a clean, context-aware UI.

## Pattern Description

The conditional settings pattern consists of:

1. **Parent Selector**: A main form select that determines which style/variant is active
2. **Style-Specific Settings**: Sub-settings that only appear when their associated parent option is selected
3. **Conditional Rendering**: React conditional rendering (`&&` operator) to show/hide sub-settings
4. **Global Stylings**: Reuse of existing form component classes for consistency

## Example: Line Texture

The line texture setting demonstrates this pattern:

- **Parent Setting**: `lineTexture` (select dropdown with options: 'solid', 'segmented')
- **Sub-Settings**:
  - `solid` → shows `lineCurvature` slider
  - `segmented` → shows `segmentedTextureSettings` (angle, spacing, length variation)

## Implementation Steps

### 1. Type Definitions

Define the parent setting type and optional sub-setting interfaces:

```typescript
// src/types/grid.ts

export type LineTexture = "solid" | "segmented";

export interface SegmentedTextureSettings {
  angleVariation: number;
  spacingVariation: number;
  lengthVariation: number;
}

export interface GridConfig {
  // ... other properties
  lineTexture: LineTexture;
  segmentedTextureSettings?: SegmentedTextureSettings; // Optional
  lineCurvature: number; // Used only when lineTexture === 'solid'
  // ...
}
```

**Key Points:**

- Parent setting type is a union of string literals
- Sub-settings are optional interfaces
- Sub-settings used by only one style are optional in the config

### 2. Default Configuration

Include default values for parent setting and sub-settings:

```typescript
// src/state/app-store.ts

const defaultGridConfig: GridConfig = {
  // ... other defaults
  lineTexture: "solid",
  segmentedTextureSettings: {
    angleVariation: 1.0,
    spacingVariation: 0.5,
    lengthVariation: 1.0,
  },
  lineCurvature: 0,
  // ...
};
```

**Key Points:**

- Always set a default for the parent setting
- Provide defaults for all sub-settings (even if optional)

### 3. UI Implementation

Implement conditional rendering in the settings panel:

```tsx
// src/components/CanvasSettingsPanel.tsx

{
  /* Parent Selector */
}
<div className="form-group">
  <label className="form-label">Texture</label>
  <select
    value={gridConfig.lineTexture}
    onChange={(e) =>
      setGridConfig({
        lineTexture: e.target.value as "solid" | "segmented",
      })
    }
    className="form-select"
  >
    <option value="solid">Solid</option>
    <option value="segmented">Segmented</option>
  </select>
</div>;

{
  /* Style-Specific Settings: Solid */
}
{
  gridConfig.lineTexture === "solid" && (
    <div className="form-group">
      <div className="form-range-container">
        <input
          type="range"
          min="-100"
          max="100"
          value={gridConfig.lineCurvature * 100}
          onChange={(e) =>
            setGridConfig({
              lineCurvature: parseInt(e.target.value) / 100,
            })
          }
          className="form-range"
        />
        <div className="form-range-display">
          <span className="form-range-label">
            Curvature: {Math.round(gridConfig.lineCurvature * 100)}%
          </span>
        </div>
      </div>
      <div className="settings-range-labels">
        <span>Concave</span>
        <span>Straight</span>
        <span>Convex</span>
      </div>
    </div>
  );
}

{
  /* Style-Specific Settings: Segmented */
}
{
  gridConfig.lineTexture === "segmented" && (
    <>
      <div className="form-group">
        <div className="form-range-container">
          <input
            type="range"
            min="0"
            max="100"
            value={
              (gridConfig.segmentedTextureSettings?.angleVariation ?? 1.0) * 100
            }
            onChange={(e) =>
              setGridConfig({
                segmentedTextureSettings: {
                  ...gridConfig.segmentedTextureSettings!,
                  angleVariation: parseInt(e.target.value) / 100,
                },
              })
            }
            className="form-range"
          />
          <div className="form-range-display">
            <span className="form-range-label">
              Angle Var:{" "}
              {Math.round(
                (gridConfig.segmentedTextureSettings?.angleVariation ?? 1.0) *
                  100
              )}
              %
            </span>
          </div>
        </div>
      </div>
      {/* Additional segmented settings... */}
    </>
  );
}
```

**Key Points:**

- Parent selector uses standard `form-group` → `form-label` → `form-select` pattern
- Sub-settings use conditional rendering with `&&` operator
- Multiple sub-settings for one style can be wrapped in `<>` fragment
- Use nullish coalescing (`??`) with default values for optional sub-settings
- When updating nested sub-settings, spread existing values: `{...gridConfig.segmentedTextureSettings!, ...}`

### 4. CSS Classes

All form components use global CSS classes defined in `src/styles/components/forms.css`:

- `form-group`: Container for a form control
- `form-label`: Label for form controls
- `form-select`: Select dropdown styling
- `form-range-container`: Container for range input
- `form-range`: Range input styling
- `form-range-display`: Container for range value display
- `form-range-label`: Label showing current range value
- `settings-range-labels`: Container for range min/max labels (optional)

**Key Points:**

- All styling is handled by global CSS classes
- No inline styles or component-specific styles needed
- Consistent appearance across all settings

### 5. Config Export/Import

Ensure parent setting and sub-settings are handled in config manager:

```typescript
// src/core/config-manager.ts

// Export
mapGridConfigToSettings(config: GridConfig): GridSettings {
    return {
        // ...
        lines: {
            // ...
            texture: config.lineTexture,
            segmentedTextureSettings: config.segmentedTextureSettings,
        },
    };
}

// Import
mapSettingsToGridConfig(settings: GridSettings): GridConfig {
    return {
        // ...
        lineTexture: settings.lines.texture || 'solid', // Default fallback
        segmentedTextureSettings: settings.lines.segmentedTextureSettings || {
            angleVariation: 1.0,
            spacingVariation: 0.5,
            lengthVariation: 1.0,
        },
    };
}
```

**Key Points:**

- Always provide fallback defaults when importing
- Include both parent and sub-settings in export/import

### 6. Shuffle Function (Optional)

If shuffle functionality exists, randomize parent setting and sub-settings:

```typescript
// src/state/app-store.ts

const randomTexture = randomChoice(["solid", "segmented"] as const);

const newGridConfig: GridConfig = {
  // ...
  lineTexture: randomTexture,
  lineCurvature:
    randomTexture === "solid" ? randomFloat(-1, 1) : gridConfig.lineCurvature,
  segmentedTextureSettings:
    randomTexture === "segmented"
      ? {
          angleVariation: randomFloat(0, 1),
          spacingVariation: randomFloat(0, 1),
          lengthVariation: randomFloat(0, 1),
        }
      : gridConfig.segmentedTextureSettings,
  // ...
};
```

**Key Points:**

- Randomly select parent setting
- Only randomize sub-settings for the selected style
- Keep existing sub-settings for unselected styles

## UI Placement Guidelines

1. **Parent Selector**: Place immediately before style-specific settings
2. **Sub-Settings**: Group all sub-settings for each style together
3. **Common Settings**: Place shared settings (like width, opacity) after all style-specific sections

Example structure:

```
Lines Section:
  - Color picker
  - Texture select (parent) ←

  [Conditional: Solid Style]
  - Curvature slider

  [Conditional: Segmented Style]
  - Angle Var slider
  - Spacing Var slider
  - Length Var slider

  - Frequency slider (shared)
  - Width slider (shared)
  - Opacity slider (shared)
```

## Best Practices

### 1. Type Safety

- Always use TypeScript union types for parent settings
- Use optional interfaces for sub-settings
- Provide type assertions in select onChange handlers

### 2. Default Values

- Always provide sensible defaults for sub-settings
- Use nullish coalescing (`??`) when accessing optional sub-settings
- Ensure defaults work correctly when config is imported

### 3. Conditional Rendering

- Use `&&` operator for simple show/hide logic
- Use fragments (`<>...</>`) for multiple sub-settings
- Avoid nested conditionals when possible

### 4. State Updates

- When updating nested sub-settings, always spread existing values
- Use non-null assertion (`!`) only when certain value exists (after conditional check)
- Consider defensive programming: `?? defaultValue`

### 5. CSS Consistency

- Always use global form CSS classes
- Don't create component-specific styles
- Follow existing patterns for form controls

### 6. Code Organization

- Keep related parent/sub-setting logic together
- Comment complex conditional logic
- Group all sub-settings for one style in a single conditional block

## Extending the Pattern

To add a new conditional setting:

1. **Add type definition** in `src/types/grid.ts`

   - Parent setting type (union)
   - Sub-setting interfaces (optional)

2. **Update GridConfig** interface

   - Add parent setting property
   - Add optional sub-setting properties

3. **Update default config** in `src/state/app-store.ts`

   - Add default parent setting value
   - Add default sub-setting values

4. **Add UI** in `src/components/CanvasSettingsPanel.tsx`

   - Add parent selector
   - Add conditional sub-settings for each style

5. **Update config manager** in `src/core/config-manager.ts`

   - Export parent and sub-settings
   - Import with fallback defaults

6. **Update shuffle** (if applicable) in `src/state/app-store.ts`
   - Randomize parent setting
   - Randomize sub-settings for selected style only

## Examples of Future Applications

This pattern can be applied to:

- **Point Style**: 'circle' | 'square' | 'star'

  - `circle` → no sub-settings
  - `square` → `squareRotation` angle
  - `star` → `starPoints` count, `starInnerRadius`

- **Fill Pattern**: 'solid' | 'hatched' | 'gradient'

  - `solid` → no sub-settings
  - `hatched` → `hatchAngle`, `hatchSpacing`
  - `gradient` → `gradientDirection`, `gradientStops`

- **Grid Animation**: 'none' | 'pulse' | 'wave'
  - `none` → no sub-settings
  - `pulse` → `pulseSpeed`, `pulseIntensity`
  - `wave` → `waveSpeed`, `waveAmplitude`, `waveFrequency`

## Summary

The conditional settings pattern provides:

- **Clean UI**: Users only see relevant settings
- **Type Safety**: TypeScript ensures correct usage
- **Consistency**: Global CSS classes maintain visual consistency
- **Extensibility**: Easy to add new styles and sub-settings
- **Maintainability**: Clear separation of concerns

By following this pattern, new conditional settings can be added quickly while maintaining code quality and user experience consistency.
