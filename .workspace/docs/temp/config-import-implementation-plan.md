# Configuration Import Implementation Plan
## Grid Pincher App - Loading Saved Configurations

**Date:** October 16, 2025  
**Status:** Design Document  
**Version:** 1.0

---

## 1. Overview

This document outlines the design and implementation strategy for importing saved Grid Pincher configurations. Users will be able to load previously exported `.gridpincher.json` files to restore their work, share designs, or use templates.

---

## 2. User Flows

### 2.1 Primary Flow: Import Configuration

```
User clicks "Import Config" button
    ↓
File picker dialog opens (.gridpincher.json, .json)
    ↓
User selects file
    ↓
File is validated
    ↓
[VALIDATION PASSES]
    ↓
Preview modal shows:
    - Configuration name & description
    - Preview of key settings
    - Grid type, dimensions
    - Number of wells
    - Option: "Replace All" or "Merge Wells"
    - Cancel / Import buttons
    ↓
User clicks "Import"
    ↓
Configuration applied to app
    ↓
Grid regenerates
    ↓
Success notification
```

### 2.2 Alternative Flow: Drag & Drop

```
User drags .gridpincher.json file over canvas
    ↓
Drop zone highlights
    ↓
User drops file
    ↓
Same validation & preview flow as above
```

### 2.3 Error Flow

```
File validation fails
    ↓
Error modal shows:
    - Clear error message
    - Specific issues found
    - Suggestions for fixing
    - Close button
```

---

## 3. UI Components

### 3.1 Import Button Location

**Option A: In Toolbar** (Recommended)
```
[Show/Hide Wells] [Clear All] [Export Config] [Import Config] [Download ▼]
```
- Pros: Symmetrical with Export, high visibility
- Cons: Toolbar getting crowded

**Option B: In Download Menu**
```
Download ▼
  ├─ PNG Resolution submenu
  ├─ Vector (SVG)
  └─ Import Configuration
```
- Pros: Keeps toolbar cleaner, groups I/O operations
- Cons: Less discoverable

**Recommendation:** Option A - Separate "Import Config" button for discoverability

### 3.2 Import Preview Modal

```typescript
interface ImportPreviewProps {
  config: GridPincherConfig;
  onImport: (mergeWells: boolean) => void;
  onCancel: () => void;
}
```

**Modal Layout:**
```
┌─────────────────────────────────────────────┐
│  Import Configuration                    [X]│
├─────────────────────────────────────────────┤
│                                             │
│  Name: "Organic Wave Pattern"              │
│  Description: "Hexagonal grid with..."      │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ Preview Summary:                     │  │
│  │                                      │  │
│  │ Grid Type: Hexagonal                │  │
│  │ Size: 50 × 50                       │  │
│  │ Points: Visible, #1f2937, 80% opacity│ │
│  │ Lines: Visible, curved (35%)        │  │
│  │ Fill: Visible, 40% frequency        │  │
│  │ Wells: 3 (2 attract, 1 repel)       │  │
│  │                                      │  │
│  │ Created: Oct 16, 2025 4:30 PM       │  │
│  │ Modified: Oct 16, 2025 4:45 PM      │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  Import Mode:                               │
│  ○ Replace All (Clear current state)       │
│  ○ Merge Wells (Keep current grid)         │
│                                             │
│  [ Cancel ]              [ Import Config ] │
└─────────────────────────────────────────────┘
```

### 3.3 Error Modal

```
┌─────────────────────────────────────────────┐
│  Invalid Configuration File              [X]│
├─────────────────────────────────────────────┤
│                                             │
│  ⚠️  Unable to import this file             │
│                                             │
│  Errors found:                              │
│  • Missing required field: metadata.name    │
│  • Invalid grid.rows value (must be 5-200) │
│  • Unknown grid type: "octagonal"           │
│                                             │
│  Please check the file and try again.       │
│                                             │
│                      [ Close ]              │
└─────────────────────────────────────────────┘
```

### 3.4 Success Notification

```typescript
// Toast notification (bottom-right)
"✓ Configuration loaded successfully"
// Auto-dismiss after 3 seconds
```

---

## 4. Import Modes

### 4.1 Replace All Mode (Default)
- **Clears**: All current wells, grid config, viewport
- **Applies**: Everything from imported config
- **Use Case**: Loading a saved project, using a template
- **Risk**: Loses current work (should show warning if wells exist)

