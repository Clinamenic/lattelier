# Settings Lock/Unlock and Selective Shuffle Implementation Plan

**Date:** 2025-01-XX  
**Status:** Planning Document  
**Version:** 1.0

---

## Executive Summary

This document outlines the implementation of a lock/unlock system for individual settings in the Lattelier application. Each setting will have a lock button that prevents it from being randomized during shuffle operations. The shuffle feature will be updated to respect these locks, only randomizing unlocked settings. Additionally, wells (distortion settings) will have a master lock/unlock button that controls whether any well-related settings can be shuffled.

---

## 1. Current State Analysis

### 1.1 Current Shuffle Behavior

**Location:** `src/state/app-store.ts` - `shuffleSettings()` function

**Current Implementation:**

- Randomizes all visual settings (colors, opacity, sizes, frequencies, textures, etc.)
- Randomizes well configuration (count, positions, properties)
- **Always preserves:** rows and columns (grid dimensions)
- Regenerates grids and adjusts viewport after shuffle

**Settings Currently Randomized:**

- Grid type (square/triangular)
- Spacing
- Point size, opacity, color
- Line width, frequency, curvature, opacity, color, texture, segmented settings
- Fill frequency, opacity, color, blend mode
- Canvas background color
- Well count (0-8), positions, properties, global strength

**Settings Always Preserved:**

- Rows
- Columns

### 1.2 Settings UI Structure

**Canvas Settings Panel** (`src/components/CanvasSettingsPanel.tsx`):

- Organized into sections: Canvas, Grid, Points, Lines, Fill
- Uses form components: color pickers, range sliders, select dropdowns
- Each setting is in a `.form-group` container

**Distortion Panel** (`src/components/DistortionPanel.tsx`):

- Wells section with hide/show and clear all buttons
- Individual well properties when a well is selected
- Well list with enable/disable checkboxes

### 1.3 State Management

**Store Structure** (`src/state/app-store.ts`):

- `gridConfig: GridConfig` - All grid and visual settings
- `deformation: DeformationConfig` - Wells and global strength
- Individual settings accessed via `useAppStore` hooks

**Type Definitions:**

- `GridConfig` interface (`src/types/grid.ts`) - Defines all grid-related settings
- `DeformationConfig` interface (`src/types/attractor.ts`) - Defines well configuration
- `Well` interface - Individual well properties

---

## 2. Requirements

### 2.1 Individual Setting Locks

1. **Lock Button Placement:**

   - Each form control (input, select, range, color picker) should have a lock button to its right
   - Button should be clearly visible but not intrusive
   - Button should toggle between locked/unlocked states with visual feedback

2. **Settings Requiring Locks:**

   - **Canvas:** Background color
   - **Grid:** Type, rows, columns, spacing
   - **Points:** Color, size, opacity
   - **Lines:** Color, texture, curvature (solid), angle/spacing/length variation (segmented), frequency, width, opacity
   - **Fill:** Color, frequency, opacity, blend mode

3. **Lock State Persistence:**
   - Lock states should be stored in the application state
   - Should persist across page refreshes (localStorage)
   - Should be included in config export/import

### 2.2 Shuffle Behavior Changes

1. **Selective Randomization:**

   - Only randomize settings that are unlocked
   - Preserve current values for locked settings
   - Respect individual setting locks

2. **Row/Column Default Behavior:**
   - Remove hardcoded preservation of rows/columns
   - Users must manually lock rows/columns if they want them preserved
   - By default, rows/columns should be unlocked (can be shuffled)

### 2.3 Wells Master Lock

1. **Lock Button Placement:**

   - Add lock/unlock button to the wells section header
   - Place it next to the existing hide/show and clear all buttons
   - Controls whether any well-related settings can be shuffled

2. **Wells Lock Behavior:**

   - When locked: shuffle preserves current wells (count, positions, properties)
   - When unlocked: shuffle can randomize well count, positions, and all well properties
   - Individual well settings (when editing) don't need individual locks - master lock covers all

3. **Global Strength:**
   - Should be included in the wells master lock scope
   - When wells are locked, global strength is preserved
   - When wells are unlocked, global strength can be randomized

---

## 3. Implementation Architecture

### 3.1 State Management Changes

#### 3.1.1 New State Structure

**Add to `AppState` interface:**

