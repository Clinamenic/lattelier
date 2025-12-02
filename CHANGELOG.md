# Changelog

All notable changes to Lattelier will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.8.0 - 2025-12-01

### Added

- **Hue Variance Controls**: New hue variance sliders for points and lines (0-100%) to introduce subtle color variation around base colors
- **HSL Color Conversion Utilities**: Added `hexToHsl()` and `hslToHex()` functions for color space conversion
- **Hue Variance Rendering**: Canvas renderer now applies hue variance to points and lines, creating more organic visual patterns
- **Hue Variance State Management**: Added `pointHueVariance` and `lineHueVariance` to grid configuration with lock support

### Changed

- **Color Rendering**: Enhanced point and line color rendering to support hue variance calculations
- **Form Layout**: Added hue variance controls to Canvas Settings Panel with lock button support
- **Config Export/Import**: Hue variance values included in configuration export/import

### Technical Improvements

- **Math Utilities**: Added comprehensive HSL color conversion functions with proper normalization
- **Type Safety**: Added hue variance types to grid configuration
- **State Hash**: Updated state hash calculation to include hue variance values

**Commit Reference**: 672cd3f

## 0.7.0 - 2025-10-31

### Added

- **Settings Lock/Unlock System**: Individual lock buttons for each setting to preserve values during shuffle operations
- **LockButton Component**: Reusable lock/unlock button component with visual state indicators
- **Canvas Opacity Control**: New opacity slider for canvas background transparency (0-100%)
- **Wells Master Lock**: Master lock/unlock button in distortion panel to preserve all well configurations during shuffle
- **Settings Lock State Persistence**: Lock states saved to localStorage and included in config export/import
- **Shuffle Functionality**: Enhanced shuffle button that respects individual setting locks and wells lock
- **Guide Modal Enhancements**: Updated guide with accurate feature documentation, streamlined structure, and removed outdated information

### Changed

- **Opacity Control Placement**: Standardized opacity controls to appear immediately after color pickers in Canvas, Points, Lines, and Fill sections
- **Shuffle Behavior**: Removed hardcoded preservation of rows/columns; users must manually lock them if desired
- **Guide Modal**: Refactored to use global styles exclusively, removed purpose-specific classes
- **Form Layout**: Introduced `.form-group-row` layout pattern for inline lock button placement
- **State Management**: Enhanced app store with settings lock state and toggle actions

### Technical Improvements

- **State Persistence**: Lock states persist across page refreshes via localStorage
- **Config Compatibility**: Config export/import includes lock states with backward compatibility
- **UI Consistency**: Unified opacity control pattern across all sections
- **Code Organization**: Centralized lock state management in app store
- **Visual Feedback**: Improved lock button states with opacity transitions and color indicators

### Deployment

- **Transaction ID**: Y-kcgTzlt3_LY9kQol5dgJ8NkfZ3XEzLu-Hp44T0HAo
- **URL**: https://arweave.net/Y-kcgTzlt3_LY9kQol5dgJ8NkfZ3XEzLu-Hp44T0HAo
- **Environment**: Production
- **Deployment Date**: 2025-10-31
- **Project Metadata**: https://arweave.net/Y-kcgTzlt3_LY9kQol5dgJ8NkfZ3XEzLu-Hp44T0HAo/doap.json

**Commit Reference**: 1fafd98

## 0.6.0 - 2025-10-31

### Added

- **Segmented Line Texture System**: New modular line texture rendering architecture with extensible texture system
- **Segmented Texture Option**: Alternative to solid lines, renders lines as segmented strokes with gaps and variations
- **Texture Controls**: Configurable angle variation, spacing variation, and length variation for segmented textures
- **Conditional Settings Pattern**: Context-aware UI that shows different controls based on texture selection
- **Texture Registry System**: Extensible architecture for adding new texture types in the future
- **Architecture Documentation**: Comprehensive documentation for conditional settings pattern

### Changed

- **Line Rendering Architecture**: Refactored to use modular texture renderer system with registry pattern
- **Canvas Settings Panel**: Enhanced with texture selector and conditional style-specific controls
- **Export Manager**: Enhanced to support segmented textures in both PNG and SVG exports
- **Config Manager**: Updated to handle texture settings in configuration export/import
- **Type System**: Extended with LineTexture union type and SegmentedTextureSettings interface

### Technical Improvements

- **Modular Architecture**: Separated texture rendering logic into dedicated renderer classes
- **Deterministic Rendering**: Segmented texture uses hash-based algorithm for consistent results
- **Export Compatibility**: SVG export now generates segmented lines matching canvas rendering
- **Code Organization**: Better separation of concerns with dedicated texture renderer modules

**Commit Reference**: 1b08ff7

## 0.5.1 - 2025-10-29

### Added

- **Range Fill System**: Comprehensive range slider fill visualization with real-time updates
- **Form Control Enhancements**: Improved visual feedback and consistency across all form elements
- **Sidebar Control Icons**: New icons for left sidebar hide/show functionality
- **Range Fill Utility**: New utility system (`src/utils/range-fill.ts`) for dynamic range slider visualization

### Changed

- **Form Styling**: Enhanced form controls with improved border colors and visual hierarchy
- **Canvas Settings Panel**: Better integration with range fill system and improved user experience
- **Component Integration**: Seamless integration of range fill system with existing form components
- **Icon System**: Expanded with new sidebar control icons for better UI consistency

### Technical Improvements

- **Range Fill Visualization**: Real-time visual feedback for range sliders using CSS custom properties
- **Form Control Enhancement**: Improved styling consistency across all form elements
- **Component Architecture**: Better separation of concerns with dedicated utility functions
- **Documentation**: Updated architecture documentation to reflect UI/UX enhancements

**Commit Reference**: 5c78391

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
