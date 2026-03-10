import React, { useState } from 'react';
import { Box, Image, FileText, ChevronDown } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Scene, SceneObject } from '../../types/webgl';
import { TransformControls } from '../SceneBuilder/TransformControls';
import { ShaderEditor } from './ShaderEditor';
import useFileStore from '../../lib/storage/fileStore';

interface ObjectEditorProps {
  scene: Scene;
  onSceneUpdate: (scene: Scene) => void;
}

export function ObjectEditor({ scene, onSceneUpdate }: ObjectEditorProps) {
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const { files } = useFileStore();

  const selectedObjectData = selectedObject
    ? scene.objects.find(obj => obj.id === selectedObject)
    : null;

  const handleUpdateObject = (updated: SceneObject) => {
    const newObjects = scene.objects.map(obj =>
      obj.id === updated.id ? updated : obj
    );
    onSceneUpdate({ ...scene, objects: newObjects });
  };

  return (
    <div className="h-full bg-gray-800 rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-200">Object Properties</h2>
        {scene.objects.length > 0 && (
          <div className="mt-2 relative">
            <select
              value={selectedObject || ''}
              onChange={(e) => setSelectedObject(e.target.value || null)}
              className="w-full bg-gray-700 rounded-md px-3 py-2 text-sm appearance-none pr-8"
            >
              <option value="">Select an object…</option>
              {scene.objects.map((obj) => (
                <option key={obj.id} value={obj.id}>{obj.name}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedObjectData ? (
          <div className="p-4 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Object Name
              </label>
              <input
                type="text"
                value={selectedObjectData.name}
                onChange={(e) => handleUpdateObject({
                  ...selectedObjectData,
                  name: e.target.value
                })}
                className="w-full bg-gray-700 rounded-md px-3 py-2 text-sm"
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-4">Transform</h3>
              <TransformControls
                object={selectedObjectData}
                onUpdateObject={handleUpdateObject}
              />
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-4">Material</h3>
              <select
                value={selectedObjectData.material.type}
                onChange={(e) => handleUpdateObject({
                  ...selectedObjectData,
                  material: {
                    ...selectedObjectData.material,
                    type: e.target.value as 'basic' | 'phong' | 'custom'
                  }
                })}
                className="w-full bg-gray-700 rounded-md px-3 py-2 text-sm mb-4"
              >
                <option value="basic">Basic</option>
                <option value="phong">Phong</option>
                <option value="custom">Custom</option>
              </select>

              {selectedObjectData.material.type === 'custom' && (
                <ShaderEditor
                  vertexShader={selectedObjectData.material.vertexShader}
                  fragmentShader={selectedObjectData.material.fragmentShader}
                  onVertexShaderChange={(code) => handleUpdateObject({
                    ...selectedObjectData,
                    material: {
                      ...selectedObjectData.material,
                      vertexShader: code
                    }
                  })}
                  onFragmentShaderChange={(code) => handleUpdateObject({
                    ...selectedObjectData,
                    material: {
                      ...selectedObjectData.material,
                      fragmentShader: code
                    }
                  })}
                />
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-4">Preview</h3>
              <div className="w-full h-64 bg-gray-900 rounded-lg">
                <Canvas camera={{ position: [0, 0, 5] }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} />
                  <mesh>
                    <boxGeometry />
                    <meshStandardMaterial color="white" />
                  </mesh>
                  <OrbitControls />
                </Canvas>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-4">Assets</h3>
              <div className="grid grid-cols-2 gap-2">
                {files.map((file) => (
                  <button
                    key={file.id}
                    className="flex items-center space-x-2 p-2 bg-gray-700 rounded-md hover:bg-gray-600"
                    onClick={() => {
                      // Handle asset assignment
                    }}
                  >
                    {file.type === 'texture' && <Image className="w-4 h-4" />}
                    {file.type === 'model' && <Box className="w-4 h-4" />}
                    {file.type === 'script' && <FileText className="w-4 h-4" />}
                    <span className="text-sm truncate">{file.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select an object to edit its properties
          </div>
        )}
      </div>
    </div>
  );
}