```typescript
interface SettingsLocks {
  // Canvas settings
  canvasBackgroundColor: boolean; // true = locked, false = unlocked

  // Grid settings
  gridType: boolean;
  rows: boolean;
  columns: boolean;
  spacing: boolean;

  // Points settings
  pointColor: boolean;
  pointSize: boolean;
  pointOpacity: boolean;

  // Lines settings
  lineColor: boolean;
  lineTexture: boolean;
  lineCurvature: boolean;
  segmentedTextureSettings: {
    angleVariation: boolean;
    spacingVariation: boolean;
    lengthVariation: boolean;
  };
  lineFrequency: boolean;
  lineWidth: boolean;
  lineOpacity: boolean;

  // Fill settings
  fillColor: boolean;
  fillFrequency: boolean;
  fillOpacity: boolean;
  blendMode: boolean;
}

interface AppState {
  // ... existing properties
  settingsLocks: SettingsLocks;
  wellsLocked: boolean; // Master lock for all wells settings
  // ... actions
  toggleSettingLock: (settingKey: keyof SettingsLocks | string) => void;
  setWellsLocked: (locked: boolean) => void;
}
```

#### 3.1.2 Default Lock State

**Default Behavior:**

- All settings start **unlocked** (can be shuffled)
- Users must explicitly lock settings they want preserved
- Rows and columns are unlocked by default (breaking change from current behavior)
- Wells are unlocked by default

**Default `SettingsLocks` object:**

```typescript
const defaultSettingsLocks: SettingsLocks = {
  canvasBackgroundColor: false,
  gridType: false,
  rows: false,
  columns: false,
  spacing: false,
  pointColor: false,
  pointSize: false,
  pointOpacity: false,
  lineColor: false,
  lineTexture: false,
  lineCurvature: false,
  segmentedTextureSettings: {
    angleVariation: false,
    spacingVariation: false,
    lengthVariation: false,
  },
  lineFrequency: false,
  lineWidth: false,
  lineOpacity: false,
  fillColor: false,
  fillFrequency: false,
  fillOpacity: false,
  blendMode: false,
};

const defaultWellsLocked = false;
```

#### 3.1.3 State Actions

**Add to store:**

```typescript
toggleSettingLock: (settingKey: string) => {
  set((state) => {
    // Handle nested keys (e.g., "segmentedTextureSettings.angleVariation")
    if (settingKey.includes('.')) {
      const [parent, child] = settingKey.split('.');
      return {
        settingsLocks: {
          ...state.settingsLocks,
          [parent]: {
            ...(state.settingsLocks[parent] as any),
            [child]: !(state.settingsLocks[parent] as any)[child],
          },
        },
      };
    }

    return {
      settingsLocks: {
        ...state.settingsLocks,
        [settingKey]: !state.settingsLocks[settingKey],
      },
    };
  });

  // Persist to localStorage
  const newState = get().settingsLocks;
  localStorage.setItem('settingsLocks', JSON.stringify(newState));
},

setWellsLocked: (locked: boolean) => {
  set({ wellsLocked: locked });
  localStorage.setItem('wellsLocked', JSON.stringify(locked));
},
```

#### 3.1.4 State Initialization

**Load from localStorage on store initialization:**

```typescript
const loadSettingsLocks = (): SettingsLocks => {
  try {
    const stored = localStorage.getItem("settingsLocks");
    if (stored) {
      return { ...defaultSettingsLocks, ...JSON.parse(stored) };
    }
  } catch {
    // Ignore errors
  }
  return defaultSettingsLocks;
};

const loadWellsLocked = (): boolean => {
  try {
    const stored = localStorage.getItem("wellsLocked");
    return stored !== null ? JSON.parse(stored) : defaultWellsLocked;
  } catch {
    return defaultWellsLocked;
  }
};
```

### 3.2 Shuffle Function Updates

#### 3.2.1 Updated Shuffle Logic

**Modify `shuffleSettings()` in `app-store.ts`:**

