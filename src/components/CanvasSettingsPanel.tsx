import { useAppStore } from '../state/app-store';
import { CollapsiblePanel } from './CollapsiblePanel';

export function CanvasSettingsPanel() {
    const gridConfig = useAppStore((state) => state.gridConfig);
    const setGridConfig = useAppStore((state) => state.setGridConfig);
    const isCollapsed = useAppStore((state) => state.leftSidebarCollapsed);
    const toggleCollapse = useAppStore((state) => state.toggleLeftSidebar);

    return (
        <CollapsiblePanel
            title="Canvas Settings"
            direction="left"
            isCollapsed={isCollapsed}
            onToggle={toggleCollapse}
        >
            <div className="space-y-6">
                {/* Canvas Section */}
                <section>
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Canvas</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Background Color
                        </label>
                        <input
                            type="color"
                            value={gridConfig.canvasBackgroundColor}
                            onChange={(e) => setGridConfig({ canvasBackgroundColor: e.target.value })}
                            className="w-full h-10 rounded cursor-pointer"
                        />
                    </div>
                </section>

                {/* Grid Section */}
                <section className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Grid</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Grid Type
                            </label>
                            <select
                                value={gridConfig.gridType}
                                onChange={(e) => setGridConfig({ gridType: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="square">Square</option>
                                <option value="triangular">Triangular</option>
                                <option value="hexagonal">Hexagonal</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rows: {gridConfig.rows}
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="200"
                                value={gridConfig.rows}
                                onChange={(e) => setGridConfig({ rows: parseInt(e.target.value) })}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Columns: {gridConfig.columns}
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="200"
                                value={gridConfig.columns}
                                onChange={(e) => setGridConfig({ columns: parseInt(e.target.value) })}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Spacing: {gridConfig.spacing}
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="100"
                                value={gridConfig.spacing}
                                onChange={(e) => setGridConfig({ spacing: parseInt(e.target.value) })}
                                className="w-full"
                            />
                        </div>
                    </div>
                </section>

                {/* Points Section */}
                <section className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-800">Points</h3>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={gridConfig.showPoints}
                                onChange={(e) => setGridConfig({ showPoints: e.target.checked })}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Show</span>
                        </label>
                    </div>

                    {gridConfig.showPoints && (
                        <div className="space-y-3 pl-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Size: {gridConfig.pointSize}
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="5"
                                    step="0.5"
                                    value={gridConfig.pointSize}
                                    onChange={(e) => setGridConfig({ pointSize: parseFloat(e.target.value) })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Color
                                </label>
                                <input
                                    type="color"
                                    value={gridConfig.pointColor}
                                    onChange={(e) => setGridConfig({ pointColor: e.target.value })}
                                    className="w-full h-10 rounded cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Opacity: {Math.round(gridConfig.pointOpacity * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={gridConfig.pointOpacity * 100}
                                    onChange={(e) => setGridConfig({ pointOpacity: parseInt(e.target.value) / 100 })}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* Lines Section */}
                <section className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-800">Lines</h3>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={gridConfig.showLines}
                                onChange={(e) => setGridConfig({ showLines: e.target.checked })}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Show</span>
                        </label>
                    </div>

                    {gridConfig.showLines && (
                        <div className="space-y-3 pl-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Frequency: {Math.round(gridConfig.lineFrequency * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={gridConfig.lineFrequency * 100}
                                    onChange={(e) => setGridConfig({ lineFrequency: parseInt(e.target.value) / 100 })}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Sparse</span>
                                    <span>All</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Curvature: {Math.round(gridConfig.lineCurvature * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={gridConfig.lineCurvature * 100}
                                    onChange={(e) => setGridConfig({ lineCurvature: parseInt(e.target.value) / 100 })}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Straight</span>
                                    <span>Curved</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Width: {gridConfig.lineWidth}
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="10"
                                    step="0.5"
                                    value={gridConfig.lineWidth}
                                    onChange={(e) => setGridConfig({ lineWidth: parseFloat(e.target.value) })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Color
                                </label>
                                <input
                                    type="color"
                                    value={gridConfig.lineColor}
                                    onChange={(e) => setGridConfig({ lineColor: e.target.value })}
                                    className="w-full h-10 rounded cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Opacity: {Math.round(gridConfig.lineOpacity * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={gridConfig.lineOpacity * 100}
                                    onChange={(e) => setGridConfig({ lineOpacity: parseInt(e.target.value) / 100 })}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* Fill Section */}
                <section className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-800">Fill</h3>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={gridConfig.showFill}
                                onChange={(e) => setGridConfig({ showFill: e.target.checked })}
                                className="mr-2"
                            />
                            <span className="text-sm text-gray-700">Show</span>
                        </label>
                    </div>

                    {gridConfig.showFill && (
                        <div className="space-y-3 pl-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Frequency: {Math.round(gridConfig.fillFrequency * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={gridConfig.fillFrequency * 100}
                                    onChange={(e) => setGridConfig({ fillFrequency: parseInt(e.target.value) / 100 })}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Sparse</span>
                                    <span>All</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Color
                                </label>
                                <input
                                    type="color"
                                    value={gridConfig.fillColor}
                                    onChange={(e) => setGridConfig({ fillColor: e.target.value })}
                                    className="w-full h-10 rounded cursor-pointer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Opacity: {Math.round(gridConfig.fillOpacity * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={gridConfig.fillOpacity * 100}
                                    onChange={(e) => setGridConfig({ fillOpacity: parseInt(e.target.value) / 100 })}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Blend Mode
                                </label>
                                <select
                                    value={gridConfig.blendMode}
                                    onChange={(e) => setGridConfig({ blendMode: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="multiply">Multiply</option>
                                    <option value="screen">Screen</option>
                                    <option value="overlay">Overlay</option>
                                </select>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </CollapsiblePanel>
    );
}

