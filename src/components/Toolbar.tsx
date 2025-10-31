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
import { ExportIcon, ImportIcon, ShuffleIcon, SaveIcon } from './icons';
import { useState, useEffect, useRef } from 'react';

const exportManager = new ExportManager();
const configManager = new ConfigManager();

export function Toolbar() {
    const deformedGrid = useAppStore((state) => state.deformedGrid);
    const gridConfig = useAppStore((state) => state.gridConfig);
    const viewport = useAppStore((state) => state.viewport);
    const shuffleSettings = useAppStore((state) => state.shuffleSettings);

    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const downloadMenuRef = useRef<HTMLDivElement>(null);

    const [importPreviewConfig, setImportPreviewConfig] = useState<GridPincherConfig | null>(null);
    const [importErrors, setImportErrors] = useState<string[] | null>(null);

    const [exportFeasibility, setExportFeasibility] = useState<Map<number, ExportFeasibility>>(new Map());
    const [maxScale, setMaxScale] = useState<number>(16);

    const [showGuide, setShowGuide] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

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

    // Calculate export feasibility when menu opens or grid changes
    useEffect(() => {
        if (showDownloadMenu && deformedGrid.length > 0) {
            const bounds = calculateGridBounds(20);
            const gridWidth = bounds.maxX - bounds.minX;
            const gridHeight = bounds.maxY - bounds.minY;

            // Calculate feasibility for standard scales
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

    const handleDownloadPNG = async (scale: number, _label: string) => {
        try {
            setIsExporting(true);
            const bounds = calculateGridBounds(20);
            const wells = useAppStore.getState().deformation.wells;
            const deformation = useAppStore.getState().deformation;

            // Generate state-based hash for consistent naming
            const stateHash = generateStateHash(gridConfig, deformation, viewport);

            const blob = await exportManager.exportPNG(
                deformedGrid,
                gridConfig,
                wells,
                bounds,
                { scale }
            );
            if (blob) {
                // Use state-based hash for consistent naming
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

            // Generate state-based hash for consistent naming
            const stateHash = generateStateHash(gridConfig, deformation, viewport);

            const svgContent = exportManager.exportSVG(
                deformedGrid,
                gridConfig,
                bounds
            );
            // Use state-based hash for consistent naming
            await exportManager.downloadText(svgContent, undefined, 'image/svg+xml', stateHash);
            setShowDownloadMenu(false);
        } catch (error) {
            console.error('Error downloading SVG:', error);
        }
    };

    const handleExportConfig = async () => {
        const deformation = useAppStore.getState().deformation;
        const settingsLocks = useAppStore.getState().settingsLocks;
        const wellsLocked = useAppStore.getState().wellsLocked;

        // Generate state-based hash for consistent naming
        const stateHash = generateStateHash(gridConfig, deformation, viewport);

        const config = configManager.exportConfig(
            gridConfig,
            deformation,
            viewport,
            {
                name: `Grid Pattern ${new Date().toLocaleDateString()}`,
            },
            settingsLocks,
            wellsLocked
        );
        await configManager.downloadConfig(config, undefined, stateHash);
    };

    const handleImportClick = async () => {
        try {
            // Create file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.gridpincher,.gridpincher.json,.json';

            input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;

                try {
                    // Load and parse config
                    const config = await configManager.loadConfigFromFile(file);

                    // Validate
                    const validation = configManager.validateConfig(config);
                    if (!validation.valid) {
                        setImportErrors(validation.errors);
                        return;
                    }

                    // Show preview modal
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


    // Helper to get status icon for export option
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

    // Helper to get status color
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
            <div className="toolbar">
                <div className="toolbar-left">
                    <div className="toolbar-brand">
                        <h1 className="toolbar-title">Lattelier</h1>
                        <span className="toolbar-version">{getVersionDisplay()}</span>
                        <button
                            onClick={() => setShowGuide(true)}
                            className="toolbar-help"
                            title="Open Guide"
                            aria-label="Open guide"
                        >
                            ?
                        </button>
                    </div>
                </div>

                <div className="toolbar-right">

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

                    <button
                        onClick={shuffleSettings}
                        className="btn btn-icon-only"
                        title="Randomize settings within current dimensions"
                        aria-label="Shuffle Settings"
                    >
                        <ShuffleIcon className="icon" size={16} />
                    </button>

                    <div className="dropdown" ref={downloadMenuRef}>
                        <button
                            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
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
                                {/* 1× Standard */}
                                <button
                                    onClick={() => handleDownloadPNG(1, '1x')}
                                    disabled={exportFeasibility.get(1)?.status === 'disabled' || isExporting}
                                    className={`dropdown-item ${exportFeasibility.get(1)?.status === 'disabled' || isExporting ? 'cursor-not-allowed' : ''}`}
                                >
                                    <div className="dropdown-item-status">
                                        <span>Standard (1×)</span>
                                        <span className={getStatusColor(1)}>{getStatusIcon(1)}</span>
                                    </div>
                                    {exportFeasibility.get(1)?.message && (
                                        <div className="dropdown-item-message">
                                            {exportFeasibility.get(1)?.message}
                                        </div>
                                    )}
                                </button>

                                {/* 2× High Quality */}
                                <button
                                    onClick={() => handleDownloadPNG(2, '2x')}
                                    disabled={exportFeasibility.get(2)?.status === 'disabled' || isExporting}
                                    className={`dropdown-item ${exportFeasibility.get(2)?.status === 'disabled' || isExporting ? 'cursor-not-allowed' : ''}`}
                                >
                                    <div className="dropdown-item-status">
                                        <span>High Quality (2×)</span>
                                        <span className={getStatusColor(2)}>{getStatusIcon(2)}</span>
                                    </div>
                                    {exportFeasibility.get(2)?.message && (
                                        <div className="dropdown-item-message">
                                            {exportFeasibility.get(2)?.message}
                                        </div>
                                    )}
                                </button>

                                {/* 4× Very High Quality */}
                                <button
                                    onClick={() => handleDownloadPNG(4, '4x')}
                                    disabled={exportFeasibility.get(4)?.status === 'disabled' || isExporting}
                                    className={`dropdown-item ${exportFeasibility.get(4)?.status === 'disabled' || isExporting ? 'cursor-not-allowed' : ''}`}
                                >
                                    <div className="dropdown-item-status">
                                        <span>Very High Quality (4×)</span>
                                        <span className={getStatusColor(4)}>{getStatusIcon(4)}</span>
                                    </div>
                                    {exportFeasibility.get(4)?.message && (
                                        <div className="dropdown-item-message">
                                            {exportFeasibility.get(4)?.message}
                                        </div>
                                    )}
                                </button>

                                {/* 8× Ultra High Quality */}
                                <button
                                    onClick={() => handleDownloadPNG(8, '8x')}
                                    disabled={exportFeasibility.get(8)?.status === 'disabled' || isExporting}
                                    className={`dropdown-item ${exportFeasibility.get(8)?.status === 'disabled' || isExporting ? 'cursor-not-allowed' : ''}`}
                                >
                                    <div className="dropdown-item-status">
                                        <span>Ultra High Quality (8×)</span>
                                        <span className={getStatusColor(8)}>{getStatusIcon(8)}</span>
                                    </div>
                                    {exportFeasibility.get(8)?.message && (
                                        <div className="dropdown-item-message">
                                            {exportFeasibility.get(8)?.message}
                                        </div>
                                    )}
                                    {exportFeasibility.get(8)?.recommendation && (
                                        <div className="dropdown-item-recommendation">
                                            💡 {exportFeasibility.get(8)?.recommendation}
                                        </div>
                                    )}
                                </button>

                                {/* 16× Print Quality */}
                                <button
                                    onClick={() => handleDownloadPNG(16, '16x')}
                                    disabled={exportFeasibility.get(16)?.status === 'disabled' || isExporting}
                                    className={`dropdown-item border-b border-gray-200 ${exportFeasibility.get(16)?.status === 'disabled' || isExporting ? 'cursor-not-allowed' : ''}`}
                                >
                                    <div className="dropdown-item-status">
                                        <span>Print Quality (16×)</span>
                                        <span className={getStatusColor(16)}>{getStatusIcon(16)}</span>
                                    </div>
                                    {exportFeasibility.get(16)?.message && (
                                        <div className="dropdown-item-message">
                                            {exportFeasibility.get(16)?.message}
                                        </div>
                                    )}
                                    {exportFeasibility.get(16)?.recommendation && (
                                        <div className="dropdown-item-recommendation">
                                            💡 {exportFeasibility.get(16)?.recommendation}
                                        </div>
                                    )}
                                </button>
                                {/* SVG - Highlighted */}
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
            </div>

            {/* Import Preview Modal */}
            {importPreviewConfig && (
                <ImportPreviewModal
                    config={importPreviewConfig}
                    onImport={handleImport}
                    onCancel={handleCancelImport}
                />
            )}

            {/* Error Modal */}
            {importErrors && (
                <ErrorModal
                    title="Invalid Configuration File"
                    errors={importErrors}
                    onClose={handleCloseError}
                />
            )}

            {/* Guide Modal */}
            {showGuide && (
                <GuideModal
                    onClose={() => setShowGuide(false)}
                />
            )}
        </>
    );
}

