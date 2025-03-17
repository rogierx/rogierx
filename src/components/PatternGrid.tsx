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

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(0, 255, 0, 0.1), transparent);
    pointer-events: none;
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

export default function PatternGrid() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);

  const generateNoise = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        
        // Generate trippy patterns using sine waves and noise
        const scale = 0.01;
        const t = Date.now() * 0.001;
        
        const value1 = Math.sin(x * scale + t) * Math.cos(y * scale + t);
        const value2 = Math.sin((x + y) * scale) * Math.cos(x * scale - y * scale);
        const value3 = Math.sin(Math.sqrt(x * x + y * y) * scale);
        
        const r = Math.sin(value1 * Math.PI * 2) * 127 + 128;
        const g = Math.sin(value2 * Math.PI * 2) * 127 + 128;
        const b = Math.sin(value3 * Math.PI * 2) * 127 + 128;
        
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const generateGeometric = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    const numShapes = 50 + Math.floor(Math.random() * 100);
    const baseHue = Math.random() * 360;
    
    for (let i = 0; i < numShapes; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 20 + Math.random() * 200;
      
      const hue = (baseHue + Math.random() * 60) % 360;
      ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${0.1 + Math.random() * 0.4})`;
      ctx.strokeStyle = `hsla(${(hue + 180) % 360}, 100%, 50%, 0.5)`;
      ctx.lineWidth = 1 + Math.random() * 3;
      
      ctx.beginPath();
      if (Math.random() < 0.5) {
        const points = Math.floor(3 + Math.random() * 7);
        const angleStep = (Math.PI * 2) / points;
        for (let j = 0; j < points; j++) {
          const angle = j * angleStep;
          const radius = size * (0.5 + Math.random() * 0.5);
          const px = x + Math.cos(angle) * radius;
          const py = y + Math.sin(angle) * radius;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      } else {
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  };

  const generateMathematical = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 0.02;
    const timeValue = Date.now() * 0.001;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = (x - centerX) * scale;
        const dy = (y - centerY) * scale;
        
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const value1 = Math.sin(distance * 10 + timeValue) * Math.cos(angle * 5);
        const value2 = Math.sin(distance * 5 - timeValue) * Math.sin(angle * 3);
        const value3 = Math.cos(distance * 3 + angle * 2 + timeValue);
        
        const idx = (y * width + x) * 4;
        data[idx] = (value1 + 1) * 127;
        data[idx + 1] = (value2 + 1) * 127;
        data[idx + 2] = (value3 + 1) * 127;
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const generateFractal = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    const maxIterations = 100;
    const zoom = 1.5 + Math.random();
    const offsetX = -0.5 + Math.random() * 1;
    const offsetY = Math.random() * 1 - 0.5;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let zx = (x - width / 2) / (width / 4) / zoom + offsetX;
        let zy = (y - height / 2) / (height / 4) / zoom + offsetY;
        let cx = zx;
        let cy = zy;
        
        let iteration = 0;
        while (zx * zx + zy * zy < 4 && iteration < maxIterations) {
          const xtemp = zx * zx - zy * zy + cx;
          zy = 2 * zx * zy + cy;
          zx = xtemp;
          iteration++;
        }
        
        const idx = (y * width + x) * 4;
        if (iteration === maxIterations) {
          data[idx] = data[idx + 1] = data[idx + 2] = 0;
        } else {
          const hue = (iteration / maxIterations * 360 + Date.now() * 0.1) % 360;
          const [r, g, b] = hslToRgb(hue / 360, 1, 0.5);
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
        }
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  const generatePattern = async (type: Pattern['type']) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
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
      setLoadingText(`Generating ${types[i]} pattern...`);
      const pattern = await generatePattern(types[i]);
      if (pattern) newPatterns.push(pattern);
      setProgress((i + 1) * 25);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setPatterns(newPatterns);
    setLoading(false);
  };

  const savePattern = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `pattern-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const saveAllPatterns = () => {
    patterns.forEach((pattern, index) => {
      setTimeout(() => savePattern(pattern.canvas), index * 100);
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