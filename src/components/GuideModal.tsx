interface GuideModalProps {
    onClose: () => void;
}

export function GuideModal({ onClose }: GuideModalProps) {
    return (
        <div className="modal-backdrop">
            <div className="modal modal-xl">
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">Lattelier Guide</h2>
                    <button
                        onClick={onClose}
                        className="modal-close"
                        aria-label="Close guide"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="modal-body">
                    {/* Overview */}
                    <section className="settings-section">
                        <h3 className="settings-section-title">
                            What is Lattelier?
                        </h3>
                        <p className="text-sm text-secondary">
                            Lattelier is a creative tool for generating distorted grid patterns.
                            Start with a regular grid, add "wells" (attraction or repulsion points) to warp the grid,
                            customize the visual appearance, and export your creations as high-resolution images or vector graphics.
                        </p>
                    </section>

                    {/* Getting Started */}
                    <section className="settings-section">
                        <h3 className="settings-section-title">
                            Getting Started
                        </h3>
                        <div className="p-3 rounded">
                            <ol className="controls-list">
                                <li>1. Configure your grid in the <strong>Canvas Settings</strong> (left sidebar)</li>
                                <li>2. Click <strong>Place Well</strong> in the right sidebar, then click on the canvas to add distortion points</li>
                                <li>3. Adjust well properties (strength, radius, distortion) to shape your pattern</li>
                                <li>4. Click <strong>Download</strong> to export as PNG or SVG</li>
                            </ol>
                        </div>
                    </section>

                    {/* Canvas Settings */}
                    <section className="settings-section">
                        <h3 className="settings-section-title">
                            Canvas Settings (Left Sidebar)
                        </h3>

                        <div className="space-y-3">
                            {/* Grid */}
                            <div className="p-3 rounded">
                                <h4 className="controls-title">Grid</h4>
                                <ul className="controls-list">
                                    <li><strong>Type:</strong> Square, Triangular, or Hexagonal grid patterns</li>
                                    <li><strong>Rows/Columns:</strong> Grid density (5-200)</li>
                                    <li><strong>Spacing:</strong> Distance between grid points (5-100px)</li>
                                </ul>
                            </div>

                            {/* Points */}
                            <div className="p-3 rounded">
                                <h4 className="controls-title">Points</h4>
                                <ul className="controls-list">
                                    <li><strong>Toggle:</strong> Show/hide grid points</li>
                                    <li><strong>Size:</strong> Point radius (0.5-10px)</li>
                                    <li><strong>Color:</strong> Point color (click to pick)</li>
                                    <li><strong>Opacity:</strong> Point transparency (0-100%)</li>
                                </ul>
                            </div>

                            {/* Lines */}
                            <div className="p-3 rounded">
                                <h4 className="controls-title">Lines</h4>
                                <ul className="controls-list">
                                    <li><strong>Toggle:</strong> Show/hide connections between points</li>
                                    <li><strong>Frequency:</strong> Percentage of connections to draw (0-100%)</li>
                                    <li><strong>Curvature:</strong> Make lines straight (0%) or curved/filled (100%)</li>
                                    <li><strong>Width:</strong> Line thickness (0.5-10px)</li>
                                    <li><strong>Color:</strong> Line color</li>
                                    <li><strong>Opacity:</strong> Line transparency (0-100%)</li>
                                </ul>
                            </div>

                            {/* Fill */}
                            <div className="p-3 rounded">
                                <h4 className="controls-title">Fill</h4>
                                <ul className="controls-list">
                                    <li><strong>Toggle:</strong> Show/hide filled grid cells</li>
                                    <li><strong>Frequency:</strong> Percentage of cells to fill (0-100%)</li>
                                    <li><strong>Color:</strong> Fill color</li>
                                    <li><strong>Opacity:</strong> Fill transparency (0-100%)</li>
                                    <li><strong>Blend Mode:</strong> How fill interacts with other layers</li>
                                </ul>
                            </div>

                            {/* Canvas */}
                            <div className="p-3 rounded">
                                <h4 className="controls-title">Canvas</h4>
                                <ul className="controls-list">
                                    <li><strong>Background Color:</strong> Canvas background (default: light gray)</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Distortion Settings */}
                    <section className="settings-section">
                        <h3 className="settings-section-title">
                            Distortion Settings (Right Sidebar)
                        </h3>

                        <div className="space-y-3">
                            {/* Tools */}
                            <div className="p-3 rounded">
                                <h4 className="controls-title">Tools</h4>
                                <ul className="controls-list">
                                    <li><strong>Pan:</strong> Click and drag to move around the canvas. Also works with middle/right mouse button.</li>
                                    <li><strong>Place Well:</strong> Click on canvas to add a new distortion point. Click and drag existing wells to reposition them.</li>
                                </ul>
                            </div>

                            {/* Wells */}
                            <div className="p-3 rounded">
                                <h4 className="controls-title">Wells (Distortion Points)</h4>
                                <p className="text-xs text-secondary mb-2">
                                    Wells are points that attract or repel the grid, creating distortion effects.
                                </p>
                                <ul className="controls-list">
                                    <li>
                                        <strong>Strength:</strong>
                                        <span className="block ml-2 mt-1">
                                            • <span className="text-info">Positive (0 to 100%)</span>: Attracts grid points toward the well center<br />
                                            • <span className="text-error">Negative (-100% to 0)</span>: Repels grid points to the well's edge
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
                    <section className="settings-section">
                        <h3 className="settings-section-title">
                            Navigation & Controls
                        </h3>
                        <div className="p-3 rounded">
                            <ul className="controls-list">
                                <li><strong>Pan:</strong> Left-click drag (Pan tool), or middle/right-click drag (any tool)</li>
                                <li><strong>Zoom:</strong> Mouse wheel or trackpad scroll</li>
                                <li><strong>Move Well:</strong> Click and drag the center point of any well (Place Well tool)</li>
                                <li><strong>Collapse Sidebars:</strong> Click the arrow buttons on sidebar edges to maximize canvas space</li>
                            </ul>
                        </div>
                    </section>

                    {/* Export */}
                    <section className="settings-section">
                        <h3 className="settings-section-title">
                            Export & Import
                        </h3>

                        <div className="space-y-3">
                            {/* Download */}
                            <div className="p-3 rounded">
                                <h4 className="controls-title">Download (Images)</h4>
                                <ul className="controls-list">
                                    <li><strong>PNG:</strong> Multiple resolution options (1× to 16×). Browser limits may apply for very large exports.</li>
                                    <li><strong>SVG:</strong> Unlimited resolution vector graphics, perfect for print and scaling.</li>
                                </ul>
                                <p className="text-xs mt-2">
                                    Files are named with content hashes (e.g., <code>a7f3b2c9.png</code>). You can rename them in the save dialog.
                                </p>
                            </div>

                            {/* Export Config */}
                            <div className="p-3 rounded">
                                <h4 className="controls-title">Export Config (Save Your Work)</h4>
                                <p className="text-xs">
                                    Exports all settings (grid, wells, colors, etc.) as a JSON file.
                                    Use this to save your work and reload it later.
                                </p>
                            </div>

                            {/* Import Config */}
                            <div className="p-3 rounded">
                                <h4 className="controls-title">Import Config (Load Saved Work)</h4>
                                <p className="text-xs mb-2">
                                    Load a previously saved JSON configuration file. Choose how to import:
                                </p>
                                <ul className="controls-list">
                                    <li><strong>Replace All:</strong> Completely replaces current settings with imported config</li>
                                    <li><strong>Merge Wells:</strong> Keeps current grid settings, adds imported wells to existing ones</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Tips */}
                    <section className="settings-section">
                        <h3 className="settings-section-title">
                            Tips & Tricks
                        </h3>
                        <div className="p-3 rounded">
                            <ul className="controls-list">
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
                <div className="modal-footer">
                    <button
                        onClick={onClose}
                        className="btn"
                    >
                        Got It!
                    </button>
                </div>
            </div>
        </div>
    );
}

