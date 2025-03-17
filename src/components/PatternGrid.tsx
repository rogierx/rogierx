"use client";

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { createNoise2D } from 'simplex-noise';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
  background: #000;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const PatternContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  background: #111;
  border: 2px solid #0f0;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.02);
  }
`;

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
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

  &:hover {
    background: #0f0;
    color: #000;
  }
`;

interface Pattern {
  type: 'noise' | 'geometric' | 'mathematical' | 'fractal';
  seed: number;
  colorScheme: string[];
}

export default function PatternGrid() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('');
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const colorSchemes = [
    ['#ff0000', '#00ff00', '#0000ff'],
    ['#ff00ff', '#00ffff', '#ffff00'],
    ['#ff8800', '#00ff88', '#8800ff'],
    ['#88ff00', '#0088ff', '#ff0088']
  ];

  const generatePattern = async (canvas: HTMLCanvasElement, pattern: Pattern) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const noise2D = createNoise2D();

    switch (pattern.type) {
      case 'noise':
        const imageData = ctx.createImageData(width, height);
        for (let x = 0; x < width; x++) {
          for (let y = 0; y < height; y++) {
            const value = (noise2D(x / 50, y / 50) + 1) / 2;
            const index = (y * width + x) * 4;
            const color = pattern.colorScheme[Math.floor(value * pattern.colorScheme.length)];
            const [r, g, b] = color.match(/\w\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
            imageData.data[index] = r;
            imageData.data[index + 1] = g;
            imageData.data[index + 2] = b;
            imageData.data[index + 3] = 255;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        break;

      case 'geometric':
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        for (let i = 0; i < 50; i++) {
          const color = pattern.colorScheme[i % pattern.colorScheme.length];
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.arc(
            width / 2,
            height / 2,
            (Math.min(width, height) / 2) * (i / 50),
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
        break;

      case 'mathematical':
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        const points = [];
        for (let t = 0; t < Math.PI * 20; t += 0.1) {
          const x = width / 2 + Math.cos(t) * (t * 2);
          const y = height / 2 + Math.sin(t) * (t * 2);
          points.push([x, y]);
        }
        ctx.strokeStyle = pattern.colorScheme[0];
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        points.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.stroke();
        break;

      case 'fractal':
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        const maxIterations = 100;
        const scale = 4 / Math.min(width, height);
        for (let x = 0; x < width; x++) {
          for (let y = 0; y < height; y++) {
            let zx = (x - width / 2) * scale;
            let zy = (y - height / 2) * scale;
            let i = 0;
            while (zx * zx + zy * zy < 4 && i < maxIterations) {
              const temp = zx * zx - zy * zy + pattern.seed / 100;
              zy = 2 * zx * zy + pattern.seed / 100;
              zx = temp;
              i++;
            }
            const color = pattern.colorScheme[Math.floor((i / maxIterations) * pattern.colorScheme.length)];
            ctx.fillStyle = color;
            ctx.fillRect(x, y, 1, 1);
          }
        }
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
      colorScheme: colorSchemes[Math.floor(Math.random() * colorSchemes.length)]
    }));

    setPatterns(newPatterns);
    setLoadingText('Generating patterns...');

    await new Promise(resolve => setTimeout(resolve, 100));

    canvasRefs.current.forEach((canvas, i) => {
      if (canvas) {
        canvas.width = 500;
        canvas.height = 500;
        generatePattern(canvas, newPatterns[i]);
      }
    });

    setLoadingText('Finalizing...');
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const savePattern = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `trippy-art-${Date.now()}.png`;
    link.href = canvas.toDataURL();
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

  return (
    <>
      <Container>
        {patterns.map((pattern, i) => (
          <PatternContainer key={i} onClick={() => canvasRefs.current[i] && savePattern(canvasRefs.current[i]!)}>
            <Canvas ref={el => canvasRefs.current[i] = el} />
          </PatternContainer>
        ))}
      </Container>
      <Controls>
        <Button onClick={generateNewPatterns}>Generate New Patterns</Button>
        <Button onClick={saveAllPatterns}>Save All Patterns</Button>
      </Controls>
    </>
  );
}
