# Shuffle Button Implementation Plan
## Lattelier - Randomization Feature

**Date:** January 10, 2025  
**Status:** Planning Document  
**Version:** 1.0

---

## Executive Summary

This document outlines the implementation of a "Shuffle" button that randomizes various settings within the existing grid dimensions (rows/columns) to create new visual variations. The feature will randomize both visual settings and well configurations while preserving the core grid structure.

---

## 1. Feature Overview

### 1.1 Core Concept

The shuffle button will randomize aesthetic and configuration settings while maintaining:
- **Fixed dimensions**: Rows and columns remain unchanged
- **Functional toggles**: Show/hide states remain unchanged
- **Grid structure**: The underlying grid topology stays the same

### 1.2 User Experience

- **Single click**: Instantly generates a new random configuration
- **Preserves work**: Keeps existing grid dimensions and functional settings
- **Visual feedback**: Clear indication that randomization occurred
- **Reversible**: Users can undo or re-shuffle as needed

---

## 2. Settings to Randomize

### 2.1 Visual Settings (Canvas Settings Panel)

#### **Grid Configuration**
- **Grid Type**: Random selection from [square, triangular, hexagonal]
- **Spacing**: Random value between 5-100 (current range)
- **Canvas Background Color**: Random hex color

#### **Points Settings**
- **Point Size**: Random value between 0.5-5 (current range)
- **Point Opacity**: Random value between 0-1 (current range)
- **Point Color**: Random hex color

#### **Lines Settings**
- **Line Frequency**: Random value between 0-1 (current range)
- **Line Curvature**: Random value between 0-1 (current range)
- **Line Width**: Random value between 0.5-10 (current range)
- **Line Opacity**: Random value between 0-1 (current range)
- **Line Color**: Random hex color

#### **Fill Settings**
- **Fill Frequency**: Random value between 0-1 (current range)
- **Fill Opacity**: Random value between 0-1 (current range)
- **Fill Color**: Random hex color
- **Blend Mode**: Random selection from [normal, multiply, screen, overlay]

### 2.2 Well Settings (Distortion Settings)

#### **Well Count & Distribution**
- **Well Count**: Random number between 0-8 wells
- **Well Positions**: Random coordinates within canvas bounds
- **Well Radius**: Random value between 50-500 (current range)
- **Well Strength**: Random value between -1 to 1 (current range)
- **Well Distortion**: Random value between 0-1 (current range)

#### **Well Properties**
- **Falloff Type**: Random selection from [linear, quadratic, exponential, smooth]
- **Enabled State**: Random boolean (80% enabled, 20% disabled)
- **Show Radial Lines**: Random boolean (30% true, 70% false)

#### **Global Settings**
- **Global Strength**: Random value between 0.5-2.0

---

## 3. Settings to Preserve

### 3.1 Grid Dimensions (Fixed)
- **Rows**: Keep current value (5-200)
- **Columns**: Keep current value (5-200)

### 3.2 Functional Toggles (Preserved)
- **Show Points**: Keep current state
- **Show Lines**: Keep current state  
- **Show Fill**: Keep current state
- **Show Wells**: Keep current state

### 3.3 UI State (Preserved)
- **Viewport position/zoom**: Keep current view
- **Selected well**: Clear selection
- **Active tool**: Keep current tool
- **Sidebar states**: Keep collapsed/expanded states

---

## 4. Implementation Plan

### 4.1 Core Shuffle Function

```typescript
interface ShuffleOptions {
  includeVisuals: boolean;    // Randomize colors, opacity, etc.
  includeWells: boolean;      // Randomize well configuration
  wellCountRange: [number, number]; // Min/max wells to generate
  preserveColors: boolean;    // Keep current color scheme
}

const shuffleSettings = (options: ShuffleOptions) => {
  // 1. Clear existing wells if including wells
  // 2. Generate random visual settings
  // 3. Generate random well configuration
  // 4. Apply all changes atomically
  // 5. Regenerate grid and update view
};
```

### 4.2 Random Value Generators

#### **Color Generation**
```typescript
const generateRandomColor = (): string => {
  // Generate aesthetically pleasing colors
  // Avoid pure black/white
  // Consider color harmony
};

const generateColorPalette = (): ColorPalette => {
  // Generate coordinated color scheme
  // Ensure sufficient contrast
  // Consider accessibility
};
```

#### **Well Generation**
```typescript
const generateRandomWells = (count: number, bounds: Bounds): Well[] => {
  // Generate wells within canvas bounds
  // Avoid overlapping wells
  // Distribute evenly across canvas
};
```

### 4.3 UI Implementation

#### **Button Placement**
- **Location**: Toolbar, between "Import Config" and "Download"
- **Style**: Purple button to match export theme
- **Icon**: Shuffle/randomize icon (🔄 or similar)
- **Label**: "Shuffle Settings"

#### **Button States**
- **Default**: "Shuffle Settings"
- **Loading**: "Shuffling..." (brief)
- **Success**: Brief visual feedback

#### **Optional: Shuffle Options Modal**
- Checkboxes for what to randomize:
  - ☑️ Visual settings (colors, opacity, etc.)
  - ☑️ Well configuration
  - ☑️ Grid type and spacing
- Slider for well count range
- "Preserve current colors" option

---

## 5. Technical Implementation

### 5.1 State Management

#### **Add to App Store**
```typescript
interface AppState {
  // ... existing state
  
  // New shuffle action
  shuffleSettings: (options: ShuffleOptions) => void;
}
```

