import { useEffect } from 'react';
import { useAppStore } from '../state/app-store';
import { CollapsiblePanel } from './CollapsiblePanel';
import { initializeRangeFills, updateAllRangeFills } from '../utils/range-fill';
import { EyeOpenIcon, EyeClosedIcon, CancelIcon, LockIcon, UnlockIcon } from './icons';

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
    const wellsLocked = useAppStore((state) => state.wellsLocked);
    const setWellsLocked = useAppStore((state) => state.setWellsLocked);

    // Initialize range fills when component mounts
    useEffect(() => {
        initializeRangeFills();
    }, []);

    // Update range fills when selectedWell changes
    useEffect(() => {
        updateAllRangeFills();
    }, [selectedWellId, wells]);

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
                <section className="settings-section">
                    <h3 className="settings-section-title">Wells</h3>

                    {!selectedWell ? (
                        <>
                            {wells.length > 0 && (
                                <div className="controls-section">
                                    <div className="controls-title-row">
                                        <h4 className="controls-title">
                                            All Wells ({wells.length})
                                        </h4>
                                        <div className="controls-title-actions">
                                            <button
                                                onClick={() => setWellsLocked(!wellsLocked)}
                                                className={`btn btn-icon-only ${wellsLocked ? 'btn-locked' : ''}`}
                                                title={wellsLocked ? 'Unlock Wells (allow shuffle)' : 'Lock Wells (preserve on shuffle)'}
                                                aria-label={wellsLocked ? 'Unlock Wells' : 'Lock Wells'}
                                            >
                                                {wellsLocked ? (
                                                    <LockIcon className="icon" size={16} />
                                                ) : (
                                                    <UnlockIcon className="icon" size={16} />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setShowWells(!showWells)}
                                                className={`btn btn-icon-only ${showWells ? 'btn-active' : ''}`}
                                                title={showWells ? 'Hide Wells' : 'Show Wells'}
                                                aria-label={showWells ? 'Hide Wells' : 'Show Wells'}
                                            >
                                                {showWells ? (
                                                    <EyeOpenIcon className="icon" size={16} />
                                                ) : (
                                                    <EyeClosedIcon className="icon" size={16} />
                                                )}
                                            </button>
                                            <button
                                                onClick={handleReset}
                                                className="btn btn-icon-only"
                                                title="Clear All"
                                                aria-label="Clear All"
                                            >
                                                <CancelIcon className="icon" size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <ul className="controls-list">
                                        {wells.map((well, index) => (
                                            <li key={well.id} className="list-item-row">
                                                <button
                                                    onClick={() => selectWell(well.id)}
                                                    onMouseEnter={() => setHoveredWell(well.id)}
                                                    onMouseLeave={() => setHoveredWell(null)}
                                                    className={`list-item-btn ${well.id === selectedWellId ? 'active' : ''}`}
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
                            {wells.length > 1 && (
                                <div className="controls-section">
                                    <div className="controls-title-row">
                                        <h4 className="controls-title">
                                            All Wells ({wells.length})
                                        </h4>
                                        <div className="controls-title-actions">
                                            <button
                                                onClick={() => setWellsLocked(!wellsLocked)}
                                                className={`btn btn-icon-only ${wellsLocked ? 'btn-locked' : ''}`}
                                                title={wellsLocked ? 'Unlock Wells (allow shuffle)' : 'Lock Wells (preserve on shuffle)'}
                                                aria-label={wellsLocked ? 'Unlock Wells' : 'Lock Wells'}
                                            >
                                                {wellsLocked ? (
                                                    <LockIcon className="icon" size={16} />
                                                ) : (
                                                    <UnlockIcon className="icon" size={16} />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setShowWells(!showWells)}
                                                className={`btn btn-icon-only ${showWells ? 'btn-active' : ''}`}
                                                title={showWells ? 'Hide Wells' : 'Show Wells'}
                                                aria-label={showWells ? 'Hide Wells' : 'Show Wells'}
                                            >
                                                {showWells ? (
                                                    <EyeOpenIcon className="icon" size={16} />
                                                ) : (
                                                    <EyeClosedIcon className="icon" size={16} />
                                                )}
                                            </button>
                                            <button
                                                onClick={handleReset}
                                                className="btn btn-icon-only"
                                                title="Clear All"
                                                aria-label="Clear All"
                                            >
                                                <CancelIcon className="icon" size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <ul className="controls-list">
                                        {wells.map((well, index) => (
                                            <li key={well.id} className="list-item-row">
                                                <button
                                                    onClick={() => selectWell(well.id)}
                                                    onMouseEnter={() => setHoveredWell(well.id)}
                                                    onMouseLeave={() => setHoveredWell(null)}
                                                    className={`list-item-btn ${well.id === selectedWellId ? 'active' : ''}`}
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

                            <div className="form-group">
                                <label className="form-label">
                                    Position
                                </label>
                                <div className="form-input-row">
                                    <div className="form-input-group">
                                        <label className="form-input-label">X</label>
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
                                    <div className="form-input-group">
                                        <label className="form-input-label">Y</label>
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
                                <div className="form-range-container">
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
                                    <div className="form-range-display">
                                        <span className="form-range-label">Strength: {selectedWell.strength.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="settings-range-labels">
                                    <span>Repel</span>
                                    <span>Attract</span>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="form-range-container">
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
                                    <div className="form-range-display">
                                        <span className="form-range-label">Radius: {Math.round(selectedWell.radius)}</span>
                                    </div>
                                </div>
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
                                <div className="form-range-container">
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
                                    <div className="form-range-display">
                                        <span className="form-range-label">Distortion: {selectedWell.distortion.toFixed(2)}</span>
                                    </div>
                                </div>
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
                        </div>
                    )}
                </section>
            </div>
        </CollapsiblePanel>
    );
}