### 4.2 Merge Wells Mode
- **Keeps**: Current grid configuration
- **Adds**: Wells from imported config to existing wells
- **Adjusts**: Well positions to match current grid scale if different
- **Use Case**: Importing well patterns, combining designs
- **Benefits**: Non-destructive, allows experimentation

### 4.3 Implementation

```typescript
function importConfiguration(config: GridPincherConfig, mode: 'replace' | 'merge') {
  if (mode === 'replace') {
    // Full replacement
    store.setGridConfig(mapJSONToGridConfig(config.grid));
    store.deformation = config.distortion;
    if (config.viewport?.includeInExport) {
      store.setViewport(config.viewport);
    }
  } else if (mode === 'merge') {
    // Keep grid, add wells
    const newWells = config.distortion.wells.map(well => ({
      ...well,
      id: `well-${Date.now()}-${Math.random()}`, // New IDs
    }));
    
    // Add to existing wells
    store.deformation.wells.push(...newWells);
    store.updateDeformedGrid();
  }
}
```

---

## 5. Validation Strategy

### 5.1 Validation Levels

#### Level 1: Structure Validation (Critical)
```typescript
// Must pass to proceed
- Valid JSON syntax
- Has required fields: version, metadata, grid, distortion
- metadata.name exists
- grid object has all required fields
- distortion.wells is an array
```

#### Level 2: Data Type Validation
```typescript
// Strict type checking
- All numbers are actual numbers
- All booleans are actual booleans
- All colors are valid hex strings
- All enums match allowed values
```

#### Level 3: Range Validation
```typescript
// Values within acceptable bounds
- rows: 5-200
- columns: 5-200
- spacing: 5-100
- opacity values: 0-1
- strength: -1 to 1
- etc.
```

#### Level 4: Semantic Validation (Warnings)
```typescript
// Non-critical issues
- Very large grid (>100x100) - performance warning
- Many wells (>20) - performance warning
- Extreme zoom values - usability warning
```

### 5.2 Validation Implementation

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

class ConfigValidator {
  validate(config: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    // Level 1: Structure
    if (!this.validateStructure(config, errors)) {
      return { valid: false, errors, warnings };
    }
    
    // Level 2: Types
    this.validateTypes(config, errors);
    
    // Level 3: Ranges
    this.validateRanges(config, errors);
    
    // Level 4: Semantics
    this.validateSemantics(config, warnings);
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  private validateStructure(config: any, errors: ValidationError[]): boolean {
    // Check required fields exist
    // Return false if critical fields missing
  }
  
  private validateTypes(config: any, errors: ValidationError[]): void {
    // Check all types match expected
  }
  
  private validateRanges(config: any, errors: ValidationError[]): void {
    // Check all numeric values in valid ranges
  }
  
  private validateSemantics(config: any, warnings: ValidationWarning[]): void {
    // Check for performance/usability issues
  }
}
```

---

## 6. Error Handling

### 6.1 Error Categories

| Error Type | User Message | Recovery |
|------------|--------------|----------|
| **File Read Error** | "Unable to read file" | Try different file |
| **Invalid JSON** | "File is not valid JSON" | Show syntax error location |
| **Wrong Format** | "This is not a Grid Pincher configuration" | Check file type |
| **Version Mismatch** | "This file was created with a newer version" | Update app or manual edit |
| **Missing Fields** | "Configuration is incomplete" | List missing fields |
| **Invalid Values** | "Configuration contains invalid values" | List specific errors with line numbers |
| **Corrupted Data** | "File may be corrupted" | Try re-exporting |

### 6.2 Error Display Strategy

```typescript
// Friendly, actionable error messages
Bad:  "Invalid config at line 23"
Good: "Grid rows must be between 5 and 200 (found: 250)"

Bad:  "Parse error"
Good: "Invalid JSON syntax at line 15, column 8: Missing comma"

Bad:  "Bad file"
Good: "This file is missing required information: metadata.name"
```

### 6.3 Safe Failure

```typescript
// If import fails, app state should remain unchanged
try {
  const config = parseAndValidate(file);
  applyConfiguration(config, mode);
  showSuccess();
} catch (error) {
  // App state unchanged
  showError(error);
  // User can try again
}
```

---

## 7. File Picker Implementation

### 7.1 Native File Input

```typescript
function openFilePicker(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.gridpincher,.gridpincher.json,.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      resolve(file || null);
    };
    
    input.oncancel = () => resolve(null);
    
