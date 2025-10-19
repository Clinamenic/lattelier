# Changelog

All notable changes to Lattelier will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.2.0 - 2025-10-17

### Added
- **Complete CSS Architecture Overhaul**: Replaced Tailwind CSS with custom, semantic CSS system
- **Component-Based Styling**: Implemented isolated CSS files for each component
- **Design System**: Comprehensive design tokens with CSS custom properties
- **Enhanced UI Components**: Redesigned all components with consistent styling patterns
- **Performance Optimizations**: Reduced bundle size and improved rendering performance
- **Planning Documentation**: Added comprehensive planning documents for future features
  - Partial fill patterns planning document
  - Alternative grid types implementation guide
  - Component migration strategies
  - CSS architecture design documentation

### Changed
- **Styling System**: Complete migration from Tailwind CSS to custom CSS architecture
- **Component Structure**: Updated all React components with new CSS classes
- **Build Configuration**: Updated PostCSS configuration for custom CSS processing
- **Bundle Size**: Significantly reduced JavaScript bundle size by removing Tailwind dependency

### Technical
- **CSS Architecture**: Implemented semantic, maintainable CSS with component isolation
- **Design Tokens**: Established comprehensive design system with CSS variables
- **Build System**: Updated build pipeline for custom CSS processing
- **Performance**: Improved rendering performance and reduced memory usage

## 0.1.0 - 2025-10-17

https://cbnokgudbje6c42fkt7b4odf7kltyonibpqiq5kwg4uyqcvjvxvq.arweave.net/EFrlGoMKSeFzRVT-Hjhl-pc8OagL4Ih1VjcpiAqpres/

### Added
- Initial release of Lattelier (formerly Grid Pincher)
- Interactive grid generation with square and triangular patterns
- Well-based deformation system with attract/repel forces
- Advanced distortion controls:
  - Multiple falloff curves (linear, quadratic, exponential, smooth)
  - Adjustable distortion/scrambling within well radius
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

