import { Toolbar } from './components/Toolbar';
import { CanvasSettingsPanel } from './components/CanvasSettingsPanel';
import { Canvas } from './components/Canvas';
import { DistortionPanel } from './components/DistortionPanel';

function App() {
    return (
        <div className="h-screen flex flex-col">
            <Toolbar />
            <div className="flex-1 relative overflow-hidden">
                {/* Canvas - fills entire area, behind sidebars */}
                <div className="absolute inset-0">
                    <Canvas />
                </div>

                {/* Left sidebar - overlays on top of canvas */}
                <div className="absolute left-0 top-0 bottom-0 z-10">
                    <CanvasSettingsPanel />
                </div>

                {/* Right sidebar - overlays on top of canvas */}
                <div className="absolute right-0 top-0 bottom-0 z-10">
                    <DistortionPanel />
                </div>
            </div>
        </div>
    );
}

export default App;

