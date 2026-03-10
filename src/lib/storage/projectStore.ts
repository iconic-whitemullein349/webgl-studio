import { create } from 'zustand';
import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';

export interface Project {
  id: string;
  name: string;
  code: string;
  shaders: {
    vertex: string;
    fragment: string;
  };
  assets: Asset[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Asset {
  id: string;
  name: string;
  type: 'texture' | 'model' | 'audio';
  url: string;
  metadata: Record<string, unknown>;
}

interface ProjectStore {
  currentProject: Project | null;
  projects: Project[];
  loadProjects: () => Promise<void>;
  saveProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  loadProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const DB_NAME = 'webgl-studio';
const STORE_NAME = 'projects';

const useProjectStore = create<ProjectStore>((set, get) => ({
  currentProject: null,
  projects: [],

  loadProjects: async () => {
    const db = await openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      },
    });

    const projects = await db.getAll(STORE_NAME);
    set({ projects });
  },

  saveProject: async (projectData) => {
    const db = await openDB(DB_NAME, 1);
    const now = new Date();
    const { currentProject } = get();

    const project: Project = currentProject
      ? {
          ...currentProject,
          ...projectData,
          updatedAt: now,
        }
      : {
          ...projectData,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };

    await db.put(STORE_NAME, project);
    await get().loadProjects();
    set({ currentProject: project });
  },

  loadProject: async (id) => {
    const db = await openDB(DB_NAME, 1);
    const project = await db.get(STORE_NAME, id);
    if (project) {
      set({ currentProject: project });
    }
  },

  deleteProject: async (id) => {
    const db = await openDB(DB_NAME, 1);
    await db.delete(STORE_NAME, id);
    await get().loadProjects();
    const { currentProject } = get();
    if (currentProject?.id === id) {
      set({ currentProject: null });
    }
  },
}));

export default useProjectStore;