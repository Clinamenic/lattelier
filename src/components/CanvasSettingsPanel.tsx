import { useAppStore } from '../state/app-store';
import { CollapsiblePanel } from './CollapsiblePanel';

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

    return (
        <CollapsiblePanel
            title="Canvas Settings"
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
                    <div className="space-y-3">
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
                            <label className="form-label">
                                Rows: {gridConfig.rows}
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="200"
                                value={gridConfig.rows}
                                onChange={(e) => setGridConfig({ rows: parseInt(e.target.value) })}
                                className="form-range"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Columns: {gridConfig.columns}
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="200"
                                value={gridConfig.columns}
                                onChange={(e) => setGridConfig({ columns: parseInt(e.target.value) })}
                                className="form-range"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Spacing: {gridConfig.spacing}
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="100"
                                value={gridConfig.spacing}
                                onChange={(e) => setGridConfig({ spacing: parseInt(e.target.value) })}
                                className="form-range"
                            />
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
                        <label className="form-label">
                            Size: {gridConfig.pointSize}
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.5"
                            value={gridConfig.pointSize}
                            onChange={(e) => setGridConfig({ pointSize: parseFloat(e.target.value) })}
                            className="form-range"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Opacity: {Math.round(gridConfig.pointOpacity * 100)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={gridConfig.pointOpacity * 100}
                            onChange={(e) => setGridConfig({ pointOpacity: parseInt(e.target.value) / 100 })}
                            className="form-range"
                        />
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
                            Frequency: {Math.round(gridConfig.lineFrequency * 100)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={gridConfig.lineFrequency * 100}
                            onChange={(e) => setGridConfig({ lineFrequency: parseInt(e.target.value) / 100 })}
                            className="form-range"
                        />
                        <div className="settings-range-labels">
                            <span>Sparse</span>
                            <span>All</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Curvature: {Math.round(gridConfig.lineCurvature * 100)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={gridConfig.lineCurvature * 100}
                            onChange={(e) => setGridConfig({ lineCurvature: parseInt(e.target.value) / 100 })}
                            className="form-range"
                        />
                        <div className="settings-range-labels">
                            <span>Straight</span>
                            <span>Curved</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Width: {gridConfig.lineWidth}
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="10"
                            step="0.5"
                            value={gridConfig.lineWidth}
                            onChange={(e) => setGridConfig({ lineWidth: parseFloat(e.target.value) })}
                            className="form-range"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Opacity: {Math.round(gridConfig.lineOpacity * 100)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={gridConfig.lineOpacity * 100}
                            onChange={(e) => setGridConfig({ lineOpacity: parseInt(e.target.value) / 100 })}
                            className="form-range"
                        />
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
                        <label className="form-label">
                            Frequency: {Math.round(gridConfig.fillFrequency * 100)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={gridConfig.fillFrequency * 100}
                            onChange={(e) => setGridConfig({ fillFrequency: parseInt(e.target.value) / 100 })}
                            className="form-range"
                        />
                        <div className="settings-range-labels">
                            <span>Sparse</span>
                            <span>All</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Opacity: {Math.round(gridConfig.fillOpacity * 100)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={gridConfig.fillOpacity * 100}
                            onChange={(e) => setGridConfig({ fillOpacity: parseInt(e.target.value) / 100 })}
                            className="form-range"
                        />
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

