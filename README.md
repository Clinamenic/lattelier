# Lattelier - Lattice Distortion & Pattern Studio

A professional, client-side web application for creating distorted lattice patterns and parametric graphics using well-based deformation.

## Features

- **Interactive Grid Generation**: Square, triangular, and hexagonal patterns with up to 200×200 points
- **Well-Based Deformation**: Attract or repel points to create organic distortions
- **Advanced Distortion Controls**:
  - Multiple falloff curves (linear, quadratic, exponential, smooth)
  - Adjustable distortion/scrambling within well radius
  - Radial line visualization
- **Flexible Styling**:
  - Configurable points, lines, and fill with individual opacity controls
  - Line frequency and curvature for sparse or filled patterns
  - Blend modes for creative layer interactions
  - Custom canvas background colors
- **Multiple Export Options**:
  - PNG at multiple resolutions (1×, 2×, 4×, 8×, 16×)
  - SVG for unlimited scalability
  - JSON configuration export/import
- **Professional Workflow**:
  - Pan and zoom canvas controls
  - Collapsible side panels
  - Hover preview for well identification
  - Save and load configurations
- **100% Client-Side**: No server required, runs entirely in your browser
- **Permanent Storage**: Deployable to Arweave for permanent, decentralized hosting

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Deploy to Arweave

Lattelier is designed to be deployed to [Arweave](https://arweave.org), a permanent, decentralized storage network.

**Automated Deployment (Recommended):**

Lattelier includes pre-configured deployment scripts:

```bash
# Production deployment with confirmation
npm run deploy

# Development deployment
npm run deploy:dev

# Quick deployment (minimal logging)
npm run deploy:quick
```

**Prerequisites:**
1. Install [arkb](https://github.com/textury/arkb): `npm install -g arkb`
2. Get an [Arweave wallet](https://arweave.app) with AR tokens
3. Save your wallet to `.workspace/config/wallet.json`

**Manual Deployment:**

```bash
# 1. Build the app
npm run build

# 2. Deploy with arkb
arkb deploy dist/ --wallet .workspace/config/wallet.json
```

**Deployment Guide:**

For detailed instructions, troubleshooting, and best practices, see:
- [Arweave Deployment Guide](.workspace/docs/temp/arweave-deployment-guide.md)

**Alternative Tools:**
- **[ArDrive](https://ardrive.io)**: Drag and drop the `dist/` folder
- **[Bundlr](https://bundlr.network)**: Fast, reliable uploads
- **[ar.io](https://ar.io)**: Decentralized gateways and ArNS names

Your Lattelier deployment will be **permanently accessible** and **immutable** on the permaweb!

## How to Use

### Tools & Navigation

**Tools Panel** (right sidebar):
- **Pan Tool**: Click and drag to navigate the canvas
- **Place Well Tool**: Click to add distortion points, drag to move existing wells

**Navigation:**
- **Mouse Wheel**: Zoom in/out
- **Middle/Right Click**: Pan (works with any tool)

### Canvas Settings (Left Sidebar)

**Grid:**
- Type: Square, triangular, or hexagonal patterns
- Rows/Columns: 5-200 (higher = denser grid)
- Spacing: Distance between points

**Points:**
- Toggle visibility, adjust size, color, and opacity

**Lines:**
- Toggle connections between points
- Frequency: Percentage of connections to draw (100% = all, 0% = none)
- Curvature: Straight lines (0%) to filled curved bands (100%)
- Width, color, and opacity controls

**Fill:**
- Fill grid cells (squares, triangles, hexagons)
- Frequency: Percentage of cells to fill
- Color, opacity, and blend mode

**Canvas:**
- Background color (confined to grid area in exports)

### Distortion Settings (Right Sidebar)

**Wells:**
- **Strength**: -100% (repel) to +100% (attract)
  - Positive: Points attracted toward well center
  - Negative: Points repelled to well perimeter
- **Radius**: Area of influence (50-500px)
- **Falloff**: How strength diminishes with distance
- **Distortion**: Random scrambling within radius (0-100%)
- **Radial Lines**: Toggle lines from affected points to well center

**Hover over wells** in the list to preview them on canvas!

### Export & Import

**Download (Top toolbar):**
- **PNG**: Multiple resolutions (1×-16×) with browser limit warnings
- **SVG**: Unlimited resolution vector graphics

**Export Config:**
- Save your entire setup as JSON (grid + wells + viewport)
- Filename is auto-generated content hash

**Import Config:**
- **Replace All**: Load complete configuration
- **Merge Wells**: Keep current grid, add imported wells

## Technology Stack

- **Vite**: Build tool
- **React**: UI framework
- **TypeScript**: Type safety
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **Canvas API**: Rendering

## License

MIT

