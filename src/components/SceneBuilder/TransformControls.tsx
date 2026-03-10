import React from 'react';
import type { SceneObject } from '../../types/webgl';

interface TransformControlsProps {
  object: SceneObject;
  onUpdateObject: (object: SceneObject) => void;
}

export function TransformControls({ object, onUpdateObject }: TransformControlsProps) {
  const handleTransformChange = (
    property: 'position' | 'rotation' | 'scale',
    axis: 'x' | 'y' | 'z',
    value: number
  ) => {
    const newTransform = { ...object.transform };
    newTransform[property][axis] = value;
    onUpdateObject({ ...object, transform: newTransform });
  };

  return (
    <div className="space-y-6">
      {['position', 'rotation', 'scale'].map((transform) => (
        <div key={transform} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-300 capitalize">{transform}</h3>
          <div className="grid grid-cols-3 gap-2">
            {['x', 'y', 'z'].map((axis) => (
              <div key={axis}>
                <label className="block text-xs text-gray-400 mb-1">{axis.toUpperCase()}</label>
                <input
                  type="number"
                  value={object.transform[transform][axis]}
                  onChange={(e) =>
                    handleTransformChange(
                      transform as 'position' | 'rotation' | 'scale',
                      axis as 'x' | 'y' | 'z',
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full bg-gray-700 rounded px-2 py-1 text-sm"
                  step={transform === 'scale' ? '0.1' : transform === 'rotation' ? '1' : '0.1'}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}