import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { v4 as uuidv4 } from 'uuid';
import type { Scene } from '../../../types/webgl';

export async function convertGLBToScene(glbBuffer: ArrayBuffer): Promise<Scene> {
  const scene: Scene = {
    id: uuidv4(),
    name: 'Generated 3D Scene',
    objects: [],
    camera: {
      position: [0, 5, 10],
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
  };

  try {
    const loader = new GLTFLoader();
    const blob = new Blob([glbBuffer], { type: 'model/gltf-binary' });
    const url = URL.createObjectURL(blob);

    return new Promise<Scene>((resolve, reject) => {
      loader.load(
        url,
        (gltf) => {
          URL.revokeObjectURL(url);
          gltf.scene.traverse((child: any) => {
            if (child.isMesh) {
              const geometry = child.geometry;
              const positions = geometry.attributes.position?.array as Float32Array | undefined;
              const normals = geometry.attributes.normal?.array as Float32Array | undefined;
              const uvs = geometry.attributes.uv?.array as Float32Array | undefined;
              const indices = geometry.index?.array as Uint16Array | undefined;

              if (positions && indices) {
                scene.objects.push({
                  id: uuidv4(),
                  name: child.name || 'Generated Mesh',
                  mesh: {
                    vertices: new Float32Array(positions),
                    indices: new Uint16Array(indices),
                    normals: normals ? new Float32Array(normals) : undefined,
                    uvs: uvs ? new Float32Array(uvs) : undefined,
                  },
                  material: {
                    type: 'phong',
                    uniforms: {},
                    vertexShader: '',
                    fragmentShader: '',
                  },
                  transform: {
                    position: {
                      x: child.position.x,
                      y: child.position.y,
                      z: child.position.z,
                    },
                    rotation: {
                      x: child.rotation.x,
                      y: child.rotation.y,
                      z: child.rotation.z,
                    },
                    scale: {
                      x: child.scale.x,
                      y: child.scale.y,
                      z: child.scale.z,
                    },
                  },
                });
              }
            }
          });
          resolve(scene);
        },
        undefined,
        (error) => {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to parse GLB: ' + error.message));
        }
      );
    });
  } catch (error) {
    throw new Error(
      'Failed to convert GLB to scene: ' + (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}