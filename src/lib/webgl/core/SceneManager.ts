import { mat4 } from 'gl-matrix';
import type { Scene, SceneObject, Camera, Light } from '../../../types/webgl';
import { v4 as uuidv4 } from 'uuid';

export class SceneManager {
  private scenes: Map<string, Scene> = new Map();
  private activeScene: Scene | null = null;

  constructor() {
    this.createDefaultScene();
  }

  private createDefaultScene(): void {
    const defaultScene: Scene = {
      id: uuidv4(),
      name: 'Default Scene',
      objects: [],
      camera: {
        position: [0, 0, 5],
        target: [0, 0, 0],
        up: [0, 1, 0],
        fov: 45,
        aspect: 1,
        near: 0.1,
        far: 1000
      },
      lights: [{
        type: 'directional',
        position: [1, 1, 1],
        color: [1, 1, 1],
        intensity: 1
      }]
    };

    this.scenes.set(defaultScene.id, defaultScene);
    this.activeScene = defaultScene;
  }

  public getActiveScene(): Scene | null {
    return this.activeScene;
  }

  public setActiveScene(id: string): void {
    const scene = this.scenes.get(id);
    if (scene) {
      this.activeScene = scene;
    }
  }

  public addObject(object: Omit<SceneObject, 'id'>): string {
    if (!this.activeScene) return '';

    const id = uuidv4();
    const newObject: SceneObject = { ...object, id };
    this.activeScene.objects.push(newObject);
    return id;
  }

  public removeObject(id: string): void {
    if (!this.activeScene) return;
    this.activeScene.objects = this.activeScene.objects.filter(obj => obj.id !== id);
  }

  public updateCamera(camera: Partial<Camera>): void {
    if (!this.activeScene) return;
    this.activeScene.camera = { ...this.activeScene.camera, ...camera };
  }

  public addLight(light: Light): void {
    if (!this.activeScene) return;
    this.activeScene.lights.push(light);
  }

  public serialize(): string {
    return JSON.stringify(Array.from(this.scenes.entries()));
  }

  public deserialize(data: string): void {
    this.scenes = new Map(JSON.parse(data));
    this.activeScene = this.scenes.values().next().value;
  }
}