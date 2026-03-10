import type { StableDiffusion3DConfig } from '../types';
import type { Scene } from '../../../types/webgl';
import { validateStableDiffusion3DConfig } from '../utils/validation';
import { handleAIError } from '../utils/errorHandling';
import { convertGLBToScene } from '../utils/glbConverter';

export async function generate3DFromImage(
  image: File,
  config: StableDiffusion3DConfig
): Promise<Scene> {
  try {
    validateStableDiffusion3DConfig(config);

    const formData = new FormData();
    formData.append('image', image);

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

    const response = await fetch('https://api.stability.ai/v2beta/3d/stable-fast-3d', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(errorData.error?.message || 'Failed to generate 3D model');
    }

    const glbBuffer = await response.arrayBuffer();
    if (!glbBuffer || glbBuffer.byteLength === 0) {
      throw new Error('Received empty GLB data from Stability AI');
    }

    return await convertGLBToScene(glbBuffer);
  } catch (error) {
    console.error('3D generation error:', error);
    throw handleAIError(error);
  }
}