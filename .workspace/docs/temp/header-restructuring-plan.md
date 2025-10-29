# Header Restructuring Plan

## Lattelier - Two-Tier Header System

**Date:** January 22, 2025  
**Status:** Planning Document  
**Version:** 1.0

---

## 1. Overview

This document outlines the restructuring of the current single toolbar into a two-tier header system: a fixed primary navbar for branding and navigation, and a togglable toolbar for action buttons. This separation improves visual hierarchy and provides better space management.

---

## 2. Current State Analysis

### 2.1 Current Toolbar Structure

**Single `.toolbar` container with:**

- **Left side (`.toolbar-left`):**
  - App title ("Lattelier")
  - Version badge
  - Help button (?)
- **Right side (`.toolbar-right`):**
  - Export Config button
  - Import Config button
  - Shuffle button
  - Download dropdown menu

### 2.2 Current Issues

1. **Cramped Layout** - All elements compete for horizontal space
2. **Poor Visual Hierarchy** - Branding and actions mixed together
3. **No Space Management** - No way to hide action buttons when not needed
4. **Mobile Unfriendly** - Single row doesn't work well on smaller screens

---

## 3. Proposed Two-Tier System

### 3.1 Primary Navbar (Fixed Header)

**Purpose:** Branding, navigation, and essential app information
**Height:** 3.5rem (same as current toolbar)
**Position:** Fixed at top, always visible

**Contents:**

- **Left side:**
  - App title ("Lattelier")
  - Version badge
- **Right side:**
  - Help button (?)
  - Toolbar toggle button (hamburger/chevron icon)

### 3.2 Togglable Toolbar (Collapsible Section)

**Purpose:** Action buttons and tools
**Height:** 3rem (slightly smaller than navbar)
**Position:** Below navbar, can be collapsed/expanded
**Default State:** Expanded (user can collapse if desired)

**Contents:**

- Export Config button (icon-only)
- Import Config button (icon-only)
- Shuffle button (icon-only)
- Download dropdown menu (icon-only)

---

## 4. Design Specifications

### 4.1 Visual Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│ Primary Navbar (Fixed)                                  │
│ [Lattelier] [v1.0.0]              [?] [≡]              │
├─────────────────────────────────────────────────────────┤
│ Togglable Toolbar (Collapsible)                        │
│ [📤] [📥] [🔄] [💾]                                     │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Layout Structure

```html
<header className="header">
  <nav className="navbar">
    <div className="navbar-left">
      <h1 className="navbar-title">Lattelier</h1>
      <span className="navbar-version">v1.0.0</span>
    </div>
    <div className="navbar-right">
      <button className="btn btn-icon-only" title="Help">?</button>
      <button className="btn btn-icon-only toolbar-toggle" title="Toggle Toolbar">
        <ChevronDownIcon />
      </button>
    </div>
  </nav>

  <div className={`toolbar ${isToolbarExpanded ? 'toolbar-expanded' : 'toolbar-collapsed'}`}>
    <div className="toolbar-content">
      <button className="btn btn-icon-only" title="Export Config">
        <ExportIcon />
      </button>
      <button className="btn btn-icon-only" title="Import Config">
        <ImportIcon />
      </button>
      <button className="btn btn-icon-only" title="Shuffle Settings">
        <ShuffleIcon />
      </button>
      <div className="dropdown">
        <button className="btn btn-icon-only" title="Download">
          <SaveIcon />
        </button>
        {/* Dropdown menu content */}
      </div>
    </div>
  </div>
</header>
```

### 4.3 CSS Structure

```css
/* Header container */
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-dropdown);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

/* Primary navbar */
.navbar {
  height: 3.5rem;
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.navbar-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
}

.navbar-version {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  background-color: var(--color-gray-100);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-medium);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

/* Togglable toolbar */
.toolbar {
  height: 3rem;
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-gray-50);
  border-bottom: 1px solid var(--color-border);
  transition: all var(--transition);
  overflow: hidden;
}

.toolbar-collapsed {
  height: 0;
  padding: 0;
  border-bottom: none;
}

.toolbar-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.toolbar-toggle {
  transition: transform var(--transition);
}

.toolbar-toggle.expanded {
  transform: rotate(180deg);
}
```

---

## 5. Implementation Plan

### 5.1 Phase 1: Create New Header Structure

1. **Create new header component** - `Header.tsx`
2. **Move navbar content** - Extract branding from current toolbar
3. **Add toolbar toggle** - Implement expand/collapse functionality
4. **Update CSS** - Create new styles for two-tier system