```typescript
shuffleSettings: () => {
  const { gridConfig, settingsLocks, wellsLocked } = get();

  // Helper functions (existing)
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min;
  const randomChoice = <T>(choices: T[]): T => choices[Math.floor(Math.random() * choices.length)];
  const randomHexColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

  // Randomize texture type only if unlocked
  const randomTexture = settingsLocks.lineTexture
    ? gridConfig.lineTexture
    : randomChoice(['solid', 'segmented'] as const);

  // Generate new grid config - respect locks
  const newGridConfig: GridConfig = {
    ...gridConfig,
    // Only randomize if unlocked
    gridType: settingsLocks.gridType ? gridConfig.gridType : randomChoice(['square', 'triangular']),
    rows: settingsLocks.rows ? gridConfig.rows : randomInt(5, 200),
    columns: settingsLocks.columns ? gridConfig.columns : randomInt(5, 200),
    spacing: settingsLocks.spacing ? gridConfig.spacing : randomInt(5, 100),
    pointSize: settingsLocks.pointSize ? gridConfig.pointSize : randomFloat(0.5, 5),
    pointOpacity: settingsLocks.pointOpacity ? gridConfig.pointOpacity : randomFloat(0, 1),
    lineWidth: settingsLocks.lineWidth ? gridConfig.lineWidth : randomFloat(0.5, 10),
    lineFrequency: settingsLocks.lineFrequency ? gridConfig.lineFrequency : randomFloat(0, 1),
    lineCurvature: settingsLocks.lineCurvature
      ? gridConfig.lineCurvature
      : (randomTexture === 'solid' ? randomFloat(-1, 1) : gridConfig.lineCurvature),
    lineOpacity: settingsLocks.lineOpacity ? gridConfig.lineOpacity : randomFloat(0, 1),
    lineTexture: randomTexture,
    segmentedTextureSettings: randomTexture === 'segmented' && !settingsLocks.segmentedTextureSettings
      ? {
          angleVariation: settingsLocks.segmentedTextureSettings.angleVariation
            ? gridConfig.segmentedTextureSettings?.angleVariation ?? 1.0
            : randomFloat(0, 1),
          spacingVariation: settingsLocks.segmentedTextureSettings.spacingVariation
            ? gridConfig.segmentedTextureSettings?.spacingVariation ?? 0.5
            : randomFloat(0, 1),
          lengthVariation: settingsLocks.segmentedTextureSettings.lengthVariation
            ? gridConfig.segmentedTextureSettings?.lengthVariation ?? 1.0
            : randomFloat(0, 1),
        }
      : gridConfig.segmentedTextureSettings,
    fillFrequency: settingsLocks.fillFrequency ? gridConfig.fillFrequency : randomFloat(0, 1),
    fillOpacity: settingsLocks.fillOpacity ? gridConfig.fillOpacity : randomFloat(0, 1),
    pointColor: settingsLocks.pointColor ? gridConfig.pointColor : randomHexColor(),
    lineColor: settingsLocks.lineColor ? gridConfig.lineColor : randomHexColor(),
    fillColor: settingsLocks.fillColor ? gridConfig.fillColor : randomHexColor(),
    canvasBackgroundColor: settingsLocks.canvasBackgroundColor
      ? gridConfig.canvasBackgroundColor
      : randomHexColor(),
    blendMode: settingsLocks.blendMode ? gridConfig.blendMode : randomChoice(['normal', 'multiply', 'screen', 'overlay']),
  };

  // Handle wells randomization
  let newWells: Well[] = [];
  let newGlobalStrength = gridConfig.deformation?.globalStrength ?? 1;

  if (!wellsLocked) {
    // Randomize wells
    const wellCount = randomInt(0, 8);
    // ... existing well generation logic
    newGlobalStrength = randomFloat(0.5, 2.0);
  } else {
    // Preserve existing wells
    newWells = get().deformation.wells;
    newGlobalStrength = get().deformation.globalStrength;
  }

  // Apply changes
  set({
    gridConfig: newGridConfig,
    deformation: {
      wells: newWells,
      globalStrength: newGlobalStrength,
    },
    selectedWellId: null,
  });

  get().regenerateGrid();
  get().adjustViewportToFit();
},
```

### 3.3 UI Components

#### 3.3.1 Lock Icon Components

**Add to `src/components/icons.tsx`:**

```typescript
export const LockIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const UnlockIcon: React.FC<IconProps> = ({
  className = "",
  size = 16,
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 8.13-3.13" />
    <path d="M15 11h1" />
  </svg>
);
```

#### 3.3.2 Lock Button Component

**Create `src/components/LockButton.tsx`:**

