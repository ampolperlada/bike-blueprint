import { useRef } from 'react';
import { use3DScene } from '@/hooks/use3DScene';
import { BikeColors } from '@/types/bike';

interface Scene3DViewerProps {
  colors: BikeColors;
  onToggleFullscreen: () => void;
}

export function Scene3DViewer({ colors }: Scene3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { loading } = use3DScene(containerRef, colors);

  return (
    <div className="w-full h-full relative">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ background: '#1E1E1E' }}
      >
        {loading && (
          <div 
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ background: '#1E1E1E' }}
          >
            <div className="text-center">
              <div 
                className="w-12 h-12 rounded-full animate-spin mx-auto mb-3"
                style={{
                  border: '3px solid #3E3E42',
                  borderTopColor: '#007ACC'
                }}
              />
              <p style={{ fontSize: '13px', color: '#CCCCCC' }}>
                Loading 3D Model...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}