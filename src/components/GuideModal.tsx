interface GuideModalProps {
    onClose: () => void;
}

export function GuideModal({ onClose }: GuideModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Lattelier Guide</h2>
                        <p className="text-blue-100 text-sm">Create beautiful distorted grid patterns</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
                        aria-label="Close guide"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto flex-1 px-6 py-6">
                    {/* Overview */}
                    <section className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            What is Lattelier?
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Lattelier is a creative tool for generating distorted grid patterns.
                            Start with a regular grid, add "wells" (attraction or repulsion points) to warp the grid,
                            customize the visual appearance, and export your creations as high-resolution images or vector graphics.
                        </p>
                    </section>

                    {/* Getting Started */}
                    <section className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Getting Started
                        </h3>
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
                            <ol className="space-y-2 text-gray-700">
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2 text-blue-600">1.</span>
                                    <span>Configure your grid in the <strong>Canvas Settings</strong> (left sidebar)</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2 text-blue-600">2.</span>
                                    <span>Click <strong>Place Well</strong> in the right sidebar, then click on the canvas to add distortion points</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2 text-blue-600">3.</span>
                                    <span>Adjust well properties (strength, radius, distortion) to shape your pattern</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="font-semibold mr-2 text-blue-600">4.</span>
                                    <span>Click <strong>Download</strong> to export as PNG or SVG</span>
                                </li>
                            </ol>
                        </div>
                    </section>

                    {/* Canvas Settings */}
                    <section className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Canvas Settings (Left Sidebar)
                        </h3>

                        <div className="space-y-4">
                            {/* Grid */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Grid</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li><strong>Type:</strong> Square, Triangular, or Hexagonal grid patterns</li>
                                    <li><strong>Rows/Columns:</strong> Grid density (5-200)</li>
                                    <li><strong>Spacing:</strong> Distance between grid points (5-100px)</li>
                                </ul>
                            </div>

                            {/* Points */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Points</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li><strong>Toggle:</strong> Show/hide grid points</li>
                                    <li><strong>Size:</strong> Point radius (0.5-10px)</li>
                                    <li><strong>Color:</strong> Point color (click to pick)</li>
                                    <li><strong>Opacity:</strong> Point transparency (0-100%)</li>
                                </ul>
                            </div>

                            {/* Lines */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Lines</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li><strong>Toggle:</strong> Show/hide connections between points</li>
                                    <li><strong>Frequency:</strong> Percentage of connections to draw (0-100%)</li>
                                    <li><strong>Curvature:</strong> Make lines straight (0%) or curved/filled (100%)</li>
                                    <li><strong>Width:</strong> Line thickness (0.5-10px)</li>
                                    <li><strong>Color:</strong> Line color</li>
                                    <li><strong>Opacity:</strong> Line transparency (0-100%)</li>
                                </ul>
                            </div>

                            {/* Fill */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Fill</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li><strong>Toggle:</strong> Show/hide filled grid cells</li>
                                    <li><strong>Frequency:</strong> Percentage of cells to fill (0-100%)</li>
                                    <li><strong>Color:</strong> Fill color</li>
                                    <li><strong>Opacity:</strong> Fill transparency (0-100%)</li>
                                    <li><strong>Blend Mode:</strong> How fill interacts with other layers</li>
                                </ul>
                            </div>

                            {/* Canvas */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Canvas</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li><strong>Background Color:</strong> Canvas background (default: light gray)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Distortion Settings */}
                    <section className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Distortion Settings (Right Sidebar)
                        </h3>

                        <div className="space-y-4">
                            {/* Tools */}
                            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r">
                                <h4 className="font-semibold text-purple-900 mb-2">Tools</h4>
                                <ul className="text-sm text-purple-800 space-y-2">
                                    <li><strong>Pan:</strong> Click and drag to move around the canvas. Also works with middle/right mouse button.</li>
                                    <li><strong>Place Well:</strong> Click on canvas to add a new distortion point. Click and drag existing wells to reposition them.</li>
                                </ul>
                            </div>

                            {/* Wells */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-800 mb-2">Wells (Distortion Points)</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Wells are points that attract or repel the grid, creating distortion effects.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>
                                        <strong>Strength:</strong>
                                        <span className="block ml-4 mt-1">
                                            • <span className="text-blue-600">Positive (0 to 100%)</span>: Attracts grid points toward the well center<br />
                                            • <span className="text-red-600">Negative (-100% to 0)</span>: Repels grid points to the well's edge
                                        </span>
                                    </li>
                                    <li><strong>Radius:</strong> Area of influence (50-500px)</li>
                                    <li><strong>Falloff:</strong> How strength diminishes with distance (Linear, Quadratic, Exponential, Smooth)</li>
                                    <li><strong>Distortion:</strong> Random scrambling of point positions within the well (0-100%)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Navigation */}
                    <section className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Navigation & Controls
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <ul className="text-sm text-gray-600 space-y-2">
                                <li><strong>Pan:</strong> Left-click drag (Pan tool), or middle/right-click drag (any tool)</li>
                                <li><strong>Zoom:</strong> Mouse wheel or trackpad scroll</li>
                                <li><strong>Move Well:</strong> Click and drag the center point of any well (Place Well tool)</li>
                                <li><strong>Collapse Sidebars:</strong> Click the arrow buttons on sidebar edges to maximize canvas space</li>
                            </ul>
                        </div>
                    </section>

                    {/* Export */}
                    <section className="mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Export & Import
                        </h3>

                        <div className="space-y-4">
                            {/* Download */}
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r">
                                <h4 className="font-semibold text-green-900 mb-2">Download (Images)</h4>
                                <ul className="text-sm text-green-800 space-y-1">
                                    <li><strong>PNG:</strong> Multiple resolution options (1× to 16×). Browser limits may apply for very large exports.</li>
                                    <li><strong>SVG:</strong> Unlimited resolution vector graphics, perfect for print and scaling.</li>
                                </ul>
                                <p className="text-xs text-green-700 mt-2">
                                    Files are named with content hashes (e.g., <code>a7f3b2c9.png</code>). You can rename them in the save dialog.
                                </p>
                            </div>

                            {/* Export Config */}
                            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r">
                                <h4 className="font-semibold text-purple-900 mb-2">Export Config (Save Your Work)</h4>
                                <p className="text-sm text-purple-800">
                                    Exports all settings (grid, wells, colors, etc.) as a JSON file.
                                    Use this to save your work and reload it later.
                                </p>
                            </div>

                            {/* Import Config */}
                            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r">
                                <h4 className="font-semibold text-indigo-900 mb-2">Import Config (Load Saved Work)</h4>
                                <p className="text-sm text-indigo-800 mb-2">
                                    Load a previously saved JSON configuration file. Choose how to import:
                                </p>
                                <ul className="text-sm text-indigo-800 space-y-1">
                                    <li><strong>Replace All:</strong> Completely replaces current settings with imported config</li>
                                    <li><strong>Merge Wells:</strong> Keeps current grid settings, adds imported wells to existing ones</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Tips */}
                    <section className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                            Tips & Tricks
                        </h3>
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r">
                            <ul className="text-sm text-yellow-900 space-y-2">
                                <li>• Start with low <strong>Line Frequency</strong> (10-30%) for sparse, artistic patterns</li>
                                <li>• Combine <strong>Line Curvature</strong> with low opacity for organic, flowing effects</li>
                                <li>• Use multiple wells with opposite strengths (attract + repel) for complex distortions</li>
                                <li>• Try <strong>Hexagonal</strong> grids with fill for honeycomb-like patterns</li>
                                <li>• Experiment with <strong>Blend Modes</strong> for unexpected color interactions</li>
                                <li>• Add slight <strong>Distortion</strong> (5-15%) to wells for more natural, less geometric results</li>
                                <li>• Export as SVG for infinite scalability and easy editing in design software</li>
                                <li>• Save your favorite configurations as JSON files to build a personal library</li>
                            </ul>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                        Got It!
                    </button>
                </div>
            </div>
        </div>
    );
}

