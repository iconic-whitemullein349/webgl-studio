import React from 'react';
import { WebGLCanvas } from './WebGLCanvas';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';

interface PreviewPanelProps {
  code: string;
  width: number;
  height: number;
}

export function PreviewPanel({ code, width, height }: PreviewPanelProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <h3 className="text-sm font-medium text-gray-300">Preview</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      <div className="relative h-[calc(100%-2.5rem)]">
        <WebGLCanvas
          code={code}
          width={width}
          height={height}
        />
      </div>
    </div>
  );
}