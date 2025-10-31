# Guide Modal Update Plan

**Created:** 2025-01-14  
**Status:** Planning Phase  
**Target:** Streamline and update the Lattelier guide modal for accuracy and compactness

## Current State Analysis

### Current Guide Modal Structure

- Uses `modal-xl` class (64rem max-width)
- Contains 7 main sections:
  1. Overview ("What is Lattelier?")
  2. Getting Started
  3. Canvas Settings (Left Sidebar) - 5 subsections
  4. Distortion Settings (Right Sidebar) - 2 subsections
  5. Navigation & Controls
  6. Export & Import - 3 subsections
  7. Tips & Tricks

### Issues Identified

#### Accuracy Issues

1. **Grid Types**: Guide mentions "Square, Triangular, or Hexagonal" but app only supports Square and Triangular
2. **Line Styles**: Missing information about segmented texture settings (angle/spacing/length variation)
3. **Missing Features**:
   - Settings lock/unlock functionality (lock buttons on each setting)
   - Wells lock functionality (preserve wells during shuffle)
   - Shuffle functionality (randomize settings)
   - Well visibility toggle
   - Well enable/disable checkboxes
   - Manual position input for wells
   - Export max resolution detection/warnings

#### Structure Issues

1. **Verbose Content**: Too much repetition and explanation
2. **Poor Organization**: Information spread across many sections
3. **Outdated Formatting**: Uses old utility classes like `p-3 rounded` that should use global styles
4. **Missing Compact Presentation**: Could use more efficient information density

#### Styling Issues

1. Uses purpose-specific classes like `p-3 rounded` instead of global styles
2. Inconsistent use of existing component classes
3. Could better leverage existing `settings-section`, `controls-list` patterns

## Proposed Changes

### 1. Restructure Content Organization

**New Structure:**

1. **Quick Start** (condensed from "Getting Started")

   - Brief workflow overview
   - Essential navigation tips

2. **Canvas Settings** (streamlined)

   - Grid configuration
   - Visual layers (Points, Lines, Fill)
   - Canvas background
   - Settings locks (new)

3. **Distortion & Wells** (combined sections)

   - Well placement and manipulation
   - Well properties
   - Wells management (visibility, locks, enable/disable) - new

4. **Tools & Navigation**

   - Pan, zoom, well manipulation
   - Keyboard shortcuts if any

5. **Export & Import** (streamlined)

   - Export formats and resolution detection
   - Configuration save/load

6. **Tips** (condensed bullet points)

### 2. Content Updates

#### Add Missing Features

- Settings locks: Explain lock buttons preserve settings during shuffle
- Wells locks: Explain how to preserve wells during shuffle
- Shuffle: Explain randomize button functionality
- Well management: Visibility toggle, enable/disable, manual position input
- Line styles: Explain solid vs segmented and segmented texture parameters
- Export resolution: Mention max resolution detection and warnings

#### Remove/Update Inaccurate Content

- Remove hexagonal grid reference
- Update grid type list to only Square and Triangular
- Clarify line style options (solid with curvature vs segmented with variations)

#### Condense Existing Content

- Merge similar explanations
- Use bullet points more efficiently
- Remove redundant descriptions
- Focus on actionable information

### 3. Styling Improvements

#### Use Global Styles Only

- Replace `p-3 rounded` with appropriate spacing utilities and border-radius
- Use existing `settings-section` and `settings-section-title` classes
- Use `controls-list` for list formatting
- Leverage existing text utilities (`text-sm`, `text-xs`, `text-secondary`)
- Use `space-y-*` utilities for spacing

#### Improve Information Density

- Use definition lists or compact tables where appropriate
- Group related information
- Use visual hierarchy more effectively

### 4. Compactness Strategy

1. **Combine Related Sections**: Merge overlapping information
2. **Use Tables/Lists**: Replace paragraph text with structured data where possible
3. **Reduce Modal Size**: Consider `modal-lg` instead of `modal-xl` if content fits
4. **Progressive Disclosure**: Could collapse less common features
5. **Remove Redundancy**: Eliminate repeated explanations

## Implementation Plan

### Phase 1: Content Restructure

1. Reorganize sections according to new structure
2. Update all feature descriptions for accuracy
3. Add missing features documentation
4. Remove inaccurate information
5. Condense verbose explanations

### Phase 2: Style Migration

1. Replace purpose-specific classes with global styles
2. Apply consistent spacing and typography
3. Ensure proper use of component classes
4. Test visual hierarchy

### Phase 3: Compactness Optimization

1. Refine information density
2. Optimize section lengths
3. Consider modal size reduction if appropriate
4. Test readability at compact size

## Key Features to Document

### Settings Locks (New)

- Individual setting locks prevent randomization
- Lock icon appears next to each lockable setting
- Persists across sessions via localStorage

### Wells Management (New/Enhanced)

- Visibility toggle: Show/hide well indicators
- Enable/disable: Toggle individual wells
- Wells lock: Preserve all wells during shuffle
- Manual position: Direct X/Y coordinate input

### Shuffle (New)

- Randomizes unlocked settings within grid dimensions
- Respects lock states
- Generates random wells if wells unlocked
- Auto-adjusts viewport to fit result

### Line Styles (Enhanced)

- Solid: Curvature control (-100% to +100%)
- Segmented: Angle, spacing, and length variation controls

### Export (Enhanced)

- Max resolution detection: Shows highest safe PNG resolution
- Resolution warnings: Indicators for problematic exports
- SVG: Unlimited resolution vector export
- File naming: Content hash-based naming

## Success Criteria

1. ✅ All current functionality accurately documented
2. ✅ No purpose-specific styling, only global styles
3. ✅ More compact presentation (reduced verbosity)
4. ✅ Better organization (logical flow)
5. ✅ Improved readability (better information density)
6. ✅ All missing features documented
7. ✅ All inaccuracies removed

## Files to Modify

- `src/components/GuideModal.tsx` - Main component update
- Verify no new CSS needed (use existing global styles only)

## Notes

- Must not introduce any purpose-specific styling
- Must use existing global utility classes and component classes
- Focus on accuracy and compactness
- Maintain accessibility (proper heading hierarchy, readable text)
