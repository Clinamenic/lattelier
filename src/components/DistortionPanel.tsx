import { useAppStore } from '../state/app-store';
import { CollapsiblePanel } from './CollapsiblePanel';

export function DistortionPanel() {
    const selectedWellId = useAppStore((state) => state.selectedWellId);
    const wells = useAppStore((state) => state.deformation.wells);
    const updateWell = useAppStore((state) => state.updateWell);
    const removeWell = useAppStore((state) => state.removeWell);
    const activeTool = useAppStore((state) => state.activeTool);
    const setActiveTool = useAppStore((state) => state.setActiveTool);
    const selectWell = useAppStore((state) => state.selectWell);
    const setHoveredWell = useAppStore((state) => state.setHoveredWell);
    const isCollapsed = useAppStore((state) => state.rightSidebarCollapsed);
    const toggleCollapse = useAppStore((state) => state.toggleRightSidebar);

    const selectedWell = wells.find((w) => w.id === selectedWellId);

    return (
        <CollapsiblePanel
            title="Distortion Settings"
            direction="right"
            isCollapsed={isCollapsed}
            onToggle={toggleCollapse}
        >
            <div className="space-y-6">
                {/* Tools Section - Always Visible */}
                <section>
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Tools</h3>
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTool('pan')}
                            className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTool === 'pan'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Pan & Navigate
                        </button>
                        <button
                            onClick={() => setActiveTool('placeWell')}
                            className={`w-full px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTool === 'placeWell'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Place Well
                        </button>
                    </div>
                </section>

                {/* Wells Section */}
                <section className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Wells</h3>

                    {!selectedWell ? (
                        <>
                            <p className="text-sm text-gray-500 mb-4">
                                Use the Place Well tool to add wells, or select an existing one to edit its properties.
                            </p>

                            <div className="mt-4">
                                <h4 className="text-xs font-semibold text-gray-700 mb-2">
                                    Controls
                                </h4>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    <li><strong>Pan Tool:</strong> Click & drag to navigate</li>
                                    <li><strong>Well Tool:</strong> Click to place, drag to move</li>
                                    <li><strong>Scroll:</strong> Zoom in/out</li>
                                    <li><strong>Right Click:</strong> Always pans</li>
                                </ul>
                            </div>

                            {wells.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-xs font-semibold text-gray-700 mb-2">
                                        All Wells ({wells.length})
                                    </h4>
                                    <div className="space-y-1">
                                        {wells.map((well, index) => (
                                            <button
                                                key={well.id}
                                                onClick={() => selectWell(well.id)}
                                                onMouseEnter={() => setHoveredWell(well.id)}
                                                onMouseLeave={() => setHoveredWell(null)}
                                                className="w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors"
                                            >
                                                Well {index + 1} {well.strength >= 0 ? '(Attract)' : '(Repel)'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Position
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-500">X</label>
                                        <input
                                            type="number"
                                            value={Math.round(selectedWell.position.x)}
                                            onChange={(e) =>
                                                updateWell(selectedWell.id, {
                                                    position: { ...selectedWell.position, x: parseFloat(e.target.value) },
                                                })
                                            }
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Y</label>
                                        <input
                                            type="number"
                                            value={Math.round(selectedWell.position.y)}
                                            onChange={(e) =>
                                                updateWell(selectedWell.id, {
                                                    position: { ...selectedWell.position, y: parseFloat(e.target.value) },
                                                })
                                            }
                                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Repel</span>
                                    <span>Attract</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Falloff
                                </label>
                                <select
                                    value={selectedWell.falloff}
                                    onChange={(e) =>
                                        updateWell(selectedWell.id, { falloff: e.target.value as any })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="linear">Linear</option>
                                    <option value="quadratic">Quadratic</option>
                                    <option value="exponential">Exponential</option>
                                    <option value="smooth">Smooth</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>None</span>
                                    <span>Chaos</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedWell.enabled}
                                        onChange={(e) =>
                                            updateWell(selectedWell.id, { enabled: e.target.checked })
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">Enabled</span>
                                </label>

                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedWell.showRadialLines}
                                        onChange={(e) =>
                                            updateWell(selectedWell.id, { showRadialLines: e.target.checked })
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700">Show Radial Lines</span>
                                </label>
                            </div>

                            <button
                                onClick={() => removeWell(selectedWell.id)}
                                className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                            >
                                Delete Well
                            </button>

                            {wells.length > 1 && (
                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="text-xs font-semibold text-gray-700 mb-2">
                                        All Wells ({wells.length})
                                    </h4>
                                    <div className="space-y-1">
                                        {wells.map((well, index) => (
                                            <button
                                                key={well.id}
                                                onClick={() => selectWell(well.id)}
                                                onMouseEnter={() => setHoveredWell(well.id)}
                                                onMouseLeave={() => setHoveredWell(null)}
                                                className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${well.id === selectedWellId
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'hover:bg-gray-100'
                                                    }`}
                                            >
                                                Well {index + 1} {well.strength >= 0 ? '(Attract)' : '(Repel)'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </CollapsiblePanel>
    );
}

