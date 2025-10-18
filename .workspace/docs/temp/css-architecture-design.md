# CSS Architecture Design

## Directory Structure

```
src/styles/
├── variables.css          # CSS custom properties
├── base.css              # Base styles and resets
├── fonts.css             # Font definitions and loading
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

## CSS Custom Properties (variables.css)

### Color System
```css
:root {
  /* Primary Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #1d4ed8;
  --color-primary-700: #1d4ed8;
  
  /* Secondary Colors */
  --color-secondary-50: #faf5ff;
  --color-secondary-100: #f3e8ff;
  --color-secondary-500: #8b5cf6;
  --color-secondary-600: #7c3aed;
  --color-secondary-700: #6d28d9;
  
  /* Semantic Colors */
  --color-success-50: #ecfdf5;
  --color-success-100: #d1fae5;
  --color-success-500: #10b981;
  --color-success-600: #059669;
  
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  
  --color-info-50: #eef2ff;
  --color-info-100: #e0e7ff;
  --color-info-500: #6366f1;
  --color-info-600: #4f46e5;
  
  /* Neutral Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  
  /* Semantic Color Aliases */
  --color-background: var(--color-gray-50);
  --color-surface: #ffffff;
  --color-text-primary: var(--color-gray-800);
  --color-text-secondary: var(--color-gray-600);
  --color-text-muted: var(--color-gray-500);
  --color-border: var(--color-gray-200);
  --color-border-focus: var(--color-primary-500);
}
```

### Spacing Scale
```css
:root {
  --space-xs: 0.25rem;    /* 4px */
  --space-sm: 0.5rem;     /* 8px */
  --space-md: 1rem;       /* 16px */
  --space-lg: 1.5rem;     /* 24px */
  --space-xl: 2rem;        /* 32px */
  --space-2xl: 3rem;      /* 48px */
  --space-3xl: 4rem;       /* 64px */
  --space-4xl: 6rem;       /* 96px */
}
```

### Typography Scale
```css
:root {
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

### Border Radius Scale
```css
:root {
  --radius-sm: 0.125rem;   /* 2px */
  --radius-md: 0.375rem;   /* 6px */
  --radius-lg: 0.5rem;     /* 8px */
  --radius-xl: 0.75rem;    /* 12px */
  --radius-full: 9999px;
}
```

### Z-Index Scale
```css
:root {
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}
```

### Transitions
```css
:root {
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;
}
```

## Base Styles (base.css)

### Reset and Normalize
```css
/* Box sizing reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default margins and padding */
* {
  margin: 0;
  padding: 0;
}

/* Base typography */
body {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  background-color: var(--color-background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Root element */
#root {
  width: 100%;
  height: 100%;
}
```

### Typography Base
```css
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

h1 { font-size: var(--font-size-2xl); }
h2 { font-size: var(--font-size-xl); }
h3 { font-size: var(--font-size-lg); }
h4 { font-size: var(--font-size-base); }
h5 { font-size: var(--font-size-sm); }
h6 { font-size: var(--font-size-xs); }

p {
  margin-bottom: var(--space-md);
  line-height: var(--line-height-normal);
}

a {
  color: var(--color-primary-600);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
```

### Form Elements Base
```css
input, select, textarea {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-sm) var(--space-md);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: var(--color-gray-200);
  height: 4px;
  border-radius: var(--radius-sm);
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: var(--color-primary-500);
  height: 16px;
  width: 16px;
  border-radius: var(--radius-full);
  cursor: pointer;
}

input[type="color"] {
  width: 100%;
  height: 2.5rem;
  padding: 0;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
}
```

## Font Definitions (fonts.css)

```css
/* Font family definitions */
:root {
  --font-family-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

/* Font loading optimization */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400 700;
  font-display: swap;
  src: url('./fonts/inter-var.woff2') format('woff2-variations');
}

/* Typography utilities */
.font-sans { font-family: var(--font-family-sans); }
.font-mono { font-family: var(--font-family-mono); }

.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.text-2xl { font-size: var(--font-size-2xl); }

.font-normal { font-weight: var(--font-weight-normal); }
.font-medium { font-weight: var(--font-weight-medium); }
.font-semibold { font-weight: var(--font-weight-semibold); }
.font-bold { font-weight: var(--font-weight-bold); }

.leading-tight { line-height: var(--line-height-tight); }
.leading-normal { line-height: var(--line-height-normal); }
.leading-relaxed { line-height: var(--line-height-relaxed); }
```

## Component Architecture

### Layout Utilities (components/layout.css)
```css
/* Flexbox utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-1 { flex: 1 1 0%; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.space-x-2 > * + * { margin-left: var(--space-sm); }
.space-x-3 > * + * { margin-left: var(--space-md); }
.space-x-4 > * + * { margin-left: var(--space-lg); }
.space-y-2 > * + * { margin-top: var(--space-sm); }
.space-y-3 > * + * { margin-top: var(--space-md); }
.space-y-4 > * + * { margin-top: var(--space-lg); }
.space-y-6 > * + * { margin-top: var(--space-xl); }

/* Grid utilities */
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.gap-2 { gap: var(--space-sm); }
.gap-3 { gap: var(--space-md); }
.gap-4 { gap: var(--space-lg); }

/* Positioning */
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.sticky { position: sticky; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.top-0 { top: 0; }
.right-0 { right: 0; }
.bottom-0 { bottom: 0; }
.left-0 { left: 0; }

/* Z-index */
.z-10 { z-index: 10; }
.z-50 { z-index: var(--z-modal); }

/* Overflow */
.overflow-hidden { overflow: hidden; }
.overflow-y-auto { overflow-y: auto; }
```

### Button Components (components/buttons.css)
```css
/* Base button styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Button variants */
.btn-primary {
  background-color: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-600);
  border-color: var(--color-primary-600);
}

.btn-secondary {
  background-color: var(--color-gray-100);
  color: var(--color-text-primary);
  border-color: var(--color-gray-200);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-gray-200);
  border-color: var(--color-gray-300);
}

.btn-success {
  background-color: var(--color-success-500);
  color: white;
  border-color: var(--color-success-500);
}

.btn-success:hover:not(:disabled) {
  background-color: var(--color-success-600);
  border-color: var(--color-success-600);
}

.btn-danger {
  background-color: var(--color-error-500);
  color: white;
  border-color: var(--color-error-500);
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--color-error-600);
  border-color: var(--color-error-600);
}

/* Button sizes */
.btn-sm {
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-xs);
}

.btn-lg {
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-lg);
}

/* Button states */
.btn-active {
  background-color: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}
```

### Form Components (components/forms.css)
```css
/* Form groups */
.form-group {
  margin-bottom: var(--space-md);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
}

.form-input {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-select {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  cursor: pointer;
}

.form-range {
  width: 100%;
  height: 4px;
  background: var(--color-gray-200);
  border-radius: var(--radius-sm);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.form-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  cursor: pointer;
}

.form-checkbox {
  margin-right: var(--space-sm);
}

/* Form validation states */
.form-input.error {
  border-color: var(--color-error-500);
}

.form-input.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

### Modal Components (components/modals.css)
```css
/* Modal backdrop */
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
  padding: var(--space-md);
}

