# CSS Architecture Documentation

## 0.4.0 - 2025-10-22

### DOAP.json Framework Integration
- **Metadata System**: Integrated DOAP.json as primary source of truth for project metadata
- **Vite Plugin**: Added doap-metadata.ts plugin for automatic HTML metadata injection
- **Deployment Tracking**: Enhanced deployment scripts to track deployments in DOAP.json
- **File Synchronization**: Added doap-sync.sh for keeping all project files synchronized

### Impacted Components
- **Build System**: Vite configuration updated with metadata injection plugin
- **HTML Head**: Enhanced with SEO, Open Graph, and Twitter Card metadata placeholders
- **Deployment Scripts**: Updated to use DOAP.json as primary metadata source
- **Version Management**: Enhanced to update DOAP.json and sync across all files
- **Public Metadata**: DOAP.json now bundled with deployments for public access

### Framework Benefits
- **Unified Metadata**: Single source of truth for all project information
- **Enhanced SEO**: Automatic metadata injection for better discoverability
- **Deployment History**: Complete tracking of all Arweave deployments
- **Public Access**: Project metadata accessible via Arweave deployment URLs

## 0.3.0 - 2025-01-27

### Version Display System
- **Dynamic Version Display**: Added version display in toolbar that reads from package.json
- **Versioning Integration**: Integrated with workspace versioning system via post-hook scripts
- **Semantic Styling**: Enhanced GuideModal with semantic CSS classes replacing utility classes
- **TypeScript Improvements**: Fixed unused imports and function call issues across core modules

### Impacted Components
- **Toolbar Component**: Added version display with semantic styling
- **Version Utility**: New utility system for dynamic version management
- **GuideModal**: Enhanced with semantic CSS classes and improved accessibility
- **Core Modules**: Cleaned up TypeScript errors and unused imports

## 0.2.0 - 2025-01-27

### Major Architectural Changes
- **Complete Tailwind CSS Migration**: Removed Tailwind CSS dependency and replaced with custom CSS architecture
- **Component-Based Styling**: Implemented semantic, maintainable CSS with component isolation
- **Design System**: Established comprehensive design system with CSS custom properties
- **Performance Optimization**: Reduced bundle size and improved rendering performance
- **Enhanced UI Components**: Redesigned all UI components with consistent styling patterns

### Impacted Components
- **Styling System**: Complete replacement of Tailwind with custom CSS
- **Component Architecture**: All React components updated with new CSS classes
- **Build System**: Updated PostCSS configuration for custom CSS processing
- **Design Tokens**: Implemented comprehensive design system with CSS variables

## Overview

This document describes the CSS architecture for Lattelier, a lean and optimized system that replaces Tailwind CSS with semantic, maintainable styles.

## Directory Structure

```
src/styles/
├── variables.css          # Design system tokens
├── base.css              # Reset and typography
├── fonts.css             # Font definitions
├── components/           # Component-specific styles
│   ├── layout.css        # Layout utilities
│   ├── buttons.css       # Button components
│   ├── forms.css         # Form controls
│   ├── modals.css        # Modal components
│   ├── panels.css        # Sidebar panels
│   ├── toolbar.css       # Toolbar component
│   └── canvas.css        # Canvas component
└── index.css             # Main entry point
```

## Design System

### Color Palette

**Primary Colors:**
- `--color-primary`: #3b82f6 (Blue)
- `--color-primary-hover`: #1d4ed8 (Darker blue)

**Secondary Colors:**
- `--color-secondary`: #8b5cf6 (Purple)
- `--color-secondary-hover`: #7c3aed (Darker purple)

**Semantic Colors:**
- `--color-success`: #10b981 (Green)
- `--color-warning`: #f59e0b (Yellow)
- `--color-error`: #ef4444 (Red)
- `--color-info`: #6366f1 (Indigo)

**Neutral Colors:**
- `--color-gray-50` to `--color-gray-900`: Gray scale
- `--color-bg`: Background color
- `--color-surface`: Surface color (white)
- `--color-text`: Primary text color
- `--color-text-muted`: Secondary text color
- `--color-text-light`: Light text color
- `--color-border`: Border color
- `--color-border-focus`: Focus border color

### Spacing Scale

```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;     /* 16px */
--space-lg: 1.5rem;   /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
```

### Typography

**Font Sizes:**
```css
--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;      /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;     /* 24px */
```

**Font Weights:**
```css
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

**Line Heights:**
```css
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### Border Radius

```css
--radius-sm: 0.125rem;   /* 2px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-full: 9999px;
```

### Transitions

```css
--transition: 150ms ease-in-out;
--transition-slow: 300ms ease-in-out;
```

## Component Classes

### Layout Utilities

**Flexbox:**
- `.flex` - `display: flex`
- `.flex-col` - `flex-direction: column`
- `.flex-1` - `flex: 1 1 0%`
- `.items-center` - `align-items: center`
- `.justify-center` - `justify-content: center`
- `.justify-between` - `justify-content: space-between`

**Spacing:**
- `.space-x-2`, `.space-x-3`, `.space-x-4` - Horizontal spacing
- `.space-y-2`, `.space-y-3`, `.space-y-4`, `.space-y-6` - Vertical spacing

**Grid:**
- `.grid` - `display: grid`
- `.grid-cols-2` - `grid-template-columns: repeat(2, minmax(0, 1fr))`
- `.gap-2`, `.gap-3`, `.gap-4` - Grid gaps

**Positioning:**
- `.relative`, `.absolute`, `.fixed`, `.sticky`
- `.inset-0` - `top: 0; right: 0; bottom: 0; left: 0`
- `.top-0`, `.right-0`, `.bottom-0`, `.left-0`
- `.z-10`, `.z-50` - Z-index values