    input.click();
  });
}
```

### 7.2 Drag & Drop (Future Enhancement)

```typescript
// In Canvas component
const handleDrop = async (e: DragEvent) => {
  e.preventDefault();
  
  const file = e.dataTransfer?.files[0];
  if (file && file.name.endsWith('.gridpincher.json')) {
    const config = await configManager.loadConfigFromFile(file);
    showImportPreview(config);
  }
};

<canvas
  onDrop={handleDrop}
  onDragOver={(e) => e.preventDefault()}
/>
```

---

## 8. State Management

### 8.1 New Store Actions

```typescript
interface AppState {
  // ... existing state
  
  // New actions
  importConfiguration: (
    config: GridPincherConfig, 
    mode: 'replace' | 'merge'
  ) => void;
  
  validateConfiguration: (
    config: GridPincherConfig
  ) => ValidationResult;
}
```

### 8.2 Implementation

```typescript
importConfiguration: (config, mode) => {
  const { grid, distortion, viewport } = config;
  
  if (mode === 'replace') {
    // Replace everything
    set((state) => ({
      gridConfig: mapJSONToGridConfig(grid),
      deformation: {
        globalStrength: distortion.globalStrength,
        wells: distortion.wells
      },
      viewport: viewport || state.viewport,
    }));
    
    // Regenerate grids
    get().regenerateGrid();
  } else {
    // Merge wells only
    set((state) => ({
      deformation: {
        ...state.deformation,
        wells: [
          ...state.deformation.wells,
          ...distortion.wells.map(w => ({
            ...w,
            id: `well-${Date.now()}-${Math.random()}`
          }))
        ]
      }
    }));
    
    get().updateDeformedGrid();
  }
}
```

---

## 9. User Experience Enhancements

### 9.1 Confirmation Dialog for Replace Mode

```typescript
// If user has unsaved work (wells exist), warn before replacing
if (mode === 'replace' && currentWells.length > 0) {
  const confirmed = confirm(
    'Replace current configuration?\n\n' +
    'This will remove all current wells and settings. ' +
    'Consider exporting first if you want to save your current work.'
  );
  
  if (!confirmed) return;
}
```

### 9.2 Import History (Future)

```typescript
// Track recently imported files
interface ImportHistory {
  filename: string;
  timestamp: string;
  configName: string;
}

// Store last 10 imports in localStorage
// Quick access menu: "Recent Imports"
```

### 9.3 Keyboard Shortcuts

```typescript
// Cmd/Ctrl + O: Open import dialog
// Cmd/Ctrl + S: Export config
```

---

## 10. Implementation Phases

### Phase 1: Core Import (MVP)
- [ ] File picker UI
- [ ] JSON parsing
- [ ] Basic validation
- [ ] Replace mode only
- [ ] Simple success/error messages
- **Estimated effort:** 4-6 hours

### Phase 2: Enhanced Validation
- [ ] Comprehensive validator class
- [ ] Detailed error messages
- [ ] Range checking
- [ ] Type validation
- **Estimated effort:** 2-3 hours

### Phase 3: Preview & Options
- [ ] Import preview modal
- [ ] Merge wells mode
- [ ] Configuration summary display
- [ ] Mode selection UI
- **Estimated effort:** 3-4 hours

### Phase 4: Polish
- [ ] Drag & drop support
- [ ] Better error modals
- [ ] Confirmation dialogs
- [ ] Toast notifications
- [ ] Keyboard shortcuts
- **Estimated effort:** 2-3 hours

**Total estimated effort:** 11-16 hours

---

## 11. Testing Strategy

### 11.1 Test Cases

#### Happy Path
- [ ] Import valid minimal config
- [ ] Import valid complex config
- [ ] Import in replace mode
- [ ] Import in merge mode
- [ ] Import with viewport
- [ ] Import without viewport

#### Error Cases
- [ ] Invalid JSON syntax
- [ ] Missing required fields
- [ ] Wrong version
- [ ] Invalid numeric ranges
- [ ] Invalid enum values
- [ ] Corrupted file
- [ ] Empty file
- [ ] Non-JSON file

#### Edge Cases
- [ ] Very large grid (200x200)
- [ ] Many wells (50+)
- [ ] No wells
- [ ] Extreme viewport values
- [ ] Future version (higher than current)

### 11.2 Test Files

Create test files in `.workspace/docs/temp/test-configs/`:
- `valid-minimal.json` - Bare minimum valid config
- `valid-complex.json` - Feature-rich config
- `invalid-structure.json` - Missing required fields
- `invalid-ranges.json` - Out-of-range values
- `invalid-syntax.json` - Malformed JSON
- `future-version.json` - Version 2.0.0

---

## 12. Security Considerations

### 12.1 Input Sanitization

```typescript
// Never use eval() or Function() on imported JSON
// Always use JSON.parse()

