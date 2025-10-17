# Configuration Export/Import Design Document
## Grid Pincher App - State Persistence System

**Date:** October 16, 2025  
**Status:** Design Proposal  
**Version:** 1.0

---

## Executive Summary

This document outlines the design for a comprehensive configuration export/import system for the Grid Pincher application. The system will allow users to save their work, share configurations with others, and maintain a library of presets.

---

## 1. Configuration Scope

### 1.1 Core Data to Persist

The configuration file should capture all user-adjustable state that defines the visual output:

#### **Grid Configuration** (Complete)
- Grid type (square/triangular/hexagonal)
- Dimensions (rows, columns, spacing)
- Point settings (size, color, opacity, visibility)
- Line settings (width, frequency, curvature, color, opacity, visibility)
- Fill settings (frequency, color, opacity, blend mode, visibility)
- Canvas background color

#### **Distortion Configuration** (Complete)
- Wells array with all properties:
  - Position (x, y coordinates)
  - Strength (-1 to 1)
  - Radius
  - Falloff type
  - Distortion amount
  - Enabled state
  - Radial lines visibility
- Global strength multiplier

#### **Viewport State** (Optional)
- Pan position (x, y)
- Zoom level
- Note: This could be optional since it's navigation state

#### **Metadata** (Recommended)
- Creation timestamp
- Last modified timestamp
- App version
- User-provided name/description
- Tags for organization

### 1.2 Data NOT to Persist

These are derived or transient values that should be recalculated:
- `baseGrid` - Regenerated from `gridConfig`
- `deformedGrid` - Recalculated from `baseGrid` + `wells`
- `selectedWellId` - UI state
- `isDragging` - Transient interaction state
- `dragStart` - Transient interaction state
- `activeTool` - UI preference
- `leftSidebarCollapsed` / `rightSidebarCollapsed` - UI preferences (persisted separately in localStorage)

---

## 2. JSON Schema Design

### 2.1 Proposed Schema Structure

```json
{
  "$schema": "https://gridpincher.app/schema/v1.json",
  "version": "1.0.0",
  "metadata": {
    "name": "Organic Flow Pattern",
    "description": "Hexagonal grid with multiple attraction points",
    "createdAt": "2025-10-16T15:30:00Z",
    "modifiedAt": "2025-10-16T16:45:00Z",
    "tags": ["organic", "hexagonal", "blue-theme"],
    "author": "User Name (optional)"
  },
  "grid": {
    "type": "hexagonal",
    "rows": 50,
    "columns": 50,
    "spacing": 25,
    "points": {
      "show": true,
      "size": 2,
      "color": "#1f2937",
      "opacity": 0.8
    },
    "lines": {
      "show": true,
      "width": 1.5,
      "frequency": 1.0,
      "curvature": 0.0,
      "color": "#6366f1",
      "opacity": 0.8
    },
    "fill": {
      "show": false,
      "frequency": 1.0,
      "color": "#3b82f6",
      "opacity": 0.3,
      "blendMode": "normal"
    },
    "canvas": {
      "backgroundColor": "#f9fafb"
    }
  },
  "distortion": {
    "globalStrength": 1.0,
    "wells": [
      {
        "id": "well-1697123456789",
        "position": { "x": 300, "y": 400 },
        "strength": 0.75,
        "radius": 200,
        "falloff": "smooth",
        "distortion": 0.2,
        "enabled": true,
        "showRadialLines": false
      },
      {
        "id": "well-1697123456790",
        "position": { "x": 800, "y": 600 },
        "strength": -0.5,
        "radius": 150,
        "falloff": "exponential",
        "distortion": 0.0,
        "enabled": true,
        "showRadialLines": true
      }
    ]
  },
  "viewport": {
    "x": 50,
    "y": 50,
    "zoom": 1.0,
    "includeInExport": false
  }
}
```

### 2.2 TypeScript Interface

