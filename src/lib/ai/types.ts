export interface AIConfig {
  stabilityApiKey: string;
  replicateApiKey: string;
  textureResolution: '512' | '1024' | '2048';
  foregroundRatio: number;
  remesh: 'none' | 'quad' | 'triangle';
  vertexCount: number;
}

export interface TextToImageConfig {
  apiKey: string;
  width?: number;
  height?: number;
  numberOfImages?: number;
  scheduler?: string;
  steps?: number;
  guidance?: number;
}

export interface StableDiffusion3DConfig {
  apiKey: string;
  textureResolution?: '512' | '1024' | '2048';
  foregroundRatio?: number;
  remesh?: 'none' | 'quad' | 'triangle';
  vertexCount?: number;
}