import React, { useState, useEffect } from 'react';
import { Header } from './components/Layout/Header';
import { TabManager } from './components/Editor/TabManager';
import { ProjectManager } from './components/Editor/ProjectManager';
import { AssetPanel } from './components/AssetManager/AssetPanel';
import useProjectStore from './lib/storage/projectStore';
import { defaultVertexShader, defaultFragmentShader } from './lib/webgl/shaders/defaultShaders';
import { v4 as uuidv4 } from 'uuid';
import type { Scene } from './types/webgl';

function App() {
  const { currentProject, saveProject } = useProjectStore();
  const [code, setCode] = useState(currentProject?.code || '// Your WebGL code here');
  const [vertexShader, setVertexShader] = useState(currentProject?.shaders.vertex || defaultVertexShader);
  const [fragmentShader, setFragmentShader] = useState(currentProject?.shaders.fragment || defaultFragmentShader);
  const [scene, setScene] = useState<Scene>({
    id: 'default',
    name: 'Default Scene',
    objects: [],
    camera: {
      position: [0, 0, 5],
      target: [0, 0, 0],
      up: [0, 1, 0],
      fov: 45,
      aspect: 16 / 9,
      near: 0.1,
      far: 1000,
    },
    lights: [
      {
        type: 'directional',
        position: [1, 1, 1],
        color: [1, 1, 1],
        intensity: 1,
      },
    ],
  });

  useEffect(() => {
    if (currentProject) {
      setCode(currentProject.code);
      setVertexShader(currentProject.shaders.vertex);
      setFragmentShader(currentProject.shaders.fragment);
    }
  }, [currentProject]);

  const handleSave = () => {
    if (currentProject) {
      saveProject({
        ...currentProject,
        code,
        shaders: {
          vertex: vertexShader,
          fragment: fragmentShader,
        },
      });
    }
  };

  const handleAssetUpload = async (file: File) => {
    if (!currentProject) return;
    const url = URL.createObjectURL(file);
    const type = file.name.match(/\.(glb|gltf|obj|fbx)$/i)
      ? 'model'
      : file.name.match(/\.(mp3|wav|ogg)$/i)
      ? 'audio'
      : 'texture';
    const newAsset = {
      id: uuidv4(),
      name: file.name,
      type: type as 'texture' | 'model' | 'audio',
      url,
      metadata: { size: file.size },
    };
    await saveProject({
      ...currentProject,
      code,
      shaders: { vertex: vertexShader, fragment: fragmentShader },
      assets: [...(currentProject.assets || []), newAsset],
    });
  };

  const handleAssetDelete = async (id: string) => {
    if (!currentProject) return;
    await saveProject({
      ...currentProject,
      code,
      shaders: { vertex: vertexShader, fragment: fragmentShader },
      assets: (currentProject.assets || []).filter((a) => a.id !== id),
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header onSave={handleSave} />
      
      <main className="flex-1 container mx-auto p-4 grid grid-cols-[280px_1fr] gap-4 h-[calc(100vh-3.5rem)]">
        <aside className="space-y-4 overflow-y-auto">
          <ProjectManager />
          <AssetPanel
            assets={currentProject?.assets || []}
            onAssetUpload={handleAssetUpload}
            onAssetDelete={handleAssetDelete}
          />
        </aside>

        <TabManager
          code={code}
          scene={scene}
          onCodeChange={setCode}
          onSceneUpdate={setScene}
        />
      </main>
    </div>
  );
}

export default App;