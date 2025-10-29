import { useAppStore } from '../state/app-store';
import { CollapsiblePanel } from './CollapsiblePanel';

export function DistortionPanel() {
    const selectedWellId = useAppStore((state) => state.selectedWellId);
    const wells = useAppStore((state) => state.deformation.wells);
    const updateWell = useAppStore((state) => state.updateWell);
    const removeWell = useAppStore((state) => state.removeWell);
    const selectWell = useAppStore((state) => state.selectWell);
    const setHoveredWell = useAppStore((state) => state.setHoveredWell);
    const isCollapsed = useAppStore((state) => state.rightSidebarCollapsed);
    const showWells = useAppStore((state) => state.showWells);
    const setShowWells = useAppStore((state) => state.setShowWells);

    const selectedWell = wells.find((w) => w.id === selectedWellId);

    const handleReset = () => {
        if (confirm('Clear all wells?')) {
            wells.forEach(w => removeWell(w.id));
        }
    };

    return (
        <CollapsiblePanel
            title="Distortion Settings"
            direction="right"
            isCollapsed={isCollapsed}
        >
            <div className="space-y-4">

                {/* Wells Section */}
                <section className="distortion-section">
                    <h3 className="distortion-section-title">Wells</h3>

                    {/* Wells Control Buttons */}
                    <div className="tool-buttons">
                        <button
                            onClick={() => setShowWells(!showWells)}
                            className={`tool-button ${showWells ? 'tool-button-active' : 'tool-button-inactive'}`}
                        >
                            {showWells ? 'Hide' : 'Show'} Wells
                        </button>
                        <button
                            onClick={handleReset}
                            className="tool-button tool-button-inactive"
                        >
                            Clear All
                        </button>
                    </div>

                    {!selectedWell ? (
                        <>
                            {wells.length > 0 && (
                                <div className="controls-section">
                                    <h4 className="controls-title">
                                        All Wells ({wells.length})
                                    </h4>
                                    <ul className="wells-list">
                                        {wells.map((well, index) => (
                                            <li key={well.id} className="well-list-item">
                                                <button
                                                    onClick={() => selectWell(well.id)}
                                                    onMouseEnter={() => setHoveredWell(well.id)}
                                                    onMouseLeave={() => setHoveredWell(null)}
                                                    className="well-item"
                                                >
                                                    Well {index + 1} {well.strength >= 0 ? '(Attract)' : '(Repel)'}
                                                </button>
                                                <label className="form-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={well.enabled}
                                                        onChange={(e) =>
                                                            updateWell(well.id, { enabled: e.target.checked })
                                                        }
                                                        className="form-checkbox"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-3">
                            <div className="form-group">
                                <label className="form-label">
                                    Position
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-light">X</label>
                                        <input
                                            type="number"
                                            value={Math.round(selectedWell.position.x)}
                                            onChange={(e) =>
                                                updateWell(selectedWell.id, {
                                                    position: { ...selectedWell.position, x: parseFloat(e.target.value) },
                                                })
                                            }
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-light">Y</label>
                                        <input
                                            type="number"
                                            value={Math.round(selectedWell.position.y)}
                                            onChange={(e) =>
                                                updateWell(selectedWell.id, {
                                                    position: { ...selectedWell.position, y: parseFloat(e.target.value) },
                                                })
                                            }
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Strength: {selectedWell.strength.toFixed(2)}
                                </label>
                                <input
                                    type="range"
                                    min="-1"
                                    max="1"
                                    step="0.01"
                                    value={selectedWell.strength}
                                    onChange={(e) =>
                                        updateWell(selectedWell.id, { strength: parseFloat(e.target.value) })
                                    }
                                    className="form-range"
                                />
                                <div className="settings-range-labels">
                                    <span>Repel</span>
                                    <span>Attract</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Radius: {Math.round(selectedWell.radius)}
                                </label>
                                <input
                                    type="range"
                                    min="50"
                                    max="500"
                                    value={selectedWell.radius}
                                    onChange={(e) =>
                                        updateWell(selectedWell.id, { radius: parseFloat(e.target.value) })
                                    }
                                    className="form-range"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Falloff
                                </label>
                                <select
                                    value={selectedWell.falloff}
                                    onChange={(e) =>
                                        updateWell(selectedWell.id, { falloff: e.target.value as any })
                                    }
                                    className="form-select"
                                >
                                    <option value="linear">Linear</option>
                                    <option value="quadratic">Quadratic</option>
                                    <option value="exponential">Exponential</option>
                                    <option value="smooth">Smooth</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Distortion: {selectedWell.distortion.toFixed(2)}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={selectedWell.distortion}
                                    onChange={(e) =>
                                        updateWell(selectedWell.id, { distortion: parseFloat(e.target.value) })
                                    }
                                    className="form-range"
                                />
                                <div className="settings-range-labels">
                                    <span>None</span>
                                    <span>Chaos</span>
                                </div>
                            </div>


                            <button
                                onClick={() => removeWell(selectedWell.id)}
                                className="btn"
                            >
                                Delete Well
                            </button>

                            {wells.length > 1 && (
                                <div className="controls-section">
                                    <h4 className="controls-title">
                                        All Wells ({wells.length})
                                    </h4>
                                    <ul className="wells-list">
                                        {wells.map((well, index) => (
                                            <li key={well.id} className="well-list-item">
                                                <button
                                                    onClick={() => selectWell(well.id)}
                                                    onMouseEnter={() => setHoveredWell(well.id)}
                                                    onMouseLeave={() => setHoveredWell(null)}
                                                    className={`well-item ${well.id === selectedWellId ? 'well-item-selected' : ''}`}
                                                >
                                                    Well {index + 1} {well.strength >= 0 ? '(Attract)' : '(Repel)'}
                                                </button>
                                                <label className="form-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={well.enabled}
                                                        onChange={(e) =>
                                                            updateWell(well.id, { enabled: e.target.checked })
                                                        }
                                                        className="form-checkbox"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </CollapsiblePanel>
    );
}