```typescript
import { LockIcon, UnlockIcon } from "./icons";
import { useAppStore } from "../state/app-store";

interface LockButtonProps {
  settingKey: string;
  locked: boolean;
  className?: string;
}

export function LockButton({
  settingKey,
  locked,
  className = "",
}: LockButtonProps) {
  const toggleSettingLock = useAppStore((state) => state.toggleSettingLock);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleSettingLock(settingKey);
      }}
      className={`btn btn-icon-only btn-lock ${
        locked ? "btn-locked" : ""
      } ${className}`}
      title={locked ? "Unlock (allow shuffle)" : "Lock (preserve on shuffle)"}
      aria-label={locked ? "Unlock" : "Lock"}
    >
      {locked ? (
        <LockIcon className="icon" size={14} />
      ) : (
        <UnlockIcon className="icon" size={14} />
      )}
    </button>
  );
}
```

#### 3.3.3 Canvas Settings Panel Updates

**Modify `src/components/CanvasSettingsPanel.tsx`:**

Add lock buttons to each form group:

```typescript
// Example: Canvas Background Color
<div className="form-group">
  <div className="form-group-row">
    <div className="color-picker-container" style={{ flex: 1 }}>
      {/* existing color picker */}
    </div>
    <LockButton
      settingKey="canvasBackgroundColor"
      locked={settingsLocks.canvasBackgroundColor}
    />
  </div>
</div>

// Example: Range Input (Rows)
<div className="form-group">
  <div className="form-group-row">
    <div className="form-range-container" style={{ flex: 1 }}>
      {/* existing range input */}
    </div>
    <LockButton
      settingKey="rows"
      locked={settingsLocks.rows}
    />
  </div>
</div>

// Example: Select (Grid Type)
<div className="form-group">
  <div className="form-group-row">
    <select className="form-select" style={{ flex: 1 }}>
      {/* existing select */}
    </select>
    <LockButton
      settingKey="gridType"
      locked={settingsLocks.gridType}
    />
  </div>
</div>
```

**Handle nested settings (segmented texture):**

```typescript
{
  gridConfig.lineTexture === "segmented" && (
    <>
      <div className="form-group">
        <div className="form-group-row">
          <div className="form-range-container" style={{ flex: 1 }}>
            {/* angle variation input */}
          </div>
          <LockButton
            settingKey="segmentedTextureSettings.angleVariation"
            locked={settingsLocks.segmentedTextureSettings.angleVariation}
          />
        </div>
      </div>
      {/* Similar for spacing and length variation */}
    </>
  );
}
```

#### 3.3.4 Distortion Panel Updates

**Modify `src/components/DistortionPanel.tsx`:**

Add master lock button to wells section header:

```typescript
<div className="controls-title-row">
  <h4 className="controls-title">All Wells ({wells.length})</h4>
  <div className="controls-title-actions">
    <button
      onClick={() => setWellsLocked(!wellsLocked)}
      className={`btn btn-icon-only ${wellsLocked ? "btn-locked" : ""}`}
      title={
        wellsLocked
          ? "Unlock Wells (allow shuffle)"
          : "Lock Wells (preserve on shuffle)"
      }
      aria-label={wellsLocked ? "Unlock Wells" : "Lock Wells"}
    >
      {wellsLocked ? (
        <LockIcon className="icon" size={16} />
      ) : (
        <UnlockIcon className="icon" size={16} />
      )}
    </button>
    {/* Existing hide/show and clear buttons */}
  </div>
</div>
```

### 3.4 CSS Styling

#### 3.4.1 Form Group Row Layout

**Add to `src/styles/components/forms.css`:**

```css
/* Form group with inline lock button */
.form-group-row {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.form-group-row .form-range-container,
.form-group-row .color-picker-container,
.form-group-row .form-select,
.form-group-row .form-input {
  flex: 1;
}

/* Lock button styling */
.btn-lock {
  flex-shrink: 0;
  width: var(--pill-height);
  height: var(--pill-height);
  opacity: 0.7;
  transition: opacity var(--transition), color var(--transition);
}

.btn-lock:hover {
  opacity: 1;
}

.btn-lock.btn-locked {
  opacity: 1;
  color: var(--color-primary);
}

.btn-lock.btn-locked:hover {
  color: var(--color-primary-dark);
}
```

#### 3.4.2 Control Title Actions Layout

