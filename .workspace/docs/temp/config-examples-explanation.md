# Configuration JSON Examples - Explanation

## Overview
I've created three example JSON configuration files that demonstrate the complete state capture for the Grid Pincher app.

---

## File Structure Breakdown

### Top Level
```json
{
  "version": "1.0.0",           // Schema version for compatibility
  "metadata": { ... },          // User-provided info and timestamps
  "grid": { ... },              // All visual grid settings
  "distortion": { ... },        // Wells and deformation
  "viewport": { ... }           // Optional camera position
}
```

---

## Section Details

### 1. Metadata Section
```json
"metadata": {
  "name": "Pattern Name",                    // User-provided name
  "description": "Optional description",     // Longer explanation
  "createdAt": "2025-10-16T16:30:45.123Z",  // ISO 8601 timestamp
  "modifiedAt": "2025-10-16T16:45:22.456Z", // Last edit timestamp
  "tags": ["tag1", "tag2"],                  // Searchable tags
  "author": "Username"                       // Optional attribution
}
```

### 2. Grid Section
Captures ALL visual appearance settings:

```json
"grid": {
  "type": "square",              // square | triangular | hexagonal
  "rows": 30,                    // Grid height (5-200)
  "columns": 30,                 // Grid width (5-200)
  "spacing": 20,                 // Distance between points (5-100)
  
  "points": {
    "show": true,                // Visibility toggle
    "size": 2,                   // Radius (0.5-5)
    "color": "#1f2937",          // Hex color
    "opacity": 0.8               // Transparency (0-1)
  },
  
  "lines": {
    "show": true,                // Visibility toggle
    "width": 1.5,                // Thickness (0.5-10)
    "frequency": 1.0,            // How many to draw (0-1, 1=all)
    "curvature": 0.0,            // Curve amount (0-1, 0=straight)
    "color": "#6366f1",          // Hex color
    "opacity": 0.8               // Transparency (0-1)
  },
  
  "fill": {
    "show": false,               // Visibility toggle
    "frequency": 1.0,            // How many faces to fill (0-1)
    "color": "#3b82f6",          // Hex color
    "opacity": 0.3,              // Transparency (0-1)
    "blendMode": "normal"        // CSS blend mode
  },
  
  "canvas": {
    "backgroundColor": "#f9fafb" // Background color (hex)
  }
}
```

### 3. Distortion Section
Captures all wells (attract/repel points):

```json
"distortion": {
  "globalStrength": 1.0,         // Master intensity multiplier
  "wells": [
    {
      "id": "well-1697476845123", // Unique identifier (timestamp-based)
      "position": {
        "x": 350,                  // X coordinate in grid space
        "y": 400                   // Y coordinate in grid space
      },
      "strength": 0.75,            // Force (-1 to 1, negative=repel)
      "radius": 220,               // Area of effect (50-500)
      "falloff": "smooth",         // linear | quadratic | exponential | smooth
      "distortion": 0.3,           // Chaos amount (0-1)
      "enabled": true,             // Active/inactive toggle
      "showRadialLines": false     // Visual helper lines
    }
    // ... more wells
  ]
}
```

### 4. Viewport Section (Optional)
Saves the camera position and zoom:

```json
"viewport": {
  "x": -50,                      // Pan X offset
  "y": -30,                      // Pan Y offset
  "zoom": 1.2,                   // Zoom level (0.1-5)
  "includeInExport": true        // Whether to restore viewport
}
```

---

## Example Files

### 1. `example-config-minimal.json`
**Use Case:** Default starting point, clean slate

- Square grid, 30x30
- Default colors and settings
- No wells (no distortion)
- Shows the simplest possible configuration

**When to use:**
- Starting a new project
- Teaching/demo purposes
- Default template

---

### 2. `example-config.json`
**Use Case:** Typical artistic project

- Hexagonal grid, 50x50 (medium complexity)
- Curved lines with 85% frequency
- Fill with multiply blend (layered look)
- 3 wells creating organic flow
- Mix of attract and repel forces
- Some chaos/distortion
- Professional color palette

**When to use:**
- Most real-world designs
- Good balance of features
- Template for variations

---

### 3. `example-config-complex.json`
**Use Case:** Advanced artistic exploration

