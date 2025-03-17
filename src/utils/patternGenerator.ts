import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise';

interface ColorScheme {
  style: 'neon' | 'dark' | 'psychedelic' | 'monochrome' | 'fire';
  colors: string[];
}

export function hsvToRgb(h: number, s: number, v: number): string {
  let r: number, g: number, b: number;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
    default: r = 0; g = 0; b = 0;
  }

  return `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
}

export function createRandomColorScheme(): ColorScheme {
  const nColors = 256;
  const colors: string[] = [];
  const style = ['neon', 'dark', 'psychedelic', 'monochrome', 'fire'][Math.floor(Math.random() * 5)] as ColorScheme['style'];
  const baseHue = Math.random();

  switch (style) {
    case 'neon':
      colors.push('#000000');
      for (let i = 0; i < nColors; i++) {
        const hue = (baseHue + 0.3 * Math.random()) % 1.0;
        const saturation = 0.8 + 0.2 * Math.random();
        const value = 0.6 + 0.4 * Math.random();
        colors.push(hsvToRgb(hue, saturation, value));
      }
      break;

    case 'dark':
      for (let i = 0; i < nColors; i++) {
        const hue = (baseHue + 0.2 * Math.random()) % 1.0;
        const saturation = 0.7 + 0.3 * Math.random();
        const value = 0.1 + 0.4 * (i / nColors);
        colors.push(hsvToRgb(hue, saturation, value));
      }
      break;

    case 'psychedelic':
      for (let i = 0; i < nColors; i++) {
        const hue = ((i / nColors) * 2) % 1.0;
        const saturation = 0.8 + 0.2 * Math.random();
        const value = 0.6 + 0.4 * Math.random();
        colors.push(hsvToRgb(hue, saturation, value));
      }
      break;

    case 'monochrome':
      const monoHue = Math.random();
      for (let i = 0; i < nColors; i++) {
        const saturation = 0.8 + 0.2 * Math.random();
        const value = i / nColors;
        colors.push(hsvToRgb(monoHue, saturation, value));
      }
      break;

    case 'fire':
      for (let i = 0; i < nColors; i++) {
        if (i < nColors * 0.4) {
          const value = (i / (nColors * 0.4)) * 0.8;
          colors.push(hsvToRgb(0.05, 0.8 + 0.2 * Math.random(), value));
        } else {
          const hue = 0.05 + (i - nColors * 0.4) / (nColors * 0.6) * 0.1;
          colors.push(hsvToRgb(hue, 0.9, 0.8 + (i - nColors * 0.4) / (nColors * 0.6) * 0.2));
        }
      }
      break;
  }

  return { style, colors };
}

export interface PatternConfig {
  type: 'noise' | 'geometric' | 'mathematical' | 'fractal';
  width: number;
  height: number;
  scale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
  seed: number;
  colorScheme: ColorScheme;
}

export function generateNoisePattern(config: PatternConfig, ctx: CanvasRenderingContext2D): void {
  const { width, height, scale, octaves, persistence, lacunarity } = config;
  const noise2D = createNoise2D();
  const noise3D = createNoise3D();
  const noise4D = createNoise4D();
  const imageData = ctx.createImageData(width, height);
  const time = Date.now() * 0.001;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = x / scale;
      const ny = y / scale;
      
      const noiseValue = (
        noise4D(nx, ny, Math.sin(time), Math.cos(time)) * 0.5 +
        noise3D(nx, ny, time) * 0.3 +
        noise2D(nx, ny) * 0.2
      );
      
      const value = (noiseValue + 1) / 2;
      const index = (y * width + x) * 4;
      const colorIndex = Math.min(
        Math.floor(value * config.colorScheme.colors.length),
        config.colorScheme.colors.length - 1
      );
      
      const color = config.colorScheme.colors[colorIndex];
      const [r, g, b] = color.match(/[0-9a-f]{2}/g)!.map(x => parseInt(x, 16));
      
      imageData.data[index] = r;
      imageData.data[index + 1] = g;
      imageData.data[index + 2] = b;
      imageData.data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// Add other pattern generation functions (geometric, mathematical, fractal) here...
// They will be similar to the Python implementations but optimized for JavaScript/Canvas

export function applyPostProcessing(ctx: CanvasRenderingContext2D, effects: string[]): void {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;

  if (effects.includes('smooth')) {
    // Implement Gaussian blur
    // This is a simplified version - you might want to use a WebGL shader for better performance
    const sigma = Math.random() * 40 + 20;
    const kernelSize = Math.ceil(sigma * 3) * 2 + 1;
    const kernel = new Float32Array(kernelSize);
    
    for (let i = 0; i < kernelSize; i++) {
      const x = i - Math.floor(kernelSize / 2);
      kernel[i] = Math.exp(-(x * x) / (2 * sigma * sigma));
    }
    
    // Normalize kernel
    const sum = kernel.reduce((a, b) => a + b);
    kernel.forEach((v, i) => kernel[i] = v / sum);
    
    // Apply kernel
    const temp = new Uint8ClampedArray(data.length);
    for (let y = 0; y < ctx.canvas.height; y++) {
      for (let x = 0; x < ctx.canvas.width; x++) {
        let r = 0, g = 0, b = 0;
        for (let i = 0; i < kernelSize; i++) {
          const offset = Math.max(0, Math.min(x + i - Math.floor(kernelSize / 2), ctx.canvas.width - 1));
          const index = (y * ctx.canvas.width + offset) * 4;
          r += data[index] * kernel[i];
          g += data[index + 1] * kernel[i];
          b += data[index + 2] * kernel[i];
        }
        const index = (y * ctx.canvas.width + x) * 4;
        temp[index] = r;
        temp[index + 1] = g;
        temp[index + 2] = b;
        temp[index + 3] = 255;
      }
    }
    data.set(temp);
  }

  if (effects.includes('dark_areas')) {
    const threshold = Math.random() * 0.2 + 0.1;
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < threshold) {
        data[i] = data[i] * 0.2;
        data[i + 1] = data[i + 1] * 0.2;
        data[i + 2] = data[i + 2] * 0.2;
      }
    }
  }

  if (effects.includes('high_contrast')) {
    const threshold = Math.random() * 0.03 + 0.02;
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < threshold) {
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}