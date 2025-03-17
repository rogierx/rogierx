'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import MatrixLoading from './MatrixLoading';

// ... (keep all the styled components and interfaces the same)

export default function PatternGrid() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const animationFrameRef = useRef<number>();

  // ... (keep all the pattern generation functions the same)

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

  const updateProgress = () => {
    if (progressRef.current < 100) {
      progressRef.current += 1;
      setProgress(progressRef.current);
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const generatePatterns = async () => {
    setLoading(true);
    progressRef.current = 0;
    setProgress(0);
    const types: Pattern['type'][] = ['noise', 'geometric', 'mathematical', 'fractal'];
    const newPatterns: Pattern[] = [];

    // Start progress animation
    updateProgress();

    for (let i = 0; i < 4; i++) {
      setLoadingText(`Synthesizing pattern ${i + 1}/4...\nProcessing quantum state ${Math.floor(progressRef.current % 25) + 1}/25`);
      const pattern = await generatePattern(types[i]);
      if (pattern) newPatterns.push(pattern);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Give time for pattern generation
    }

    // Clean up animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setProgress(100);
    await new Promise(resolve => setTimeout(resolve, 500)); // Show 100% briefly

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
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
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