# Component Migration Guide

## Migration Checklist Template

For each component, follow this systematic approach:

### Pre-Migration Analysis
- [ ] Identify all Tailwind classes used
- [ ] Map classes to semantic CSS equivalents
- [ ] Identify conditional styling patterns
- [ ] Note any complex animations or transitions
- [ ] Document component-specific requirements

### Migration Steps
- [ ] Create component-specific CSS file
- [ ] Implement base component styles
- [ ] Add state modifiers (hover, focus, active, disabled)
- [ ] Implement conditional styling
- [ ] Add animations and transitions
- [ ] Test all interactions and states
- [ ] Validate visual consistency

### Post-Migration Validation
- [ ] Visual regression testing
- [ ] Interaction testing
- [ ] Cross-browser testing
- [ ] Performance testing
- [ ] Accessibility testing

## Component-Specific Migration Plans

### 1. App.tsx

**Current Tailwind Classes:**
- `h-screen flex flex-col`
- `flex-1 relative overflow-hidden`
- `absolute inset-0`
- `absolute left-0 top-0 bottom-0 z-10`
- `absolute right-0 top-0 bottom-0 z-10`

**Semantic CSS Classes:**
```css
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.app-canvas {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.app-sidebar-left {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
}

.app-sidebar-right {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
}
```

**Migration Steps:**
1. Create `components/layout.css` with app-specific styles
2. Replace Tailwind classes with semantic classes
3. Test layout behavior across different screen sizes
4. Verify z-index layering works correctly

### 2. Canvas.tsx

**Current Tailwind Classes:**
- `w-full h-full`
- `cursor-pointer`, `cursor-grab`, `cursor-crosshair`

**Semantic CSS Classes:**
```css
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

**Migration Steps:**
1. Create `components/canvas.css`
2. Implement base canvas styles
3. Add cursor utility classes
4. Test cursor changes with different tools
5. Verify canvas fills container correctly

### 3. CollapsiblePanel.tsx

**Current Tailwind Classes:**
- Complex conditional styling with template literals
- `h-full bg-white border-gray-200 overflow-hidden transition-all duration-300 ease-in-out pointer-events-none`
- `border-r`, `border-l`
- `w-0`, `w-80`
- `sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between`
- `p-1 hover:bg-gray-100 rounded transition-colors`
- `w-5 h-5 text-gray-600`
- `absolute top-1/2 -translate-y-1/2 h-32 w-8 bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center pointer-events-auto`
- `left-0 rounded-r`, `right-0 rounded-l`
- `w-4 h-4 text-gray-600 mb-2`
- `text-xs text-gray-600`

**Semantic CSS Classes:**
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

.panel-toggle-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text-secondary);
}

.panel-content-area {
  padding: var(--space-lg);
}

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

.panel-tab-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
}

.panel-tab-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}
```

**Migration Steps:**
1. Create `components/panels.css`
2. Implement base panel styles
3. Add collapsed/expanded state styles
4. Implement smooth width transitions
5. Add collapsed tab styling
6. Test animation performance
7. Verify all hover and interaction states

### 4. CanvasSettingsPanel.tsx

**Current Tailwind Classes:**
- `space-y-6`
- `text-sm font-semibold text-gray-800 mb-3`
- `block text-sm font-medium text-gray-700 mb-1`
- `w-full h-10 rounded cursor-pointer`
- `border-t border-gray-200 pt-4`
- `flex items-center justify-between mb-3`
- `flex items-center cursor-pointer`
- `mr-2`
- `text-sm text-gray-700`
- `space-y-3 pl-2`
- `w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`
- `w-full`
- `flex justify-between text-xs text-gray-500 mt-1`
- `space-y-2`

**Semantic CSS Classes:**
```css
.settings-panel {
  /* Panel content area */
}

.settings-section {
  margin-bottom: var(--space-xl);
}

.settings-section:not(:first-child) {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-lg);
}

.settings-section-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

.settings-form-group {
  margin-bottom: var(--space-md);
}

.settings-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
}

.settings-color-input {
  width: 100%;
  height: 2.5rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  border: none;
  padding: 0;
}

.settings-select {
  width: 100%;
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  font-size: var(--font-size-sm);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.settings-select:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.settings-range {
  width: 100%;
}

.settings-range-labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-xs);
}

.settings-toggle-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.settings-toggle {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.settings-toggle input {
  margin-right: var(--space-sm);
}

.settings-toggle-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.settings-subsection {
  padding-left: var(--space-sm);
}

.settings-subsection .settings-form-group {
  margin-bottom: var(--space-md);
}
```

