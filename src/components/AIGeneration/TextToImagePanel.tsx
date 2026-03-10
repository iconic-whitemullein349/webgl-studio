import React, { useState } from 'react';
import { Sparkles, Loader2, Settings, AlertCircle } from 'lucide-react';
import { generateImageFromText } from '../../lib/ai/services/replicateService';

interface TextToImagePanelProps {
  onImageGenerated: (imageUrl: string) => void;
  replicateApiKey: string;
}

export function TextToImagePanel({ onImageGenerated, replicateApiKey }: TextToImagePanelProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [config, setConfig] = useState({
    width: 1024,
    height: 1024,
    steps: 50,
    guidance: 7.5,
  });

  const handleGenerate = async () => {
    if (!prompt.trim() || !replicateApiKey || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const imageUrl = await generateImageFromText(prompt, {
        apiKey: replicateApiKey,
        ...config,
      });
      setGeneratedImageUrl(imageUrl);
      onImageGenerated(imageUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate image';
      setError(message);
      console.error('Image generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Text Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate…"
          rows={3}
          className="w-full bg-gray-700 rounded-md p-2 text-sm text-gray-200 placeholder-gray-400 resize-none"
        />
      </div>

      {error && (
        <div className="flex items-start space-x-2 text-red-400 bg-red-900/20 rounded-md p-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-3 p-3 bg-gray-700 rounded-lg">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Width</label>
                <input
                  type="number"
                  value={config.width}
                  onChange={(e) => setConfig({ ...config, width: Number(e.target.value) })}
                  className="w-full bg-gray-600 rounded px-2 py-1 text-sm"
                  step={64}
                  min={512}
                  max={2048}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Height</label>
                <input
                  type="number"
                  value={config.height}
                  onChange={(e) => setConfig({ ...config, height: Number(e.target.value) })}
                  className="w-full bg-gray-600 rounded px-2 py-1 text-sm"
                  step={64}
                  min={512}
                  max={2048}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Steps: {config.steps}
              </label>
              <input
                type="range"
                value={config.steps}
                onChange={(e) => setConfig({ ...config, steps: Number(e.target.value) })}
                className="w-full"
                min={20}
                max={100}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Guidance Scale: {config.guidance}
              </label>
              <input
                type="range"
                value={config.guidance}
                onChange={(e) => setConfig({ ...config, guidance: Number(e.target.value) })}
                className="w-full"
                min={1}
                max={20}
                step={0.5}
              />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleGenerate}
        disabled={!prompt.trim() || !replicateApiKey || isGenerating}
        className={`w-full py-2 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors ${
          isGenerating || !prompt.trim() || !replicateApiKey
            ? 'bg-purple-700 cursor-not-allowed opacity-60'
            : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating Image…</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Generate Image</span>
          </>
        )}
      </button>

      {!replicateApiKey && (
        <p className="text-xs text-yellow-400">
          Enter your Replicate API key above to enable text-to-image generation.
        </p>
      )}

      {generatedImageUrl && (
        <div className="mt-2">
          <p className="text-xs text-gray-400 mb-2">Generated image (click Generate 3D to use it):</p>
          <img
            src={generatedImageUrl}
            alt="Generated"
            className="w-full rounded-md object-contain max-h-64"
          />
        </div>
      )}
    </div>
  );
}