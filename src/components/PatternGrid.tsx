'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import MatrixLoading from './MatrixLoading';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #000;
  padding: 20px;
  gap: 20px;
`;

const PatternContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 100%;
  width: fit-content;
`;

const CanvasWrapper = styled.div`
  position: relative;
  cursor: pointer;
  border: 2px solid #0f0;
  transition: transform 0.3s ease;
  background: rgba(0, 255, 0, 0.05);

  &:hover {
    transform: scale(1.02);
    border-color: #0f0;
    box-shadow: 0 0 15px #0f0;
  }
`;

const Canvas = styled.canvas`
  width: 500px;
  height: 500px;
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  background: #000;
  color: #0f0;
  border: 1px solid #0f0;
  padding: 10px 20px;
  cursor: pointer;
  font-family: monospace;
  transition: all 0.3s ease;

  &:hover {
    background: #0f0;
    color: #000;
    box-shadow: 0 0 10px #0f0;
  }
`;

interface Pattern {
  type: 'noise' | 'geometric' | 'mathematical' | 'fractal';
  canvas: HTMLCanvasElement;
}

function createRandomColormap() {
  const colors: [number, number, number][] = [];
  const nColors = 256;
  
  const style = ['neon', 'dark', 'psychedelic', 'monochrome', 'fire'][Math.floor(Math.random() * 5)];
  
  if (style === 'neon') {
    const baseHue = Math.random();
    colors.push([0, 0, 0]); // Start with black
    for (let i = 0; i < nColors; i++) {
      const hue = (baseHue + 0.3 * Math.random()) % 1.0;
      const saturation = 0.8 + 0.2 * Math.random();
      const value = 0.6 + 0.4 * Math.random();
      colors.push(hsvToRgb(hue, saturation, value));
    }
  } else if (style === 'dark') {
    const baseHue = Math.random();
    for (let i = 0; i < nColors; i++) {
      const hue = (baseHue + 0.2 * Math.random()) % 1.0;
      const saturation = 0.7 + 0.3 * Math.random();
      const value = 0.1 + 0.4 * (i / nColors);
      colors.push(hsvToRgb(hue, saturation, value));
    }
  } else if (style === 'psychedelic') {
    for (let i = 0; i < nColors; i++) {
      const hue = (i / nColors * 2) % 1.0;
      const saturation = 0.8 + 0.2 * Math.random();
      const value = 0.6 + 0.4 * Math.random();
      colors.push(hsvToRgb(hue, saturation, value));
    }
  } else if (style === 'monochrome') {
    const hue = Math.random();
    for (let i = 0; i < nColors; i++) {
      const saturation = 0.8 + 0.2 * Math.random();
      const value = i / nColors;
      colors.push(hsvToRgb(hue, saturation, value));
    }
  } else { // fire
    for (let i = 0; i < nColors; i++) {
      if (i < nColors * 0.4) {
        // Dark red to bright red
        const hue = 0.05;
        const saturation = 0.8 + 0.2 * Math.random();
        const value = (i / (nColors * 0.4)) * 0.8;
        colors.push(hsvToRgb(hue, saturation, value));
      } else {
        // Red to yellow
        const hue = 0.05 + (i - nColors * 0.4) / (nColors * 0.6) * 0.1;
        const saturation = 0.9;
        const value = 0.8 + (i - nColors * 0.4) / (nColors * 0.6) * 0.2;
        colors.push(hsvToRgb(hue, saturation, value));
      }
    }
  }
  
  return colors;
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  let r, g, b;
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

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export default function PatternGrid() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);

  const generateNoise = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    // Choose noise style
    const style = ['smooth', 'detailed', 'chaotic', 'flowing', 'geometric'][Math.floor(Math.random() * 5)];
    
    let scale, octaves, persistence, lacunarity;
    
    if (style === 'smooth') {
      scale = Math.floor(Math.random() * 400) + 600;
      octaves = 4;
      persistence = 0.4;
      lacunarity = 2.0;
    } else if (style === 'detailed') {
      scale = Math.floor(Math.random() * 200) + 200;
      octaves = 8;
      persistence = 0.7;
      lacunarity = 2.5;
    } else if (style === 'chaotic') {
      scale = Math.floor(Math.random() * 200) + 100;
      octaves = 6;
      persistence = 0.9;
      lacunarity = 3.0;
    } else if (style === 'flowing') {
      scale = Math.floor(Math.random() * 400) + 400;
      octaves = 5;
      persistence = 0.5;
      lacunarity = 1.8;
    } else { // geometric
      scale = Math.floor(Math.random() * 300) + 300;
      octaves = 3;
      persistence = 0.3;
      lacunarity = 2.2;
    }
    
    // Generate Perlin noise
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let value = 0;
        let amplitude = 1;
        let frequency = 1;
        
        for (let o = 0; o < octaves; o++) {
          const sampleX = x * frequency / scale;
          const sampleY = y * frequency / scale;
          
          // Improved noise function using multiple frequencies
          const noise = Math.sin(sampleX + Math.cos(sampleY)) * 
                       Math.cos(sampleY - Math.sin(sampleX)) *
                       Math.sin((sampleX + sampleY) * frequency);
          
          value += noise * amplitude;
          amplitude *= persistence;
          frequency *= lacunarity;
        }
        
        // Normalize to [0, 1]
        value = (value + 1) / 2;
        
        const idx = (y * width + x) * 4;
        const color = Math.floor(value * 255);
        data[idx] = color;
        data[idx + 1] = color;
        data[idx + 2] = color;
        data[idx + 3] = 255;
      }
    }
    
    // Apply post-processing effects
    const effects = ['smooth', 'dark_areas', 'high_contrast', 'none']
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 3));
    
    if (effects.includes('smooth')) {
      // Gaussian-like blur
      const tempData = new Uint8ClampedArray(data);
      const radius = Math.floor(Math.random() * 40) + 20;
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let r = 0, g = 0, b = 0, count = 0;
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                const idx = (ny * width + nx) * 4;
                r += tempData[idx];
                g += tempData[idx + 1];
                b += tempData[idx + 2];
                count++;
              }
            }
          }
          const idx = (y * width + x) * 4;
          data[idx] = r / count;
          data[idx + 1] = g / count;
          data[idx + 2] = b / count;
        }
      }
    }
    
    if (effects.includes('dark_areas')) {
      const threshold = Math.random() * 0.2 + 0.1;
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < threshold) {
          data[i] = data[i + 1] = data[i + 2] = 0;
        }
      }
    }
    
    if (effects.includes('high_contrast')) {
      const threshold = Math.random() * 0.03 + 0.02;
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < threshold) {
          data[i] = data[i + 1] = data[i + 2] = 255;
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Apply colormap
    const colormap = createRandomColormap();
    const finalImageData = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < finalImageData.data.length; i += 4) {
      const idx = Math.floor(finalImageData.data[i] / 255 * (colormap.length - 1));
      const [r, g, b] = colormap[idx];
      finalImageData.data[i] = r;
      finalImageData.data[i + 1] = g;
      finalImageData.data[i + 2] = b;
    }
    ctx.putImageData(finalImageData, 0, 0);
  };

  const generateGeometric = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    const nElements = Math.floor(Math.random() * 4) + 3;
    const elements = Array(nElements).fill(0).map(() => 
      ['circle', 'line', 'spiral', 'wave'][Math.floor(Math.random() * 4)]
    );
    
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let value = 0;
        
        elements.forEach(element => {
          const normalizedX = (x - width/2) / (width/2);
          const normalizedY = (y - height/2) / (height/2);
          
          if (element === 'circle') {
            const cx = Math.random() * 2 - 1;
            const cy = Math.random() * 2 - 1;
            const r = Math.sqrt((normalizedX - cx)**2 + (normalizedY - cy)**2);
            const thickness = Math.random() * 0.1 + 0.05;
            value += Math.sin(r/thickness)**2;
          } else if (element === 'line') {
            const angle = Math.random() * Math.PI * 2;
            const freq = Math.random() * 10 + 5;
            value += Math.sin((normalizedX * Math.cos(angle) + normalizedY * Math.sin(angle)) * freq)**2;
          } else if (element === 'spiral') {
            const r = Math.sqrt(normalizedX**2 + normalizedY**2);
            const theta = Math.atan2(normalizedY, normalizedX);
            const arms = Math.floor(Math.random() * 6) + 2;
            const scale = Math.random() * 5 + 2;
            value += Math.sin(theta * arms + r * scale)**2;
          } else { // wave
            const freqX = Math.random() * 10 + 5;
            const freqY = Math.random() * 10 + 5;
            value += Math.sin(normalizedX * freqX)**2 * Math.cos(normalizedY * freqY)**2;
          }
        });
        
        value = value / elements.length;
        
        const idx = (y * width + x) * 4;
        const colormap = createRandomColormap();
        const colorIdx = Math.floor(value * (colormap.length - 1));
        const [r, g, b] = colormap[colorIdx];
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const generateMathematical = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    const function_type = ['mandelbrot', 'julia', 'newton'][Math.floor(Math.random() * 3)];
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const normalizedX = (x - width/2) / (width/4);
        const normalizedY = (y - height/2) / (height/4);
        
        let value = 0;
        
        if (function_type === 'mandelbrot') {
          let zx = normalizedX;
          let zy = normalizedY;
          let cx = zx;
          let cy = zy;
          let iteration = 0;
          
          while (zx * zx + zy * zy < 4 && iteration < 100) {
            const xtemp = zx * zx - zy * zy + cx;
            zy = 2 * zx * zy + cy;
            zx = xtemp;
            iteration++;
          }
          
          value = iteration / 100;
        } else if (function_type === 'julia') {
          const cx = Math.random() * 2 - 1;
          const cy = Math.random() * 2 - 1;
          let zx = normalizedX;
          let zy = normalizedY;
          let iteration = 0;
          
          while (zx * zx + zy * zy < 4 && iteration < 100) {
            const xtemp = zx * zx - zy * zy + cx;
            zy = 2 * zx * zy + cy;
            zx = xtemp;
            iteration++;
          }
          
          value = iteration / 100;
        } else { // newton
          let zx = normalizedX;
          let zy = normalizedY;
          
          for (let i = 0; i < 10; i++) {
            // z = z - (z^3 - 1)/(3z^2)
            const z2x = zx * zx - zy * zy;
            const z2y = 2 * zx * zy;
            const z3x = z2x * zx - z2y * zy;
            const z3y = z2x * zy + z2y * zx;
            
            const denominator = 3 * (z2x * z2x + z2y * z2y);
            const numeratorX = z3x - zx;
            const numeratorY = z3y - zy;
            
            zx = zx - (numeratorX * z2x + numeratorY * z2y) / denominator;
            zy = zy - (numeratorY * z2x - numeratorX * z2y) / denominator;
          }
          
          value = Math.sqrt(zx * zx + zy * zy);
        }
        
        const idx = (y * width + x) * 4;
        const colormap = createRandomColormap();
        const colorIdx = Math.floor(value * (colormap.length - 1));
        const [r, g, b] = colormap[colorIdx];
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const generateFractal = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    const iterations = Math.floor(Math.random() * 4) + 3;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const normalizedX = (x - width/2) / (width/2);
        const normalizedY = (y - height/2) / (height/2);
        
        let value = 0;
        for (let i = 0; i < iterations; i++) {
          const scale = Math.pow(2, i);
          const phase = Math.random() * Math.PI * 2;
          value += Math.sin(normalizedX * scale + phase) * Math.cos(normalizedY * scale + phase);
        }
        
        value = (value + iterations) / (2 * iterations);
        
        const idx = (y * width + x) * 4;
        const colormap = createRandomColormap();
        const colorIdx = Math.floor(value * (colormap.length - 1));
        const [r, g, b] = colormap[colorIdx];
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const generatePattern = async (type: Pattern['type']) => {
    const canvas = document.createElement('canvas');
    canvas.width = 3840;  // 4K resolution
    canvas.height = 2160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    switch (type) {
      case 'noise':
        generateNoise(ctx, canvas.width, canvas.height);
        break;
      case 'geometric':
        generateGeometric(ctx, canvas.width, canvas.height);
        break;
      case 'mathematical':
        generateMathematical(ctx, canvas.width, canvas.height);
        break;
      case 'fractal':
        generateFractal(ctx, canvas.width, canvas.height);
        break;
    }

    return { type, canvas };
  };

  const generatePatterns = async () => {
    setLoading(true);
    setProgress(0);
    const types: Pattern['type'][] = ['noise', 'geometric', 'mathematical', 'fractal'];
    const newPatterns: Pattern[] = [];

    for (let i = 0; i < 4; i++) {
      for (let step = 0; step < 25; step++) {
        setLoadingText(`Synthesizing pattern ${i + 1}/4...\nProcessing quantum state ${step + 1}/25`);
        setProgress(i * 25 + step);
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      const pattern = await generatePattern(types[i]);
      if (pattern) newPatterns.push(pattern);
    }

    setPatterns(newPatterns);
    setLoading(false);
  };

  const savePattern = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
    link.download = `trippy_art_4k_${timestamp}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const saveAllPatterns = () => {
    patterns.forEach((pattern, index) => {
      setTimeout(() => savePattern(pattern.canvas), index * 500);
    });
  };

  useEffect(() => {
    generatePatterns();
  }, []);

  if (loading) {
    return (
      <MatrixLoading
        text={loadingText}
        progress={progress}
        isLoading={loading}
      />
    );
  }

  return (
    <Container>
      <PatternContainer>
        {patterns.map((pattern, index) => (
          <CanvasWrapper key={index} onClick={() => savePattern(pattern.canvas)}>
            <Canvas
              ref={canvas => {
                if (canvas) {
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.drawImage(pattern.canvas, 0, 0, canvas.width, canvas.height);
                  }
                }
              }}
            />
          </CanvasWrapper>
        ))}
      </PatternContainer>
      <Controls>
        <Button onClick={generatePatterns}>GENERATE</Button>
        <Button onClick={saveAllPatterns}>SAVE ALL</Button>
      </Controls>
    </Container>
  );
}