**Migration Steps:**
1. Create `components/forms.css` for form controls
2. Implement section styling
3. Add form control styling
4. Implement toggle switches
5. Add range input styling
6. Test all form interactions
7. Verify color picker functionality

### 5. DistortionPanel.tsx

**Current Tailwind Classes:**
- `space-y-6`
- `text-sm font-semibold text-gray-800 mb-3`
- `space-y-2`
- `w-full px-4 py-2 rounded-md text-sm font-medium transition-colors`
- `bg-blue-500 text-white`, `bg-gray-100 text-gray-700 hover:bg-gray-200`
- `border-t border-gray-200 pt-4`
- `text-sm text-gray-500 mb-4`
- `mt-4`
- `text-xs font-semibold text-gray-700 mb-2`
- `text-xs text-gray-600 space-y-1`
- `space-y-1`
- `w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors`
- `space-y-4`
- `block text-sm font-medium text-gray-700 mb-1`
- `grid grid-cols-2 gap-2`
- `text-xs text-gray-500`
- `w-full px-2 py-1 border border-gray-300 rounded text-sm`
- `w-full`
- `flex justify-between text-xs text-gray-500 mt-1`
- `space-y-2`
- `flex items-center cursor-pointer`
- `mr-2`
- `text-sm text-gray-700`
- `w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium`
- `border-t border-gray-200 pt-4`
- `text-xs font-semibold text-gray-700 mb-2`
- `space-y-1`
- `w-full text-left px-2 py-1 text-sm rounded transition-colors`
- `bg-blue-100 text-blue-800`, `hover:bg-gray-100`

**Semantic CSS Classes:**
```css
.distortion-panel {
  /* Panel content area */
}

.distortion-section {
  margin-bottom: var(--space-xl);
}

.distortion-section:not(:first-child) {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-lg);
}

.distortion-section-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

.tool-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.tool-button {
  width: 100%;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  border: none;
  cursor: pointer;
}

.tool-button-active {
  background-color: var(--color-primary-500);
  color: white;
}

.tool-button-inactive {
  background-color: var(--color-gray-100);
  color: var(--color-text-secondary);
}

.tool-button-inactive:hover {
  background-color: var(--color-gray-200);
}

.help-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  margin-bottom: var(--space-lg);
}

.controls-section {
  margin-top: var(--space-lg);
}

.controls-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-sm);
}

.controls-list {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  list-style: none;
  padding: 0;
}

.controls-list li {
  margin-bottom: var(--space-xs);
}

.wells-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.wells-list li {
  margin-bottom: var(--space-xs);
}

.well-item {
  width: 100%;
  text-align: left;
  padding: var(--space-xs) var(--space-sm);
  font-size: var(--font-size-sm);
  border-radius: var(--radius-sm);
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.well-item:hover {
  background-color: var(--color-gray-100);
}

.well-item-selected {
  background-color: var(--color-primary-100);
  color: var(--color-primary-800);
}

.well-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.well-form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.well-form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-xs);
}

.well-form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
}

.well-form-input {
  width: 100%;
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
}

.well-form-range {
  width: 100%;
}

.well-form-range-labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  margin-top: var(--space-xs);
}

.well-form-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.well-form-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.well-form-checkbox input {
  margin-right: var(--space-sm);
}

.well-form-checkbox-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.well-delete-button {
  width: 100%;
  padding: var(--space-sm) var(--space-lg);
  background-color: var(--color-error-500);
  color: white;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: background-color var(--transition-fast);
}

.well-delete-button:hover {
  background-color: var(--color-error-600);
}
```

**Migration Steps:**
1. Create `components/forms.css` for form controls
2. Implement tool button states
3. Add form styling for well properties
4. Implement well list styling
5. Add delete button styling
6. Test all form interactions
7. Verify tool switching behavior

### 6. Modal Components

#### ErrorModal.tsx
**Current Tailwind Classes:**
- `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`
- `bg-white rounded-lg shadow-xl max-w-lg w-full mx-4`
- `flex items-center justify-between p-6 border-b border-gray-200`
- `flex items-center gap-3`
- `text-2xl`
- `text-xl font-semibold text-gray-800`
- `text-gray-400 hover:text-gray-600 text-2xl leading-none`
- `p-6`
- `text-gray-700 mb-4`
- `space-y-2 bg-red-50 border border-red-200 rounded-md p-4`
- `text-sm text-red-800 flex items-start gap-2`
- `text-red-500 mt-0.5`
- `text-sm text-gray-600 mt-4`
- `flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50`
- `px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors`

