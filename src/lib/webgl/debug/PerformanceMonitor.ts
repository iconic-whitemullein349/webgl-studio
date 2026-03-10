import Stats from 'stats.js';

export interface PerformanceMetrics {
  fps: number;
  drawCalls: number;
  vertices: number;
  textures: number;
  triangles: number;
  shaderSwitches: number;
  memoryUsage: {
    geometries: number;
    textures: number;
    shaders: number;
  };
}

export class PerformanceMonitor {
  private stats: Stats;
  private metrics: PerformanceMetrics;
  private lastUpdate: number = 0;
  private updateInterval: number = 1000; // Update every second

  constructor() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    this.metrics = this.createDefaultMetrics();
  }

  private createDefaultMetrics(): PerformanceMetrics {
    return {
      fps: 0,
      drawCalls: 0,
      vertices: 0,
      textures: 0,
      triangles: 0,
      shaderSwitches: 0,
      memoryUsage: {
        geometries: 0,
        textures: 0,
        shaders: 0
      }
    };
  }

  public begin(): void {
    this.stats.begin();
  }

  public end(): void {
    this.stats.end();
    this.updateMetrics();
  }

  public updateMetrics(): void {
    const now = performance.now();
    if (now - this.lastUpdate >= this.updateInterval) {
      this.metrics.fps = this.stats.getFPS();
      this.lastUpdate = now;
    }
  }

  public recordDrawCall(vertices: number, triangles: number): void {
    this.metrics.drawCalls++;
    this.metrics.vertices += vertices;
    this.metrics.triangles += triangles;
  }

  public recordShaderSwitch(): void {
    this.metrics.shaderSwitches++;
  }

  public recordTextureUse(): void {
    this.metrics.textures++;
  }

  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public reset(): void {
    this.metrics = this.createDefaultMetrics();
  }

  public getDomElement(): HTMLElement {
    return this.stats.dom;
  }
}