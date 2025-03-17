import { createNoise2D } from 'simplex-noise';

const generateNoise = (width: number, height: number, scale: number = 50) => {
  const noise2D = createNoise2D();
  const data = new Float32Array(width * height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = x / width * scale;
      const ny = y / height * scale;
      data[y * width + x] = (noise2D(nx, ny) + 1) * 0.5;
    }
  }
  
  return data;
};

const generateFractal = (width: number, height: number) => {
  const data = new Float32Array(width * height);
  const maxIter = 100;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const x0 = (x / width) * 4 - 2;
      const y0 = (y / height) * 4 - 2;
      let zx = 0;
      let zy = 0;
      let iter = 0;
      
      while (zx * zx + zy * zy < 4 && iter < maxIter) {
        const xtemp = zx * zx - zy * zy + x0;
        zy = 2 * zx * zy + y0;
        zx = xtemp;
        iter++;
      }
      
      data[y * width + x] = iter / maxIter;
    }
  }
  
  return data;
};

const generateGeometric = (width: number, height: number) => {
  const data = new Float32Array(width * height);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = (x / width) * 2 - 1;
      const ny = (y / height) * 2 - 1;
      const r = Math.sqrt(nx * nx + ny * ny);
      const theta = Math.atan2(ny, nx);
      
      data[y * width + x] = (Math.sin(10 * r + 5 * theta) + 1) * 0.5;
    }
  }
  
  return data;
};

const patternTypes = ['noise', 'fractal', 'geometric'] as const;

const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};

export const generatePattern = async () => {
  const width = 800;
  const height = 800;
  const patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
  
  let data: Float32Array;
  
  switch (patternType) {
    case 'noise':
      data = generateNoise(width, height);
      break;
    case 'fractal':
      data = generateFractal(width, height);
      break;
    case 'geometric':
      data = generateGeometric(width, height);
      break;
    default:
      data = generateNoise(width, height);
  }

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(width, height);

  // Apply color mapping
  const baseHue = Math.random() * 360;
  for (let i = 0; i < data.length; i++) {
    const value = data[i];
    const h = (baseHue + value * 180) % 360;
    const s = 80 + value * 20;
    const l = 30 + value * 40;
    
    const [r, g, b] = hslToRgb(h, s, l);
    
    imageData.data[i * 4] = r;
    imageData.data[i * 4 + 1] = g;
    imageData.data[i * 4 + 2] = b;
    imageData.data[i * 4 + 3] = 255;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
};