import React from 'react';
import Stats from 'stats.js';

interface DebugInfo {
  fps: number;
  drawCalls: number;
  vertices: number;
  textures: number;
}

interface DebugPanelProps {
  stats: Stats;
  debugInfo: DebugInfo;
}

export function DebugPanel({ stats, debugInfo }: DebugPanelProps) {
  return (
    <div className="absolute bottom-4 right-4 bg-gray-800 rounded-lg p-4 text-sm">
      <h3 className="font-medium text-gray-300 mb-2">Debug Information</h3>
      <div className="space-y-1">
        <p className="text-gray-400">
          FPS: <span className="text-gray-200">{debugInfo.fps.toFixed(1)}</span>
        </p>
        <p className="text-gray-400">
          Draw Calls: <span className="text-gray-200">{debugInfo.drawCalls}</span>
        </p>
        <p className="text-gray-400">
          Vertices: <span className="text-gray-200">{debugInfo.vertices}</span>
        </p>
        <p className="text-gray-400">
          Textures: <span className="text-gray-200">{debugInfo.textures}</span>
        </p>
      </div>
    </div>
  );
}