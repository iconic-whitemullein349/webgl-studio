import React, { useCallback, useEffect } from 'react';
import { Code2, BoxSelect, Settings2, Play, Wand2, Files } from 'lucide-react';
import { CodeEditor } from './CodeEditor';
import { SceneBuilder } from '../SceneBuilder/SceneBuilder';
import { ObjectEditor } from './ObjectEditor';
import { PreviewPanel } from '../Preview/PreviewPanel';
import { AIGenerationPanel } from '../AIGeneration/AIGenerationPanel';
import { FilesPanel } from '../Files/FilesPanel';
import type { Scene } from '../../types/webgl';

interface TabManagerProps {
  code: string;
  scene: Scene;
  onCodeChange: (code: string) => void;
  onSceneUpdate: (scene: Scene) => void;
}

export function TabManager({ code, scene, onCodeChange, onSceneUpdate }: TabManagerProps) {
  const [activeTab, setActiveTab] = React.useState('code');

  const handleKeyboardShortcut = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case '1':
          setActiveTab('code');
          event.preventDefault();
          break;
        case '2':
          setActiveTab('world');
          event.preventDefault();
          break;
        case '3':
          setActiveTab('object');
          event.preventDefault();
          break;
        case '4':
          setActiveTab('play');
          event.preventDefault();
          break;
        case '5':
          setActiveTab('ai');
          event.preventDefault();
          break;
        case '6':
          setActiveTab('files');
          event.preventDefault();
          break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [handleKeyboardShortcut]);

  const tabs = [
    { id: 'code', label: 'Code Editor', icon: Code2 },
    { id: 'world', label: 'World Editor', icon: BoxSelect },
    { id: 'object', label: 'Object Editor', icon: Settings2 },
    { id: 'play', label: 'Play Mode', icon: Play },
    { id: 'ai', label: 'AI Generation', icon: Wand2 },
    { id: 'files', label: 'Files', icon: Files },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex bg-gray-800 border-b border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-700 text-white border-b-2 border-purple-500'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="ml-2 text-xs text-gray-500">
                {tab.id === 'code' && '⌘1'}
                {tab.id === 'world' && '⌘2'}
                {tab.id === 'object' && '⌘3'}
                {tab.id === 'play' && '⌘4'}
                {tab.id === 'ai' && '⌘5'}
                {tab.id === 'files' && '⌘6'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'code' && (
          <div className="h-full p-4">
            <CodeEditor value={code} onChange={onCodeChange} language="javascript" />
          </div>
        )}
        {activeTab === 'world' && (
          <div className="h-full p-4">
            <SceneBuilder scene={scene} onSceneUpdate={onSceneUpdate} />
          </div>
        )}
        {activeTab === 'object' && (
          <div className="h-full p-4">
            <ObjectEditor scene={scene} onSceneUpdate={onSceneUpdate} />
          </div>
        )}
        {activeTab === 'play' && (
          <div className="h-full">
            <PreviewPanel code={code} width={800} height={600} />
          </div>
        )}
        {activeTab === 'ai' && (
          <div className="h-full p-4">
            <AIGenerationPanel onSceneGenerated={onSceneUpdate} />
          </div>
        )}
        {activeTab === 'files' && (
          <div className="h-full p-4">
            <FilesPanel scene={scene} onSceneUpdate={onSceneUpdate} />
          </div>
        )}
      </div>
    </div>
  );
}