**Semantic CSS Classes:**
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
  padding: var(--space-md);
}

.modal {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 32rem;
  width: 100%;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--color-border);
}

.modal-header-content {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.modal-icon {
  font-size: var(--font-size-2xl);
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
  transition: color var(--transition-fast);
}

.modal-close:hover {
  color: var(--color-text-secondary);
}

.modal-body {
  padding: var(--space-xl);
}

.modal-text {
  color: var(--color-text-secondary);
  margin-bottom: var(--space-lg);
}

.error-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  background-color: var(--color-error-50);
  border: 1px solid var(--color-error-200);
  border-radius: var(--radius-md);
  padding: var(--space-lg);
}

.error-item {
  font-size: var(--font-size-sm);
  color: var(--color-error-800);
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
}

.error-bullet {
  color: var(--color-error-500);
  margin-top: 0.125rem;
}

.error-help {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-lg);
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: var(--space-xl);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-gray-50);
}

.modal-button {
  padding: var(--space-sm) var(--space-lg);
  color: white;
  background-color: var(--color-gray-600);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.modal-button:hover {
  background-color: var(--color-gray-700);
}
```

#### GuideModal.tsx
**Current Tailwind Classes:**
- `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4`
- `bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col`
- `bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between`
- `text-2xl font-bold`
- `text-blue-100 text-sm`
- `text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition-colors`
- `overflow-y-auto flex-1 px-6 py-6`
- `mb-8`
- `text-xl font-bold text-gray-800 mb-3`
- `text-gray-600 leading-relaxed`
- `bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r`
- `space-y-2 text-gray-700`
- `flex items-start`
- `font-semibold mr-2 text-blue-600`
- `bg-gray-50 p-4 rounded-lg`
- `font-semibold text-gray-800 mb-2`
- `text-sm text-gray-600 space-y-1`
- `space-y-4`
- `bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r`
- `font-semibold text-purple-900 mb-2`
- `text-sm text-purple-800 space-y-2`
- `text-blue-600`, `text-red-600`
- `bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r`
- `text-sm text-yellow-900 space-y-2`
- `border-t border-gray-200 px-6 py-4 bg-gray-50`
- `w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all`

**Semantic CSS Classes:**
```css
.guide-modal {
  max-width: 64rem;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.guide-header {
  background: linear-gradient(to right, var(--color-primary-600), var(--color-secondary-600));
  color: white;
  padding: var(--space-lg) var(--space-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.guide-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
}

.guide-subtitle {
  color: var(--color-primary-100);
  font-size: var(--font-size-sm);
}

.guide-close {
  color: white;
  background: none;
  border: none;
  border-radius: var(--radius-full);
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.guide-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.guide-content {
  overflow-y: auto;
  flex: 1;
  padding: var(--space-xl);
}

.guide-section {
  margin-bottom: var(--space-xl);
}

.guide-section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
}

.guide-text {
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.guide-highlight {
  background-color: var(--color-primary-50);
  border-left: 4px solid var(--color-primary-500);
  padding: var(--space-lg);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  color: var(--color-text-secondary);
}

.guide-step {
  display: flex;
  align-items: flex-start;
}

.guide-step-number {
  font-weight: var(--font-weight-semibold);
  margin-right: var(--space-sm);
  color: var(--color-primary-600);
}

.guide-info-box {
  background-color: var(--color-gray-50);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
}

.guide-info-title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.guide-info-list {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  list-style: none;
  padding: 0;
}

.guide-info-list li {
  margin-bottom: var(--space-xs);
}

.guide-feature-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.guide-feature {
  background-color: var(--color-gray-50);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
}

.guide-feature-title {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.guide-feature-list {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  list-style: none;
  padding: 0;
}

.guide-feature-list li {
  margin-bottom: var(--space-xs);
}

.guide-tip-box {
  background-color: var(--color-warning-50);
  border-left: 4px solid var(--color-warning-500);
  padding: var(--space-lg);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.guide-tip-list {
  font-size: var(--font-size-sm);
  color: var(--color-warning-900);
  list-style: none;
  padding: 0;
}

.guide-tip-list li {
  margin-bottom: var(--space-sm);
}

.guide-footer {
  border-top: 1px solid var(--color-border);
  padding: var(--space-lg) var(--space-xl);
  background-color: var(--color-gray-50);
}

.guide-footer-button {
  width: 100%;
  background: linear-gradient(to right, var(--color-primary-600), var(--color-secondary-600));
  color: white;
  padding: var(--space-md) 0;
  border-radius: var(--radius-lg);
  border: none;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.guide-footer-button:hover {
  background: linear-gradient(to right, var(--color-primary-700), var(--color-secondary-700));
}
```

#### ImportPreviewModal.tsx
**Current Tailwind Classes:**
- `fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`
- `bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto`
- `flex items-center justify-between p-6 border-b border-gray-200`
- `text-xl font-semibold text-gray-800`
- `text-gray-400 hover:text-gray-600 text-2xl leading-none`
- `p-6 space-y-6`
- `text-lg font-semibold text-gray-800 mb-2`
- `text-sm text-gray-600 mb-3`
- `flex items-center gap-4 text-xs text-gray-500`
- `bg-gray-50 rounded-lg p-4 space-y-2`
- `text-sm font-semibold text-gray-700 mb-3`
- `grid grid-cols-2 gap-3 text-sm`
- `text-gray-600`
- `ml-2 font-medium text-gray-800 capitalize`
- `pt-2 border-t border-gray-200 mt-3`
- `space-y-1 text-sm`
- `flex items-center gap-2`
- `pointer-events-none`
- `text-gray-600`
- `text-sm font-semibold text-gray-700 mb-3`
- `space-y-3`
- `flex items-start p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors`
- `mt-1`
- `ml-3 flex-1`
- `font-medium text-gray-800`
- `text-sm text-gray-600 mt-1`
- `flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50`
- `px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors`
- `px-4 py-2 text-white bg-purple-500 rounded-md hover:bg-purple-600 transition-colors font-medium`

**Semantic CSS Classes:**
```css
.import-modal {
  max-width: 48rem;
  max-height: 90vh;
  overflow-y: auto;
}

.import-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-xl);
  border-bottom: 1px solid var(--color-border);
}

.import-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.import-close {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.import-close:hover {
  color: var(--color-text-secondary);
}

.import-body {
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.import-metadata {
  /* Metadata section */
}

.import-metadata-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.import-metadata-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}

.import-metadata-dates {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}

.import-summary {
  background-color: var(--color-gray-50);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.import-summary-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}

.import-summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
  font-size: var(--font-size-sm);
}

.import-summary-label {
  color: var(--color-text-secondary);
}

.import-summary-value {
  margin-left: var(--space-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  text-transform: capitalize;
}

.import-summary-divider {
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-md);
}

.import-summary-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  font-size: var(--font-size-sm);
}

.import-summary-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.import-summary-checkbox {
  pointer-events: none;
}

.import-summary-text {
  color: var(--color-text-secondary);
}

.import-modes {
  /* Import mode selection */
}

.import-modes-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-md);
}

.import-modes-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.import-mode-option {
  display: flex;
  align-items: flex-start;
  padding: var(--space-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.import-mode-option:hover {
  background-color: var(--color-gray-50);
}

.import-mode-option-selected {
  border-color: var(--color-primary-500);
}

.import-mode-radio {
  margin-top: var(--space-xs);
}

.import-mode-content {
  margin-left: var(--space-md);
  flex: 1;
}

.import-mode-title {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.import-mode-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: var(--space-xs);
}

.import-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-md);
  padding: var(--space-xl);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-gray-50);
}

.import-button-cancel {
  padding: var(--space-sm) var(--space-lg);
  color: var(--color-text-secondary);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.import-button-cancel:hover {
  background-color: var(--color-gray-50);
}

.import-button-import {
  padding: var(--space-sm) var(--space-lg);
  color: white;
  background-color: var(--color-secondary-500);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  transition: background-color var(--transition-fast);
}

.import-button-import:hover {
  background-color: var(--color-secondary-600);
}
```

### 7. Toolbar.tsx

**Current Tailwind Classes:**
- `h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between`
- `flex items-center space-x-4`
- `flex items-center space-x-2`
- `text-xl font-bold text-gray-800`
- `w-7 h-7 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center text-sm font-bold transition-colors`
- `text-sm text-gray-500`
- `flex items-center space-x-3`
- `px-4 py-2 rounded-md text-sm font-medium transition-colors`
- `bg-blue-500 text-white hover:bg-blue-600`, `bg-gray-200 text-gray-700 hover:bg-gray-300`
- `px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium`
- `px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm font-medium`
- `px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm font-medium`
- `relative`
- `px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium`
- `absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50`
- `px-3 py-2 bg-blue-50 border-b border-blue-200`
- `text-xs text-blue-900`
- `font-semibold`
- `font-bold`
- `px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200`
- `w-full text-left px-4 py-2 text-sm transition-colors`
- `text-gray-400 cursor-not-allowed bg-gray-50`, `text-gray-700 hover:bg-gray-100`
- `flex items-center justify-between`
- `text-xs text-gray-500 mt-1`
- `text-gray-400 cursor-not-allowed bg-gray-50`, `text-gray-700 hover:bg-gray-100`
- `border-b border-gray-200`
- `w-full text-left px-4 py-2 text-sm bg-purple-50 hover:bg-purple-100 border-l-4 border-purple-500 rounded-b-md transition-colors`
- `font-medium text-purple-900`
- `text-purple-600 font-bold`
- `text-xs text-purple-700 mt-1`

**Semantic CSS Classes:**
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

.toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.toolbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
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

.toolbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.toolbar-button {
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-fast);
  border: none;
  cursor: pointer;
}

.toolbar-button-primary {
  background-color: var(--color-primary-500);
  color: white;
}

.toolbar-button-primary:hover {
  background-color: var(--color-primary-600);
}

.toolbar-button-secondary {
  background-color: var(--color-gray-200);
  color: var(--color-text-secondary);
}

.toolbar-button-secondary:hover {
  background-color: var(--color-gray-300);
}

.toolbar-button-success {
  background-color: var(--color-success-500);
  color: white;
}

.toolbar-button-success:hover {
  background-color: var(--color-success-600);
}

.toolbar-button-purple {
  background-color: var(--color-secondary-500);
  color: white;
}

.toolbar-button-purple:hover {
  background-color: var(--color-secondary-600);
}

.toolbar-button-indigo {
  background-color: var(--color-info-500);
  color: white;
}

.toolbar-button-indigo:hover {
  background-color: var(--color-info-600);
}

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

**Migration Steps:**
1. Create `components/toolbar.css`
2. Implement toolbar layout
3. Add button styling variants
4. Implement dropdown menu
5. Add status indicators
6. Test all interactions
7. Verify dropdown positioning

## Testing Strategy

### Visual Regression Testing
1. **Screenshot Comparison**: Take screenshots before and after migration
2. **Component Isolation**: Test each component individually
3. **State Testing**: Test all component states (hover, focus, active, disabled)
4. **Responsive Testing**: Test across different screen sizes

### Interaction Testing
1. **Form Controls**: Test all form inputs and interactions
2. **Modal Behavior**: Test modal opening, closing, and backdrop clicks
3. **Panel Collapsing**: Test smooth animations and state changes
4. **Dropdown Menus**: Test positioning and click-outside behavior
5. **Canvas Interactions**: Test cursor changes and tool switching

### Cross-Browser Testing
1. **Chrome**: Primary testing browser
2. **Firefox**: Test CSS custom properties support
3. **Safari**: Test webkit-specific properties
4. **Edge**: Test fallback behavior

### Performance Testing
1. **CSS Bundle Size**: Measure before and after migration
2. **Loading Performance**: Test CSS loading and rendering
3. **Animation Performance**: Test smooth transitions
4. **Memory Usage**: Monitor for CSS-related memory leaks

## Common Migration Patterns

### 1. Spacing Utilities
```css
/* Tailwind: space-y-6 */
.section > * + * {
  margin-top: var(--space-xl);
}

/* Tailwind: gap-4 */
.grid {
  gap: var(--space-lg);
}
```

### 2. Color Utilities
```css
/* Tailwind: text-gray-800 */
.text-primary {
  color: var(--color-text-primary);
}

/* Tailwind: bg-blue-500 */
.bg-primary {
  background-color: var(--color-primary-500);
}
```

### 3. Layout Utilities
```css
/* Tailwind: flex items-center justify-between */
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Tailwind: absolute inset-0 */
.absolute-fill {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
```

### 4. State Modifiers
```css
/* Tailwind: hover:bg-gray-100 */
.button:hover {
  background-color: var(--color-gray-100);
}

/* Tailwind: focus:ring-2 focus:ring-blue-500 */
.input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

## Migration Validation Checklist

### Pre-Migration
- [ ] Document current Tailwind usage
- [ ] Create CSS architecture
- [ ] Set up build process
- [ ] Create component CSS files

### During Migration
- [ ] Implement base styles
- [ ] Migrate simple components first
- [ ] Test each component individually
- [ ] Validate visual consistency
- [ ] Test interactions and states

### Post-Migration
- [ ] Remove Tailwind dependencies
- [ ] Optimize CSS bundle
- [ ] Test cross-browser compatibility
- [ ] Performance testing
- [ ] Documentation updates
