'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise';
import MatrixLoading from './MatrixLoading';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
  background: #000;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`;

const PatternContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: #111;
  border: 2px solid #0f0;
  cursor: pointer;
  transition: transform 0.2s;
  overflow: hidden;

  &:hover {
    transform: scale(1.02);
    border-color: #0ff;
  }
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
`;

const Controls = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
  z-index: 10;
`;

const Button = styled.button`
  background: #000;
  color: #0f0;
  border: 2px solid #0f0;
  padding: 10px 20px;
  font-family: monospace;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 2px;

  &:hover {
    background: #0f0;
    color: #000;
    text-shadow: 0 0 5px #000;
  }
`;

interface Pattern {
  type: 'noise' | 'geometric' | 'mathematical' | 'fractal';
  seed: number;
  colorScheme: string[];
  complexity: number;
  distortion: number;
}

export default function PatternGrid() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);

  const colorSchemes = [
    ['#00ff00', '#00aa00', '#008800', '#004400'],
    ['#00ffff', '#00aaaa', '#008888', '#004444'],
    ['#ff00ff', '#aa00aa', '#880088', '#440044'],
    ['#ffff00', '#aaaa00', '#888800', '#444400'],
    ['#ff0000', '#aa0000', '#880000', '#440000'],
    ['#0000ff', '#0000aa', '#000088', '#000044'],
  ];

  const generateNoise = (ctx: CanvasRenderingContext2D, width: number, height: number, pattern: Pattern) => {
    const imageData = ctx.createImageData(width, height);
    const noise2D = createNoise2D();
    const noise3D = createNoise3D();
    const noise4D = createNoise4D();
    const scale = pattern.complexity * 0.01;
    const time = Date.now() * 0.001;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const nx = x * scale;
        const ny = y * scale;
        
        const noise = (
          noise4D(nx, ny, Math.sin(time) * pattern.distortion, Math.cos(time) * pattern.distortion) * 0.5 +
          noise3D(nx, ny, time * pattern.distortion) * 0.3 +
          noise2D(nx, ny) * 0.2
        );
        
        const value = (noise + 1) / 2;
        const index = (y * width + x) * 4;
        const colorIndex = Math.min(
          Math.floor(value * pattern.colorScheme.length),
          pattern.colorScheme.length - 1
        );
        const color = pattern.colorScheme[colorIndex];
        const [r, g, b] = color.match(/\\w\\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
        
        imageData.data[index] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const generateGeometric = (ctx: CanvasRenderingContext2D, width: number, height: number, pattern: Pattern) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2;
    
    for (let i = 0; i < pattern.complexity * 2; i++) {
      const angle = (i / pattern.complexity) * Math.PI * 2;
      const radius = maxRadius * (1 - i / (pattern.complexity * 2));
      const color = pattern.colorScheme[i % pattern.colorScheme.length];
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      for (let t = 0; t <= Math.PI * 2; t += 0.1) {
        const r = radius * (1 + Math.sin(t * pattern.distortion) * 0.2);
        const x = centerX + r * Math.cos(t + angle);
        const y = centerY + r * Math.sin(t + angle);
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  };

  const generateMathematical = (ctx: CanvasRenderingContext2D, width: number, height: number, pattern: Pattern) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    
    ctx.strokeStyle = pattern.colorScheme[0];
    ctx.lineWidth = 2;
    
    ctx.beginPath();
    for (let t = 0; t < Math.PI * pattern.complexity; t += 0.1) {
      const r = Math.min(width, height) / 4 * Math.sin(t * pattern.distortion);
      const x = centerX + r * Math.cos(t);
      const y = centerY + r * Math.sin(t);
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const generateFractal = (ctx: CanvasRenderingContext2D, width: number, height: number, pattern: Pattern) => {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    const maxIterations = pattern.complexity * 20;
    const scale = 4 / Math.min(width, height);
    const offsetX = pattern.seed * 0.1;
    const offsetY = pattern.seed * 0.2;
    
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        let zx = (x - width / 2) * scale + offsetX;
        let zy = (y - height / 2) * scale + offsetY;
        let i = 0;
        
        while (zx * zx + zy * zy < 4 && i < maxIterations) {
          const temp = Math.pow(zx * zx - zy * zy + pattern.distortion, pattern.distortion);
          zy = 2 * zx * zy + pattern.seed / 100;
          zx = temp;
          i++;
        }
        
        const colorIndex = Math.floor((i / maxIterations) * pattern.colorScheme.length);
        ctx.fillStyle = pattern.colorScheme[Math.min(colorIndex, pattern.colorScheme.length - 1)];
        ctx.fillRect(x, y, 1, 1);
      }
    }
  };

  const generatePattern = async (canvas: HTMLCanvasElement, pattern: Pattern) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    switch (pattern.type) {
      case 'noise':
        generateNoise(ctx, canvas.width, canvas.height, pattern);
        break;
      case 'geometric':
        generateGeometric(ctx, canvas.width, canvas.height, pattern);
        break;
      case 'mathematical':
        generateMathematical(ctx, canvas.width, canvas.height, pattern);
        break;
      case 'fractal':
        generateFractal(ctx, canvas.width, canvas.height, pattern);
        break;
    }
  };

  const generateNewPatterns = async () => {
    setIsLoading(true);
    setLoadingText('Initializing pattern generation...');

    const types: Pattern['type'][] = ['noise', 'geometric', 'mathematical', 'fractal'];
    const newPatterns = Array(4).fill(null).map(() => ({
      type: types[Math.floor(Math.random() * types.length)],
      seed: Math.random() * 100,
      colorScheme: colorSchemes[Math.floor(Math.random() * colorSchemes.length)],
      complexity: Math.random() * 50 + 50,
      distortion: Math.random() * 3 + 1
    }));

    setPatterns(newPatterns);
    setLoadingText('Generating patterns...');

    await new Promise(resolve => setTimeout(resolve, 100));

    canvasRefs.current.forEach((canvas, i) => {
      if (canvas) {
        canvas.width = 1000;
        canvas.height = 1000;
        generatePattern(canvas, newPatterns[i]);
      }
    });

    setLoadingText('Finalizing...');
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const savePattern = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `matrix-pattern-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const saveAllPatterns = () => {
    canvasRefs.current.forEach((canvas) => {
      if (canvas) savePattern(canvas);
    });
  };

  useEffect(() => {
    generateNewPatterns();
  }, []);

  const setCanvasRef = (index: number) => (element: HTMLCanvasElement | null) => {
    canvasRefs.current[index] = element;
  };

  return (
    <>
      <Container>
        {patterns.map((pattern, i) => (
          <PatternContainer key={i} onClick={() => canvasRefs.current[i] && savePattern(canvasRefs.current[i]!)}>
            <Canvas ref={setCanvasRef(i)} />
          </PatternContainer>
        ))}
      </Container>
      <Controls>
        <Button onClick={generateNewPatterns}>Generate</Button>
        <Button onClick={saveAllPatterns}>Save All</Button>
      </Controls>
      <MatrixLoading isLoading={isLoading} text={loadingText} />
    </>
  );
}