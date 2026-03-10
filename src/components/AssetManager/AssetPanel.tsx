import React from 'react';
import { Upload, Trash2, Image, FileAudio, Box } from 'lucide-react';
import type { Asset } from '../../lib/storage/projectStore';

interface AssetPanelProps {
  assets: Asset[];
  onAssetUpload: (file: File) => Promise<void>;
  onAssetDelete: (id: string) => void;
}

export function AssetPanel({ assets, onAssetUpload, onAssetDelete }: AssetPanelProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAssetUpload(file);
    }
  };

  const getAssetIcon = (type: Asset['type']) => {
    switch (type) {
      case 'texture':
        return <Image className="w-4 h-4" />;
      case 'audio':
        return <FileAudio className="w-4 h-4" />;
      case 'model':
        return <Box className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-medium text-gray-300">Assets</h3>
        <label className="cursor-pointer p-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".png,.jpg,.jpeg,.glb,.gltf,.wav,.mp3"
          />
          <Upload className="w-4 h-4" />
        </label>
      </div>

      <div className="space-y-2">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="flex items-center justify-between p-2 bg-gray-900 rounded-md"
          >
            <div className="flex items-center space-x-2">
              {getAssetIcon(asset.type)}
              <span className="text-sm text-gray-300">{asset.name}</span>
            </div>
            <button
              onClick={() => onAssetDelete(asset.id)}
              className="p-1 text-gray-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}