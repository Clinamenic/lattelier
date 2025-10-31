import { useEffect } from 'react';
import { useAppStore } from '../state/app-store';
import { CollapsiblePanel } from './CollapsiblePanel';
import { initializeRangeFills, updateAllRangeFills } from '../utils/range-fill';

// Helper function to determine if a color is light or dark
function getContrastColor(hexColor: string): string {
    // Remove the # if present
    const hex = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function CanvasSettingsPanel() {
    const gridConfig = useAppStore((state) => state.gridConfig);
    const setGridConfig = useAppStore((state) => state.setGridConfig);
    const isCollapsed = useAppStore((state) => state.leftSidebarCollapsed);

    // Initialize range fills when component mounts
    useEffect(() => {
        initializeRangeFills();
    }, []);

    // Update range fills when gridConfig changes (e.g., from shuffle)
    useEffect(() => {
        updateAllRangeFills();
    }, [gridConfig]);

    return (
        <CollapsiblePanel
            title="Lattice Settings"
            direction="left"
            isCollapsed={isCollapsed}
        >
            <div className="space-y-6">
                {/* Canvas Section */}
                <section className="settings-section">
                    <h3 className="settings-section-title">Canvas</h3>
                    <div className="form-group">
                        <div className="color-picker-container">
                            <input
                                type="color"
                                value={gridConfig.canvasBackgroundColor}
                                onChange={(e) => setGridConfig({ canvasBackgroundColor: e.target.value })}
                                className="color-picker-input"
                            />
                            <div
                                className="color-picker-display"
                                style={{ backgroundColor: gridConfig.canvasBackgroundColor }}
                            >
                                <span
                                    className="color-picker-label"
                                    style={{
                                        color: getContrastColor(gridConfig.canvasBackgroundColor)
                                    }}
                                >
                                    {gridConfig.canvasBackgroundColor.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Grid Section */}
                <section className="settings-section">
                    <h3 className="settings-section-title">Grid</h3>
                    <div className="form-group">
                        <label className="form-label">
                            Grid Type
                        </label>
                        <select
                            value={gridConfig.gridType}
                            onChange={(e) => setGridConfig({ gridType: e.target.value as any })}
                            className="form-select"
                        >
                            <option value="square">Square</option>
                            <option value="triangular">Triangular</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <div className="form-range-container">
                            <input
                                type="range"
                                min="5"
                                max="200"
                                value={gridConfig.rows}
                                onChange={(e) => setGridConfig({ rows: parseInt(e.target.value) })}
                                className="form-range"
                            />
                            <div className="form-range-display">
                                <span className="form-range-label">Rows: {gridConfig.rows}</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="form-range-container">
                            <input
                                type="range"
                                min="5"
                                max="200"
                                value={gridConfig.columns}
                                onChange={(e) => setGridConfig({ columns: parseInt(e.target.value) })}
                                className="form-range"
                            />
                            <div className="form-range-display">
                                <span className="form-range-label">Columns: {gridConfig.columns}</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="form-range-container">
                            <input
                                type="range"
                                min="5"
                                max="100"
                                value={gridConfig.spacing}
                                onChange={(e) => setGridConfig({ spacing: parseInt(e.target.value) })}
                                className="form-range"
                            />
                            <div className="form-range-display">
                                <span className="form-range-label">Spacing: {gridConfig.spacing}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Points Section */}
                <section className="settings-section">
                    <h3 className="settings-section-title">Points</h3>
                    <div className="form-group">
                        <div className="color-picker-container">
                            <input
                                type="color"
                                value={gridConfig.pointColor}
                                onChange={(e) => setGridConfig({ pointColor: e.target.value })}
                                className="color-picker-input"
                            />
                            <div
                                className="color-picker-display"
                                style={{ backgroundColor: gridConfig.pointColor }}
                            >
                                <span
                                    className="color-picker-label"
                                    style={{
                                        color: getContrastColor(gridConfig.pointColor)
                                    }}
                                >
                                    {gridConfig.pointColor.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="form-range-container">
                            <input
                                type="range"
                                min="0"
                                max="5"
                                step="0.01"
                                value={gridConfig.pointSize}
                                onChange={(e) => setGridConfig({ pointSize: parseFloat(e.target.value) })}
                                className="form-range"
                            />
                            <div className="form-range-display">
                                <span className="form-range-label">Size: {gridConfig.pointSize.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="form-range-container">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={gridConfig.pointOpacity * 100}
                                onChange={(e) => setGridConfig({ pointOpacity: parseInt(e.target.value) / 100 })}
                                className="form-range"
                            />
                            <div className="form-range-display">
                                <span className="form-range-label">Opacity: {Math.round(gridConfig.pointOpacity * 100)}%</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Lines Section */}
                <section className="settings-section">
                    <h3 className="settings-section-title">Lines</h3>
                    <div className="form-group">
                        <div className="color-picker-container">
                            <input
                                type="color"
                                value={gridConfig.lineColor}
                                onChange={(e) => setGridConfig({ lineColor: e.target.value })}
                                className="color-picker-input"
                            />
                            <div
                                className="color-picker-display"
                                style={{ backgroundColor: gridConfig.lineColor }}
                            >
                                <span
                                    className="color-picker-label"
                                    style={{
                                        color: getContrastColor(gridConfig.lineColor)
                                    }}
                                >
                                    {gridConfig.lineColor.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Texture
                        </label>
                        <select
                            value={gridConfig.lineTexture}
                            onChange={(e) => setGridConfig({ lineTexture: e.target.value as 'solid' | 'segmented' })}
                            className="form-select"
                        >
                            <option value="solid">Solid</option>
                            <option value="segmented">Segmented</option>
                        </select>
                    </div>

                    {gridConfig.lineTexture === 'solid' && (
                        <div className="form-group">
                            <div className="form-range-container">
                                <input
                                    type="range"
                                    min="-100"
                                    max="100"
                                    value={gridConfig.lineCurvature * 100}
                                    onChange={(e) => setGridConfig({ lineCurvature: parseInt(e.target.value) / 100 })}
                                    className="form-range"
                                />
                                <div className="form-range-display">
                                    <span className="form-range-label">Curvature: {Math.round(gridConfig.lineCurvature * 100)}%</span>
                                </div>
                            </div>
                            <div className="settings-range-labels">
                                <span>Concave</span>
                                <span>Straight</span>
                                <span>Convex</span>
                            </div>
                        </div>
                    )}

                    {gridConfig.lineTexture === 'segmented' && (
                        <>
                            <div className="form-group">
                                <div className="form-range-container">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={(gridConfig.segmentedTextureSettings?.angleVariation ?? 1.0) * 100}
                                        onChange={(e) =>
                                            setGridConfig({
                                                segmentedTextureSettings: {
                                                    ...gridConfig.segmentedTextureSettings!,
                                                    angleVariation: parseInt(e.target.value) / 100,
                                                },
                                            })
                                        }
                                        className="form-range"
                                    />
                                    <div className="form-range-display">
                                        <span className="form-range-label">
                                            Angle Var: {Math.round((gridConfig.segmentedTextureSettings?.angleVariation ?? 1.0) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="form-range-container">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={(gridConfig.segmentedTextureSettings?.spacingVariation ?? 0.5) * 100}
                                        onChange={(e) =>
                                            setGridConfig({
                                                segmentedTextureSettings: {
                                                    ...gridConfig.segmentedTextureSettings!,
                                                    spacingVariation: parseInt(e.target.value) / 100,
                                                },
                                            })
                                        }
                                        className="form-range"
                                    />
                                    <div className="form-range-display">
                                        <span className="form-range-label">
                                            Spacing Var: {Math.round((gridConfig.segmentedTextureSettings?.spacingVariation ?? 0.5) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="form-range-container">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={(gridConfig.segmentedTextureSettings?.lengthVariation ?? 1.0) * 100}
                                        onChange={(e) =>
                                            setGridConfig({
                                                segmentedTextureSettings: {
                                                    ...gridConfig.segmentedTextureSettings!,
                                                    lengthVariation: parseInt(e.target.value) / 100,
                                                },
                                            })
                                        }
                                        className="form-range"
                                    />
                                    <div className="form-range-display">
                                        <span className="form-range-label">
                                            Length Var: {Math.round((gridConfig.segmentedTextureSettings?.lengthVariation ?? 1.0) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <div className="form-range-container">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={gridConfig.lineFrequency * 100}
                                onChange={(e) => setGridConfig({ lineFrequency: parseInt(e.target.value) / 100 })}
                                className="form-range"
                            />
                            <div className="form-range-display">
                                <span className="form-range-label">Frequency: {Math.round(gridConfig.lineFrequency * 100)}%</span>
                            </div>
                        </div>
                        <div className="settings-range-labels">
                            <span>Sparse</span>
                            <span>All</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="form-range-container">
                            <input
                                type="range"
                                min="0.5"
                                max="10"
                                step="0.5"
                                value={gridConfig.lineWidth}
                                onChange={(e) => setGridConfig({ lineWidth: parseFloat(e.target.value) })}
                                className="form-range"
                            />
                            <div className="form-range-display">
                                <span className="form-range-label">Width: {gridConfig.lineWidth.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="form-range-container">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={gridConfig.lineOpacity * 100}
                                onChange={(e) => setGridConfig({ lineOpacity: parseInt(e.target.value) / 100 })}
                                className="form-range"
                            />
                            <div className="form-range-display">
                                <span className="form-range-label">Opacity: {Math.round(gridConfig.lineOpacity * 100)}%</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fill Section */}
                <section className="settings-section">
                    <h3 className="settings-section-title">Fill</h3>
                    <div className="form-group">
                        <div className="color-picker-container">
                            <input
                                type="color"
                                value={gridConfig.fillColor}
                                onChange={(e) => setGridConfig({ fillColor: e.target.value })}
                                className="color-picker-input"
                            />
                            <div
                                className="color-picker-display"
                                style={{ backgroundColor: gridConfig.fillColor }}
                            >
                                <span
                                    className="color-picker-label"
                                    style={{
                                        color: getContrastColor(gridConfig.fillColor)
                                    }}
                                >
                                    {gridConfig.fillColor.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="form-range-container">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={gridConfig.fillFrequency * 100}
                                onChange={(e) => setGridConfig({ fillFrequency: parseInt(e.target.value) / 100 })}
                                className="form-range"
                            />
                            <div className="form-range-display">
                                <span className="form-range-label">Frequency: {Math.round(gridConfig.fillFrequency * 100)}%</span>
                            </div>
                        </div>
                        <div className="settings-range-labels">
                            <span>Sparse</span>
                            <span>All</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="form-range-container">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={gridConfig.fillOpacity * 100}
                                onChange={(e) => setGridConfig({ fillOpacity: parseInt(e.target.value) / 100 })}
                                className="form-range"
                            />
                            <div className="form-range-display">
                                <span className="form-range-label">Opacity: {Math.round(gridConfig.fillOpacity * 100)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Blend Mode
                        </label>
                        <select
                            value={gridConfig.blendMode}
                            onChange={(e) => setGridConfig({ blendMode: e.target.value as any })}
                            className="form-select"
                        >
                            <option value="normal">Normal</option>
                            <option value="multiply">Multiply</option>
                            <option value="screen">Screen</option>
                            <option value="overlay">Overlay</option>
                        </select>
                    </div>
                </section>
            </div>
        </CollapsiblePanel>
    );
}

