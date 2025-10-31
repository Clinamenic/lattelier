# Wells Settings UI Reorganization

**Date:** 2025-10-31  
**Created:** 2025-10-31T05:16:28Z  
**Status:** Planning Document  
**Version:** 1.0

---

## 1. Overview

Reorganize the wells settings section in the distortion settings sidebar to:

1. Move the wells list to appear at the top
2. Add icon buttons (eye and cancel icons) next to the "All Wells (N)" label
3. Replace text buttons with icon-only buttons using global icon button styling

---

## 2. Baseline Knowledge

### 2.1 Current Structure

**File:** `src/components/DistortionPanel.tsx`

Current layout:

```
Wells Section
├── Wells Control Buttons (tool-buttons div)
│   ├── Show/Hide Wells (text button)
│   └── Clear All (text button)
└── All Wells Section (when wells.length > 0)
    ├── "All Wells (N)" heading
    └── Wells list (ul.wells-list)
```

**Current issues:**

- Control buttons are separate from the wells list
- Buttons use text labels instead of icons
- Wells list appears below controls instead of at top

### 2.2 Key Interfaces and Dependencies

**State Management:**

- `showWells` - boolean state controlling visibility
- `setShowWells` - function to toggle visibility
- `wells` - array of well objects
- `removeWell` - function to remove individual wells
- `handleReset` - function to clear all wells (confirms before clearing)

**Icons:**

- `src/components/icons.tsx` - icon component definitions
- No eye or cancel icons currently exist

**Styling:**

- `.btn-icon-only` - global icon button class (from `src/styles/components/buttons.css`)
- `.controls-title` - heading style for "All Wells (N)"
- `.wells-list` - list container
- `.well-list-item` - individual well item

### 2.3 Required File Modifications

1. **src/components/icons.tsx**

   - Add `EyeOpenIcon` component
   - Add `EyeClosedIcon` component
   - Add `CancelIcon` component (round cancel/X icon)

2. **src/components/DistortionPanel.tsx**

   - Restructure wells section to move list to top
   - Replace text buttons with icon buttons
   - Position icon buttons next to "All Wells (N)" heading
   - Update both instances (when no well selected, when well selected)

3. **src/styles/components/forms.css** (if needed)
   - Add CSS for controls-title with inline buttons layout
   - Ensure icon buttons align properly next to heading

---

## 3. Type Definitions

### 3.1 Icon Components

No new types needed - existing `IconProps` interface from icons.tsx:

```typescript
interface IconProps {
  className?: string;
  size?: number;
}
```

### 3.2 Component Structure

No new TypeScript types required - restructuring is purely presentational.

---

## 4. Implementation Order

### 4.1 Step 1: Create Icon Components

**File:** `src/components/icons.tsx`

Create three new icon components:

1. `EyeOpenIcon` - open eye icon for when wells are visible
2. `EyeClosedIcon` - closed/slashed eye icon for when wells are hidden
3. `CancelIcon` - round cancel/X icon for clear all action

**Design considerations:**

- Follow existing icon style (stroke-based, 2px strokeWidth)
- ViewBox 0 0 24 24 for consistency
- Use `currentColor` for fill/stroke to respect theme

### 4.2 Step 2: Update DistortionPanel Component Structure

**File:** `src/components/DistortionPanel.tsx`

**Changes needed:**

1. Import new icon components
2. Remove `tool-buttons` div section
3. Restructure "All Wells" section:
   - Move wells list to top
   - Create flex container for heading + icon buttons
   - Add eye icon button (conditional: EyeOpenIcon when showWells=true, EyeClosedIcon when false)
   - Add cancel icon button
   - Apply `.btn-icon-only` class and active state as needed

**Layout structure:**

```
Wells Section
└── All Wells Section (when wells.length > 0)
    ├── Header row (flex container)
    │   ├── "All Wells (N)" heading
    │   ├── Eye icon button (toggle showWells)
    │   └── Cancel icon button (clear all)
    └── Wells list (ul.wells-list)
```

