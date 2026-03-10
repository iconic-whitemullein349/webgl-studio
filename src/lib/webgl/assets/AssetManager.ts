export class AssetManager {
  private textures: Map<string, WebGLTexture> = new Map();
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private models: Map<string, ArrayBuffer> = new Map();
  private gl: WebGL2RenderingContext;
  private audioContext: AudioContext;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.audioContext = new AudioContext();
  }

  async loadTexture(url: string, id: string): Promise<WebGLTexture> {
    if (this.textures.has(id)) {
      return this.textures.get(id)!;
    }

    const response = await fetch(url);
    const blob = await response.blob();
    const image = await createImageBitmap(blob);
    
    const texture = this.gl.createTexture()!;
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image
    );
    
    this.gl.generateMipmap(this.gl.TEXTURE_2D);
    this.textures.set(id, texture);
    
    return texture;
  }

  async loadAudio(url: string, id: string): Promise<AudioBuffer> {
    if (this.audioBuffers.has(id)) {
      return this.audioBuffers.get(id)!;
    }

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    this.audioBuffers.set(id, audioBuffer);
    return audioBuffer;
  }

  async loadModel(url: string, id: string): Promise<ArrayBuffer> {
    if (this.models.has(id)) {
      return this.models.get(id)!;
    }

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.models.set(id, arrayBuffer);
    
    return arrayBuffer;
  }

  deleteAsset(id: string): void {
    if (this.textures.has(id)) {
      const texture = this.textures.get(id)!;
      this.gl.deleteTexture(texture);
      this.textures.delete(id);
    }
    this.audioBuffers.delete(id);
    this.models.delete(id);
  }
}