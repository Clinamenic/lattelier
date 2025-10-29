import { useState, useEffect, useRef } from 'react';
import { ExportIcon, ImportIcon, ShuffleIcon, SaveIcon, RightSidebarHideIcon, RightSidebarShowIcon, PanIcon, PlaceWellIcon } from './icons';
import { useAppStore, ImportMode } from '../state/app-store';
import { ExportManager } from '../core/export-manager';
import { ConfigManager } from '../core/config-manager';
import { exportValidator, ExportFeasibility } from '../utils/export-validator';
import { GridPincherConfig } from '../types/config';
import { ImportPreviewModal } from './ImportPreviewModal';
import { ErrorModal } from './ErrorModal';
import { GuideModal } from './GuideModal';
import { generateStateHash } from '../utils/state-hash';
import { getVersionDisplay } from '../utils/version';

const exportManager = new ExportManager();
const configManager = new ConfigManager();

export function Header() {
    const deformedGrid = useAppStore((state) => state.deformedGrid);
    const gridConfig = useAppStore((state) => state.gridConfig);
    const viewport = useAppStore((state) => state.viewport);
    const shuffleSettings = useAppStore((state) => state.shuffleSettings);
    const leftSidebarCollapsed = useAppStore((state) => state.leftSidebarCollapsed);
    const rightSidebarCollapsed = useAppStore((state) => state.rightSidebarCollapsed);
    const toggleLeftSidebar = useAppStore((state) => state.toggleLeftSidebar);
    const toggleRightSidebar = useAppStore((state) => state.toggleRightSidebar);
    const activeTool = useAppStore((state) => state.activeTool);
    const setActiveTool = useAppStore((state) => state.setActiveTool);

    // Toolbar toggle state with persistence
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const downloadMenuRef = useRef<HTMLDivElement>(null);
    const [showGuide, setShowGuide] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Import/Export state
    const [importPreviewConfig, setImportPreviewConfig] = useState<GridPincherConfig | null>(null);
    const [importErrors, setImportErrors] = useState<string[] | null>(null);
    const [exportFeasibility, setExportFeasibility] = useState<Map<number, ExportFeasibility>>(new Map());
    const [maxScale, setMaxScale] = useState<number>(16);

    // Handle click outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
                setShowDownloadMenu(false);
            }
        };

        if (showDownloadMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDownloadMenu]);

    // Export/Import handlers (moved from Toolbar component)
    const calculateGridBounds = (padding: number = 20) => {
        if (deformedGrid.length === 0) {
            return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        }

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const point of deformedGrid) {
            const { x, y } = point.currentPosition;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }

        return {
            minX: minX - padding,
            minY: minY - padding,
            maxX: maxX + padding,
            maxY: maxY + padding,
        };
    };

    const handleDownloadPNG = async (scale: number, _label: string) => {
        try {
            setIsExporting(true);
            const bounds = calculateGridBounds(20);
            const wells = useAppStore.getState().deformation.wells;
            const deformation = useAppStore.getState().deformation;

            const stateHash = generateStateHash(gridConfig, deformation, viewport);

            const blob = await exportManager.exportPNG(
                deformedGrid,
                gridConfig,
                wells,
                bounds,
                { scale }
            );
            if (blob) {
                await exportManager.downloadBlob(blob, undefined, 'image/png', stateHash);
            } else {
                console.error('Failed to create blob');
            }
            setShowDownloadMenu(false);
        } catch (error) {
            console.error('Error downloading PNG:', error);
        } finally {
            setIsExporting(false);
        }
    };

    const handleDownloadSVG = async () => {
        try {
            const bounds = calculateGridBounds(20);
            const deformation = useAppStore.getState().deformation;

            const stateHash = generateStateHash(gridConfig, deformation, viewport);

            const svgContent = exportManager.exportSVG(
                deformedGrid,
                gridConfig,
                bounds
            );
            await exportManager.downloadText(svgContent, undefined, 'image/svg+xml', stateHash);
            setShowDownloadMenu(false);
        } catch (error) {
            console.error('Error downloading SVG:', error);
        }
    };

    const handleExportConfig = async () => {
        const deformation = useAppStore.getState().deformation;

        const stateHash = generateStateHash(gridConfig, deformation, viewport);

        const config = configManager.exportConfig(
            gridConfig,
            deformation,
            viewport,
            {
                name: `Grid Pattern ${new Date().toLocaleDateString()}`,
            }
        );
        await configManager.downloadConfig(config, undefined, stateHash);
    };

    const handleImportClick = async () => {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.gridpincher,.gridpincher.json,.json';

            input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;

                try {
                    const config = await configManager.loadConfigFromFile(file);
                    const validation = configManager.validateConfig(config);
                    if (!validation.valid) {
                        setImportErrors(validation.errors);
                        return;
                    }
                    setImportPreviewConfig(config);
                } catch (error) {
                    setImportErrors([
                        'Failed to read or parse file',
                        error instanceof Error ? error.message : 'Unknown error'
                    ]);
                }
            };

            input.click();
        } catch (error) {
            setImportErrors(['Failed to open file picker']);
        }
    };

    const handleImport = (mode: ImportMode) => {
        if (!importPreviewConfig) return;

        useAppStore.getState().importConfiguration(
            importPreviewConfig,
            mode,
            configManager
        );

        setImportPreviewConfig(null);
    };

    const handleCancelImport = () => {
        setImportPreviewConfig(null);
    };

    const handleCloseError = () => {
        setImportErrors(null);
    };

    // Export feasibility calculation
    useEffect(() => {
        if (showDownloadMenu && deformedGrid.length > 0) {
            const bounds = calculateGridBounds(20);
            const gridWidth = bounds.maxX - bounds.minX;
            const gridHeight = bounds.maxY - bounds.minY;

            const scales = [1, 2, 4, 8, 16];
            const feasibilityMap = exportValidator.validateMultipleScales(
                gridWidth,
                gridHeight,
                scales
            );

            setExportFeasibility(feasibilityMap);
            setMaxScale(exportValidator.calculateMaxScale(gridWidth, gridHeight));
        }
    }, [showDownloadMenu, deformedGrid, gridConfig]);

    const getStatusIcon = (scale: number): string => {
        const feasibility = exportFeasibility.get(scale);
        if (!feasibility) return '';

        switch (feasibility.status) {
            case 'safe': return '✓';
            case 'warning': return '⚠';
            case 'disabled': return '🚫';
            default: return '';
        }
    };

    const getStatusColor = (scale: number): string => {
        const feasibility = exportFeasibility.get(scale);
        if (!feasibility) return 'text-gray-700';

        switch (feasibility.status) {
            case 'safe': return 'text-green-600';
            case 'warning': return 'text-yellow-600';
            case 'disabled': return 'text-red-600';
            default: return 'text-gray-700';
        }
    };

    return (
        <>
            <header className="header">
                {/* Primary Navbar */}
                <nav className="navbar">
                    <div className="navbar-left">
                        <h1 className="navbar-title">Lattelier</h1>
                        <span className="navbar-version">{getVersionDisplay()}</span>
                    </div>
                    <div className="navbar-right">
                        <button
                            onClick={() => setShowGuide(true)}
                            className="btn btn-icon-only"
                            title="Open Guide"
                            aria-label="Open guide"
                        >
                            ?
                        </button>
                    </div>
                </nav>

                {/* Toolbar */}
                <div className="toolbar">
                    <div className="toolbar-left">
                        {/* Left Sidebar Controls */}
                        <button
                            onClick={toggleLeftSidebar}
                            className="btn btn-icon-only"
                            title={leftSidebarCollapsed ? 'Show Left Sidebar' : 'Hide Left Sidebar'}
                            aria-label={leftSidebarCollapsed ? 'Show Left Sidebar' : 'Hide Left Sidebar'}
                        >
                            {leftSidebarCollapsed ? (
                                <RightSidebarHideIcon className="icon" size={16} />
                            ) : (
                                <RightSidebarShowIcon className="icon" size={16} />
                            )}
                        </button>
                    </div>

                    <div className="toolbar-center">
                        {/* Import/Export/Download Group */}
                        <div className="toolbar-group">
                            <button
                                onClick={handleExportConfig}
                                className="btn btn-icon-only"
                                title="Export Config"
                                aria-label="Export Config"
                            >
                                <ExportIcon className="icon" size={16} />
                            </button>

                            <button
                                onClick={handleImportClick}
                                className="btn btn-icon-only"
                                title="Import Config"
                                aria-label="Import Config"
                            >
                                <ImportIcon className="icon" size={16} />
                            </button>

                            <div className="dropdown" ref={downloadMenuRef}>
                                <button
                                    onClick={() => {
                                        console.log('Download button clicked, current state:', showDownloadMenu);
                                        setShowDownloadMenu(!showDownloadMenu);
                                    }}
                                    className="btn btn-icon-only"
                                    disabled={isExporting}
                                    title={isExporting ? 'Exporting...' : 'Download'}
                                    aria-label={isExporting ? 'Exporting...' : 'Download'}
                                >
                                    <SaveIcon className="icon" size={16} />
                                </button>

                                {showDownloadMenu && (
                                    <div className="dropdown-menu">
                                        {/* Summary Header */}
                                        {maxScale && (
                                            <div className="dropdown-header">
                                                <div className="text-xs">
                                                    <span className="font-semibold">Max PNG Resolution:</span>{' '}
                                                    <span className="font-bold">{maxScale}×</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="dropdown-section">
                                            PNG Resolution
                                        </div>
                                        
                                        {/* PNG Resolution Options */}
                                        {[1, 2, 4, 8, 16].map((scale) => (
                                            <button
                                                key={scale}
                                                onClick={() => handleDownloadPNG(scale, `${scale}x`)}
                                                disabled={exportFeasibility.get(scale)?.status === 'disabled' || isExporting}
                                                className={`dropdown-item ${exportFeasibility.get(scale)?.status === 'disabled' || isExporting ? 'cursor-not-allowed' : ''}`}
                                            >
                                                <div className="dropdown-item-status">
                                                    <span>
                                                        {scale === 1 && 'Standard (1×)'}
                                                        {scale === 2 && 'High Quality (2×)'}
                                                        {scale === 4 && 'Very High Quality (4×)'}
                                                        {scale === 8 && 'Ultra High Quality (8×)'}
                                                        {scale === 16 && 'Print Quality (16×)'}
                                                    </span>
                                                    <span className={getStatusColor(scale)}>{getStatusIcon(scale)}</span>
                                                </div>
                                                {exportFeasibility.get(scale)?.message && (
                                                    <div className="dropdown-item-message">
                                                        {exportFeasibility.get(scale)?.message}
                                                    </div>
                                                )}
                                                {exportFeasibility.get(scale)?.recommendation && (
                                                    <div className="dropdown-item-recommendation">
                                                        💡 {exportFeasibility.get(scale)?.recommendation}
                                                    </div>
                                                )}
                                            </button>
                                        ))}

                                        {/* SVG Option */}
                                        <button
                                            onClick={handleDownloadSVG}
                                            className="dropdown-item dropdown-item-highlighted"
                                        >
                                            <div className="dropdown-item-status">
                                                <span className="font-medium">✨ Vector (SVG)</span>
                                                <span className="font-bold">∞</span>
                                            </div>
                                            <div className="dropdown-item-message">
                                                Unlimited resolution · Best for print
                                            </div>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shuffle Group */}
                        <div className="toolbar-group">
                            <button
                                onClick={shuffleSettings}
                                className="btn btn-icon-only"
                                title="Randomize settings within current dimensions"
                                aria-label="Shuffle Settings"
                            >
                                <ShuffleIcon className="icon" size={16} />
                            </button>
                        </div>

                        {/* Tools Group */}
                        <div className="toolbar-group">
                            <button
                                onClick={() => setActiveTool('pan')}
                                className={`btn btn-icon-only ${activeTool === 'pan' ? 'btn-active' : ''}`}
                                title="Pan & Navigate"
                                aria-label="Pan & Navigate"
                            >
                                <PanIcon className="icon" size={16} />
                            </button>
                            <button
                                onClick={() => setActiveTool('placeWell')}
                                className={`btn btn-icon-only ${activeTool === 'placeWell' ? 'btn-active' : ''}`}
                                title="Place Well"
                                aria-label="Place Well"
                            >
                                <PlaceWellIcon className="icon" size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="toolbar-right">
                        {/* Right Sidebar Controls */}
                        <button
                            onClick={toggleRightSidebar}
                            className="btn btn-icon-only"
                            title={rightSidebarCollapsed ? 'Show Right Sidebar' : 'Hide Right Sidebar'}
                            aria-label={rightSidebarCollapsed ? 'Show Right Sidebar' : 'Hide Right Sidebar'}
                        >
                            {rightSidebarCollapsed ? (
                                <RightSidebarShowIcon className="icon" size={16} />
                            ) : (
                                <RightSidebarHideIcon className="icon" size={16} />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Modals */}
            {importPreviewConfig && (
                <ImportPreviewModal
                    config={importPreviewConfig}
                    onImport={handleImport}
                    onCancel={handleCancelImport}
                />
            )}

            {importErrors && (
                <ErrorModal
                    title="Invalid Configuration File"
                    errors={importErrors}
                    onClose={handleCloseError}
                />
            )}

            {showGuide && (
                <GuideModal
                    onClose={() => setShowGuide(false)}
                />
            )}
        </>
    );
}
