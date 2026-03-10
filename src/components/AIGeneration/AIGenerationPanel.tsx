import React, { useState } from 'react';
import { Wand2, Loader2, Settings } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { TextToImagePanel } from './TextToImagePanel';
import { generate3DFromImage } from '../../lib/ai/stableDiffusion3D';
import type { Scene } from '../../types/webgl';

interface AIGenerationPanelProps {
  onSceneGenerated: (scene: Scene) => void;
}

export function AIGenerationPanel({ onSceneGenerated }: AIGenerationPanelProps) {
  const [image, setImage] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [config, setConfig] = useState({
    stabilityApiKey: '',
    replicateApiKey: '',
    textureResolution: '1024' as '512' | '1024' | '2048',
    foregroundRatio: 0.85,
    remesh: 'none' as 'none' | 'quad' | 'triangle',
    vertexCount: -1,
  });

  const handleImageGenerated = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'generated-image.png', { type: 'image/png' });
      setImage(file);
    } catch (error) {
      console.error('Failed to load generated image:', error);
    }
  };

  const handleGenerate = async () => {
    if (!image || !config.stabilityApiKey || isGenerating) return;

    setIsGenerating(true);
    try {
      const scene = await generate3DFromImage({
        image,
        config: {
          apiKey: config.stabilityApiKey,
          textureResolution: config.textureResolution,
          foregroundRatio: config.foregroundRatio,
          remesh: config.remesh,
          vertexCount: config.vertexCount,
        },
      });
      onSceneGenerated(scene);
    } catch (error) {
      console.error('Failed to generate scene:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-200">AI-Powered 3D Generation</h2>
        <Wand2 className="w-5 h-5 text-purple-400" />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            API Keys
          </label>
          <div className="space-y-2">
            <input
              type="password"
              value={config.stabilityApiKey}
              onChange={(e) => setConfig({ ...config, stabilityApiKey: e.target.value })}
              placeholder="Stability API Key (sk-...)"
              className="w-full bg-gray-700 rounded-md p-2 text-sm text-gray-200 placeholder-gray-400"
            />
            <input
              type="password"
              value={config.replicateApiKey}
              onChange={(e) => setConfig({ ...config, replicateApiKey: e.target.value })}
              placeholder="Replicate API Key"
              className="w-full bg-gray-700 rounded-md p-2 text-sm text-gray-200 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Step 1: Generate or Upload Image</h3>
          <div className="space-y-4">
            <TextToImagePanel
              onImageGenerated={handleImageGenerated}
              replicateApiKey={config.replicateApiKey}
            />
            <div className="relative">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                <div className="border-t border-gray-700" />
                <div className="flex justify-center -mt-3">
                  <span className="bg-gray-800 px-2 text-sm text-gray-400">OR</span>
                </div>
              </div>
            </div>
            <ImageUploader
              image={image}
              onImageSelect={setImage}
              onImageClear={() => setImage(null)}
            />
          </div>
        </div>

        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-sm font-medium text-gray-300 mb-4">Step 2: Configure 3D Generation</h3>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-200"
            >
              <Settings className="w-4 h-4" />
              <span>Advanced Settings</span>
            </button>
          </div>

          {showAdvanced && (
            <div className="space-y-4 p-4 bg-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Texture Resolution
                </label>
                <select
                  value={config.textureResolution}
                  onChange={(e) => setConfig({
                    ...config,
                    textureResolution: e.target.value as '512' | '1024' | '2048'
                  })}
                  className="w-full bg-gray-600 rounded-md p-2 text-sm"
                >
                  <option value="512">512px</option>
                  <option value="1024">1024px</option>
                  <option value="2048">2048px</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Foreground Ratio
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={config.foregroundRatio}
                  onChange={(e) => setConfig({
                    ...config,
                    foregroundRatio: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
                <div className="text-right text-xs text-gray-400">
                  {config.foregroundRatio.toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Remesh Type
                </label>
                <select
                  value={config.remesh}
                  onChange={(e) => setConfig({
                    ...config,
                    remesh: e.target.value as 'none' | 'quad' | 'triangle'
                  })}
                  className="w-full bg-gray-600 rounded-md p-2 text-sm"
                >
                  <option value="none">None</option>
                  <option value="quad">Quad</option>
                  <option value="triangle">Triangle</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!image || !config.stabilityApiKey || isGenerating}
          className={`w-full py-2 px-4 rounded-md flex items-center justify-center space-x-2 ${
            isGenerating || !image || !config.stabilityApiKey
              ? 'bg-purple-700 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          } transition-colors`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating 3D Model...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generate 3D Model</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}