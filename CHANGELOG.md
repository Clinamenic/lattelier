# Changelog

All notable changes to Lattelier will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.5.0 - 2025-10-29

https://arweave.net/aXZA2vrOnD5QvOOvRZQYJMlwLSCmECAYrgMU0IQRk7U

### Added

- **Header Component**: New dedicated Header component with two-tier system (navbar + toolbar)
- **Icon System**: Centralized icon component (`icons.tsx`) for consistent SVG icon usage across the application
- **Header Styling**: New header.css with semantic navbar and toolbar styles for improved visual hierarchy

### Changed

- **Component Architecture**: Migrated toolbar functionality from Toolbar component to new Header component
- **Button System**: Simplified button variants and styling patterns for better maintainability
- **Form Components**: Streamlined form styling with reduced complexity
- **Layout Structure**: Enhanced visual hierarchy with fixed navbar and collapsible toolbar sections
- **Component Organization**: Consolidated toolbar state and actions in Header component for better state management

### Technical

- **CSS Architecture**: Updated header.css with semantic navbar and toolbar styles
- **Component Refactoring**: Restructured UI components for improved organization and maintainability
- **Icon Architecture**: Centralized icon definitions in icons.tsx for maintainability and consistency

### Deployment

- **Transaction ID**: aXZA2vrOnD5QvOOvRZQYJMlwLSCmECAYrgMU0IQRk7U
- **URL**: https://arweave.net/aXZA2vrOnD5QvOOvRZQYJMlwLSCmECAYrgMU0IQRk7U
- **Environment**: production
- **Deployment Date**: 2025-10-29

## 0.4.0 - 2025-10-22

### Added

- **DOAP.json Metadata System**: Integrated DOAP.json as primary source of truth for project metadata
- **Vite Metadata Plugin**: Added doap-metadata.ts plugin for automatic HTML metadata injection
- **File Synchronization**: Added doap-sync.sh script for keeping all project files synchronized
- **Enhanced HTML Metadata**: Added SEO, Open Graph, and Twitter Card metadata placeholders
- **Deployment Tracking**: Enhanced deployment scripts to track deployments in DOAP.json
- **Public Metadata Access**: DOAP.json now bundled with deployments for public access

### Changed

- **Build System**: Updated Vite configuration with metadata injection plugin
- **Deployment Scripts**: Modified to use DOAP.json as primary metadata source
- **Version Management**: Enhanced to update DOAP.json and sync across all files
- **HTML Head**: Enhanced with comprehensive metadata placeholders for SEO and social sharing

### Framework Benefits

- **Unified Metadata**: Single source of truth for all project information
- **Enhanced SEO**: Automatic metadata injection for better discoverability
- **Deployment History**: Complete tracking of all Arweave deployments
- **Public Access**: Project metadata accessible via Arweave deployment URLs

## 0.3.0 - 2025-10-18

https://fnf3y7jzivfyvtlaorhdeuuqcrm26uttk6tqo4lt33grxb4otcwa.arweave.net/K0u8fTlFS4rNYHROMlKQFFmvUnNXpwdxc97NG4eOmKw/

### Added

- **Dynamic Version Display**: Added version display in toolbar that automatically reads from package.json
- **Versioning System Integration**: Integrated with workspace versioning system via post-hook scripts
- **Version Utility**: New utility system for dynamic version management and display formatting
- **Enhanced Modal Styling**: Improved GuideModal with semantic CSS classes replacing utility classes

### Changed

- **GuideModal Component**: Enhanced with semantic styling and improved accessibility
- **Toolbar Component**: Added version display with subtle badge styling
- **CSS Architecture**: Extended with version display styling and semantic improvements

### Fixed

- **TypeScript Errors**: Fixed unused imports and function call issues across core modules
- **Code Quality**: Removed unused variables and cleaned up import statements
- **Build System**: Resolved all TypeScript compilation errors

### Technical

- **Version Management**: Automated version display updates via version bump script integration
- **CSS Architecture**: Enhanced with version display styling and semantic class improvements
- **Build Process**: Improved TypeScript compilation and error handling

## 0.2.0 - 2025-10-17

https://cbnokgudbje6c42fkt7b4odf7kltyonibpqiq5kwg4uyqcvjvxvq.arweave.net/EFrlGoMKSeFzRVT-Hjhl-pc8OagL4Ih1VjcpiAqpres/

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
