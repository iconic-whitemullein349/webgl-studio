import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  TransformControls, 
  Grid, 
  PerspectiveCamera,
  GizmoHelper,
  GizmoViewport,
  useGLTF
} from '@react-three/drei';
import type { Scene, SceneObject } from '../../types/webgl';
import useFileStore from '../../lib/storage/fileStore';

interface WorldViewProps {
  scene: Scene;
  selectedObject: string | null;
  onObjectSelect: (id: string | null) => void;
  onSceneUpdate: (scene: Scene) => void;
}

interface SceneObjectProps {
  object: SceneObject;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onTransform: (transform: any) => void;
}

function ModelMesh({ url, isSelected, onClick, meshRef }: {
  url: string;
  isSelected: boolean;
  onClick: () => void;
  meshRef: React.RefObject<THREE.Mesh>;
}) {
  const { scene: modelScene } = useGLTF(url);
  return (
    <primitive
      ref={meshRef}
      object={modelScene.clone()}
      onClick={(e: any) => { e.stopPropagation(); onClick(); }}
    />
  );
}

function SceneObjectMesh({ object, isSelected, onSelect, onTransform }: SceneObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { files } = useFileStore();
  const modelFile = files.find(f => f.type === 'model' && f.id === object.modelId);

  React.useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(
        object.transform.position.x,
        object.transform.position.y,
        object.transform.position.z
      );
      meshRef.current.rotation.set(
        object.transform.rotation.x,
        object.transform.rotation.y,
        object.transform.rotation.z
      );
      meshRef.current.scale.set(
        object.transform.scale.x,
        object.transform.scale.y,
        object.transform.scale.z
      );
    }
  }, [object.transform]);

  if (modelFile) {
    return (
      <ModelMesh
        url={modelFile.url}
        isSelected={isSelected}
        onClick={() => onSelect(object.id)}
        meshRef={meshRef}
      />
    );
  }

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(object.id);
      }}
      castShadow
      receiveShadow
    >
      <boxGeometry />
      <meshStandardMaterial color={isSelected ? '#9333ea' : '#ffffff'} />
      {isSelected && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          onObjectChange={() => {
            if (meshRef.current) {
              onTransform({
                position: meshRef.current.position,
                rotation: meshRef.current.rotation,
                scale: meshRef.current.scale,
              });
            }
          }}
        />
      )}
    </mesh>
  );
}

export function WorldView({ scene, selectedObject, onObjectSelect, onSceneUpdate }: WorldViewProps) {
  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');

  const handleTransform = (objectId: string, transform: any) => {
    const newObjects = scene.objects.map(obj => {
      if (obj.id === objectId) {
        return {
          ...obj,
          transform: {
            position: {
              x: transform.position.x,
              y: transform.position.y,
              z: transform.position.z
            },
            rotation: {
              x: transform.rotation.x,
              y: transform.rotation.y,
              z: transform.rotation.z
            },
            scale: {
              x: transform.scale.x,
              y: transform.scale.y,
              z: transform.scale.z
            }
          }
        };
      }
      return obj;
    });

    onSceneUpdate({ ...scene, objects: newObjects });
  };

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <button
          onClick={() => setTransformMode('translate')}
          className={`px-3 py-1 rounded-md text-sm ${
            transformMode === 'translate' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Move
        </button>
        <button
          onClick={() => setTransformMode('rotate')}
          className={`px-3 py-1 rounded-md text-sm ${
            transformMode === 'rotate' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Rotate
        </button>
        <button
          onClick={() => setTransformMode('scale')}
          className={`px-3 py-1 rounded-md text-sm ${
            transformMode === 'scale' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          Scale
        </button>
      </div>

      <Canvas shadows>
        <PerspectiveCamera
          makeDefault
          position={[5, 5, 5]}
          fov={scene.camera.fov}
          near={scene.camera.near}
          far={scene.camera.far}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} castShadow />

        <Grid
          infiniteGrid
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={3}
          sectionThickness={1}
          sectionColor="#4b5563"
          fadeDistance={30}
          fadeStrength={1}
        />

        {scene.objects.map((object) => (
          <SceneObjectMesh
            key={object.id}
            object={object}
            isSelected={selectedObject === object.id}
            onSelect={onObjectSelect}
            onTransform={(transform) => handleTransform(object.id, transform)}
          />
        ))}

        <OrbitControls makeDefault />
        
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}