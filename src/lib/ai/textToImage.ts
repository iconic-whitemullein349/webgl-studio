import Replicate from 'replicate';

interface TextToImageConfig {
  apiKey: string;
  width?: number;
  height?: number;
  numberOfImages?: number;
  scheduler?: string;
  steps?: number;
  guidance?: number;
}

export async function generateImageFromText(
  prompt: string,
  config: TextToImageConfig
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('Replicate API key is required');
  }

  if (!prompt.trim()) {
    throw new Error('Prompt is required');
  }

  const replicate = new Replicate({
    auth: config.apiKey,
  });

  try {
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: prompt.trim(),
          width: Math.min(Math.max(config.width || 1024, 512), 2048),
          height: Math.min(Math.max(config.height || 1024, 512), 2048),
          num_outputs: Math.min(Math.max(config.numberOfImages || 1, 1), 4),
          scheduler: config.scheduler || "K_EULER",
          num_inference_steps: Math.min(Math.max(config.steps || 50, 20), 100),
          guidance_scale: Math.min(Math.max(config.guidance || 7.5, 1), 20),
          refine: "expert_ensemble_refiner",
          high_noise_frac: 0.8,
        }
      }
    );

    if (!output) {
      throw new Error('No output received from Replicate API');
    }

    if (!Array.isArray(output) || output.length === 0) {
      throw new Error('Invalid output format from Replicate API');
    }

    const imageUrl = output[0];
    if (typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
      throw new Error('Invalid image URL received from Replicate API');
    }

    return imageUrl;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Image generation failed:', error.message);
      throw new Error(`Image generation failed: ${error.message}`);
    } else {
      console.error('Image generation failed:', error);
      throw new Error('Image generation failed: Unknown error');
    }
  }
}