import React from 'react';
import { Box, CircleDot, Triangle, Plus, Trash2 } from 'lucide-react';
import type { SceneObject } from '../../types/webgl';

interface SceneHierarchyProps {
  objects: SceneObject[];
  selectedObject: string | null;
  onSelectObject: (id: string | null) => void;
  onUpdateObjects: (objects: SceneObject[]) => void;
}

export function SceneHierarchy({
  objects,
  selectedObject,
  onSelectObject,
  onUpdateObjects,
}: SceneHierarchyProps) {
  const handleAddObject = (type: 'cube' | 'sphere' | 'cone') => {
    const newObject: SceneObject = {
      id: crypto.randomUUID(),
      name: `New ${type}`,
      mesh: {
        vertices: new Float32Array(),
        indices: new Uint16Array(),
      },
      material: {
        type: 'basic',
        uniforms: {},
        vertexShader: '',
        fragmentShader: '',
      },
      transform: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    };
    onUpdateObjects([...objects, newObject]);
  };

  const handleDeleteObject = (id: string) => {
    onUpdateObjects(objects.filter((obj) => obj.id !== id));
    if (selectedObject === id) {
      onSelectObject(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-300">Objects</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleAddObject('cube')}
            className="p-1.5 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            title="Add Cube"
          >
            <Box className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAddObject('sphere')}
            className="p-1.5 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            title="Add Sphere"
          >
            <CircleDot className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAddObject('cone')}
            className="p-1.5 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            title="Add Cone"
          >
            <Triangle className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {objects.map((object) => (
          <div
            key={object.id}
            className={`flex items-center justify-between p-2 rounded cursor-pointer ${
              selectedObject === object.id ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
            onClick={() => onSelectObject(object.id)}
          >
            <span className="text-sm text-gray-300">{object.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteObject(object.id);
              }}
              className="p-1 text-gray-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}