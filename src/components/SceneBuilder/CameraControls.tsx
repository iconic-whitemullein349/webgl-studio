import React from 'react';
import type { Camera } from '../../types/webgl';

interface CameraControlsProps {
  camera: Camera;
  onUpdateCamera: (camera: Camera) => void;
}

export function CameraControls({ camera, onUpdateCamera }: CameraControlsProps) {
  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    const newPosition = [...camera.position] as [number, number, number];
    newPosition['xyz'.indexOf(axis)] = value;
    onUpdateCamera({ ...camera, position: newPosition });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-300">Position</h3>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs text-gray-400 mb-1">X</label>
            <input
              type="number"
              value={camera.position[0]}
              onChange={(e) => handlePositionChange('x', parseFloat(e.target.value))}
              className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Y</label>
            <input
              type="number"
              value={camera.position[1]}
              onChange={(e) => handlePositionChange('y', parseFloat(e.target.value))}
              className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Z</label>
            <input
              type="number"
              value={camera.position[2]}
              onChange={(e) => handlePositionChange('z', parseFloat(e.target.value))}
              className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              step="0.1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-300">Field of View</h3>
        <input
          type="range"
          min="1"
          max="179"
          value={camera.fov}
          onChange={(e) => onUpdateCamera({ ...camera, fov: parseFloat(e.target.value) })}
          className="w-full"
        />
        <div className="text-xs text-gray-400 text-right">{camera.fov}°</div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-300">Clipping Planes</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Near</label>
            <input
              type="number"
              value={camera.near}
              onChange={(e) => onUpdateCamera({ ...camera, near: parseFloat(e.target.value) })}
              className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              step="0.1"
              min="0.1"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Far</label>
            <input
              type="number"
              value={camera.far}
              onChange={(e) => onUpdateCamera({ ...camera, far: parseFloat(e.target.value) })}
              className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
              step="1"
              min="1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}