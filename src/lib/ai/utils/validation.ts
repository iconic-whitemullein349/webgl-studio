import { AIGenerationError } from './errorHandling';
import type { TextToImageConfig, StableDiffusion3DConfig } from '../types';

export function validateTextToImageConfig(config: TextToImageConfig): void {
  if (!config.apiKey) {
    throw new AIGenerationError('Replicate API key is required');
  }

  if (config.width && (config.width < 512 || config.width > 2048)) {
    throw new AIGenerationError('Width must be between 512 and 2048 pixels');
  }

  if (config.height && (config.height < 512 || config.height > 2048)) {
    throw new AIGenerationError('Height must be between 512 and 2048 pixels');
  }

  if (config.steps && (config.steps < 20 || config.steps > 100)) {
    throw new AIGenerationError('Steps must be between 20 and 100');
  }

  if (config.guidance && (config.guidance < 1 || config.guidance > 20)) {
    throw new AIGenerationError('Guidance scale must be between 1 and 20');
  }
}

export function validateStableDiffusion3DConfig(config: StableDiffusion3DConfig): void {
  if (!config.apiKey) {
    throw new AIGenerationError('Stability API key is required');
  }

  if (config.foregroundRatio && (config.foregroundRatio < 0.1 || config.foregroundRatio > 1)) {
    throw new AIGenerationError('Foreground ratio must be between 0.1 and 1');
  }

  if (config.vertexCount && config.vertexCount !== -1 && (config.vertexCount < 100 || config.vertexCount > 20000)) {
    throw new AIGenerationError('Vertex count must be between 100 and 20000 or -1');
  }
}