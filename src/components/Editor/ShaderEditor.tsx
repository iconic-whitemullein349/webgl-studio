import React from 'react';
import CodeMirror from '@uiw/react-codemirror';

interface ShaderEditorProps {
  vertexShader: string;
  fragmentShader: string;
  onVertexShaderChange: (value: string) => void;
  onFragmentShaderChange: (value: string) => void;
}

export function ShaderEditor({
  vertexShader,
  fragmentShader,
  onVertexShaderChange,
  onFragmentShaderChange,
}: ShaderEditorProps) {
  return (
    <div className="grid grid-rows-2 gap-4 h-full">
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Vertex Shader</h3>
        <CodeMirror
          value={vertexShader}
          height="calc(100% - 2rem)"
          theme="dark"
          onChange={onVertexShaderChange}
          className="text-sm"
        />
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Fragment Shader</h3>
        <CodeMirror
          value={fragmentShader}
          height="calc(100% - 2rem)"
          theme="dark"
          onChange={onFragmentShaderChange}
          className="text-sm"
        />
      </div>
    </div>
  );
}