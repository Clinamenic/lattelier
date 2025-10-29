import { Header } from './components/Header';
import { CanvasSettingsPanel } from './components/CanvasSettingsPanel';
import { Canvas } from './components/Canvas';
import { DistortionPanel } from './components/DistortionPanel';

function App() {
    return (
        <div className="app-container">
            <Header />
            <div className="app-content">
                {/* Canvas - fills entire area, behind sidebars */}
                <div className="app-canvas">
                    <Canvas />
                </div>

                {/* Left sidebar - overlays on top of canvas */}
                <div className="app-sidebar-left">
                    <CanvasSettingsPanel />
                </div>

                {/* Right sidebar - overlays on top of canvas */}
                <div className="app-sidebar-right">
                    <DistortionPanel />
                </div>
            </div>
        </div>
    );
}

export default App;