/* Modal container */
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

.modal-lg {
  max-width: 48rem;
}

.modal-xl {
  max-width: 64rem;
}

/* Modal header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.modal-close {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  color: var(--color-text-muted);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.modal-close:hover {
  color: var(--color-text-secondary);
}

/* Modal body */
.modal-body {
  padding: var(--space-lg);
  overflow-y: auto;
  flex: 1;
}

/* Modal footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-md);
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-gray-50);
}
```

### Panel Components (components/panels.css)
```css
/* Collapsible panel */
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
  transition: all var(--transition-normal);
  pointer-events: auto;
}

.panel-left {
  border-right: 1px solid var(--color-border);
}

.panel-right {
  border-left: 1px solid var(--color-border);
}

.panel-collapsed {
  width: 0;
}

.panel-expanded {
  width: 20rem;
}

.panel-inner {
  width: 20rem;
  height: 100%;
  overflow-y: auto;
}

/* Panel header */
.panel-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-md) var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.panel-toggle {
  padding: var(--space-xs);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.panel-toggle:hover {
  background-color: var(--color-gray-100);
}

/* Panel content */
.panel-content-area {
  padding: var(--space-lg);
}

/* Collapsed tab */
.panel-tab {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 8rem;
  width: 2rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color var(--transition-fast);
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-tab:hover {
  background-color: var(--color-gray-50);
}

.panel-tab-left {
  left: 0;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.panel-tab-right {
  right: 0;
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

.panel-tab-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.panel-tab-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}
```

### Toolbar Component (components/toolbar.css)
```css
/* Toolbar */
.toolbar {
  height: 3.5rem;
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.toolbar-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.toolbar-help {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-100);
  color: var(--color-primary-600);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  transition: background-color var(--transition-fast);
}

.toolbar-help:hover {
  background-color: var(--color-primary-200);
}

.toolbar-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}

/* Dropdown menu */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  margin-top: var(--space-sm);
  width: 16rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: var(--z-dropdown);
}

.dropdown-header {
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-primary-50);
  border-bottom: 1px solid var(--color-primary-200);
  font-size: var(--font-size-xs);
  color: var(--color-primary-900);
}

.dropdown-section {
  padding: var(--space-sm) var(--space-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  border-bottom: 1px solid var(--color-border);
}

.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.dropdown-item:hover:not(:disabled) {
  background-color: var(--color-gray-100);
}

.dropdown-item:disabled {
  color: var(--color-text-muted);
  cursor: not-allowed;
  background-color: var(--color-gray-50);
}

.dropdown-item-highlighted {
  background-color: var(--color-secondary-50);
  border-left: 4px solid var(--color-secondary-500);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.dropdown-item-highlighted .dropdown-item {
  color: var(--color-secondary-900);
  font-weight: var(--font-weight-medium);
}

.dropdown-item-highlighted .dropdown-item:hover {
  background-color: var(--color-secondary-100);
}
```

### Canvas Component (components/canvas.css)
```css
/* Canvas */
.canvas {
  width: 100%;
  height: 100%;
}

.canvas-cursor-crosshair {
  cursor: crosshair;
}

.canvas-cursor-grab {
  cursor: grab;
}

.canvas-cursor-pointer {
  cursor: pointer;
}
```

## Main Entry Point (index.css)

```css
/* Import all stylesheets */
@import './variables.css';
@import './fonts.css';
@import './base.css';
@import './components/layout.css';
@import './components/buttons.css';
@import './components/forms.css';
@import './components/modals.css';
@import './components/panels.css';
@import './components/toolbar.css';
@import './components/canvas.css';
```

## Migration Strategy

### Phase 1: Setup CSS Architecture
1. Create directory structure
2. Implement variables.css with all custom properties
3. Create base.css with reset and typography
4. Set up fonts.css

### Phase 2: Component Migration
1. Start with simple components (Canvas, ErrorModal)
2. Move to medium complexity (DistortionPanel, Toolbar)
3. Finish with complex components (CollapsiblePanel, GuideModal)

### Phase 3: Integration & Testing
1. Update main index.css import
2. Remove Tailwind dependencies
3. Test all components and interactions
4. Optimize and refine styles

### Phase 4: Cleanup
1. Remove Tailwind config and dependencies
2. Update build process
3. Document new CSS architecture
4. Performance optimization
