# WebGL Studio

A browser-based 3D graphics development environment featuring a live WebGL2 code editor, interactive scene builder, AI-powered 3D model generation, and persistent project management.

![WebGL Studio](https://img.shields.io/badge/WebGL-2-blue?logo=webgl)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)
![Three.js](https://img.shields.io/badge/Three.js-r162-000000?logo=three.js)

---

## ✨ Features

### 🖥️ Live WebGL2 Code Editor
- Powered by CodeMirror 6 with syntax highlighting, bracket matching, and autocomplete
- Real-time WebGL2 rendering preview with FPS counter (Stats.js)
- Full access to the `renderer` API (`renderer.getGL()`, `renderer.clear()`)
- Keyboard shortcuts: **⌘1–⌘6** to switch tabs

### 🌍 World Editor (Three.js scene builder)
- Interactive 3D viewport with orbit controls, grid, and gizmos
- Add cubes, spheres, and cone primitives
- Move / Rotate / Scale objects with transform controls
- Camera position and FOV controls
- Scene hierarchy with add/delete

### 🎨 Object Editor
- Per-object material type (Basic / Phong / Custom)
- Custom GLSL vertex + fragment shader editor per object
- Asset assignment from the file store
- 3D preview of selected object

### 🤖 AI 3D Generation (Stability AI + Replicate)
- **Text → Image**: Enter a prompt → generate an image via Stable Diffusion XL (Replicate API)
- **Image → 3D**: Upload or use the generated image → create a GLB 3D model (Stability AI Stable Fast 3D)
- Advanced settings: texture resolution, foreground ratio, remesh type, vertex count
- Generated model is instantly added to the scene

### 📁 File Manager
- Upload models (`.glb`, `.gltf`, `.obj`, `.fbx`), textures (`.png`, `.jpg`, `.webp`, `.hdr`), audio, and scripts
- Persistent storage via IndexedDB
- Download and delete files
- Texture preview in the panel

### 💾 Project Manager
- Create, save, load, and delete multiple projects
- Projects are persisted in IndexedDB (works fully offline, no sign-in required)
- Auto-saves shaders and code when you hit **Save**

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/RhythrosaLabs/webgl-studio.git
cd webgl-studio
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔑 API Keys (Optional)

AI generation features require API keys. **Keys are never stored on any server** — they are stored only in your browser's local state during the session.

| Feature | Provider | Where to get a key |
|---|---|---|
| Text → Image (SDXL) | [Replicate](https://replicate.com) | [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens) |
| Image → 3D (Stable Fast 3D) | [Stability AI](https://stability.ai) | [platform.stability.ai/account/keys](https://platform.stability.ai/account/keys) |

Enter your keys in the **AI Generation** tab when needed. They are not saved to disk.

---

## 🏗️ Tech Stack

| Layer | Library |
|---|---|
| UI Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| 3D Viewport | Three.js r162 + @react-three/fiber + @react-three/drei |
| Code Editor | CodeMirror 6 via @uiw/react-codemirror |
| AI – Text to Image | Replicate API (SDXL) |
| AI – Image to 3D | Stability AI Stable Fast 3D API |
| GLB Parsing | Three.js GLTFLoader |
| Persistence | IndexedDB via idb |
| State Management | Zustand |
| Math | gl-matrix |
| Performance | Stats.js |
| Icons | Lucide React |

---

## 📁 Project Structure

```
src/
├── App.tsx                        # Root layout
├── components/
│   ├── AIGeneration/
│   │   ├── AIGenerationPanel.tsx  # Orchestrates text-to-image + image-to-3D
│   │   ├── ImageUploader.tsx      # Drag-and-drop image uploader
│   │   └── TextToImagePanel.tsx   # Replicate SDXL prompt UI
│   ├── AssetManager/
│   │   └── AssetPanel.tsx         # Project asset list (sidebar)
│   ├── Debug/
│   │   └── DebugPanel.tsx         # FPS / draw call overlay
│   ├── Editor/
│   │   ├── CodeEditor.tsx         # CodeMirror wrapper
│   │   ├── EditorPanel.tsx        # Split code + shader editor
│   │   ├── ObjectEditor.tsx       # Per-object properties panel
│   │   ├── ProjectManager.tsx     # Project CRUD sidebar
│   │   ├── ShaderEditor.tsx       # GLSL vertex/fragment editor
│   │   └── TabManager.tsx         # Main tab bar (⌘1-⌘6)
│   ├── Files/
│   │   └── FilesPanel.tsx         # File browser + upload
│   ├── Layout/
│   │   └── Header.tsx             # Top navigation bar
│   ├── Preview/
│   │   ├── PreviewPanel.tsx       # Preview frame with fullscreen toggle
│   │   └── WebGLCanvas.tsx        # Raw WebGL2 canvas + animation loop
│   └── SceneBuilder/
│       ├── CameraControls.tsx     # FOV / position / clipping planes
│       ├── LightingControls.tsx   # Add/edit directional, point, spot lights
│       ├── SceneBuilder.tsx       # Left panel + WorldView split
│       ├── SceneHierarchy.tsx     # Object tree with add/delete
│       ├── TransformControls.tsx  # Position / rotation / scale inputs
│       └── WorldView.tsx          # React Three Fiber 3D viewport
├── lib/
│   ├── ai/
│   │   ├── stableDiffusion3D.ts   # Stability AI image-to-3D integration
│   │   ├── textToImage.ts         # Replicate text-to-image (standalone)
│   │   ├── types.ts               # Shared AI config interfaces
│   │   ├── services/
│   │   │   ├── replicateService.ts   # Replicate API client
│   │   │   └── stabilityService.ts   # Stability AI API client
│   │   └── utils/
│   │       ├── errorHandling.ts   # AIGenerationError class
│   │       ├── glbConverter.ts    # THREE.GLTFLoader-based GLB parser
│   │       └── validation.ts      # Config validation helpers
│   ├── storage/
│   │   ├── fileStore.ts           # IndexedDB file store (Zustand)
│   │   └── projectStore.ts        # IndexedDB project store (Zustand)
│   └── webgl/
│       ├── assets/AssetManager.ts
│       ├── core/
│       │   ├── renderer.ts        # WebGL2Renderer class
│       │   └── SceneManager.ts    # Scene CRUD manager
│       ├── debug/PerformanceMonitor.ts
│       └── shaders/defaultShaders.ts   # Default GLSL300es shaders
└── types/
    └── webgl.d.ts                 # Scene, SceneObject, Transform, etc.
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘1` / `Ctrl+1` | Code Editor tab |
| `⌘2` / `Ctrl+2` | World Editor tab |
| `⌘3` / `Ctrl+3` | Object Editor tab |
| `⌘4` / `Ctrl+4` | Play Mode (WebGL Preview) |
| `⌘5` / `Ctrl+5` | AI Generation tab |
| `⌘6` / `Ctrl+6` | File Manager tab |

---

## 🛡️ Security & Privacy

- **No telemetry, no analytics, no tracking.**
- All project data and files are stored **locally** in your browser's IndexedDB.
- API keys are kept **only in React component state** — they are never persisted to disk or sent anywhere except to the official API providers' servers.
- Safe to use on air-gapped machines (except for AI features which need internet access to external APIs).

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
