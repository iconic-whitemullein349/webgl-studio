import Replicate from 'replicate';
import type { TextToImageConfig } from '../types';
import { validateTextToImageConfig } from '../utils/validation';
import { handleAIError } from '../utils/errorHandling';

const SDXL_MODEL = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

export async function generateImageFromText(
  prompt: string,
  config: TextToImageConfig
): Promise<string> {
  try {
    validateTextToImageConfig(config);

    const replicate = new Replicate({
      auth: config.apiKey,
    });

    const prediction = await replicate.predictions.create({
      version: SDXL_MODEL,
      input: {
        prompt: prompt.trim(),
        width: config.width || 1024,
        height: config.height || 1024,
        num_outputs: config.numberOfImages || 1,
        scheduler: config.scheduler || "K_EULER",
        num_inference_steps: config.steps || 50,
        guidance_scale: config.guidance || 7.5,
        refine: "expert_ensemble_refiner",
        high_noise_frac: 0.8,
      }
    });

    const result = await replicate.wait(prediction);

    if (!result?.output || !Array.isArray(result.output) || result.output.length === 0) {
      throw new Error('No output received from Replicate API');
    }

    const imageUrl = result.output[0];
    if (typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
      throw new Error('Invalid image URL received from Replicate API');
    }

    return imageUrl;
  } catch (error) {
    console.error('Image generation error:', error);
    throw handleAIError(error);
  }
}