**Apply to both locations:**

- Line 65-96: When no well selected
- Line 224-255: When well selected (and wells.length > 1)

### 4.3 Step 3: Style Header Row

**File:** `src/styles/components/forms.css`

Add CSS for controls-title header row with inline buttons:

- Flex container for alignment
- Gap spacing between heading and buttons
- Ensure icon buttons align vertically with heading text

---

## 5. Integration Points

### 5.1 Component Integration

**DistortionPanel.tsx:**

- Import new icons: `EyeOpenIcon`, `EyeClosedIcon`, `CancelIcon`
- Use conditional rendering for eye icon based on `showWells` state
- Maintain existing onClick handlers:
  - Eye button: `onClick={() => setShowWells(!showWells)}`
  - Cancel button: `onClick={handleReset}`

### 5.2 Styling Integration

**buttons.css:**

- `.btn-icon-only` already exists and provides base styling
- `.btn-active` can be used for eye button when `showWells` is true
- No additional button classes needed

**forms.css:**

- Update `.controls-title` or create new class for flex header layout
- Ensure buttons align properly with text

### 5.3 Error Handling

- Maintain existing confirmation dialog for "Clear All" action
- No new error cases introduced

---

## 6. Success Criteria

### 6.1 Functionality

- [ ] Wells list appears at the top of the wells section
- [ ] Eye icon button toggles well visibility correctly
- [ ] Eye icon shows open state when wells are visible, closed when hidden
- [ ] Cancel icon button clears all wells (with confirmation)
- [ ] Both buttons work in both contexts (no well selected, well selected)

### 6.2 Visual Design

- [ ] Icon buttons use global `.btn-icon-only` styling
- [ ] Buttons align properly next to "All Wells (N)" heading
- [ ] Eye button shows active state when wells are visible
- [ ] Icons match design system (stroke-based, proper sizing)
- [ ] Layout is consistent across both instances (no selection vs selection)

### 6.3 Code Quality

- [ ] Icon components follow existing pattern in icons.tsx
- [ ] No duplicate code between the two wells list instances
- [ ] CSS follows existing patterns and design tokens
- [ ] No console errors or warnings

---

## 7. Risk & Rollback

### 7.1 Risks

**Low Risk:**

- Purely presentational changes
- Existing functionality preserved
- Clear user requirement

**Potential Issues:**

- Icon alignment with heading may need fine-tuning
- Icon visibility/contrast on different backgrounds

### 7.2 Rollback Plan

If issues arise:

1. Revert `DistortionPanel.tsx` changes
2. Revert `icons.tsx` additions (or keep icons for future use)
3. Revert `forms.css` changes if any

Git commits are atomic, so rollback is straightforward.

---

## 8. Dependencies

### 8.1 External Dependencies

None - all functionality uses existing React, state management, and CSS.

### 8.2 Internal Dependencies

1. Icons must be created before DistortionPanel updates
2. CSS updates can be done in parallel or after component changes

---

## 9. Implementation Notes

### 9.1 Icon Design Specifications

**EyeOpenIcon:**

- Standard eye shape (oval with curved top)
- ViewBox: 0 0 24 24
- Stroke-based design

**EyeClosedIcon:**

- Eye shape with diagonal slash line
- Or: closed/sleeping eye icon
- ViewBox: 0 0 24 24
- Stroke-based design

**CancelIcon:**

- Round circle with X inside
- ViewBox: 0 0 24 24
- Stroke-based design
- Or: simple X in circle

### 9.2 Layout Considerations

**Header Row:**

- Use flexbox: `display: flex`, `align-items: center`, `gap`
- Heading on left, buttons on right
- Or: heading, then buttons inline

**Button Spacing:**

- Small gap between heading and buttons (var(--space-sm) or var(--space-xs))
- Small gap between the two icon buttons

### 9.3 Accessibility

- Maintain `title` or `aria-label` attributes on icon buttons
- Ensure buttons are keyboard accessible
- Maintain focus states from `.btn-icon-only` styling
