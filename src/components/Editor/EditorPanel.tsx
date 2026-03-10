import React from 'react';
import { CodeEditor } from './CodeEditor';
import { ShaderEditor } from './ShaderEditor';
import { Maximize2, Minimize2 } from 'lucide-react';

interface EditorPanelProps {
  code: string;
  vertexShader: string;
  fragmentShader: string;
  onCodeChange: (value: string) => void;
  onVertexShaderChange: (value: string) => void;
  onFragmentShaderChange: (value: string) => void;
}

export function EditorPanel({
  code,
  vertexShader,
  fragmentShader,
  onCodeChange,
  onVertexShaderChange,
  onFragmentShaderChange,
}: EditorPanelProps) {
  const [maximizedEditor, setMaximizedEditor] = React.useState<'code' | 'shader' | null>(null);

  return (
    <div className="flex flex-col h-full gap-2">
      <div 
        className={`bg-gray-800 rounded-lg overflow-hidden transition-all ${
          maximizedEditor === 'code' ? 'h-full' : maximizedEditor === 'shader' ? 'h-0' : 'h-1/2'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-300">Main Editor</h3>
          <button
            onClick={() => setMaximizedEditor(maximizedEditor === 'code' ? null : 'code')}
            className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
          >
            {maximizedEditor === 'code' ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
        <CodeEditor
          value={code}
          onChange={onCodeChange}
          language="javascript"
        />
      </div>

      <div 
        className={`bg-gray-800 rounded-lg overflow-hidden transition-all ${
          maximizedEditor === 'shader' ? 'h-full' : maximizedEditor === 'code' ? 'h-0' : 'h-1/2'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-300">Shader Editor</h3>
          <button
            onClick={() => setMaximizedEditor(maximizedEditor === 'shader' ? null : 'shader')}
            className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
          >
            {maximizedEditor === 'shader' ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
        <ShaderEditor
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          onVertexShaderChange={onVertexShaderChange}
          onFragmentShaderChange={onFragmentShaderChange}
        />
      </div>
    </div>
  );
}