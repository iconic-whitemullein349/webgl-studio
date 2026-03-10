export interface ShaderProgram {
  program: WebGLProgram;
  attributes: { [key: string]: number };
  uniforms: { [key: string]: WebGLUniformLocation };
}

export interface Transform {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export interface Scene {
  id: string;
  name: string;
  objects: SceneObject[];
  camera: Camera;
  lights: Light[];
}

export interface SceneObject {
  id: string;
  name: string;
  modelId?: string;
  mesh: Mesh;
  material: Material;
  transform: Transform;
}

export interface Camera {
  position: [number, number, number];
  target: [number, number, number];
  up: [number, number, number];
  fov: number;
  aspect: number;
  near: number;
  far: number;
}

export interface Light {
  type: 'directional' | 'point' | 'spot';
  position: [number, number, number];
  color: [number, number, number];
  intensity: number;
}

export interface Material {
  type: 'basic' | 'phong' | 'pbr' | 'custom';
  uniforms: { [key: string]: any };
  vertexShader: string;
  fragmentShader: string;
}

export interface Mesh {
  vertices: Float32Array;
  indices: Uint16Array;
  normals?: Float32Array;
  uvs?: Float32Array;
}