- Triangular grid, 120x120 (very dense)
- High curvature (0.85) with thick lines (4.5px)
- Heavy distortion and chaos
- 7 wells (6 active, 1 disabled)
- Radial lines on some wells
- Dark background (#0a0a0a)
- Psychedelic color scheme
- Multiple blend modes

**When to use:**
- Complex artistic pieces
- Maximum feature demonstration
- Stress testing
- Advanced user templates

---

## File Size Estimates

Based on these examples:

| Configuration | Wells | File Size | Description |
|---------------|-------|-----------|-------------|
| Minimal       | 0     | ~500 bytes | Bare minimum |
| Typical       | 3     | ~900 bytes | Average use |
| Complex       | 7     | ~1.8 KB    | Feature-rich |
| Maximum*      | 50+   | ~10 KB     | Edge case |

*Assuming reasonable maximum of ~50 wells

---

## Important Implementation Notes

### Well IDs
```javascript
// Generated using timestamp to ensure uniqueness
id: `well-${Date.now()}`
// Example: "well-1697476845123"
```

### Timestamps
```javascript
// ISO 8601 format for international compatibility
createdAt: new Date().toISOString()
// Example: "2025-10-16T16:30:45.123Z"
```

### Colors
All colors stored as hex strings:
```
"#1f2937"  // Valid
"#f00"     // Valid (3-digit)
"rgb(255, 0, 0)" // Convert to hex before storing
```

### Numeric Ranges
All values validated on import:
```
opacity: 0.0 - 1.0
strength: -1.0 - 1.0
frequency: 0.0 - 1.0
curvature: 0.0 - 1.0
rows/columns: 5 - 200
spacing: 5 - 100
pointSize: 0.5 - 5.0
lineWidth: 0.5 - 10.0
radius: 50 - 500
zoom: 0.1 - 5.0
```

---

## Round-Trip Guarantee

A configuration exported and then imported should produce **identical visual results**:

```
Current App State 
    ↓ EXPORT
JSON File
    ↓ IMPORT
Restored App State
    = IDENTICAL APPEARANCE
```

The only differences might be:
- New well IDs (regenerated)
- Updated `modifiedAt` timestamp
- Recalculated derived values (baseGrid, deformedGrid)

---

## Usage Examples

### Export Current State
```typescript
// User clicks "Download" → "Configuration (JSON)"
const config = {
  version: "1.0.0",
  metadata: {
    name: userProvidedName,
    description: userProvidedDescription,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    tags: userProvidedTags
  },
  grid: mapGridConfigToJSON(store.gridConfig),
  distortion: {
    globalStrength: store.deformation.globalStrength,
    wells: store.deformation.wells
  },
  viewport: includeViewport ? store.viewport : undefined
};

downloadJSON(config, `${config.metadata.name}.gridpincher`);
```

### Import Configuration
```typescript
// User selects .gridpincher file
const file = await selectFile();
const json = await file.text();
const config = JSON.parse(json);

// Validate
if (config.version !== "1.0.0") {
  throw new Error("Unsupported version");
}

// Apply to store
store.setGridConfig(mapJSONToGridConfig(config.grid));
store.deformation = config.distortion;
if (config.viewport?.includeInExport) {
  store.setViewport(config.viewport);
}
```

---

## Future Enhancements

### Compression (v1.1)
For very large configurations:
```typescript
// Before save
const compressed = pako.gzip(JSON.stringify(config));
// File extension: .gridpincher.gz

// On load
const json = pako.ungzip(compressed, { to: 'string' });
```

### Presets (v1.2)
Built-in configurations shipped with app:
```
/presets/
  ├── organic-flow.gridpincher
  ├── geometric-precision.gridpincher
  ├── chaotic-energy.gridpincher
  └── minimal-zen.gridpincher
```

### Cloud Sync (v2.0)
```json
"metadata": {
  "cloudSync": {
    "enabled": true,
    "lastSyncedAt": "2025-10-16T17:00:00.000Z",
    "userId": "user123",
    "shareUrl": "https://gridpincher.app/share/abc123"
  }
}
```

---

## Validation Checklist

When importing a configuration, validate:

- ✅ Valid JSON syntax
- ✅ `version` field present and supported
- ✅ `metadata.name` present (required)
- ✅ `grid` object present with all required fields
- ✅ `distortion` object present
- ✅ All numeric values within valid ranges
- ✅ All enum values are valid (gridType, falloff, blendMode)
- ✅ All colors are valid hex strings
- ✅ Well IDs are unique
- ✅ No circular references or malformed objects

---

## Summary

The JSON configuration format:
- **Complete:** Captures 100% of visual state
- **Portable:** Works across browsers and systems
- **Human-readable:** Can be manually edited
- **Versionable:** Works with git and other VCS
- **Extensible:** Easy to add new fields
- **Validated:** Type-safe with comprehensive checks

File sizes are very reasonable (< 2KB for most cases), making it practical for sharing and storage.

