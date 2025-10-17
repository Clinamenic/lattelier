# UI Restructure Plan - Grid Pincher App

## Overview
Reorganize the sidebar layout to better separate canvas rendering settings from distortion/manipulation settings, with collapsible panels.

## Current State

### Left Sidebar (ControlPanel)
- Grid Settings (type, rows, columns, spacing)
- Display toggles (show points, lines, fill)
- Point size slider
- Line settings (frequency, curvature, width)
- Colors section (point, line, fill colors)
- Opacity slider (global)
- Blend mode selector

### Right Sidebar (PropertiesPanel)
- Tools (Pan/Place Well buttons)
- Well properties (when selected)
- Well list
- Controls/help text

## Proposed New Structure

### Left Sidebar: "Canvas Settings" (Collapsible Left)

**1. Grid Section**
- Grid Type (square/triangular/hexagonal)
- Rows (5-200)
- Columns (5-200)  
- Spacing (5-100)

**2. Points Section**
- Show Points (toggle)
- Point Size (0.5-5) - only when visible
- Point Color - only when visible
- Point Opacity (0-100%) - only when visible

**3. Lines Section**
- Show Lines (toggle)
- Frequency (0-100%) - only when visible
- Curvature (0-100%) - only when visible
- Line Width (0.5-10) - only when visible
- Line Color - only when visible
- Line Opacity (0-100%) - only when visible

**4. Fill Section** (Optional - to discuss)
- Show Fill (toggle)
- Fill Color - only when visible
- Fill Opacity (0-100%) - only when visible
- Blend Mode - only when visible

### Right Sidebar: "Distortion Settings" (Collapsible Right)

**1. Tools Section** (Always visible at top)
- Pan & Navigate button
- Place Well button

**2. Wells Section**
- When no well selected:
  - Instructions/help text
  - List of all wells
- When well selected:
  - Position (X/Y inputs)
  - Strength (-1 to 1)
  - Radius (50-500)
  - Falloff type (linear/quadratic/exponential/smooth)
  - Distortion (0-1)
  - Show Radial Lines (toggle)
  - Enabled (toggle)
  - Delete button
  - Divider
  - List of all wells

## Implementation Tasks

### 1. Create Collapsible Panel Component
- Generic collapsible wrapper
- Collapse left (slides left, shows tab)
- Collapse right (slides right, shows tab)
- Smooth animations
- Persist state in localStorage

### 2. Restructure ControlPanel (Left Sidebar)
- Rename to "CanvasSettingsPanel"
- Add collapsible functionality
- Reorganize into 4 sections (Grid, Points, Lines, Fill)
- Separate opacity per element (remove global opacity)
- Add section headers with dividers

### 3. Restructure PropertiesPanel (Right Sidebar)
- Rename to "DistortionPanel"
- Add collapsible functionality
- Keep Tools section at top (always visible)
- Keep Wells section structure
- Update header text

### 4. Update Layout
- Update main App layout to handle collapsed states
- Ensure canvas expands when sidebars collapse
- Add visual tabs/handles for collapsed panels

## Confirmed Decisions

1. **Fill section**: ✅ Keep as its own section with:
   - Show Fill toggle
   - Fill Frequency (0-100%)
   - Fill Color
   - Fill Opacity (0-100%)
   - Blend Mode

2. **Opacity**: ✅ Per-element opacity:
   - Point Opacity (0-100%)
   - Line Opacity (0-100%)
   - Fill Opacity (0-100%)

3. **Collapse behavior**: ✅ Persist state in localStorage
   - Both panels can be collapsed simultaneously
   - State persists across browser sessions

## Technical Implementation Notes

1. **Collapsible Component Props**:
   ```typescript
   interface CollapsiblePanelProps {
     title: string;
     direction: 'left' | 'right';
     children: React.ReactNode;
     defaultCollapsed?: boolean;
   }
   ```

2. **State Management**:
   - Add `leftSidebarCollapsed` and `rightSidebarCollapsed` to app store
   - Or use local component state with localStorage sync

3. **CSS Approach**:
   - Tailwind classes for transitions
   - Fixed width when expanded (320px?)
   - ~40px tab width when collapsed

## Design Considerations

- Clean section headers with subtle dividers
- Conditional rendering (hide controls when parent toggle is off)
- Consistent spacing and padding
- Smooth transitions (200-300ms)
- Visual feedback for collapse/expand
- Tab should show panel name vertically when collapsed

## Implementation Status: ✅ COMPLETE

All tasks completed:
1. ✅ User confirmed all questions
2. ✅ Created CollapsiblePanel component
3. ✅ Refactored ControlPanel → CanvasSettingsPanel
4. ✅ Refactored PropertiesPanel → DistortionPanel
5. ✅ Updated main layout
6. ✅ Implemented collapse/expand with localStorage persistence
7. ✅ Removed deprecated components

See `ui-restructure-summary.md` for detailed implementation notes.

