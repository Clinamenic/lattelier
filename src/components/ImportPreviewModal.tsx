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
        <div className="modal-backdrop">
            <div className="modal modal-lg">
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">Import Configuration</h2>
                    <button
                        onClick={onCancel}
                        className="modal-close"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="modal-body">
                    {/* Metadata */}
                    <div>
                        <h3 className="import-metadata-title">{config.metadata.name}</h3>
                        {config.metadata.description && (
                            <p className="import-metadata-description">{config.metadata.description}</p>
                        )}
                        <div className="import-metadata-dates">
                            <span>Created: {new Date(config.metadata.createdAt).toLocaleDateString()}</span>
                            <span>Modified: {new Date(config.metadata.modifiedAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Configuration Summary */}
                    <div className="import-summary">
                        <h4 className="import-summary-title">Configuration Summary</h4>

                        <div className="import-summary-grid">
                            <div>
                                <span className="import-summary-label">Grid Type:</span>
                                <span className="import-summary-value capitalize">{config.grid.type}</span>
                            </div>
                            <div>
                                <span className="import-summary-label">Size:</span>
                                <span className="import-summary-value">
                                    {config.grid.rows} × {config.grid.columns}
                                </span>
                            </div>
                            <div>
                                <span className="import-summary-label">Spacing:</span>
                                <span className="import-summary-value">{config.grid.spacing}px</span>
                            </div>
                            <div>
                                <span className="import-summary-label">Wells:</span>
                                <span className="import-summary-value">
                                    {config.distortion.wells.length} total
                                    {attractWells > 0 && ` (${attractWells} attract`}
                                    {repelWells > 0 && `, ${repelWells} repel)`}
                                    {attractWells > 0 && repelWells === 0 && ')'}
                                </span>
                            </div>
                        </div>

                        <div className="import-summary-divider">
                            <div className="import-summary-list">
                                <div className="import-summary-item">
                                    <input
                                        type="checkbox"
                                        checked={config.grid.points.show}
                                        readOnly
                                        className="import-summary-checkbox"
                                    />
                                    <span className="import-summary-text">
                                        Points: {config.grid.points.color}, {Math.round(config.grid.points.opacity * 100)}% opacity
                                    </span>
                                </div>
                                <div className="import-summary-item">
                                    <input
                                        type="checkbox"
                                        checked={config.grid.lines.show}
                                        readOnly
                                        className="import-summary-checkbox"
                                    />
                                    <span className="import-summary-text">
                                        Lines: {config.grid.lines.color}, {Math.round(config.grid.lines.curvature * 100)}% curved, {Math.round(config.grid.lines.frequency * 100)}% frequency
                                    </span>
                                </div>
                                <div className="import-summary-item">
                                    <input
                                        type="checkbox"
                                        checked={config.grid.fill.show}
                                        readOnly
                                        className="import-summary-checkbox"
                                    />
                                    <span className="import-summary-text">
                                        Fill: {config.grid.fill.color}, {Math.round(config.grid.fill.frequency * 100)}% frequency, {config.grid.fill.blendMode} blend
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Import Mode Selection */}
                    <div>
                        <h4 className="import-modes-title">Import Mode</h4>
                        <div className="import-modes-list">
                            <label className={`import-mode-option ${selectedMode === 'replace' ? 'import-mode-option-selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="importMode"
                                    value="replace"
                                    checked={selectedMode === 'replace'}
                                    onChange={() => setSelectedMode('replace')}
                                    className="import-mode-radio"
                                />
                                <div className="import-mode-content">
                                    <div className="import-mode-title">Replace All</div>
                                    <div className="import-mode-description">
                                        Clear current grid and wells, load entire configuration. Use this to open a saved project or apply a template.
                                    </div>
                                </div>
                            </label>

                            <label className={`import-mode-option ${selectedMode === 'merge' ? 'import-mode-option-selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="importMode"
                                    value="merge"
                                    checked={selectedMode === 'merge'}
                                    onChange={() => setSelectedMode('merge')}
                                    className="import-mode-radio"
                                />
                                <div className="import-mode-content">
                                    <div className="import-mode-title">Merge Wells</div>
                                    <div className="import-mode-description">
                                        Keep current grid settings, add {config.distortion.wells.length} well{config.distortion.wells.length !== 1 ? 's' : ''} from import. Use this to combine patterns or add distortions to current work.
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button
                        onClick={onCancel}
                        className="import-button-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        className="import-button-import"
                    >
                        Import Configuration
                    </button>
                </div>
            </div>
        </div>
    );
}