**Overflow:**
- `.overflow-hidden` - `overflow: hidden`
- `.overflow-y-auto` - `overflow-y: auto`

### Button Components

**Base Button:**
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
}
```

**Button Variants:**
- `.btn-primary` - Primary button (blue)
- `.btn-secondary` - Secondary button (gray)
- `.btn-success` - Success button (green)
- `.btn-danger` - Danger button (red)
- `.btn-purple` - Purple button
- `.btn-indigo` - Indigo button

**Button Sizes:**
- `.btn-sm` - Small button
- `.btn-lg` - Large button

**Button States:**
- `.btn-active` - Active state
- `:disabled` - Disabled state
- `:hover` - Hover state

### Form Components

**Form Groups:**
```css
.form-group {
  margin-bottom: var(--space-md);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  margin-bottom: var(--space-xs);
}
```

**Form Inputs:**
- `.form-input` - Text inputs
- `.form-select` - Select dropdowns
- `.form-range` - Range sliders
- `.form-checkbox` - Checkboxes

**Form States:**
- `.form-input.error` - Error state
- `:focus` - Focus state

### Modal Components

**Modal Structure:**
```css
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.modal {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 32rem;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
```

**Modal Sizes:**
- `.modal-lg` - Large modal (48rem)
- `.modal-xl` - Extra large modal (64rem)

**Modal Sections:**
- `.modal-header` - Modal header
- `.modal-body` - Modal body
- `.modal-footer` - Modal footer

### Panel Components

**Panel Structure:**
```css
.panel {
  position: relative;
  height: 100%;
  pointer-events: none;
}

.panel-content {
  height: 100%;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all var(--transition-slow);
  pointer-events: auto;
}
```

**Panel States:**
- `.panel-collapsed` - Collapsed state (width: 0)
- `.panel-expanded` - Expanded state (width: 20rem)
- `.panel-left` - Left panel
- `.panel-right` - Right panel

**Panel Elements:**
- `.panel-header` - Panel header
- `.panel-title` - Panel title
- `.panel-toggle` - Toggle button
- `.panel-content-area` - Content area
- `.panel-tab` - Collapsed tab

### Toolbar Component

**Toolbar Structure:**
```css
.toolbar {
  height: 3.5rem;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

**Toolbar Sections:**
- `.toolbar-left` - Left section
- `.toolbar-right` - Right section
- `.toolbar-brand` - Brand section
- `.toolbar-title` - Title
- `.toolbar-help` - Help button
- `.toolbar-info` - Info text

**Dropdown Menu:**
- `.dropdown` - Dropdown container
- `.dropdown-menu` - Dropdown menu
- `.dropdown-header` - Dropdown header
- `.dropdown-section` - Dropdown section
- `.dropdown-item` - Dropdown item
- `.dropdown-item-highlighted` - Highlighted item

### Canvas Component

**Canvas Styles:**
```css
.canvas {
  width: 100%;
  height: 100%;
}
```

**Canvas Cursors:**
- `.canvas-cursor-crosshair` - Crosshair cursor
- `.canvas-cursor-grab` - Grab cursor
- `.canvas-cursor-pointer` - Pointer cursor

## Usage Guidelines

### 1. Component Styling

Use semantic class names that describe the component's purpose:

```jsx
// Good
<button className="btn btn-primary">Save</button>
<div className="modal-backdrop">
  <div className="modal">
    <div className="modal-header">...</div>
  </div>
</div>

// Avoid
<button className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
```

### 2. Layout Utilities

Use layout utilities for common patterns:

```jsx
// Good
<div className="flex items-center justify-between">
  <h1>Title</h1>
  <button>Action</button>
</div>

// Avoid
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
```

### 3. Spacing

Use the spacing scale consistently:

```jsx
// Good
<div className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Avoid
<div>
  <div style={{ marginBottom: '1rem' }}>Item 1</div>
  <div>Item 2</div>
</div>
```

### 4. Color Usage

Use semantic color variables:

```css
/* Good */
.error-message {
  color: var(--color-error);
  background-color: var(--color-error);
  background-color: rgba(239, 68, 68, 0.1);
}

/* Avoid */
.error-message {
  color: #ef4444;
  background-color: #fef2f2;
}
```

## Performance Considerations

### 1. CSS Custom Properties

CSS custom properties provide excellent performance and theming capabilities:

```css
:root {
  --color-primary: #3b82f6;
}

.button {
  background-color: var(--color-primary);
}
```

### 2. Component Isolation

Each component has its own CSS file, enabling:
- Better maintainability
- Easier debugging
- Selective loading
- Reduced bundle size

### 3. Lean Architecture

The system is designed to be lean and efficient:
- Minimal CSS bundle size
- Optimized selectors
- Efficient cascade
- No unused styles

## Browser Support

The CSS architecture supports modern browsers with:
- CSS Custom Properties (CSS Variables)
- CSS Grid and Flexbox
- Modern selectors
- CSS transitions and transforms

## Migration from Tailwind

The migration from Tailwind CSS to this architecture provides:

1. **Better Maintainability**: Semantic class names are easier to understand and maintain
2. **Reduced Bundle Size**: Eliminates unused Tailwind classes
3. **Improved Performance**: CSS custom properties are more efficient
4. **Better Theming**: Easy to implement dark mode and custom themes
5. **Component Isolation**: Each component's styles are isolated and maintainable

## Future Enhancements

1. **Dark Mode**: Easy to implement using CSS custom properties
2. **Theming**: Support for multiple color schemes
3. **Responsive Design**: Mobile-first responsive utilities
4. **Animation System**: Consistent animation patterns
5. **Accessibility**: Enhanced accessibility features
