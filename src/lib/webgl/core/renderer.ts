import { mat4 } from 'gl-matrix';
import type { Scene, ShaderProgram } from '../../../types/webgl';

export class WebGLRenderer {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private currentProgram: ShaderProgram | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error('WebGL 2 not supported');
    this.gl = gl;
    this.initGL();
  }

  private initGL(): void {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
  }

  public setSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }

  public clear(): void {
    const gl = this.gl;
    gl.clearColor(0.05, 0.05, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }

  public getGL(): WebGL2RenderingContext {
    return this.gl;
  }

  public render(scene: Scene): void {
    this.clear();

    const viewMatrix = mat4.create();
    const projectionMatrix = mat4.create();

    mat4.lookAt(
      viewMatrix,
      scene.camera.position as [number, number, number],
      scene.camera.target,
      scene.camera.up
    );

    mat4.perspective(
      projectionMatrix,
      (scene.camera.fov * Math.PI) / 180,
      scene.camera.aspect,
      scene.camera.near,
      scene.camera.far
    );

    scene.objects.forEach((_object) => {
      // Object rendering will be implemented per-material
    });
  }
}