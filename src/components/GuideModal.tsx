interface GuideModalProps {
    onClose: () => void;
}

export function GuideModal({ onClose }: GuideModalProps) {
    return (
        <div className="modal-backdrop">
            <div className="modal modal-lg">
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
                    {/* Quick Start */}
                    <section className="settings-section">
                        <h3 className="settings-section-title">Quick Start</h3>
                        <ul className="controls-list">
                            <li><strong>1.</strong> Configure grid in <strong>Canvas Settings</strong> (left sidebar)</li>
                            <li><strong>2.</strong> Click <strong>Place Well</strong> tool, then click canvas to add distortion points</li>
                            <li><strong>3.</strong> Adjust well properties to shape your pattern</li>
                            <li><strong>4.</strong> Use <strong>Download</strong> to export as PNG or SVG</li>
                        </ul>
                    </section>

                    {/* Canvas Settings */}
                    <section className="settings-section">
                        <h3 className="settings-section-title">Canvas Settings</h3>
                        <div className="space-y-3">
                            <div>
                                <h4 className="controls-title">Grid</h4>
                                <ul className="controls-list">
                                    <li><strong>Type:</strong> Square or Triangular</li>
                                    <li><strong>Rows/Columns:</strong> Density (5-200)</li>
                                    <li><strong>Spacing:</strong> Point distance (5-100px)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="controls-title">Points</h4>
                                <ul className="controls-list">
                                    <li>Size, color, opacity controls</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="controls-title">Lines</h4>
                                <ul className="controls-list">
                                    <li><strong>Style:</strong> Solid (with curvature) or Segmented (with angle/spacing/length variation)</li>
                                    <li><strong>Frequency:</strong> Connection percentage (0-100%)</li>
                                    <li>Width, color, opacity controls</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="controls-title">Fill</h4>
                                <ul className="controls-list">
                                    <li>Frequency, color, opacity, blend mode</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="controls-title">Canvas</h4>
                                <ul className="controls-list">
                                    <li>Background color picker</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="controls-title">Settings Locks</h4>
                                <ul className="controls-list">
                                    <li>Lock icon next to each setting prevents randomization during shuffle</li>
                                    <li>Lock states persist across sessions</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Distortion & Wells */}
                    <section className="settings-section">
                        <h3 className="settings-section-title">Distortion & Wells</h3>
                        <div className="space-y-3">
                            <div>
                                <h4 className="controls-title">Tools</h4>
                                <ul className="controls-list">
                                    <li><strong>Pan:</strong> Click-drag to navigate (also middle/right-click drag)</li>
                                    <li><strong>Place Well:</strong> Click canvas to add, drag well center to move</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="controls-title">Well Properties</h4>
                                <ul className="controls-list">
                                    <li><strong>Strength:</strong> Positive (attract) or negative (repel), -100% to +100%</li>
                                    <li><strong>Radius:</strong> Influence area (50-500px)</li>
                                    <li><strong>Falloff:</strong> Linear, Quadratic, Exponential, or Smooth</li>
                                    <li><strong>Distortion:</strong> Random scrambling within radius (0-100%)</li>
                                    <li><strong>Position:</strong> Direct X/Y coordinate input or drag</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="controls-title">Wells Management</h4>
                                <ul className="controls-list">
                                    <li><strong>Visibility:</strong> Toggle show/hide well indicators</li>
                                    <li><strong>Enable/Disable:</strong> Checkbox to activate/deactivate individual wells</li>
                                    <li><strong>Wells Lock:</strong> Preserve all wells during shuffle</li>
                                    <li><strong>Clear All:</strong> Remove all wells</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Tools & Workflow */}
                    <section className="settings-section">
                        <h3 className="settings-section-title">Tools & Workflow</h3>
                        <ul className="controls-list">
                            <li><strong>Shuffle:</strong> Randomize unlocked settings within grid dimensions</li>
                            <li><strong>Zoom:</strong> Mouse wheel or trackpad scroll</li>
                            <li><strong>Collapse Sidebars:</strong> Arrow buttons on sidebar edges</li>
                            <li><strong>Export Config:</strong> Save all settings as JSON file</li>
                            <li><strong>Import Config:</strong> Load JSON - Replace All or Merge Wells</li>
                        </ul>
                    </section>

                    {/* Export */}
                    <section className="settings-section">
                        <h3 className="settings-section-title">Export</h3>
                        <ul className="controls-list">
                            <li><strong>PNG:</strong> Multiple resolutions (1× to 16×) with max resolution detection and warnings</li>
                            <li><strong>SVG:</strong> Unlimited resolution vector graphics</li>
                            <li>Files named with content hashes (rename in save dialog)</li>
                        </ul>
                    </section>

                    {/* Tips */}
                    <section className="settings-section">
                        <h3 className="settings-section-title">Tips</h3>
                        <ul className="controls-list">
                            <li>Low <strong>Line Frequency</strong> (10-30%) for sparse patterns</li>
                            <li>Combine <strong>Curvature</strong> with low opacity for organic effects</li>
                            <li>Use <strong>Segmented</strong> line style for textured variations</li>
                            <li>Opposite well strengths (attract + repel) create complex distortions</li>
                            <li>Triangular grids with fill create interesting geometric patterns</li>
                            <li>Experiment with <strong>Blend Modes</strong> for color interactions</li>
                            <li>Light <strong>Distortion</strong> (5-15%) adds natural variation</li>
                            <li>Lock settings you like before shuffling to preserve them</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}