#### **Implementation**
```typescript
shuffleSettings: (options) => {
  const { gridConfig, deformation } = get();
  
  // Generate new settings
  const newGridConfig = generateRandomGridConfig(gridConfig, options);
  const newDeformation = generateRandomDeformation(options);
  
  // Apply atomically
  set({
    gridConfig: newGridConfig,
    deformation: newDeformation,
    selectedWellId: null, // Clear selection
  });
  
  // Regenerate grids
  get().regenerateGrid();
},
```

### 5.2 Randomization Logic

#### **Grid Config Randomization**
```typescript
const generateRandomGridConfig = (
  current: GridConfig, 
  options: ShuffleOptions
): GridConfig => {
  return {
    // Preserve dimensions
    rows: current.rows,
    columns: current.columns,
    
    // Randomize visual settings
    gridType: options.includeVisuals ? randomGridType() : current.gridType,
    spacing: options.includeVisuals ? randomSpacing() : current.spacing,
    pointSize: options.includeVisuals ? randomPointSize() : current.pointSize,
    // ... etc for all visual properties
  };
};
```

#### **Well Generation**
```typescript
const generateRandomWells = (options: ShuffleOptions): Well[] => {
  if (!options.includeWells) return [];
  
  const count = randomInt(options.wellCountRange[0], options.wellCountRange[1]);
  const bounds = calculateCanvasBounds();
  
  return Array.from({ length: count }, () => ({
    id: `well-${Date.now()}-${Math.random()}`,
    position: randomPosition(bounds),
    strength: randomStrength(),
    radius: randomRadius(),
    falloff: randomFalloff(),
    distortion: randomDistortion(),
    enabled: randomBoolean(0.8), // 80% enabled
    showRadialLines: randomBoolean(0.3), // 30% show lines
  }));
};
```

### 5.3 UI Components

#### **Toolbar Integration**
```typescript
// In Toolbar.tsx
<button
  onClick={handleShuffle}
  className="btn btn-purple"
  title="Randomize settings within current dimensions"
>
  🔄 Shuffle Settings
</button>
```

#### **Optional: Shuffle Options Modal**
```typescript
interface ShuffleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShuffle: (options: ShuffleOptions) => void;
}

const ShuffleModal = ({ isOpen, onClose, onShuffle }: ShuffleModalProps) => {
  // Modal with checkboxes and sliders for shuffle options
};
```

---

## 6. User Experience Considerations

### 6.1 Visual Feedback

#### **Animation**
- Brief "shuffling" animation during randomization
- Smooth transition when applying new settings
- Visual indication of what changed

#### **Undo Support**
- Store previous state before shuffling
- "Undo Shuffle" button (optional)
- History of recent shuffles

### 6.2 Accessibility

#### **Keyboard Support**
- Tab navigation to shuffle button
- Enter/Space to activate
- Clear focus indicators

#### **Screen Reader Support**
- Descriptive button labels
- Announce changes after shuffle
- Clear state changes

### 6.3 Performance

#### **Optimization**
- Batch state updates
- Minimize re-renders
- Efficient random generation
- Debounce rapid clicks

---

## 7. Implementation Phases

### 7.1 Phase 1: Basic Shuffle (MVP)
- [ ] Add shuffle button to toolbar
- [ ] Implement basic randomization for visual settings
- [ ] Implement basic well generation
- [ ] Add to app store
- [ ] Basic UI feedback

### 7.2 Phase 2: Enhanced Options
- [ ] Shuffle options modal
- [ ] Granular control over what to randomize
- [ ] Well count range selection
- [ ] Color palette preservation option

### 7.3 Phase 3: Advanced Features
- [ ] Undo shuffle functionality
- [ ] Shuffle history
- [ ] Smart color generation
- [ ] Well distribution algorithms

---

## 8. Testing Strategy

### 8.1 Unit Tests
- Random value generation functions
- Well placement algorithms
- Color generation logic
- State management updates

### 8.2 Integration Tests
- Shuffle button functionality
- State consistency after shuffle
- Grid regeneration
- Well application

### 8.3 User Testing
- Usability of shuffle options
- Visual feedback effectiveness
- Performance with large grids
- Accessibility compliance

---

## 9. Future Enhancements

### 9.1 Advanced Randomization
- **Smart Shuffle**: Avoid obviously bad combinations
- **Theme-based Shuffle**: Randomize within color themes
- **Pattern Shuffle**: Randomize specific pattern elements
- **Export Shuffle**: Save/load shuffle presets

### 9.2 Creative Features
- **Shuffle Animation**: Animate the randomization process
- **Shuffle Preview**: Show preview before applying
- **Batch Shuffle**: Generate multiple variations
- **Shuffle Gallery**: Save interesting results

---

## 10. Success Metrics

### 10.1 User Engagement
- Shuffle button usage frequency
- Time spent exploring variations
- Export rate after shuffling

### 10.2 Quality Metrics
- Visual appeal of shuffled results
- Performance impact
- User satisfaction scores

---

## 11. Conclusion

The shuffle button will provide users with an intuitive way to explore the creative possibilities of Lattelier while maintaining their established grid structure. By randomizing both visual settings and well configurations, users can discover new patterns and combinations they might not have considered manually.

The implementation should prioritize user experience, performance, and accessibility while providing enough flexibility for future enhancements.
