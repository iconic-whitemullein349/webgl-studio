import React, { useState } from 'react';
import { Camera, Move, Sun, Box, Layers } from 'lucide-react';
import { WorldView } from './WorldView';
import { SceneHierarchy } from './SceneHierarchy';
import { TransformControls } from './TransformControls';
import { CameraControls } from './CameraControls';
import { LightingControls } from './LightingControls';
import type { Scene, SceneObject } from '../../types/webgl';

interface SceneBuilderProps {
  scene: Scene;
  onSceneUpdate: (scene: Scene) => void;
}

export function SceneBuilder({ scene, onSceneUpdate }: SceneBuilderProps) {
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'transform' | 'camera' | 'lighting'>('hierarchy');
  const [selectedObject, setSelectedObject] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-[300px_1fr] gap-4 h-full">
      <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('hierarchy')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm ${
              activeTab === 'hierarchy' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Hierarchy</span>
          </button>
          <button
            onClick={() => setActiveTab('transform')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm ${
              activeTab === 'transform' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Move className="w-4 h-4" />
            <span>Transform</span>
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm ${
              activeTab === 'camera' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Camera</span>
          </button>
          <button
            onClick={() => setActiveTab('lighting')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm ${
              activeTab === 'lighting' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Lighting</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'hierarchy' && (
            <SceneHierarchy
              objects={scene.objects}
              selectedObject={selectedObject}
              onSelectObject={setSelectedObject}
              onUpdateObjects={(objects) => onSceneUpdate({ ...scene, objects })}
            />
          )}
          {activeTab === 'transform' && selectedObject && (
            <TransformControls
              object={scene.objects.find(obj => obj.id === selectedObject)!}
              onUpdateObject={(updated) => {
                const newObjects = scene.objects.map(obj =>
                  obj.id === selectedObject ? updated : obj
                );
                onSceneUpdate({ ...scene, objects: newObjects });
              }}
            />
          )}
          {activeTab === 'camera' && (
            <CameraControls
              camera={scene.camera}
              onUpdateCamera={(camera) => onSceneUpdate({ ...scene, camera })}
            />
          )}
          {activeTab === 'lighting' && (
            <LightingControls
              lights={scene.lights}
              onUpdateLights={(lights) => onSceneUpdate({ ...scene, lights })}
            />
          )}
        </div>
      </div>

      <WorldView
        scene={scene}
        selectedObject={selectedObject}
        onObjectSelect={setSelectedObject}
        onSceneUpdate={onSceneUpdate}
      />
    </div>
  );
}