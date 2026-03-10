import React, { useEffect, useRef } from 'react';
import Stats from 'stats.js';
import { WebGLRenderer } from '../../lib/webgl/core/renderer';

interface WebGLCanvasProps {
  code: string;
  width: number;
  height: number;
}

const DEFAULT_CODE = `
// renderer.gl gives you the raw WebGL2 context
// renderer.clear() clears the canvas
// This runs every frame — use it to draw your scene

const gl = renderer.getGL();
renderer.clear();

// Example: rotating triangle (time is seconds since start)
const now = performance.now() / 1000;
const r = Math.abs(Math.sin(now));
const g = Math.abs(Math.sin(now + 2));
const b = Math.abs(Math.sin(now + 4));
gl.clearColor(r * 0.2, g * 0.1, b * 0.3, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
`.trim();

export function WebGLCanvas({ code, width, height }: WebGLCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const statsRef = useRef<Stats | null>(null);
  const statsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      rendererRef.current = new WebGLRenderer(canvasRef.current);
      rendererRef.current.setSize(width, height);
    } catch (e) {
      console.error('WebGL init failed:', e);
      return;
    }

    const stats = new Stats();
    stats.showPanel(0);
    if (statsContainerRef.current) {
      stats.dom.style.position = 'absolute';
      stats.dom.style.top = '0';
      stats.dom.style.left = '0';
      statsContainerRef.current.appendChild(stats.dom);
    }
    statsRef.current = stats;

    const runCode = code.trim() ? code : DEFAULT_CODE;

    let animationFrame: number;
    const animate = () => {
      stats.begin();
      try {
        // eslint-disable-next-line no-new-func
        const userFn = new Function('renderer', runCode);
        userFn(rendererRef.current);
      } catch (err) {
        console.error('Error in preview code:', err);
      }
      stats.end();
      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      if (stats.dom.parentNode) {
        stats.dom.parentNode.removeChild(stats.dom);
      }
    };
  }, [code, width, height]);

  return (
    <div ref={statsContainerRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-black rounded-lg"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
}