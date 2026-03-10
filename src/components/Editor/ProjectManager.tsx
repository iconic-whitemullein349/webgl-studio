import React from 'react';
import { Save, FolderOpen, Trash2, Plus } from 'lucide-react';
import useProjectStore from '../../lib/storage/projectStore';

export function ProjectManager() {
  const { projects, currentProject, loadProjects, saveProject, loadProject, deleteProject } = useProjectStore();

  React.useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleNewProject = () => {
    saveProject({
      name: 'New Project',
      code: '// New WebGL Project',
      shaders: {
        vertex: '// Vertex Shader',
        fragment: '// Fragment Shader'
      },
      assets: []
    });
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-200">Projects</h2>
        <button
          onClick={handleNewProject}
          className="p-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`flex items-center justify-between p-2 rounded-md ${
              currentProject?.id === project.id ? 'bg-gray-700' : 'bg-gray-900'
            }`}
          >
            <span className="text-gray-300">{project.name}</span>
            <div className="flex space-x-2">
              <button
                onClick={() => loadProject(project.id)}
                className="p-1 text-gray-400 hover:text-gray-200"
              >
                <FolderOpen className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteProject(project.id)}
                className="p-1 text-gray-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}