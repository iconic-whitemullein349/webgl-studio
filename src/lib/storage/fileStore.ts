import { create } from 'zustand';
import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';

export interface ProjectFile {
  id: string;
  name: string;
  type: 'model' | 'texture' | 'audio' | 'script';
  size: number;
  lastModified: Date;
  url: string;
  data: ArrayBuffer;
}

interface FileStore {
  files: ProjectFile[];
  addFile: (file: Omit<ProjectFile, 'id'>) => Promise<void>;
  removeFile: (id: string) => Promise<void>;
  getFile: (id: string) => Promise<ProjectFile | undefined>;
  loadFiles: () => Promise<void>;
}

const DB_NAME = 'webgl-studio-files';
const STORE_NAME = 'files';

const useFileStore = create<FileStore>((set, get) => ({
  files: [],

  addFile: async (fileData) => {
    const db = await openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      },
    });

    const file: ProjectFile = {
      ...fileData,
      id: uuidv4(),
    };

    await db.put(STORE_NAME, file);
    await get().loadFiles();
  },

  removeFile: async (id) => {
    const db = await openDB(DB_NAME, 1);
    await db.delete(STORE_NAME, id);
    await get().loadFiles();
  },

  getFile: async (id) => {
    const db = await openDB(DB_NAME, 1);
    return db.get(STORE_NAME, id);
  },

  loadFiles: async () => {
    const db = await openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      },
    });

    const files = await db.getAll(STORE_NAME);
    set({ files });
  },
}));

export default useFileStore;