**Ensure `controls-title-actions` in `src/styles/components/panels.css` or similar handles multiple buttons:**

```css
.controls-title-actions {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}
```

### 3.5 Configuration Export/Import

#### 3.5.1 Export Lock States

**Update `src/core/config-manager.ts`:**

Add lock states to export:

```typescript
exportConfig(
  gridConfig: GridConfig,
  deformation: DeformationConfig,
  viewport: Viewport,
  settingsLocks: SettingsLocks,
  wellsLocked: boolean,
  metadata: Partial<ConfigMetadata> = {}
): GridPincherConfig {
  return {
    // ... existing config
    locks: {
      settings: settingsLocks,
      wells: wellsLocked,
    },
  };
}
```

#### 3.5.2 Import Lock States

**Update import logic:**

```typescript
importConfiguration: (config, mode, configManager) => {
  // ... existing import logic

  // Restore lock states if present
  if (config.locks) {
    set({
      settingsLocks: { ...defaultSettingsLocks, ...config.locks.settings },
      wellsLocked: config.locks.wells ?? false,
    });

    // Persist to localStorage
    localStorage.setItem('settingsLocks', JSON.stringify(config.locks.settings));
    localStorage.setItem('wellsLocked', JSON.stringify(config.locks.wells));
  }
},
```

#### 3.5.3 Type Definitions

**Update `src/types/config.ts`:**

```typescript
export interface SettingsLocksConfig {
  settings: SettingsLocks;
  wells: boolean;
}

export interface GridPincherConfig {
  version: string;
  metadata: ConfigMetadata;
  grid: GridSettings;
  distortion: DistortionSettings;
  viewport?: ViewportConfig;
  locks?: SettingsLocksConfig; // Optional for backward compatibility
}
```

---

## 4. Implementation Steps

### Phase 1: State Management Foundation

1. ✅ Define `SettingsLocks` interface and add to `AppState`
2. ✅ Add default lock states (all unlocked)
3. ✅ Implement `toggleSettingLock` and `setWellsLocked` actions
4. ✅ Add localStorage persistence for lock states
5. ✅ Update store initialization to load locks from localStorage

### Phase 2: Shuffle Function Updates

1. ✅ Modify `shuffleSettings()` to respect individual locks
2. ✅ Update wells randomization to respect `wellsLocked` flag
3. ✅ Test that locked settings are preserved correctly
4. ✅ Verify unlocked settings are randomized

### Phase 3: UI Components

1. ✅ Create `LockIcon` and `UnlockIcon` components
2. ✅ Create `LockButton` component
3. ✅ Add CSS for form group rows and lock buttons
4. ✅ Update `CanvasSettingsPanel` to include lock buttons for all settings
5. ✅ Handle nested settings (segmented texture) lock buttons
6. ✅ Update `DistortionPanel` to include wells master lock button

### Phase 4: Configuration Integration

1. ✅ Update config export to include lock states
2. ✅ Update config import to restore lock states
3. ✅ Update type definitions for config format
4. ✅ Ensure backward compatibility (locks optional in config)

### Phase 5: Testing & Refinement

1. ✅ Test all individual setting locks
2. ✅ Test wells master lock
3. ✅ Test shuffle with various lock combinations
4. ✅ Test config export/import with locks
5. ✅ Verify localStorage persistence
6. ✅ Test edge cases (all locked, all unlocked, mixed)

---

## 5. Edge Cases & Considerations

### 5.1 Conditional Settings

- **Segmented Texture Settings:** Only show lock buttons when texture is 'segmented'
- **Curvature:** Only relevant when texture is 'solid' - lock state still applies
- **Solution:** Lock buttons should be conditionally rendered with their parent setting

### 5.2 Default Behavior Change

- **Breaking Change:** Rows/columns are now unlocked by default (previously always preserved)
- **Migration:** Existing users will need to lock rows/columns if they want them preserved
- **Documentation:** Update user guide/help to explain new behavior

### 5.3 Config Compatibility

- **Backward Compatibility:** Config files without lock states should import with all locks unlocked (default)
- **Versioning:** Consider versioning config format if needed for future changes

### 5.4 Nested Lock State Access

- **Segmented Texture:** Need to handle nested object access in toggle function
- **Solution:** Use string path with dot notation (e.g., "segmentedTextureSettings.angleVariation")

### 5.5 Visual Feedback

