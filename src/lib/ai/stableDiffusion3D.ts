import type { Scene } from '../../types/webgl';
import { convertGLBToScene } from './utils/glbConverter';

interface StableDiffusion3DConfig {
  apiKey: string;
  textureResolution?: '512' | '1024' | '2048';
  foregroundRatio?: number;
  remesh?: 'none' | 'quad' | 'triangle';
  vertexCount?: number;
  materialPrompt?: string;
}

interface GenerationOptions {
  image?: File;
  textPrompt?: string;
  config: StableDiffusion3DConfig;
}

export async function generate3DFromImage({ image, config }: GenerationOptions): Promise<Scene> {
  const formData = new FormData();

  if (image) {
    formData.append('image', image);
  }

  if (config.textureResolution) {
    formData.append('texture_resolution', config.textureResolution);
  }
  if (config.foregroundRatio) {
    formData.append('foreground_ratio', config.foregroundRatio.toString());
  }
  if (config.remesh) {
    formData.append('remesh', config.remesh);
  }
  if (config.vertexCount && config.vertexCount > 0) {
    formData.append('vertex_count', config.vertexCount.toString());
  }

  try {
    const response = await fetch('https://api.stability.ai/v2beta/3d/stable-fast-3d', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to generate 3D model' }));
      throw new Error(error.message || 'Failed to generate 3D model');
    }

    const glbBuffer = await response.arrayBuffer();
    const scene = await convertGLBToScene(glbBuffer);

    if (config.materialPrompt) {
      const materialResponse = await fetch('https://api.stability.ai/v2beta/material/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: config.materialPrompt,
          resolution: config.textureResolution || '1024',
        }),
      });

      if (materialResponse.ok) {
        const materialData = await materialResponse.json();
        scene.objects.forEach((obj) => {
          obj.material = {
            type: 'pbr',
            uniforms: {
              albedoMap: materialData.albedo_url,
              normalMap: materialData.normal_url,
              roughnessMap: materialData.roughness_url,
            },
            vertexShader: '',
            fragmentShader: '',
          };
        });
      }
    }

    return scene;
  } catch (error) {
    console.error('3D generation failed:', error);
    throw error;
  }
}