```typescript
export interface GridPincherConfig {
  $schema?: string;
  version: string;
  metadata: {
    name: string;
    description?: string;
    createdAt: string; // ISO 8601
    modifiedAt: string; // ISO 8601
    tags?: string[];
    author?: string;
  };
  grid: {
    type: 'square' | 'triangular' | 'hexagonal';
    rows: number;
    columns: number;
    spacing: number;
    points: {
      show: boolean;
      size: number;
      color: string;
      opacity: number;
    };
    lines: {
      show: boolean;
      width: number;
      frequency: number;
      curvature: number;
      color: string;
      opacity: number;
    };
    fill: {
      show: boolean;
      frequency: number;
      color: string;
      opacity: number;
      blendMode: string;
    };
    canvas: {
      backgroundColor: string;
    };
  };
  distortion: {
    globalStrength: number;
    wells: Array<{
      id: string;
      position: { x: number; y: number };
      strength: number;
      radius: number;
      falloff: 'linear' | 'quadratic' | 'exponential' | 'smooth';
      distortion: number;
      enabled: boolean;
      showRadialLines: boolean;
    }>;
  };
  viewport?: {
    x: number;
    y: number;
    zoom: number;
    includeInExport: boolean;
  };
}
```

---

## 3. Implementation Considerations

### 3.1 File Format Options

#### **Option A: JSON (Recommended)**
- **Pros:**
  - Human-readable
  - Easy to edit manually
  - Standard web format
  - Diff-friendly for version control
  - No external dependencies
- **Cons:**
  - Larger file size than binary
  - No native compression
- **File Extension:** `.gridpincher` or `.gp.json`

#### **Option B: Compressed JSON**
- **Pros:**
  - Smaller file size
  - Still JSON-based
- **Cons:**
  - Not human-readable
  - Requires decompression library
- **Implementation:** Use pako or similar library

#### **Option C: Binary Format**
- **Pros:**
  - Smallest file size
  - Fastest parsing
- **Cons:**
  - Not human-readable
  - More complex implementation
  - Harder to debug

**Recommendation:** Start with JSON (Option A) for ease of development and user friendliness. Add compression as a future enhancement if needed.

### 3.2 Validation Requirements

#### **Schema Validation**
- Validate against JSON schema on import
- Check version compatibility
- Provide clear error messages for invalid files

#### **Data Integrity Checks**
- Validate numeric ranges (e.g., opacity 0-1, strength -1 to 1)
- Verify color formats (hex, rgb, rgba)
- Check for required fields
- Sanitize well IDs to prevent duplicates

#### **Migration Strategy**
- Support multiple schema versions
- Automatic migration from older versions
- Preserve unknown fields for forward compatibility

### 3.3 UI Integration Points

#### **Export Flow**
1. User clicks "Download" → New menu item: "Configuration (JSON)"
2. Modal/dialog opens with:
   - Configuration name input
   - Description textarea (optional)
   - Tags input (optional)
   - Viewport inclusion checkbox
   - Export button
3. Generate JSON with metadata
4. Download as `.gridpincher` file

#### **Import Flow**
1. New button in Toolbar: "Load Configuration"
2. File picker opens (accept: `.gridpincher,.json`)
3. Parse and validate JSON
4. Show preview/confirmation modal:
   - Configuration name and metadata
   - Preview of settings
   - Option to merge wells vs. replace all
   - Import button
5. Apply configuration to store
6. Regenerate grid and deformation

#### **Preset Library** (Future Enhancement)
- Built-in preset configurations
- Browse and apply presets
- Community-shared presets
- Local preset management

---

## 4. Code Implementation Plan

### 4.1 New Files to Create

```
src/
├── types/
│   └── config.ts              # GridPincherConfig interface
├── core/
│   ├── config-manager.ts      # Export/import/validation logic
│   └── config-validator.ts    # JSON schema validation
├── components/
│   ├── ExportConfigModal.tsx  # Export dialog
│   └── ImportConfigModal.tsx  # Import dialog
└── utils/
    └── config-migration.ts    # Version migration utilities
```

### 4.2 Core Functions

```typescript
// config-manager.ts
export class ConfigManager {
  // Export current state to config object
  exportConfig(
    gridConfig: GridConfig,
    deformation: DeformationConfig,
    viewport: Viewport,
    metadata: Partial<ConfigMetadata>
  ): GridPincherConfig;

  // Serialize config to JSON string
  serializeConfig(config: GridPincherConfig): string;

  // Parse JSON string to config object
  parseConfig(json: string): GridPincherConfig;

  // Validate config structure and values
  validateConfig(config: GridPincherConfig): ValidationResult;

  // Import config into app state
  importConfig(
    config: GridPincherConfig,
    mergeWells: boolean
  ): ImportResult;

  // Download config as file
  downloadConfig(config: GridPincherConfig, filename: string): void;

  // Load config from file
  loadConfigFromFile(file: File): Promise<GridPincherConfig>;
}
```