// Sanitize all string fields
function sanitizeString(str: string): string {
  return str.replace(/<script>/gi, '').substring(0, 1000);
}

// Validate all numeric fields
function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
```

### 12.2 File Size Limits

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

if (file.size > MAX_FILE_SIZE) {
  throw new Error('File too large (max 10 MB)');
}
```

### 12.3 Well Limits

```typescript
const MAX_WELLS = 100;

if (config.distortion.wells.length > MAX_WELLS) {
  throw new Error(`Too many wells (max ${MAX_WELLS})`);
}
```

---

## 13. Accessibility

### 13.1 Keyboard Navigation
- File picker accessible via Tab
- Modal dialogs support Escape to cancel
- Import button has proper ARIA labels

### 13.2 Screen Reader Support
```typescript
<button
  onClick={handleImport}
  aria-label="Import configuration from JSON file"
>
  Import Config
</button>

<dialog
  role="dialog"
  aria-labelledby="import-modal-title"
  aria-describedby="import-modal-description"
>
  ...
</dialog>
```

---

## 14. Documentation

### 14.1 User Guide Section
- How to export configurations
- How to import configurations
- Understanding import modes
- Troubleshooting common errors
- Sharing configurations with others

### 14.2 Developer Documentation
- Configuration schema reference
- Validation rules
- Migration guide for version changes
- API documentation for ConfigManager

---

## 15. Future Enhancements

### 15.1 Configuration Library (v1.2)
- Browse built-in presets
- Community-shared configurations
- Categories and tags
- Search and filter

### 15.2 Batch Import (v1.3)
- Import multiple configurations at once
- Merge multiple configs
- Batch processing

### 15.3 URL Import (v1.4)
- Load config from URL parameter
- Share via link: `?config=https://...`
- Deep linking support

### 15.4 Auto-save (v1.5)
- Auto-save to localStorage
- Recover unsaved work
- Version history

### 15.5 Cloud Sync (v2.0)
- Save to cloud storage
- Sync across devices
- Collaborative editing

---

## 16. Success Metrics

- **Usability:** 90% of imports succeed without errors
- **Discoverability:** Users find import within 30 seconds
- **Reliability:** Zero data loss during import failures
- **Performance:** Import completes in < 1 second for typical configs
- **Satisfaction:** Users rate import experience 4+ stars

---

## 17. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Data loss during import** | High | Implement safe failure, no state change on error |
| **Invalid configs crash app** | High | Comprehensive validation before applying |
| **Confusing error messages** | Medium | User-friendly messages with specific fixes |
| **Poor performance with large configs** | Medium | File size limits, well count limits |
| **Version compatibility issues** | Medium | Clear version checking, migration strategy |

---

## 18. Appendix: Code Snippets

### 18.1 Main Import Function

```typescript
async function handleImportConfig() {
  try {
    // 1. Pick file
    const file = await openFilePicker();
    if (!file) return;
    
    // 2. Load and parse
    const config = await configManager.loadConfigFromFile(file);
    
    // 3. Validate
    const validation = configManager.validateConfig(config);
    if (!validation.valid) {
      showErrorModal(validation.errors);
      return;
    }
    
    // 4. Show preview
    const { confirmed, mode } = await showImportPreview(config);
    if (!confirmed) return;
    
    // 5. Apply configuration
    store.importConfiguration(config, mode);
    
    // 6. Success
    showSuccessToast('Configuration loaded successfully');
    
  } catch (error) {
    showErrorModal([{
      field: 'file',
      message: error.message,
      severity: 'error'
    }]);
  }
}
```

---

## 19. Next Steps

1. Review this plan with stakeholders
2. Create UI mockups for modals
3. Implement Phase 1 (Core Import)
4. Create test files
5. User testing
6. Iterate based on feedback
7. Implement remaining phases

---

## 20. Conclusion

The import functionality will complete the save/load cycle for Grid Pincher, enabling:
- ✅ Saving and restoring work sessions
- ✅ Sharing designs with others
- ✅ Building template libraries
- ✅ Experimentation without fear of losing work
- ✅ Collaboration and community sharing

With careful validation, clear error messages, and thoughtful UX, import will be as smooth and intuitive as export.

**Recommendation:** Proceed with Phase 1 implementation after plan approval.