- **Lock State:** Locked buttons should have clear visual distinction (different color, opacity)
- **Hover States:** Provide clear hover tooltips explaining lock behavior
- **Accessibility:** Ensure lock buttons are keyboard accessible and have ARIA labels

---

## 6. Testing Checklist

### 6.1 Individual Setting Locks

- [ ] Lock/unlock each setting type (color, range, select)
- [ ] Verify locked settings are preserved during shuffle
- [ ] Verify unlocked settings are randomized during shuffle
- [ ] Test nested settings (segmented texture variations)

### 6.2 Wells Master Lock

- [ ] Lock/unlock wells button works
- [ ] When locked, wells are preserved during shuffle
- [ ] When unlocked, wells are randomized during shuffle
- [ ] Global strength respects wells lock

### 6.3 Shuffle Combinations

- [ ] All settings locked - shuffle does nothing
- [ ] All settings unlocked - shuffle randomizes everything (including rows/columns)
- [ ] Mixed locks - only unlocked settings randomize
- [ ] Rows locked, columns unlocked - only columns randomize

### 6.4 Persistence

- [ ] Lock states persist across page refresh
- [ ] Lock states are saved to localStorage
- [ ] Lock states are included in config export
- [ ] Lock states are restored from config import

### 6.5 UI/UX

- [ ] Lock buttons are clearly visible but not intrusive
- [ ] Lock/unlock states are visually distinct
- [ ] Tooltips provide clear explanation
- [ ] Buttons are keyboard accessible
- [ ] Layout works on different screen sizes

---

## 7. Success Criteria

1. ✅ Every setting in Canvas Settings Panel has a lock button
2. ✅ Wells section has a master lock button
3. ✅ Shuffle only randomizes unlocked settings
4. ✅ Lock states persist across page refreshes
5. ✅ Lock states are included in config export/import
6. ✅ Default behavior: all settings unlocked (including rows/columns)
7. ✅ Visual feedback clearly indicates locked/unlocked states
8. ✅ No breaking changes to existing functionality (shuffle still works)

---

## 8. Future Enhancements (Optional)

1. **Bulk Lock/Unlock:** Add buttons to lock/unlock all settings at once
2. **Preset Lock Profiles:** Save and restore common lock configurations
3. **Visual Indicators:** Show lock state in tooltips or labels
4. **Lock Inheritance:** Option to lock all settings in a section at once
5. **Export Lock Presets:** Export/import just lock configurations separately

---

## Appendix A: File Modification Summary

### New Files

- `src/components/LockButton.tsx` - Reusable lock button component

### Modified Files

- `src/state/app-store.ts` - Add lock state, actions, and update shuffle
- `src/components/CanvasSettingsPanel.tsx` - Add lock buttons to all form groups
- `src/components/DistortionPanel.tsx` - Add wells master lock button
- `src/components/icons.tsx` - Add LockIcon and UnlockIcon
- `src/styles/components/forms.css` - Add form-group-row styling
- `src/types/config.ts` - Add SettingsLocksConfig interface
- `src/core/config-manager.ts` - Update export/import to handle locks

### Dependencies

- No new external dependencies required
- Uses existing icon and button patterns
- Compatible with current CSS architecture

---

## Appendix B: Configuration Schema Update

### New Config Structure

```typescript
interface GridPincherConfig {
  version: string;
  metadata: ConfigMetadata;
  grid: GridSettings;
  distortion: DistortionSettings;
  viewport?: ViewportConfig;
  locks?: SettingsLocksConfig; // NEW - Optional for backward compatibility
}

interface SettingsLocksConfig {
  settings: {
    canvasBackgroundColor: boolean;
    gridType: boolean;
    rows: boolean;
    columns: boolean;
    spacing: boolean;
    pointColor: boolean;
    pointSize: boolean;
    pointOpacity: boolean;
    lineColor: boolean;
    lineTexture: boolean;
    lineCurvature: boolean;
    segmentedTextureSettings: {
      angleVariation: boolean;
      spacingVariation: boolean;
      lengthVariation: boolean;
    };
    lineFrequency: boolean;
    lineWidth: boolean;
    lineOpacity: boolean;
    fillColor: boolean;
    fillFrequency: boolean;
    fillOpacity: boolean;
    blendMode: boolean;
  };
  wells: boolean;
}
```

---

**End of Document**