### 4.3 Store Integration

Add new actions to `app-store.ts`:

```typescript
interface AppState {
  // ... existing state

  // New configuration actions
  exportConfiguration: (metadata: Partial<ConfigMetadata>) => GridPincherConfig;
  importConfiguration: (config: GridPincherConfig, mergeWells: boolean) => void;
}
```

---

## 5. Use Cases

### 5.1 Primary Use Cases

1. **Save Work in Progress**
   - User working on complex pattern with multiple wells
   - Saves configuration to return later
   - Preserves exact state including well positions

2. **Share Designs**
   - User creates interesting pattern
   - Exports configuration
   - Shares file with colleague or online
   - Recipient imports and sees identical setup

3. **Template Library**
   - Power users create reusable templates
   - Starter configurations for different styles
   - Quick project initialization

4. **Version Control**
   - Track iterations of a design
   - Compare different versions
   - Rollback to previous states

5. **Batch Processing** (Future)
   - Export multiple configurations
   - Apply same settings to different grids
   - Automation workflows

### 5.2 Example Workflow

```
User A creates pattern:
1. Sets up 50x50 hexagonal grid
2. Places 5 wells with various strengths
3. Adjusts colors and opacity
4. Exports as "organic-flow.gridpincher"

User A shares file with User B:
5. User B opens Grid Pincher app
6. Clicks "Load Configuration"
7. Selects "organic-flow.gridpincher"
8. App shows preview of settings
9. User B clicks Import
10. Exact pattern appears
11. User B can modify and export variations
```

---

## 6. Error Handling

### 6.1 Import Errors

| Error Type | User Message | Recovery Action |
|------------|--------------|-----------------|
| Invalid JSON | "File is not valid JSON" | Show JSON syntax error location |
| Wrong schema | "File is not a Grid Pincher configuration" | Check for $schema field |
| Version too new | "This file requires a newer version of Grid Pincher" | Show required version |
| Missing required fields | "Configuration is incomplete" | List missing fields |
| Invalid values | "Configuration contains invalid values" | List validation errors with line numbers |
| File too large | "Configuration file is too large" | Suggest simplification |

### 6.2 Export Errors

| Error Type | User Message | Recovery Action |
|------------|--------------|-----------------|
| No permission | "Cannot save file to this location" | Prompt for different location |
| Disk full | "Not enough space to save file" | Check available space |
| Name conflict | "File already exists" | Confirm overwrite |

---

## 7. Security Considerations

### 7.1 Input Validation
- Never use `eval()` on imported JSON
- Sanitize all string inputs
- Validate numeric ranges
- Check for malicious data types

### 7.2 Size Limits
- Maximum file size: 10MB
- Maximum wells: 1000
- Maximum grid dimensions: 1000x1000
- Prevent denial-of-service via large configs

### 7.3 Privacy
- No automatic uploading of configurations
- No tracking of user configurations
- Metadata fields are optional
- Author field is not required

---

## 8. Testing Strategy

### 8.1 Test Cases

1. **Round-trip Test**
   - Export configuration → Import same file → Verify identical state

2. **Edge Cases**
   - Empty wells array
   - Minimum/maximum values
   - Special characters in metadata
   - Large configurations

3. **Version Migration**
   - Import v1.0 file into v2.0 app
   - Verify automatic migration

4. **Error Handling**
   - Corrupted JSON
   - Missing fields
   - Invalid data types
   - Out-of-range values

5. **Cross-browser**
   - Export in Chrome, import in Firefox
   - Verify file download/upload works

### 8.2 Validation Test Suite

```typescript
describe('ConfigManager', () => {
  it('exports valid configuration');
  it('imports exported configuration');
  it('validates correct schema');
  it('rejects invalid schema');
  it('migrates old versions');
  it('handles missing optional fields');
  it('sanitizes user input');
  it('respects size limits');
});
```

---

## 9. Future Enhancements

### 9.1 Short-term (v1.1)
- Compress JSON with gzip
- Add thumbnail preview to config
- Preset library with 10+ built-in patterns
- Keyboard shortcut for export (Ctrl+S)
- Drag-and-drop import

### 9.2 Medium-term (v1.2)
- Cloud storage integration
- Configuration history (undo/redo)
- Compare two configurations
- Batch export multiple variations

### 9.3 Long-term (v2.0)
- Animation keyframes in config
- Parameterized templates
- Configuration marketplace
- API for programmatic generation
- Command-line export tool

