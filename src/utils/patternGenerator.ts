import { createNoise2D } from 'simplex-noise';
import { GPU } from 'gpu.js';

const gpu = new GPU();

const generateNoise = (width: number, height: number, scale: number = 50) => {
  const noise2D = createNoise2D();
  const data = new Float32Array(width * height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = x / width * scale;
      const ny = y / height * scale;
      data[y * width + x] = noise2D(nx, ny);
    }
  }
  
  return data;
};

const generateFractal = gpu.createKernel(function(width: number, height: number) {
  const x0 = (this.thread.x / width) * 4 - 2;
  const y0 = (this.thread.y / height) * 4 - 2;
  let x = 0;
  let y = 0;
  let iteration = 0;
  const maxIteration = 100;

  while (x*x + y*y <= 4 && iteration < maxIteration) {
    const xtemp = x*x - y*y + x0;
    y = 2*x*y + y0;
    x = xtemp;
    iteration++;
  }

  return iteration / maxIteration;
}).setOutput([800, 800]);

const generateGeometric = gpu.createKernel(function(width: number, height: number) {
  const x = (this.thread.x / width) * 2 - 1;
  const y = (this.thread.y / height) * 2 - 1;
  const r = Math.sqrt(x*x + y*y);
  const theta = Math.atan2(y, x);
  
  return Math.sin(10 * r + 5 * theta) * 0.5 + 0.5;
}).setOutput([800, 800]);

const patternTypes = ['noise', 'fractal', 'geometric'] as const;

export const generatePattern = async () => {
  const width = 800;
  const height = 800;
  const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
  
  let data: Float32Array | number[];
  
  switch (patternType) {
    case 'noise':
      data = generateNoise(width, height);
      break;
    case 'fractal':
      data = generateFractal(width, height) as number[];
      break;
    case 'geometric':
      data = generateGeometric(width, height) as number[];
      break;
    default:
      data = generateNoise(width, height);
  }

  // Convert to canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(width, height);

  // Apply color mapping
  const hue = Math.random() * 360;
  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    const h = (hue + value * 180) % 360;
    const s = 80 + value * 20;
    const l = 30 + value * 40;

    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * l / 100 - 1)) * s / 100;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l / 100 - c / 2;

    let r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    imageData.data[i * 4] = Math.round((r + m) * 255);
    imageData.data[i * 4 + 1] = Math.round((g + m) * 255);
    imageData.data[i * 4 + 2] = Math.round((b + m) * 255);
    imageData.data[i * 4 + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
};