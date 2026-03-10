import React from 'react';
import { Plus } from 'lucide-react';
import type { Light } from '../../types/webgl';

interface LightingControlsProps {
  lights: Light[];
  onUpdateLights: (lights: Light[]) => void;
}

export function LightingControls({ lights, onUpdateLights }: LightingControlsProps) {
  const handleAddLight = () => {
    const newLight: Light = {
      type: 'point',
      position: [0, 5, 0],
      color: [1, 1, 1],
      intensity: 1
    };
    onUpdateLights([...lights, newLight]);
  };

  const handleUpdateLight = (index: number, updates: Partial<Light>) => {
    const newLights = lights.map((light, i) =>
      i === index ? { ...light, ...updates } : light
    );
    onUpdateLights(newLights);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-300">Scene Lights</h3>
        <button
          onClick={handleAddLight}
          className="p-1.5 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {lights.map((light, index) => (
        <div key={index} className="bg-gray-700 rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <select
              value={light.type}
              onChange={(e) => handleUpdateLight(index, { type: e.target.value as Light['type'] })}
              className="bg-gray-600 rounded px-2 py-1 text-sm"
            >
              <option value="directional">Directional</option>
              <option value="point">Point</option>
              <option value="spot">Spot</option>
            </select>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs text-gray-400">Position</h4>
            <div className="grid grid-cols-3 gap-2">
              {['x', 'y', 'z'].map((axis, i) => (
                <div key={axis}>
                  <label className="block text-xs text-gray-400 mb-1">{axis.toUpperCase()}</label>
                  <input
                    type="number"
                    value={light.position[i]}
                    onChange={(e) => {
                      const newPosition = [...light.position];
                      newPosition[i] = parseFloat(e.target.value);
                      handleUpdateLight(index, { position: newPosition as [number, number, number] });
                    }}
                    className="w-full bg-gray-600 rounded px-2 py-1 text-sm"
                    step="0.1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs text-gray-400">Color</h4>
            <div className="grid grid-cols-3 gap-2">
              {['R', 'G', 'B'].map((channel, i) => (
                <div key={channel}>
                  <label className="block text-xs text-gray-400 mb-1">{channel}</label>
                  <input
                    type="number"
                    value={light.color[i]}
                    onChange={(e) => {
                      const newColor = [...light.color];
                      newColor[i] = parseFloat(e.target.value);
                      handleUpdateLight(index, { color: newColor as [number, number, number] });
                    }}
                    className="w-full bg-gray-600 rounded px-2 py-1 text-sm"
                    step="0.1"
                    min="0"
                    max="1"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs text-gray-400">Intensity</h4>
            <input
              type="range"
              value={light.intensity}
              onChange={(e) => handleUpdateLight(index, { intensity: parseFloat(e.target.value) })}
              className="w-full"
              min="0"
              max="2"
              step="0.1"
            />
            <div className="text-xs text-gray-400 text-right">{light.intensity.toFixed(1)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}