### 5.2 Phase 2: Update Toolbar Component

1. **Refactor Toolbar.tsx** - Remove branding, keep only action buttons
2. **Add toggle state** - Implement expand/collapse logic
3. **Update positioning** - Adjust for new header structure

### 5.3 Phase 3: Update Layout & Spacing

1. **Update main content** - Add top padding to account for header height
2. **Test responsiveness** - Ensure mobile-friendly layout
3. **Update z-index** - Ensure proper layering

---

## 6. State Management

### 6.1 Toolbar Toggle State

```typescript
const [isToolbarExpanded, setIsToolbarExpanded] = useState(true);

const toggleToolbar = () => {
  setIsToolbarExpanded(!isToolbarExpanded);
};
```

### 6.2 Local Storage Persistence

```typescript
// Save user preference
useEffect(() => {
  localStorage.setItem("toolbar-expanded", isToolbarExpanded.toString());
}, [isToolbarExpanded]);

// Load user preference on mount
useEffect(() => {
  const saved = localStorage.getItem("toolbar-expanded");
  if (saved !== null) {
    setIsToolbarExpanded(saved === "true");
  }
}, []);
```

---

## 7. User Experience Considerations

### 7.1 Default Behavior

- **Default State:** Toolbar expanded (most users want quick access to actions)
- **Toggle Button:** Clear visual indicator (chevron that rotates)
- **Persistence:** Remember user's preference across sessions

### 7.2 Visual Feedback

- **Smooth Animation:** CSS transitions for expand/collapse
- **Clear Toggle State:** Rotating chevron icon
- **Hover States:** Proper button hover feedback

### 7.3 Accessibility

- **Keyboard Navigation:** Toggle button accessible via keyboard
- **Screen Readers:** Proper ARIA labels for toggle state
- **Focus Management:** Maintain focus when toggling

---

## 8. Benefits

### 8.1 Design Benefits

- **Better Visual Hierarchy** - Clear separation of branding vs actions
- **Improved Space Management** - Users can hide action buttons when not needed
- **Cleaner Layout** - Less cramped, more organized appearance
- **Mobile Friendly** - Two-tier system works better on small screens

### 8.2 User Experience Benefits

- **Reduced Cognitive Load** - Clear separation of concerns
- **Customizable Interface** - Users can hide/show toolbar as needed
- **Better Focus** - Branding stays visible, actions can be hidden
- **Consistent Behavior** - Toggle state persists across sessions

### 8.3 Development Benefits

- **Modular Structure** - Separate navbar and toolbar components
- **Easier Maintenance** - Clear separation of responsibilities
- **Better Testing** - Each component can be tested independently
- **Future Extensibility** - Easy to add more navbar or toolbar items

---

## 9. Migration Strategy

### 9.1 Backward Compatibility

- Keep existing `.toolbar` classes temporarily
- Add new classes alongside existing ones
- Gradual migration to new structure

### 9.2 Testing Approach

1. **Visual Testing** - Ensure layout looks correct
2. **Functionality Testing** - Verify all buttons work
3. **Responsive Testing** - Test on different screen sizes
4. **Accessibility Testing** - Verify keyboard navigation and screen readers

---

## 10. Success Metrics

### 10.1 Technical Metrics

- **Layout Stability** - No layout shifts or visual bugs
- **Performance** - Smooth animations, no lag
- **Accessibility** - Passes accessibility audits

### 10.2 User Experience Metrics

- **Usability** - Users can easily find and use all features
- **Customization** - Users utilize toolbar toggle feature
- **Satisfaction** - Positive feedback on new layout

---

## 11. Risks & Mitigation

### 11.1 Potential Risks

- **Layout Breaking** - New structure might break existing layout
- **User Confusion** - Users might not find action buttons
- **Mobile Issues** - Two-tier system might not work on mobile

### 11.2 Mitigation Strategies

- **Gradual Rollout** - Implement in phases with testing
- **User Testing** - Get feedback before full deployment
- **Responsive Design** - Ensure mobile-friendly implementation
- **Clear Visual Cues** - Make toggle button obvious and intuitive

---

## 12. Conclusion

This two-tier header system will significantly improve the visual hierarchy and user experience of Lattelier. By separating branding from actions and providing a togglable toolbar, users get a cleaner interface that can be customized to their needs.

The implementation maintains all existing functionality while providing better organization and space management. The persistent toggle state ensures users don't have to reconfigure their preferred layout each time they use the application.
