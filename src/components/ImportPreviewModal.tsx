import { useState } from 'react';
import { GridPincherConfig } from '../types/config';
import { ImportMode } from '../state/app-store';

interface ImportPreviewModalProps {
    config: GridPincherConfig;
    onImport: (mode: ImportMode) => void;
    onCancel: () => void;
}

export function ImportPreviewModal({ config, onImport, onCancel }: ImportPreviewModalProps) {
    const [selectedMode, setSelectedMode] = useState<ImportMode>('replace');

    const handleImport = () => {
        onImport(selectedMode);
    };

    const attractWells = config.distortion.wells.filter(w => w.strength >= 0).length;
    const repelWells = config.distortion.wells.filter(w => w.strength < 0).length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Import Configuration</h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Metadata */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{config.metadata.name}</h3>
                        {config.metadata.description && (
                            <p className="text-sm text-gray-600 mb-3">{config.metadata.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Created: {new Date(config.metadata.createdAt).toLocaleDateString()}</span>
                            <span>Modified: {new Date(config.metadata.modifiedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Configuration Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Configuration Summary</h4>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-gray-600">Grid Type:</span>
                                <span className="ml-2 font-medium text-gray-800 capitalize">{config.grid.type}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Size:</span>
                                <span className="ml-2 font-medium text-gray-800">
                                    {config.grid.rows} × {config.grid.columns}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Spacing:</span>
                                <span className="ml-2 font-medium text-gray-800">{config.grid.spacing}px</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Wells:</span>
                                <span className="ml-2 font-medium text-gray-800">
                                    {config.distortion.wells.length} total
                                    {attractWells > 0 && ` (${attractWells} attract`}
                                    {repelWells > 0 && `, ${repelWells} repel)`}
                                    {attractWells > 0 && repelWells === 0 && ')'}
                                </span>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-200 mt-3">
                            <div className="space-y-1 text-sm">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={config.grid.points.show}
                                        readOnly
                                        className="pointer-events-none"
                                    />
                                    <span className="text-gray-600">
                                        Points: {config.grid.points.color}, {Math.round(config.grid.points.opacity * 100)}% opacity
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={config.grid.lines.show}
                                        readOnly
                                        className="pointer-events-none"
                                    />
                                    <span className="text-gray-600">
                                        Lines: {config.grid.lines.color}, {Math.round(config.grid.lines.curvature * 100)}% curved, {Math.round(config.grid.lines.frequency * 100)}% frequency
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={config.grid.fill.show}
                                        readOnly
                                        className="pointer-events-none"
                                    />
                                    <span className="text-gray-600">
                                        Fill: {config.grid.fill.color}, {Math.round(config.grid.fill.frequency * 100)}% frequency, {config.grid.fill.blendMode} blend
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Import Mode Selection */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Import Mode</h4>
                        <div className="space-y-3">
                            <label className="flex items-start p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                style={{ borderColor: selectedMode === 'replace' ? '#3b82f6' : '#e5e7eb' }}
                            >
                                <input
                                    type="radio"
                                    name="importMode"
                                    value="replace"
                                    checked={selectedMode === 'replace'}
                                    onChange={() => setSelectedMode('replace')}
                                    className="mt-1"
                                />
                                <div className="ml-3 flex-1">
                                    <div className="font-medium text-gray-800">Replace All</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Clear current grid and wells, load entire configuration. Use this to open a saved project or apply a template.
                                    </div>
                                </div>
                            </label>

                            <label className="flex items-start p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                style={{ borderColor: selectedMode === 'merge' ? '#3b82f6' : '#e5e7eb' }}
                            >
                                <input
                                    type="radio"
                                    name="importMode"
                                    value="merge"
                                    checked={selectedMode === 'merge'}
                                    onChange={() => setSelectedMode('merge')}
                                    className="mt-1"
                                />
                                <div className="ml-3 flex-1">
                                    <div className="font-medium text-gray-800">Merge Wells</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Keep current grid settings, add {config.distortion.wells.length} well{config.distortion.wells.length !== 1 ? 's' : ''} from import. Use this to combine patterns or add distortions to current work.
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        className="px-4 py-2 text-white bg-purple-500 rounded-md hover:bg-purple-600 transition-colors font-medium"
                    >
                        Import Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}

