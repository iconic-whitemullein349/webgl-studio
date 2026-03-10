import React from 'react';
import { FileText, Upload, Image, Box, Music, Trash2, Download } from 'lucide-react';
import type { Scene } from '../../types/webgl';
import useFileStore, { type ProjectFile } from '../../lib/storage/fileStore';

interface FilesPanelProps {
  scene: Scene;
  onSceneUpdate: (scene: Scene) => void;
}

export function FilesPanel({ scene, onSceneUpdate }: FilesPanelProps) {
  const { files, addFile, removeFile, loadFiles } = useFileStore();
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const getFileIcon = (type: ProjectFile['type']) => {
    switch (type) {
      case 'model':
        return <Box className="w-4 h-4 text-blue-400" />;
      case 'texture':
        return <Image className="w-4 h-4 text-green-400" />;
      case 'audio':
        return <Music className="w-4 h-4 text-yellow-400" />;
      case 'script':
        return <FileText className="w-4 h-4 text-purple-400" />;
    }
  };

  const detectType = (file: File): ProjectFile['type'] => {
    if (file.name.match(/\.(glb|gltf|obj|fbx)$/i)) return 'model';
    if (file.name.match(/\.(png|jpg|jpeg|webp|hdr|exr)$/i)) return 'texture';
    if (file.name.match(/\.(mp3|wav|ogg)$/i)) return 'audio';
    return 'script';
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const url = URL.createObjectURL(new Blob([data], { type: file.type }));
    await addFile({
      name: file.name,
      type: detectType(file),
      size: file.size,
      lastModified: new Date(file.lastModified),
      url,
      data,
    });
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const handleDelete = async (id: string) => {
    await removeFile(id);
    if (selectedFile === id) setSelectedFile(null);
  };

  const handleDownload = (file: ProjectFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selected = files.find((f) => f.id === selectedFile);

  return (
    <div className="bg-gray-800 rounded-lg h-full flex flex-col">
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-200">Project Files</h2>
        <label className="cursor-pointer p-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors" title="Upload File">
          <Upload className="w-4 h-4" />
          <input
            type="file"
            className="hidden"
            accept=".glb,.gltf,.obj,.fbx,.png,.jpg,.jpeg,.webp,.hdr,.mp3,.wav,.ogg,.js,.ts,.glsl"
            onChange={handleUpload}
          />
        </label>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2">
            <Upload className="w-8 h-8" />
            <p className="text-sm">No files yet. Upload models, textures, or audio.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                  selectedFile === file.id ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
                onClick={() => setSelectedFile(file.id)}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {getFileIcon(file.type)}
                  <span className="text-sm text-gray-300 truncate">{file.name}</span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
                    className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="border-t border-gray-700 p-4 space-y-2">
          <h3 className="text-sm font-medium text-gray-300">File Details</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <span className="text-gray-400">Type</span>
            <span className="text-gray-200 capitalize">{selected.type}</span>
            <span className="text-gray-400">Size</span>
            <span className="text-gray-200">{(selected.size / 1024).toFixed(1)} KB</span>
            <span className="text-gray-400">Modified</span>
            <span className="text-gray-200">{new Date(selected.lastModified).toLocaleDateString()}</span>
          </div>
          {selected.type === 'texture' && (
            <img src={selected.url} alt={selected.name} className="mt-2 w-full rounded-md max-h-32 object-contain bg-gray-900" />
          )}
        </div>
      )}
    </div>
  );
}