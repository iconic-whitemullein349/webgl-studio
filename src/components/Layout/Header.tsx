import React from 'react';
import { Split, Save, Play, Download, Settings, HelpCircle } from 'lucide-react';
import useProjectStore from '../../lib/storage/projectStore';

interface HeaderProps {
  onSave?: () => void;
}

export function Header({ onSave }: HeaderProps = {}) {
  const { currentProject, saveProject } = useProjectStore();

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else if (currentProject) {
      saveProject(currentProject);
    }
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Split className="w-6 h-6 text-blue-400" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            WebGL Studio
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-blue-600 text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 group"
          >
            <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Save</span>
          </button>
          <button className="px-3 py-1.5 bg-green-600 text-sm rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2 group">
            <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Run</span>
          </button>
          <div className="h-6 w-px bg-gray-700 mx-2" />
          <button className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors rounded-md">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors rounded-md">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-gray-200 transition-colors rounded-md">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}