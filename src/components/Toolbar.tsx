import { useAppStore, ImportMode } from '../state/app-store';
import { ExportManager } from '../core/export-manager';
import { ConfigManager } from '../core/config-manager';
import { exportValidator, ExportFeasibility } from '../utils/export-validator';
import { GridPincherConfig } from '../types/config';
import { ImportPreviewModal } from './ImportPreviewModal';
import { ErrorModal } from './ErrorModal';
import { GuideModal } from './GuideModal';
import { useState, useEffect, useRef } from 'react';

const exportManager = new ExportManager();
const configManager = new ConfigManager();

export function Toolbar() {
    const showWells = useAppStore((state) => state.showWells);
    const setShowWells = useAppStore((state) => state.setShowWells);
    const wellCount = useAppStore((state) => state.deformation.wells.length);
    const deformedGrid = useAppStore((state) => state.deformedGrid);
    const gridConfig = useAppStore((state) => state.gridConfig);
    const viewport = useAppStore((state) => state.viewport);

    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const downloadMenuRef = useRef<HTMLDivElement>(null);

    const [importPreviewConfig, setImportPreviewConfig] = useState<GridPincherConfig | null>(null);
    const [importErrors, setImportErrors] = useState<string[] | null>(null);

    const [exportFeasibility, setExportFeasibility] = useState<Map<number, ExportFeasibility>>(new Map());
    const [maxScale, setMaxScale] = useState<number>(16);

    const [showGuide, setShowGuide] = useState(false);

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
            const bounds = calculateGridBounds(20);
            const wells = useAppStore.getState().deformation.wells;
            const blob = await exportManager.exportPNG(
                deformedGrid,
                gridConfig,
                wells,
                bounds,
                { scale }
            );
            if (blob) {
                // No filename - will auto-generate from content hash
                await exportManager.downloadBlob(blob, undefined, 'image/png');
            } else {
                console.error('Failed to create blob');
            }
            setShowDownloadMenu(false);
        } catch (error) {
            console.error('Error downloading PNG:', error);
        }
    };

    const handleDownloadSVG = async () => {
        try {
            const bounds = calculateGridBounds(20);
            const svgContent = exportManager.exportSVG(
                deformedGrid,
                gridConfig,
                bounds
            );
            // No filename - will auto-generate from content hash
            await exportManager.downloadText(svgContent, undefined, 'image/svg+xml');
            setShowDownloadMenu(false);
        } catch (error) {
            console.error('Error downloading SVG:', error);
        }
    };

    const handleExportConfig = async () => {
        const config = configManager.exportConfig(
            gridConfig,
            useAppStore.getState().deformation,
            viewport,
            {
                name: `Grid Pattern ${new Date().toLocaleDateString()}`,
            }
        );
        await configManager.downloadConfig(config);
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

    const handleReset = () => {
        if (confirm('Clear all wells?')) {
            const wells = useAppStore.getState().deformation.wells;
            wells.forEach(w => useAppStore.getState().removeWell(w.id));
        }
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
            <div className="h-14 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <h1 className="text-xl font-bold text-gray-800">Lattelier</h1>
                        <button
                            onClick={() => setShowGuide(true)}
                            className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 flex items-center justify-center text-sm font-bold transition-colors"
                            title="Open Guide"
                            aria-label="Open guide"
                        >
                            ?
                        </button>
                    </div>
                    <span className="text-sm text-gray-500">
                        {wellCount} {wellCount === 1 ? 'well' : 'wells'}
                    </span>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowWells(!showWells)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${showWells
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {showWells ? 'Hide' : 'Show'} Wells
                    </button>

                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                    >
                        Clear All
                    </button>

                    <button
                        onClick={handleExportConfig}
                        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors text-sm font-medium"
                    >
                        Export Config
                    </button>

                    <button
                        onClick={handleImportClick}
                        className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm font-medium"
                    >
                        Import Config
                    </button>

                    <div className="relative" ref={downloadMenuRef}>
                        <button
                            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
                        >
                            Download
                        </button>

                        {showDownloadMenu && (
                            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                {/* Summary Header */}
                                {maxScale && (
                                    <div className="px-3 py-2 bg-blue-50 border-b border-blue-200">
                                        <div className="text-xs text-blue-900">
                                            <span className="font-semibold">Max PNG Resolution:</span>{' '}
                                            <span className="font-bold">{maxScale}×</span>
                                        </div>
                                    </div>
                                )}

                                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                                    PNG Resolution
                                </div>
                                {/* 1× Standard */}
                                <button
                                    onClick={() => handleDownloadPNG(1, '1x')}
                                    disabled={exportFeasibility.get(1)?.status === 'disabled'}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${exportFeasibility.get(1)?.status === 'disabled'
                                        ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Standard (1×)</span>
                                        <span className={getStatusColor(1)}>{getStatusIcon(1)}</span>
                                    </div>
                                    {exportFeasibility.get(1)?.message && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {exportFeasibility.get(1)?.message}
                                        </div>
                                    )}
                                </button>

                                {/* 2× High Quality */}
                                <button
                                    onClick={() => handleDownloadPNG(2, '2x')}
                                    disabled={exportFeasibility.get(2)?.status === 'disabled'}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${exportFeasibility.get(2)?.status === 'disabled'
                                        ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>High Quality (2×)</span>
                                        <span className={getStatusColor(2)}>{getStatusIcon(2)}</span>
                                    </div>
                                    {exportFeasibility.get(2)?.message && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {exportFeasibility.get(2)?.message}
                                        </div>
                                    )}
                                </button>

                                {/* 4× Very High Quality */}
                                <button
                                    onClick={() => handleDownloadPNG(4, '4x')}
                                    disabled={exportFeasibility.get(4)?.status === 'disabled'}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${exportFeasibility.get(4)?.status === 'disabled'
                                        ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Very High Quality (4×)</span>
                                        <span className={getStatusColor(4)}>{getStatusIcon(4)}</span>
                                    </div>
                                    {exportFeasibility.get(4)?.message && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {exportFeasibility.get(4)?.message}
                                        </div>
                                    )}
                                </button>

                                {/* 8× Ultra High Quality */}
                                <button
                                    onClick={() => handleDownloadPNG(8, '8x')}
                                    disabled={exportFeasibility.get(8)?.status === 'disabled'}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${exportFeasibility.get(8)?.status === 'disabled'
                                        ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Ultra High Quality (8×)</span>
                                        <span className={getStatusColor(8)}>{getStatusIcon(8)}</span>
                                    </div>
                                    {exportFeasibility.get(8)?.message && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {exportFeasibility.get(8)?.message}
                                        </div>
                                    )}
                                    {exportFeasibility.get(8)?.recommendation && (
                                        <div className="text-xs text-blue-600 mt-1">
                                            💡 {exportFeasibility.get(8)?.recommendation}
                                        </div>
                                    )}
                                </button>

                                {/* 16× Print Quality */}
                                <button
                                    onClick={() => handleDownloadPNG(16, '16x')}
                                    disabled={exportFeasibility.get(16)?.status === 'disabled'}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors border-b border-gray-200 ${exportFeasibility.get(16)?.status === 'disabled'
                                        ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span>Print Quality (16×)</span>
                                        <span className={getStatusColor(16)}>{getStatusIcon(16)}</span>
                                    </div>
                                    {exportFeasibility.get(16)?.message && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {exportFeasibility.get(16)?.message}
                                        </div>
                                    )}
                                    {exportFeasibility.get(16)?.recommendation && (
                                        <div className="text-xs text-blue-600 mt-1">
                                            💡 {exportFeasibility.get(16)?.recommendation}
                                        </div>
                                    )}
                                </button>
                                {/* SVG - Highlighted */}
                                <button
                                    onClick={handleDownloadSVG}
                                    className="w-full text-left px-4 py-2 text-sm bg-purple-50 hover:bg-purple-100 border-l-4 border-purple-500 rounded-b-md transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-purple-900">✨ Vector (SVG)</span>
                                        <span className="text-purple-600 font-bold">∞</span>
                                    </div>
                                    <div className="text-xs text-purple-700 mt-1">
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