---

## 10. File Format Examples

### 10.1 Minimal Configuration

```json
{
  "version": "1.0.0",
  "metadata": {
    "name": "Simple Grid",
    "createdAt": "2025-10-16T15:30:00Z",
    "modifiedAt": "2025-10-16T15:30:00Z"
  },
  "grid": {
    "type": "square",
    "rows": 20,
    "columns": 20,
    "spacing": 30,
    "points": { "show": true, "size": 2, "color": "#000000", "opacity": 1 },
    "lines": { "show": true, "width": 1, "frequency": 1, "curvature": 0, "color": "#000000", "opacity": 1 },
    "fill": { "show": false, "frequency": 1, "color": "#cccccc", "opacity": 0.5, "blendMode": "normal" },
    "canvas": { "backgroundColor": "#ffffff" }
  },
  "distortion": {
    "globalStrength": 1.0,
    "wells": []
  }
}
```

### 10.2 Complex Configuration

```json
{
  "version": "1.0.0",
  "metadata": {
    "name": "Psychedelic Mesh",
    "description": "High-frequency triangular grid with chaotic distortion",
    "createdAt": "2025-10-16T15:30:00Z",
    "modifiedAt": "2025-10-16T17:22:00Z",
    "tags": ["complex", "colorful", "artistic"],
    "author": "DesignExplorer42"
  },
  "grid": {
    "type": "triangular",
    "rows": 80,
    "columns": 80,
    "spacing": 15,
    "points": {
      "show": false,
      "size": 1,
      "color": "#ff00ff",
      "opacity": 0.6
    },
    "lines": {
      "show": true,
      "width": 2.5,
      "frequency": 0.7,
      "curvature": 0.8,
      "color": "#00ffff",
      "opacity": 0.9
    },
    "fill": {
      "show": true,
      "frequency": 0.3,
      "color": "#ff6600",
      "opacity": 0.4,
      "blendMode": "multiply"
    },
    "canvas": {
      "backgroundColor": "#0a0a0a"
    }
  },
  "distortion": {
    "globalStrength": 1.0,
    "wells": [
      {
        "id": "well-1697123456789",
        "position": { "x": 400, "y": 300 },
        "strength": 0.85,
        "radius": 250,
        "falloff": "smooth",
        "distortion": 0.6,
        "enabled": true,
        "showRadialLines": false
      },
      {
        "id": "well-1697123456790",
        "position": { "x": 800, "y": 500 },
        "strength": -0.7,
        "radius": 180,
        "falloff": "exponential",
        "distortion": 0.8,
        "enabled": true,
        "showRadialLines": true
      },
      {
        "id": "well-1697123456791",
        "position": { "x": 600, "y": 700 },
        "strength": 0.3,
        "radius": 300,
        "falloff": "linear",
        "distortion": 0.2,
        "enabled": true,
        "showRadialLines": false
      }
    ]
  },
  "viewport": {
    "x": -120,
    "y": -80,
    "zoom": 1.5,
    "includeInExport": true
  }
}
```

---

## 11. Implementation Timeline

### Phase 1: Foundation (Week 1)
- [ ] Create TypeScript interfaces
- [ ] Implement ConfigManager core functions
- [ ] Add export to JSON functionality
- [ ] Basic validation

### Phase 2: UI Integration (Week 2)
- [ ] Export dialog with metadata inputs
- [ ] Import file picker
- [ ] Preview before import
- [ ] Error handling UI

### Phase 3: Polish (Week 3)
- [ ] Comprehensive testing
- [ ] Documentation
- [ ] Example configurations
- [ ] User guide

### Phase 4: Advanced Features (Future)
- [ ] Preset library
- [ ] Version migration
- [ ] Compression
- [ ] Cloud storage

---

## 12. Success Metrics

- **Usability:** 95% of exports can be re-imported successfully
- **Reliability:** No data loss during round-trip export/import
- **Performance:** Export/import completes in < 1 second for typical configs
- **Adoption:** 30% of users utilize export/import within first month

---

## 13. Conclusion

The configuration export/import system will significantly enhance the Grid Pincher app by:
1. Enabling users to save and restore their work
2. Facilitating collaboration and sharing
3. Supporting template-based workflows
4. Providing a foundation for future features

**Recommendation:** Proceed with implementation of Phase 1 (JSON export/import) as the foundation is well-defined and low-risk.

