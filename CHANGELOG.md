# Changelog

All notable changes to Lattelier will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.0 - 2025-10-17

### Added
- Initial release of Lattelier (formerly Grid Pincher)
- Interactive grid generation with square, triangular, and hexagonal patterns
- Well-based deformation system with attract/repel forces
- Advanced distortion controls:
  - Multiple falloff curves (linear, quadratic, exponential, smooth)
  - Adjustable distortion/scrambling within well radius
  - Radial line visualization
- Flexible styling system:
  - Individual opacity controls for points, lines, and fill
  - Line frequency and curvature controls
  - Multiple blend modes
  - Custom canvas background colors
- Multi-resolution export:
  - PNG export at 1×, 2×, 4×, 8×, and 16× resolutions
  - SVG export for unlimited scalability
  - Browser limit validation with warnings
- Configuration management:
  - JSON export/import for saving and loading setups
  - Content-hash based filenames
  - Replace All and Merge Wells import modes
- Professional UI:
  - Collapsible left (Canvas Settings) and right (Distortion) panels
  - Pan and Place Well tools with clear visual feedback
  - Hover preview for well identification
  - Comprehensive in-app guide modal
- Pan and zoom canvas controls
- Real-time grid updates
- 100% client-side operation
- Arweave deployment support for permanent hosting

### Changed
- Renamed from "Grid Pincher" to "Lattelier"
- Migrated project structure from nested `grid-pincher-app/` to root level
- Enhanced README with comprehensive usage guide and Arweave deployment instructions

### Technical
- React 18 + TypeScript for type-safe development
- Vite for fast builds and development
- Zustand for lightweight state management
- Tailwind CSS for modern styling
- HTML5 Canvas for high-performance rendering
- File System Access API for improved file saving (with legacy fallback)

