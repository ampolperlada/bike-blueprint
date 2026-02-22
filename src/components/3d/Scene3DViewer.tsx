import { useRef } from 'react';
import { Camera, Maximize2, RotateCcw } from 'lucide-react';
import { use3DScene } from '@/hooks/use3DScene';
import { BikeColors } from '@/types/bike';

interface Scene3DViewerProps {
  colors: BikeColors;
  onToggleFullscreen: () => void;
}

export function Scene3DViewer({ colors, onToggleFullscreen }: Scene3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { loading, autoRotate, setAutoRotate, resetCamera } = use3DScene(containerRef, colors);

  return (
    <div className="flex-1 relative">
      <div
        ref={containerRef}
        className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800 relative"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xl font-semibold">Loading NMAX Model...</p>
              <p className="text-sm text-gray-400 mt-2">Professional 3D Studio</p>
            </div>
          </div>
        )}

        {/* Floating Controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
          <button
            onClick={onToggleFullscreen}
            className="p-3 rounded-lg bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all border border-gray-700"
            title="Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
          <button
            onClick={resetCamera}
            className="p-3 rounded-lg bg-black/60 backdrop-blur-md hover:bg-black/80 transition-all border border-gray-700"
            title="Reset Camera"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-3 rounded-lg backdrop-blur-md transition-all border border-gray-700 ${
              autoRotate
                ? 'bg-orange-600/80 hover:bg-orange-700/80'
                : 'bg-black/60 hover:bg-black/80'
            }`}
            title="Auto Rotate"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        {!loading && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-700 text-sm z-20">
            <p className="text-gray-300">
              <span className="font-semibold">🖱️ Drag</span> to rotate
            </p>
          </div>
        )}
      </div>
    </div>
  );
}